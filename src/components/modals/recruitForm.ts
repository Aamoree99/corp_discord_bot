import {
    ChannelType,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если locales — директория с index.ts
import { db } from '../../db/client.js';
import { recruits } from '../../db/schema.js';
import { getCharacterId } from '../../utils/esi.js';

export const customId = 'recruit:form';

export async function handle(interaction: ModalSubmitInteraction) {
    const guild = interaction.guild!;
    const user = interaction.user;
    const guildId = guild.id;

    const settings = await getGuildSettings(guildId);
    const t = getLocale(settings.language);

    const characterName = interaction.fields.getTextInputValue('characterName').trim();
    const experience = interaction.fields.getTextInputValue('experience').trim();
    const timezone = interaction.fields.getTextInputValue('timezone').trim();
    const source = interaction.fields.getTextInputValue('source').trim();

    const characterId = await getCharacterId(characterName);
    const officerRoles = Array.isArray(settings.officerRoleIds) ? settings.officerRoleIds : [];

    // Создаём канал
    const channel = await guild.channels.create({
        name: `recruit-${user.username}`,
        type: ChannelType.GuildText,
        parent: settings.recruitCategoryId || undefined,
        permissionOverwrites: [
            { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            ...officerRoles.map(id => ({
                id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            })),
            {
                id: user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
        ],
    });

    // Меняем ник
    if (settings.setNickname) {
        try {
            const member = await guild.members.fetch(user.id);
            if (member.manageable) {
                await member.setNickname(characterName);
                console.log(`✅ Никнейм ${user.tag} изменён на "${characterName}"`);
            } else {
                console.warn(`⚠️ ${user.tag} не manageable для смены ника.`);
            }
        } catch (err) {
            console.warn(`❌ Ошибка при смене ника ${user.tag}:`, err);
        }
    }


    // Создаём embed
    const embed = new EmbedBuilder()
        .setTitle(t.recruit.modal.title)
        .setDescription(`**${t.recruit.fields.characterName}:** ${characterName}`)
        .addFields(
            { name: t.recruit.modal.experience, value: experience },
            { name: t.recruit.modal.timezone, value: timezone },
            { name: t.recruit.modal.source, value: source || '—' }
        )
        .setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
        .setColor(0x00b0f4);

    if (characterId) {
        embed.addFields({
            name: t.recruit.fields.links,
            value: `[zKillboard](https://zkillboard.com/character/${characterId}/) | [EveWho](https://evewho.com/character/${characterId})`
        });
    }

    const inserted = await db
        .insert(recruits)
        .values({
            guildId,
            userId: user.id,
            characterName,
            experience,
            timezone,
            source,
            channelId: channel.id,
        })
        .returning({ id: recruits.id });

    const recruitId = inserted[0].id;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`recruit:accept:${recruitId}`)
            .setLabel(t.recruit.accept)
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`recruit:reject:${recruitId}`)
            .setLabel(t.recruit.reject)
            .setStyle(ButtonStyle.Danger)
    );

    // Пингуем рекрута и всех офицеров
    const officerMentions = officerRoles.map(id => `<@&${id}>`).join(' ');
    const mentionLine = `<@${user.id}> ${officerMentions}`;

    await channel.send({
        content: mentionLine,
        embeds: [embed],
        components: [row],
    });

    await interaction.reply({ content: t.recruit.submitted, ephemeral: true });
}
