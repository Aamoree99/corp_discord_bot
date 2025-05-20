import { db } from '../db/client.js';
import { ops, opResponses } from '../db/schema.js';
import { eq, and, lte } from 'drizzle-orm';
import { Client, TextChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { getGuildSettings } from '../db/queries/getGuildSettings.js';
import { getLocale } from '../locales/index.js'; // если `locales` — это папка с `index.ts`

export async function checkOpsAndPing(client: Client) {
    const now = new Date();
    const soon = new Date(now.getTime() + 15 * 60 * 1000); // 10 минут вперед

    console.log(`[checkOpsAndPing] Checking ops between now (${now.toISOString()}) and ${soon.toISOString()}`);

    const upcoming = await db.select().from(ops).where(and(
        lte(ops.startTime, soon),  // старт меньше или равен now+10 мин
        eq(ops.pingSent, false),
    ));

    console.log(`[checkOpsAndPing] Found ${upcoming.length} ops to ping.`);

    for (const op of upcoming) {
        const yes = await db.select().from(opResponses).where(and(
            eq(opResponses.opId, op.id),
            eq(opResponses.response, 'yes'),
        ));

        const mentions = yes.length
            ? yes.map(r => `<@${r.userId}>`).join(' ')
            : '__';

        const settings = await getGuildSettings(op.guildId);
        const channelId = settings.pingChannelId;
        if (!channelId) {
            console.warn(`[checkOpsAndPing] Guild ${op.guildId} has no pingChannelId set, skipping op ${op.id}.`);
            continue;
        }

        const t = getLocale(settings.language);

        const rawChannel = await client.channels.fetch(channelId).catch((err) => {
            console.error(`[checkOpsAndPing] Failed to fetch channel ${channelId}:`, err);
            return null;
        });

        if (!rawChannel?.isTextBased()) {
            console.warn(`[checkOpsAndPing] Channel ${channelId} is not text-based or not found, skipping op ${op.id}.`);
            continue;
        }

        if (
            rawChannel instanceof TextChannel ||
            rawChannel instanceof NewsChannel ||
            rawChannel instanceof ThreadChannel
        ) {
            try {
                await rawChannel.send({
                    content: `🛡️ ${t.ops.ping(op.name)}\n${mentions}`,
                });
                console.log(`[checkOpsAndPing] Sent ping for op ${op.id} (${op.name}) to channel ${channelId}.`);
            } catch (err) {
                console.error(`[checkOpsAndPing] Failed to send ping message for op ${op.id} (${op.name}):`, err);
                continue;
            }
        }

        await db.update(ops)
            .set({ pingSent: true })
            .where(eq(ops.id, op.id));

        console.log(`[checkOpsAndPing] Marked op ${op.id} as pingSent.`);
    }
}
