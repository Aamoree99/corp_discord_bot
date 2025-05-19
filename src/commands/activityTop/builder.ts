import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('activity-top')
    .setDescription('Show top active users')
    .addStringOption(option =>
        option.setName('range')
            .setDescription('Time range')
            .addChoices(
                { name: 'All time', value: 'all' },
                { name: 'Last month', value: 'month' }
            )
            .setRequired(true)
    );
