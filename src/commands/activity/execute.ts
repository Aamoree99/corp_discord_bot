import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { db } from '../../db/client.js';
import { ops, opResponses, pings, pingResponses } from '../../db/schema.js';
import { eq, and, gte, count } from 'drizzle-orm';
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

    // 👤 Кого проверяем
    const targetMember = interaction.options.getMember('user') ?? interaction.member;
    if (!targetMember || !('joinedAt' in targetMember) || !targetMember.joinedAt) {
        await interaction.reply({ content: t.pings.notFound, ephemeral: true });
        return;
    }

    const userId = targetMember.user.id;
    const guildId = guild.id;
    const joinedAt = targetMember.joinedAt;

    const [
        opsTotalRows,
        pingsTotalRows,
        opStatsRows,
        pingStatsRows,
    ] = await Promise.all([
        db.select({ total: count() }).from(ops).where(and(
            eq(ops.guildId, guildId),
            gte(ops.startTime, joinedAt)
        )),
        db.select({ total: count() }).from(pings).where(and(
            eq(pings.guildId, guildId),
            gte(pings.createdAt, joinedAt)
        )),
        db
            .select({
                response: opResponses.response,
                total: count(),
            })
            .from(opResponses)
            .innerJoin(ops, eq(opResponses.opId, ops.id))
            .where(and(
                eq(opResponses.userId, userId),
                eq(ops.guildId, guildId),
                gte(ops.startTime, joinedAt),
            ))
            .groupBy(opResponses.response),
        db
            .select({
                response: pingResponses.response,
                total: count(),
            })
            .from(pingResponses)
            .innerJoin(pings, eq(pingResponses.pingId, pings.id))
            .where(and(
                eq(pingResponses.userId, userId),
                eq(pings.guildId, guildId),
                gte(pings.createdAt, joinedAt),
            ))
            .groupBy(pingResponses.response),
    ]);

    const counts = { yes: 0, no: 0, maybe: 0 };
    for (const row of [...opStatsRows, ...pingStatsRows]) {
        if (!row.response) continue;
        if (row.response === 'yes' || row.response === 'no' || row.response === 'maybe') {
            counts[row.response] += Number(row.total);
        }
    }

    const total = Number(opsTotalRows[0]?.total ?? 0) + Number(pingsTotalRows[0]?.total ?? 0);
    const yes = counts.yes;
    const no = counts.no;
    const maybe = counts.maybe;
    const answered = yes + no + maybe;
    const ignored = Math.max(total - answered, 0);

    // 🧾 Embed
    const embed = new EmbedBuilder()
        .setTitle(`📊 ${t.activity.title(targetMember.user.username)}`)
        .addFields(
            { name: ` ${t.ops.responses.yes}`, value: yes.toString(), inline: true },
            { name: ` ${t.ops.responses.no}`, value: no.toString(), inline: true },
            { name: ` ${t.ops.responses.maybe}`, value: maybe.toString(), inline: true },
            { name: `🚫 ${t.activity.ignored}`, value: ignored.toString(), inline: true },
        )
        .setFooter({ text: `${t.activity.since} ${joinedAt.toLocaleDateString()}` });

    await interaction.reply({ embeds: [embed] });
}
