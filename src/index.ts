import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from './config/env.js';
import { registerReadyHandler } from './events/ready.js';
import { registerInteractionHandler } from './events/interactionCreate.js';
import { registerGlobalCommands } from './config/commands.js';
import { registerGuildCreateHandler } from './events/guildCreate.js';
import { checkOpsAndPing } from './utils/checkOps.js';
import cron from 'node-cron';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

registerReadyHandler(client);
registerInteractionHandler(client);
registerGuildCreateHandler(client);

await registerGlobalCommands(); // ← теперь нормально

client.login(config.token);

cron.schedule('*/15 * * * *', () => {
    checkOpsAndPing(client).catch(console.error);
});
