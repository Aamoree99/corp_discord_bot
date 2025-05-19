import { GuildSettings } from '../../types';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';

export function formatSettingsEmbed(settings: GuildSettings) {
    return new EmbedBuilder()
        .setTitle('Guild Settings')
        .addFields(
            { name: 'Language', value: settings.language ?? 'en', inline: true },
            { name: 'Officer Role(s)', value: settings.officerRoleIds?.join(', ') || 'Not set', inline: true },
            { name: 'Recruit Category', value: settings.recruitCategoryId || 'Not set', inline: true },
            { name: 'Ping Channel', value: settings.pingChannelId || 'Not set', inline: true },
            { name: 'Accepted Role', value: settings.recruitAcceptedRoleId || 'Not set', inline: true },
            { name: 'Set Nickname', value: settings.setNickname ? 'Yes' : 'No', inline: true },
        )
        .setColor(0x5865F2);
}

export function getSetupComponents(settings: GuildSettings) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('setup:edit')
            .setLabel('✏️ Edit Settings')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('setup:toggle-nickname')
            .setLabel(settings.setNickname ? '🔁 Nickname: ON' : '🔁 Nickname: OFF')
            .setStyle(ButtonStyle.Secondary)
    );
    return [row];
}
