import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export function buildHistoryEmbed(
    entries: any[],
    t: {
        history: {
            title: string;
            page: (current: number, total: number) => string;
            statuses: Record<string, string>;
        };
    },
    page: number,
    total: number
) {
    const lines = entries.map(r => {
        const statusKey = r.status ?? 'pending';
        const status = t.history.statuses[statusKey] ?? statusKey;

        const decided = r.decidedAt
            ? `<t:${Math.floor(r.decidedAt.getTime() / 1000)}:d>`
            : '—';

        const officer = r.decidedBy ? `<@${r.decidedBy}>` : '—';
        const reason = r.decisionReason || '—';

        return `**${r.characterName}** — ${status} | ${decided} | ${officer}` +
            (statusKey === 'rejected' ? `\n> ${reason}` : '');
    });

    return new EmbedBuilder()
        .setTitle(t.history.title)
        .setDescription(lines.join('\n\n'))
        .setFooter({ text: t.history.page(page + 1, Math.ceil(total / 10)) })
        .setColor(0x5865F2);
}

export function getPaginationComponents(current: number, total: number) {
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`recruit:history:prev:${current}`)
            .setLabel('◀️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(current === 0),

        new ButtonBuilder()
            .setCustomId(`recruit:history:next:${current}`)
            .setLabel('▶️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled((current + 1) * 10 >= total)
    );

    return [row];
}
