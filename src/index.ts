import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from './config/env';
import { registerReadyHandler } from './events/ready';
import { registerInteractionHandler } from './events/interactionCreate';
import { registerGlobalCommands } from './config/commands';
import {registerGuildCreateHandler} from "./events/guildCreate";
import {checkOpsAndPing} from "./utils/checkOps";

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

setInterval(() => {
    checkOpsAndPing(client).catch(console.error);
}, 15 * 60 * 1000);
