import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { db } from '../../db/client';
import { ops, opResponses, pings, pingResponses } from '../../db/schema';
import { eq, and, gte, lt, inArray } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings';
import { getLocale } from '../../locales';

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

    let opsInRange, pingsInRange;

    if (range === 'month') {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // начало прошлого месяца (1-е число)
        const fromDate = new Date(year, month - 1, 1);
        // начало текущего месяца (1-е число)
        const toDate = new Date(year, month, 1);

        // запросы с диапазоном [fromDate, toDate)
        opsInRange = await db.select().from(ops).where(and(
            eq(ops.guildId, guild.id),
            gte(ops.startTime, fromDate),
            lt(ops.startTime, toDate),
        ));

        pingsInRange = await db.select().from(pings).where(and(
            eq(pings.guildId, guild.id),
            gte(pings.createdAt, fromDate),
            lt(pings.createdAt, toDate),
        ));
    } else {
        // За всё время
        opsInRange = await db.select().from(ops).where(eq(ops.guildId, guild.id));
        pingsInRange = await db.select().from(pings).where(eq(pings.guildId, guild.id));
    }

    const opIds = opsInRange.map(op => op.id);
    const pingIds = pingsInRange.map(p => p.id);

    const opYes = opIds.length
        ? await db.select().from(opResponses).where(and(
            eq(opResponses.response, 'yes'),
            inArray(opResponses.opId, opIds)
        ))
        : [];

    const pingYes = pingIds.length
        ? await db.select().from(pingResponses).where(and(
            eq(pingResponses.response, 'yes'),
            inArray(pingResponses.pingId, pingIds)
        ))
        : [];

    // 📊 Собираем счёт по userId
    const allYes = [...opYes, ...pingYes];
    const stats = new Map<string, number>();

    for (const r of allYes) {
        const id = r.userId;
        stats.set(id, (stats.get(id) ?? 0) + 1);
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
