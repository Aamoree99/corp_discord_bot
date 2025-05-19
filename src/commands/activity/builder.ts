import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Show activity of a user')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('User to check')
            .setRequired(false)
    );
