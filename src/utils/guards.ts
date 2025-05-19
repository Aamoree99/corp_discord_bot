import { Interaction, CacheType, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import { db } from '../db/client';
import { guildSettings } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function requireGuildActive(interaction: BaseInteraction): Promise<boolean> {
    if (!interaction.guildId) {
        if (interaction.isRepliable()) {
            await interaction.reply({ content: '❌ This command can only be used in a server.', ephemeral: true });
        }
        return false;
    }

    const [settings] = await db
        .select()
        .from(guildSettings)
        .where(eq(guildSettings.guildId, interaction.guildId));

    if (!settings) {
        if (interaction.isRepliable()) {
            await interaction.reply({ content: '❌ This server is not registered in the bot database.', ephemeral: true });
        }
        return false;
    }

    const now = new Date();
    if (!settings.activeUntil || new Date(settings.activeUntil) < now) {
        if (interaction.isRepliable()) {
            await interaction.reply({
                content: '⛔ This bot subscription has expired. Please contact your officers.',
                ephemeral: true
            });
        }
        return false;
    }

    return true;
}
