import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from './config/env';
import { registerReadyHandler } from './events/ready';
import { registerInteractionHandler } from './events/interactionCreate';
import { registerGlobalCommands } from './config/commands';
import {registerGuildCreateHandler} from "./events/guildCreate";
import {checkOpsAndPing} from "./utils/checkOps";
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

await registerGlobalCommands(); // ← ДО login()

client.login(config.token);

cron.schedule('*/15 * * * *', () => {
    checkOpsAndPing(client).catch(console.error);
});