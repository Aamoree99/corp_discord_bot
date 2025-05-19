import { SlashCommandBuilder, ChannelType } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('setup-recruit-message')
    .setDescription('Send recruit message to a specific channel')
    .addChannelOption(option =>
        option
            .setName('channel')
            .setDescription('Channel to send recruit message')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
    );
