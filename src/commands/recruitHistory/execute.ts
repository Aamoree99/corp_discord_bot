import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { db } from '../../db/client.js';
import { recruits } from '../../db/schema.js';
import { and, eq, sql } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales = директория с index.ts
import { buildHistoryEmbed, getPaginationComponents } from './utils.js';

const PAGE_SIZE = 10;

export async function execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const user = interaction.user;

    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);
    const officerRoleIds = Array.isArray(settings.officerRoleIds) ? settings.officerRoleIds : [];

    if (!interaction.member || !('roles' in interaction.member)) {
        await interaction.reply({ content: t.recruit.errors.noPermission, ephemeral: true });
        return;
    }

    const member = interaction.member;
    const isOfficer = officerRoleIds.some(roleId =>
        (member.roles as any).cache.has(roleId)
    );

    if (!isOfficer) {
        await interaction.reply({ content: t.recruit.errors.noPermission, ephemeral: true });
        return;
    }

    const statusFilter = interaction.options.getString('status') ?? 'all';

    const whereClause =
        statusFilter !== 'all'
            ? and(eq(recruits.guildId, guildId), eq(recruits.status, statusFilter))
            : eq(recruits.guildId, guildId);

    const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(recruits)
        .where(whereClause);

    const total = totalCount[0].count;
    const page = 0;

    const entries = await db
        .select()
        .from(recruits)
        .where(whereClause)
        .orderBy(sql`${recruits.createdAt} DESC`)
        .limit(PAGE_SIZE)
        .offset(page * PAGE_SIZE);

    if (entries.length === 0) {
        await interaction.reply({ content: t.recruit.history.empty, ephemeral: true });
        return;
    }

    const embed = buildHistoryEmbed(entries, t.recruit, page, total);
    const components = getPaginationComponents(page, total);

    await interaction.reply({
        embeds: [embed],
        components,
        ephemeral: true,
    });
}
