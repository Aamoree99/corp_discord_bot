import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure your guild settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
