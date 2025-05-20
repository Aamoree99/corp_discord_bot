import {
    ChatInputCommandInteraction,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder, TextChannel,
} from 'discord.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales содержит index.ts

export async function execute(interaction: ChatInputCommandInteraction) {
    const channel = interaction.options.getChannel('channel', true);
    if (!channel || !(channel instanceof TextChannel)) {
        await interaction.reply({
            content: '❌ Selected channel is not a text channel.',
            ephemeral: true,
        });
        return;
    }
    const guildId = interaction.guildId!;
    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const embed = new EmbedBuilder()
        .setTitle(t.recruit.title)
        .setDescription(t.recruit.description)
        .setColor(0x00b0f4);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId('recruit:apply')
            .setLabel(t.recruit.buttonLabel)
            .setStyle(ButtonStyle.Primary)
    );

    await channel.send({
        embeds: [embed],
        components: [row],
    });

    await interaction.reply({
        content: `✅ Message sent to <#${channel.id}>`,
        ephemeral: true,
    });
}
