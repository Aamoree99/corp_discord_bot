import { Client, ActivityType } from 'discord.js';

export function registerReadyHandler(client: Client) {
    client.once('ready', () => {
        console.log(`✅ Бот запущен как ${client.user?.tag}`);
        client.user?.setActivity('across the galaxy', {
            type: ActivityType.Watching
        });

    });
}
