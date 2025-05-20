import { ChatInputCommandInteraction } from 'discord.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { formatSettingsEmbed, getSetupComponents } from './utils.js';

export async function execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const settings = await getGuildSettings(guildId);

    const embed = formatSettingsEmbed(settings);
    const components = getSetupComponents(settings);

    await interaction.reply({
        embeds: [embed],
        components,
        ephemeral: true,
    });
}
