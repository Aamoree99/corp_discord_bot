import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js';

import { getGuildSettings } from '../../db/queries/getGuildSettings';
import { getLocale } from '../../locales';

export const customId = 'setup:edit';

export async function handle(interaction: ButtonInteraction) {
    const guildId = interaction.guildId!;
    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const modal = new ModalBuilder()
        .setCustomId('setup:modal')
        .setTitle(t.setup.modalTitle);

    const rows = [
        new TextInputBuilder()
            .setCustomId('language')
            .setLabel(t.setup.fields.language)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(settings.language || 'en'),

        new TextInputBuilder()
            .setCustomId('officerRoleIds')
            .setLabel(t.setup.fields.officerRoleIds)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setValue(settings.officerRoleIds?.join(', ') || ''),

        new TextInputBuilder()
            .setCustomId('recruitCategoryId')
            .setLabel(t.setup.fields.recruitCategoryId)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(settings.recruitCategoryId || ''),

        new TextInputBuilder()
            .setCustomId('pingChannelId')
            .setLabel(t.setup.fields.pingChannelId)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(settings.pingChannelId || ''),

        new TextInputBuilder()
            .setCustomId('recruitAcceptedRoleId')
            .setLabel(t.setup.fields.recruitAcceptedRoleId)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setValue(settings.recruitAcceptedRoleId || ''),
    ];

    modal.addComponents(...rows.map((input) =>
        new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    ));

    await interaction.showModal(modal);
}
