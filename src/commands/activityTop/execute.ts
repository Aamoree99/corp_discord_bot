import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { db } from '../../db/client.js';
import { ops, opResponses, pings, pingResponses } from '../../db/schema.js';
import { eq, and, gte, lt, count } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js';

export async function execute(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) {
        await interaction.reply({ content: '❌ Guild not found.', ephemeral: true });
        return;
    }

    const settings = await getGuildSettings(guild.id);
    const t = getLocale(settings.language);

    // 🔒 Офицерская проверка
    if (!interaction.inGuild() || !interaction.member || !('roles' in interaction.member)) {
        await interaction.reply({ content: t.common.notAllowed, ephemeral: true });
        return;
    }

    const memberRoles = interaction.member.roles;
    const isOfficer = Array.isArray(settings.officerRoleIds) &&
        settings.officerRoleIds.some(id =>
            'cache' in memberRoles
                ? memberRoles.cache.has(id)
                : memberRoles.includes(id)
        );

    if (!isOfficer) {
        await interaction.reply({ content: t.common.notAllowed, ephemeral: true });
        return;
    }

    // 📅 Период
    const range = interaction.options.getString('range', true); // 'all' | 'month'

    const opWhere = [eq(ops.guildId, guild.id)];
    const pingWhere = [eq(pings.guildId, guild.id)];

    if (range === 'month') {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const fromDate = new Date(year, month - 1, 1);
        const toDate = new Date(year, month, 1);

        opWhere.push(gte(ops.startTime, fromDate), lt(ops.startTime, toDate));
        pingWhere.push(gte(pings.createdAt, fromDate), lt(pings.createdAt, toDate));
    }

    const [opYesRows, pingYesRows] = await Promise.all([
        db
            .select({
                userId: opResponses.userId,
                total: count(),
            })
            .from(opResponses)
            .innerJoin(ops, eq(opResponses.opId, ops.id))
            .where(and(
                eq(opResponses.response, 'yes'),
                ...opWhere,
            ))
            .groupBy(opResponses.userId),
        db
            .select({
                userId: pingResponses.userId,
                total: count(),
            })
            .from(pingResponses)
            .innerJoin(pings, eq(pingResponses.pingId, pings.id))
            .where(and(
                eq(pingResponses.response, 'yes'),
                ...pingWhere,
            ))
            .groupBy(pingResponses.userId),
    ]);

    const stats = new Map<string, number>();

    for (const row of opYesRows) {
        stats.set(row.userId, (stats.get(row.userId) ?? 0) + Number(row.total));
    }
    for (const row of pingYesRows) {
        stats.set(row.userId, (stats.get(row.userId) ?? 0) + Number(row.total));
    }

    const sorted = [...stats.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (!sorted.length) {
        await interaction.reply({ content: t.activity.noData, ephemeral: true });
        return;
    }

    const leaderboard = sorted
        .map(([userId, count], i) => `**${i + 1}.** <@${userId}> — ${count}`)
        .join('\n');

    const title = range === 'month' ? t.activity.topMonth : t.activity.topAll;

    const embed = new EmbedBuilder()
        .setTitle(`🏆 ${title}`)
        .setDescription(leaderboard)
        .setColor(0xf1c40f);

    await interaction.reply({ embeds: [embed], ephemeral: true });

}
