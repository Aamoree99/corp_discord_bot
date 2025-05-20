import {
    ButtonInteraction,
    TextChannel,
} from 'discord.js';
import { db } from '../../db/client.js';
import { recruits } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales — папка с index.ts

export async function handle(interaction: ButtonInteraction) {
    const [_, __, recruitIdStr] = interaction.customId.split(':');
    const recruitId = parseInt(recruitIdStr);

    const guild = interaction.guild!;
    const user = interaction.user;
    const guildId = guild.id;

    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);
    const officerRoleIds = Array.isArray(settings.officerRoleIds) ? settings.officerRoleIds : [];
    if (!interaction.member || !('roles' in interaction.member)) {
        await interaction.reply({ content: t.recruit.errors.noPermission, ephemeral: true });
        return;
    }

    const member = interaction.member;
    const hasOfficerRole = officerRoleIds.some(roleId =>
        (member.roles as any).cache.has(roleId)
    );

    if (!hasOfficerRole) {
        await interaction.reply({ content: t.recruit.errors.noPermission, ephemeral: true });
        return;
    }

    const acceptedRoleId = settings.recruitAcceptedRoleId;

    if (!acceptedRoleId) {
        await interaction.reply({
            content: t.recruit.errors.noAcceptedRole,
            ephemeral: true,
        });
        return;
    }

    const [recruit] = await db.select().from(recruits).where(
        and(eq(recruits.id, recruitId), eq(recruits.guildId, guildId))
    );

    if (!recruit) {
        await interaction.reply({ content: t.recruit.errors.notFound, ephemeral: true });
        return;
    }

    try {
        const member = await guild.members.fetch(recruit.userId);
        await member.roles.add(acceptedRoleId);
    } catch (err) {
        await interaction.reply({ content: t.recruit.errors.addRoleFail, ephemeral: true });
        return;
    }

    await db.update(recruits).set({
        status: 'accepted',
        decidedBy: user.id,
        decidedAt: new Date(),
    }).where(eq(recruits.id, recruitId));

    await interaction.reply({ content: t.recruit.accepted, ephemeral: true });

    // отложенное удаление канала
    const channelId = recruit.channelId;
    if (channelId) {
        setTimeout(async () => {
            try {
                const rawChannel = await guild.channels.fetch(channelId);
                const channel = rawChannel as TextChannel;

                if (channel?.deletable) {
                    await channel.delete();
                }
            } catch (err) {
                console.warn(`⚠️ Не удалось удалить канал ${channelId}:`, err);
            }
        }, 5000);
    }

}
