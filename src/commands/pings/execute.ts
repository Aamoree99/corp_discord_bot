import {
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} from 'discord.js';

import { db } from '../../db/client.js';
import { pings } from '../../db/schema.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales содержит index.ts

export async function execute(interaction: ChatInputCommandInteraction) {
    const settings = await getGuildSettings(interaction.guildId!);
    const t = getLocale(settings.language);

    const now = new Date();

    if (!interaction.inGuild() || !interaction.member || !('roles' in interaction.member)) {
        await interaction.reply({
            content: t.pings.noPermission,
            ephemeral: true,
        });
        return;
    }

    const memberRoles = interaction.member.roles;

    const allowed = Array.isArray(settings.officerRoleIds)
        && settings.officerRoleIds.some(id => {
            if (Array.isArray(memberRoles)) return memberRoles.includes(id);
            if ('cache' in memberRoles) return memberRoles.cache.has(id); // если GuildMemberRoleManager
            return false;
        });

    if (!allowed) {
        await interaction.reply({
            content: t.pings.noPermission, // например: '❌ You are not allowed to use this command.'
            ephemeral: true
        });
        return;
    }

    const message = interaction.options.getString('name', true);

    const [ping] = await db.insert(pings).values({
        guildId: interaction.guildId!,
        message,
        createdBy: interaction.user.id,
        createdAt: now,
    }).returning();

    const embed = new EmbedBuilder()
        .setTitle('📡 Ping')
        .setDescription(`${message}\n\n${t.pings.description}`)
        .setColor(0xf1c40f)
        .setFooter({ text: t.pings.footer })
        .setTimestamp(now);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`ping:yes:${ping.id}`)
            .setLabel(t.ops.responses.yes)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`ping:no:${ping.id}`)
            .setLabel(t.ops.responses.no)
            .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
            .setCustomId(`ping:maybe:${ping.id}`)
            .setLabel(t.ops.responses.maybe)
            .setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
}
