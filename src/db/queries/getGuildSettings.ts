import { db } from '../client';
import { guildSettings } from '../schema';
import { eq } from 'drizzle-orm';

export async function getGuildSettings(guildId: string) {
    const [settings] = await db
        .select()
        .from(guildSettings)
        .where(eq(guildSettings.guildId, guildId));

    return settings ?? {
        guildId,
        language: 'en',
        officerRoleIds: [],
        recruitCategoryId: null,
        pingChannelId: null,
        recruitAcceptedRoleId: null,
        setNickname: true,
        activeUntil: null,
        createdAt: new Date(),
        updatedAt: null,
    };
}

export async function upsertGuildSettings(
    guildId: string,
    data: Partial<Omit<typeof guildSettings.$inferSelect, 'id'>>
) {
    const [existing] = await db
        .select()
        .from(guildSettings)
        .where(eq(guildSettings.guildId, guildId));

    if (existing) {
        await db
            .update(guildSettings)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(guildSettings.guildId, guildId));
    } else {
        await db.insert(guildSettings).values({
            guildId,
            ...data,
            createdAt: new Date(),
        });
    }
}
