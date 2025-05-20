import { Client, Guild } from 'discord.js';
import { db } from '../db/client.js';
import { guildSettings } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export function registerGuildCreateHandler(client: Client) {
    client.on('guildCreate', async (guild: Guild) => {
        console.log(`➕ Добавлен на сервер: ${guild.name} (${guild.id})`);

        // Проверка: есть ли уже запись?
        const existing = await db.select().from(guildSettings).where(eq(guildSettings.guildId, guild.id));

        if (existing.length === 0) {
            await db.insert(guildSettings).values({
                guildId: guild.id,
                createdAt: new Date()
            });
            console.log(`✅ Запись для гильдии ${guild.id} создана`);
        } else {
            console.log(`ℹ️ Запись уже существует для ${guild.id}`);
        }
    });
}
