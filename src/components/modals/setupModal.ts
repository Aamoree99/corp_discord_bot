import { ModalSubmitInteraction } from 'discord.js';
import {getGuildSettings, upsertGuildSettings} from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js';

export const customId = 'setup:modal';

export async function handle(interaction: ModalSubmitInteraction) {
    const guildId = interaction.guildId!;

    const language = interaction.fields.getTextInputValue('language').toLowerCase();
    const officerRoleIds = interaction.fields.getTextInputValue('officerRoleIds').trim();
    const recruitCategoryId = interaction.fields.getTextInputValue('recruitCategoryId').trim() || null;
    const pingChannelId = interaction.fields.getTextInputValue('pingChannelId').trim() || null;
    const recruitAcceptedRoleId = interaction.fields.getTextInputValue('recruitAcceptedRoleId').trim() || null;

    await upsertGuildSettings(guildId, {
        language,
        officerRoleIds: officerRoleIds ? officerRoleIds.split(',').map(x => x.trim()) : [],
        recruitCategoryId,
        pingChannelId,
        recruitAcceptedRoleId,
    });

    const updatedSettings = await getGuildSettings(guildId);
    const t = getLocale(updatedSettings.language);

    await interaction.reply({
        content: t.setup.success,
        ephemeral: true,
    });
}
