import { Client } from 'discord.js';

export function registerReadyHandler(client: Client) {
    client.once('ready', () => {
        console.log(`✅ Бот запущен как ${client.user?.tag}`);
    });
}
