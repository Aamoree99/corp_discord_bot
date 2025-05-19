import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Create a real-time ping with buttons')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Ping topic')
            .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);
