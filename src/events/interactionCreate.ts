import { Client } from 'discord.js';
import { requireGuildActive } from '../utils/guards';
import { commandHandlers } from '../commands';
import { getButtonHandler, getModalHandler } from '../components';

export function registerInteractionHandler(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        const guildOk = await requireGuildActive(interaction);
        if (!guildOk) return;

        // Slash-команды
        if (interaction.isChatInputCommand()) {
            const handler = commandHandlers[interaction.commandName];
            if (handler) {
                await handler(interaction);
            }
            return;
        }

        // Кнопки
        if (interaction.isButton()) {
            const handler = getButtonHandler(interaction.customId);
            if (handler) {
                await handler(interaction);
            }
            return;
        }

        // Модалки
        if (interaction.isModalSubmit()) {
            const handler = getModalHandler(interaction.customId);
            if (handler) {
                await handler(interaction);
            }
            return;
        }
    });
}
