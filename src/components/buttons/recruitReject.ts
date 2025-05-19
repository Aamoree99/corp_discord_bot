import {
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings';
import { getLocale } from '../../locales';

export async function handle(interaction: ButtonInteraction) {
    const [_, __, recruitIdStr] = interaction.customId.split(':');
    const recruitId = parseInt(recruitIdStr);

    const guildId = interaction.guildId!;
    const member = interaction.member;
    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const officerRoleIds = Array.isArray(settings.officerRoleIds) ? settings.officerRoleIds : [];
    const isOfficer = officerRoleIds.some(roleId => (member?.roles as any).cache.has(roleId));

    if (!isOfficer) {
        await interaction.reply({ content: t.recruit.errors.noPermission, ephemeral: true });
        return;
    }

    const modal = new ModalBuilder()
        .setCustomId(`recruit:reject:reason:${recruitId}`)
        .setTitle(t.recruit.rejectModal.title);

    const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel(t.recruit.rejectModal.label)
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
    );

    await interaction.showModal(modal);
}
