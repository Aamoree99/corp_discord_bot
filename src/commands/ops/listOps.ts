import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { db } from '../../db/client.js';
import { ops } from '../../db/schema.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если в `locales/` есть `index.ts`
import { and, eq, gt } from 'drizzle-orm';

const PAGE_SIZE = 10;

export const data = new SlashCommandBuilder()
    .setName('list-ops')
    .setDescription('Show upcoming ops (with pagination)');

export async function execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const now = new Date();

    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const all = await db
        .select()
        .from(ops)
        .where(and(eq(ops.guildId, guildId), gt(ops.startTime, now)))
        .orderBy(ops.startTime);

    if (all.length === 0) {
        await interaction.reply({ content: t.ops.list.noUpcoming, ephemeral: true });
        return;
    }

    const page = 0;
    const embed = buildOpListEmbed(all, page, t);
    const row = getPaginationRow(page, all.length, t);

    await interaction.reply({
        embeds: [embed],
        components: row ? [row] : [],
        ephemeral: true,
    });
}

function buildOpListEmbed(allOps: typeof ops.$inferSelect[], page: number, t: any) {
    const totalPages = Math.ceil(allOps.length / PAGE_SIZE);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const slice = allOps.slice(start, end);

    const embed = new EmbedBuilder()
        .setTitle(t.ops.list.title)
        .setColor(0x5865f2)
        .setFooter({ text: t.ops.list.page(page + 1, totalPages) });

    for (const op of slice) {
        embed.addFields({
            name: `${op.name} — <t:${Math.floor(op.startTime.getTime() / 1000)}:f>`,
            value: op.description || '—',
        });
    }

    return embed;
}

function getPaginationRow(page: number, total: number, t: any) {
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return null;

    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`ops:page:${page - 1}`)
            .setLabel('◀️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 0),
        new ButtonBuilder()
            .setCustomId(`ops:page:${page + 1}`)
            .setLabel('▶️')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page + 1 >= totalPages),
    );
}
