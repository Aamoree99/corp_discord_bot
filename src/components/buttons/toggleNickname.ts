import { ButtonInteraction } from 'discord.js';
import { getGuildSettings, upsertGuildSettings } from '../../db/queries/getGuildSettings';

export const customId = 'setup:toggle-nickname';

export async function handle(interaction: ButtonInteraction) {
    const guildId = interaction.guildId!;
    const settings = await getGuildSettings(guildId);
    const newValue = !settings.setNickname;

    await upsertGuildSettings(guildId, {
        setNickname: newValue,
    });

    await interaction.reply({
        content: `✅ Nickname has been turned ${newValue ? 'ON' : 'OFF'}.`,
        ephemeral: true,
    });
}
