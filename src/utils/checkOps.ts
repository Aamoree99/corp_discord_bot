import { db } from '../db/client.js';
import { ops, opResponses } from '../db/schema.js';
import { eq, and, gte, inArray, lte } from 'drizzle-orm';
import { Client } from 'discord.js';
import { getGuildSettings } from '../db/queries/getGuildSettings.js';
import { getLocale } from '../locales/index.js';

export async function checkOpsAndPing(client: Client) {
    const now = new Date();
    const soon = new Date(now.getTime() + 15 * 60 * 1000);

    console.log(`[checkOpsAndPing] Checking ops between now (${now.toISOString()}) and ${soon.toISOString()}`);

    const upcoming = await db.select().from(ops).where(and(
        gte(ops.startTime, now),
        lte(ops.startTime, soon),  // старт меньше или равен now+15 мин
        eq(ops.pingSent, false),
    ));

    if (upcoming.length === 0) {
        return;
    }

    console.log(`[checkOpsAndPing] Found ${upcoming.length} ops to ping.`);

    const opIds = upcoming.map(op => op.id);
    const yesResponses = await db.select({
        opId: opResponses.opId,
        userId: opResponses.userId,
    }).from(opResponses).where(and(
        eq(opResponses.response, 'yes'),
        inArray(opResponses.opId, opIds),
    ));

    const mentionsByOpId = new Map<number, string[]>();
    for (const response of yesResponses) {
        if (!mentionsByOpId.has(response.opId)) {
            mentionsByOpId.set(response.opId, []);
        }
        mentionsByOpId.get(response.opId)!.push(`<@${response.userId}>`);
    }

    const settingsCache = new Map<string, Awaited<ReturnType<typeof getGuildSettings>>>();
    const channelCache = new Map<string, Awaited<ReturnType<Client['channels']['fetch']>> | null>();
    const sentOpIds: number[] = [];

    for (const op of upcoming) {
        let settings = settingsCache.get(op.guildId);
        if (!settings) {
            settings = await getGuildSettings(op.guildId);
            settingsCache.set(op.guildId, settings);
        }

        const mentions = mentionsByOpId.get(op.id)?.join(' ') ?? '__';
        const channelId = settings.pingChannelId;
        if (!channelId) {
            console.warn(`[checkOpsAndPing] Guild ${op.guildId} has no pingChannelId set, skipping op ${op.id}.`);
            continue;
        }

        const t = getLocale(settings.language);

        let rawChannel = channelCache.get(channelId);
        if (rawChannel === undefined) {
            rawChannel = await client.channels.fetch(channelId).catch((err) => {
                console.error(`[checkOpsAndPing] Failed to fetch channel ${channelId}:`, err);
                return null;
            });
            channelCache.set(channelId, rawChannel);
        }

        if (!rawChannel?.isTextBased() || !('send' in rawChannel)) {
            console.warn(`[checkOpsAndPing] Channel ${channelId} is not text-based or not found, skipping op ${op.id}.`);
            continue;
        }

        try {
            await rawChannel.send({
                content: `🛡️ ${t.ops.ping(op.name)}\n${mentions}`,
            });
            sentOpIds.push(op.id);
            console.log(`[checkOpsAndPing] Sent ping for op ${op.id} (${op.name}) to channel ${channelId}.`);
        } catch (err) {
            console.error(`[checkOpsAndPing] Failed to send ping message for op ${op.id} (${op.name}):`, err);
        }
    }

    if (sentOpIds.length > 0) {
        await db.update(ops)
            .set({ pingSent: true })
            .where(inArray(ops.id, sentOpIds));

        console.log(`[checkOpsAndPing] Marked ${sentOpIds.length} ops as pingSent.`);
    }
}
