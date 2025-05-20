import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { db } from '../../db/client.js';
import { ops, opResponses, pings, pingResponses } from '../../db/schema.js';
import { eq, and, gte, inArray } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales — это директория с index.ts


export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({ content: '❌ Guild not found.', ephemeral: true });
        return;
    }

    const settings = await getGuildSettings(guild.id);
    const t = getLocale(settings.language);

    // 🔒 Офицерская проверка
    if (!interaction.inGuild() || !interaction.member || !('roles' in interaction.member)) {
        await interaction.reply({ content: t.common.notAllowed, ephemeral: true });
        return;
    }

    const memberRoles = interaction.member.roles;
    const isOfficer = Array.isArray(settings.officerRoleIds) &&
        settings.officerRoleIds.some(id =>
            'cache' in memberRoles
                ? memberRoles.cache.has(id)
                : memberRoles.includes(id)
        );


    if (!isOfficer) {
        await interaction.reply({ content: t.common.notAllowed, ephemeral: true });
        return;
    }

    // 👤 Кого проверяем
    const targetMember = interaction.options.getMember('user') ?? interaction.member;
    if (!targetMember || !('joinedAt' in targetMember) || !targetMember.joinedAt) {
        await interaction.reply({ content: t.pings.notFound, ephemeral: true });
        return;
    }

    const userId = targetMember.user.id;
    const guildId = guild.id;
    const joinedAt = targetMember.joinedAt;

    // 📥 Получаем все опсы и пинги после join
    const opsAfter = await db.select().from(ops).where(and(
        eq(ops.guildId, guildId),
        gte(ops.startTime, joinedAt)
    ));

    const pingsAfter = await db.select().from(pings).where(and(
        eq(pings.guildId, guildId),
        gte(pings.createdAt, joinedAt)
    ));

    const opIds = opsAfter.map(o => o.id);
    const pingIds = pingsAfter.map(p => p.id);

    const opRes = opIds.length
        ? await db.select().from(opResponses).where(and(
            eq(opResponses.userId, userId),
            inArray(opResponses.opId, opIds)
        ))
        : [];

    const pingRes = pingIds.length
        ? await db.select().from(pingResponses).where(and(
            eq(pingResponses.userId, userId),
            inArray(pingResponses.pingId, pingIds)
        ))
        : [];

    // 📊 Подсчёт
    const all = [...opRes.map(r => r.response), ...pingRes.map(r => r.response)];
    const total = opIds.length + pingIds.length;
    const yes = all.filter(r => r === 'yes').length;
    const no = all.filter(r => r === 'no').length;
    const maybe = all.filter(r => r === 'maybe').length;
    const ignored = total - all.length;

    // 🧾 Embed
    const embed = new EmbedBuilder()
        .setTitle(`📊 ${t.activity.title(targetMember.user.username)}`)
        .addFields(
            { name: ` ${t.ops.responses.yes}`, value: yes.toString(), inline: true },
            { name: ` ${t.ops.responses.no}`, value: no.toString(), inline: true },
            { name: ` ${t.ops.responses.maybe}`, value: maybe.toString(), inline: true },
            { name: `🚫 ${t.activity.ignored}`, value: ignored.toString(), inline: true },
        )
        .setFooter({ text: `${t.activity.since} ${joinedAt.toLocaleDateString()}` });

    await interaction.reply({ embeds: [embed] });
}
