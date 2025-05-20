import { SlashCommandBuilder } from 'discord.js';
import { getLocale } from '../../locales/index.js';

export function buildRecruitHistoryCommand(language: string) {
    const t = getLocale(language);

    return new SlashCommandBuilder()
        .setName('recruit-history')
        .setDescription(t.recruit.history.title)
        .addStringOption(option =>
            option.setName('status')
                .setDescription(t.recruit.history.statusFilter)
                .setRequired(false)
                .addChoices(
                    { name: t.recruit.history.statuses.all, value: 'all' },
                    { name: t.recruit.history.statuses.accepted, value: 'accepted' },
                    { name: t.recruit.history.statuses.rejected, value: 'rejected' },
                    { name: t.recruit.history.statuses.pending, value: 'pending' },
                )
        );
}
