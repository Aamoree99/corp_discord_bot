import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from 'discord.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js';

export const customId = 'recruit:apply';

export async function handle(interaction: ButtonInteraction) {
    const guildId = interaction.guildId!;
    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const modal = new ModalBuilder()
        .setCustomId('recruit:form')
        .setTitle(t.recruit.modal.title);

    const fields = [
        new TextInputBuilder()
            .setCustomId('characterName')
            .setLabel(t.recruit.modal.characterName)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),

        new TextInputBuilder()
            .setCustomId('experience')
            .setLabel(t.recruit.modal.experience)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true),

        new TextInputBuilder()
            .setCustomId('timezone')
            .setLabel(t.recruit.modal.timezone)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),

        new TextInputBuilder()
            .setCustomId('source')
            .setLabel(t.recruit.modal.source)
            .setStyle(TextInputStyle.Short)
            .setRequired(false),
    ];

    modal.addComponents(...fields.map(f =>
        new ActionRowBuilder<TextInputBuilder>().addComponents(f)
    ));

    await interaction.showModal(modal);
}
