import { db } from '../db/client';
import { ops, opResponses } from '../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { Client, TextChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { getGuildSettings } from '../db/queries/getGuildSettings';
import { getLocale } from '../locales';

export async function checkOpsAndPing(client: Client) {
    const now = new Date();
    const soon = new Date(now.getTime() + 30 * 1000);
    const recent = new Date(now.getTime() - 30 * 1000);

    const upcoming = await db.select().from(ops).where(and(
        lte(ops.startTime, soon),
        gte(ops.startTime, recent),
        eq(ops.pingSent, false),
    ));

    for (const op of upcoming) {
        const yes = await db.select().from(opResponses).where(and(
            eq(opResponses.opId, op.id),
            eq(opResponses.response, 'yes'),
        ));

        if (!yes.length) continue;

        const mentions = yes.map(r => `<@${r.userId}>`).join(' ');

        const settings = await getGuildSettings(op.guildId);
        const channelId = settings.pingChannelId;
        if (!channelId) continue;

        const t = getLocale(settings.language);

        const rawChannel = await client.channels.fetch(channelId).catch(() => null);
        if (!rawChannel?.isTextBased()) continue;

        if (
            rawChannel instanceof TextChannel ||
            rawChannel instanceof NewsChannel ||
            rawChannel instanceof ThreadChannel
        ) {
            await rawChannel.send({
                content: `🛡️ ${t.ops.ping(op.name)}\n${mentions}`,
            });
        }

        await db.update(ops)
            .set({ pingSent: true })
            .where(eq(ops.id, op.id));
    }
}
