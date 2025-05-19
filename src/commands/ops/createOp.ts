import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextChannel,
} from 'discord.js';
import { db } from '../../db/client';
import { ops } from '../../db/schema';
import { getGuildSettings } from '../../db/queries/getGuildSettings';
import { getLocale } from '../../locales';

export const data = new SlashCommandBuilder()
    .setName('create-op')
    .setDescription('Create a new operation')
    .addStringOption(opt =>
        opt.setName('name').setDescription('Op name').setRequired(true)
    )
    .addStringOption(opt =>
        opt.setName('description').setDescription('Op description').setRequired(true)
    )
    .addStringOption(opt =>
        opt.setName('start').setDescription('Start time (e.g. 2025-06-01T18:00)').setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId!;
    const userId = interaction.user.id;
    const t = getLocale((await getGuildSettings(guildId)).language);
    const settings = await getGuildSettings(guildId);

    const member = interaction.member;

    if (!member || !('roles' in member)) {
        await interaction.reply({ content: t.ops.noPermission, ephemeral: true });
        return;
    }

    const officerRoleIds = Array.isArray(settings.officerRoleIds) ? settings.officerRoleIds : [];
    const hasPermission = officerRoleIds.some(roleId => (member.roles as any).cache.has(roleId));

    if (!hasPermission) {
        await interaction.reply({ content: t.ops.noPermission, ephemeral: true });
        return;
    }


    const name = interaction.options.getString('name', true);
    const description = interaction.options.getString('description', true);

    const raw = interaction.options.getString('start', true).trim();
    const parts = raw.split(/[-T:]/).map(Number);
    const startTime = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4] || 0));

    if (isNaN(startTime.getTime())) {
        await interaction.reply({ content: t.ops.invalidDate, ephemeral: true });
        return;
    }

    // 💾 Добавим оп в БД
    const inserted = await db.insert(ops).values({
        guildId,
        name,
        description,
        startTime,
        createdBy: userId,
    }).returning({ id: ops.id });

    const opId = inserted[0].id;

    // 📤 Отправим embed в ping_channel_id
    if (!settings.pingChannelId) {
        await interaction.reply({ content: t.ops.noPingChannel, ephemeral: true });
        return;
    }

    const pingChannel = await interaction.guild?.channels.fetch(settings.pingChannelId);
    if (!pingChannel || pingChannel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: t.ops.invalidPingChannel, ephemeral: true });
        return;
    }
    const eveTimeStr = startTime.toUTCString().replace('GMT', 'UTC');
    const timestamp = Math.floor(startTime.getTime() / 1000);
    const embed = new EmbedBuilder()
        .setTitle(`📣 ${name}`)
        .setDescription(description)
        .addFields(
            {
                name: t.ops.startTime,
                value: `🕒 EVE Time: ${eveTimeStr}\n🌐 Local: <t:${timestamp}:F>`,
            },
            { name: t.ops.responses.yes, value: '—', inline: true },
            { name: t.ops.responses.no, value: '—', inline: true },
            { name: t.ops.responses.maybe, value: '—', inline: true }
        )
        .setColor(0x00b0f4)
        .setFooter({ text: t.ops.footer });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`op:yes:${opId}`).setLabel('✅').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId(`op:maybe:${opId}`).setLabel('❓').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`op:no:${opId}`).setLabel('❌').setStyle(ButtonStyle.Danger),
    );

    await (pingChannel as TextChannel).send({ embeds: [embed], components: [row] });

    await interaction.reply({ content: t.ops.created, ephemeral: true });
}
