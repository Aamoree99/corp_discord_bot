import { REST, Routes } from 'discord.js';
import { config } from './env';
import { commands } from '../commands';

const rest = new REST({ version: '10' }).setToken(config.token);

export async function registerGlobalCommands() {
    try {
        if (config.env === 'development' && config.devGuildId) {
            await rest.put(
                Routes.applicationGuildCommands(config.appId, config.devGuildId),
                { body: commands }
            );
            console.log(`✅ [DEV] Guild slash commands registered for ${config.devGuildId}!`);
        } else {
            await rest.put(
                Routes.applicationCommands(config.appId),
                { body: commands }
            );
            console.log('✅ Global slash commands registered!');
        }
    } catch (err) {
        console.error('❌ Failed to register commands:', err);
    }
}
