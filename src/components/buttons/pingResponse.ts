import {
    ButtonInteraction,
    EmbedBuilder,
    TextChannel,
    NewsChannel,
    ThreadChannel,
} from 'discord.js';
import { db } from '../../db/client';
import { pingResponses, pings } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings';
import { getLocale } from '../../locales';

export const customId = 'ping:';

export async function handle(interaction: ButtonInteraction) {
    const [_, response, pingIdStr] = interaction.customId.split(':');
    const pingId = parseInt(pingIdStr);
    const userId = interaction.user.id;
    const guild = interaction.guild;

    if (!guild) {
        await interaction.reply({ content: '❌ Invalid guild.', ephemeral: true });
        return;
    }

    const validResponses = ['yes', 'no', 'maybe'] as const;
    if (!validResponses.includes(response as any)) {
        await interaction.reply({ content: '❌ Invalid response.', ephemeral: true });
        return;
    }

    const safeResponse = response as 'yes' | 'no' | 'maybe';

    const settings = await getGuildSettings(guild.id);
    const t = getLocale(settings.language);

    const [ping] = await db.select().from(pings).where(eq(pings.id, pingId));
    if (!ping) {
        await interaction.reply({ content: t.pings.notFound, ephemeral: true });
        return;
    }

    const createdAt = new Date(ping.createdAt + 'Z');
    const pingAge = Date.now() - createdAt.getTime();
    if (pingAge > 15 * 60 * 1000) {
        await interaction.reply({ content: t.pings.expired, ephemeral: true });
        return;
    }

    // Записываем/обновляем ответ
    await db.insert(pingResponses).values({
        pingId,
        userId,
        response: safeResponse,
        respondedAt: new Date()
    }).onConflictDoUpdate({
        target: [pingResponses.pingId, pingResponses.userId],
        set: {
            response: safeResponse,
            respondedAt: new Date()
        }
    });

    // Получаем все отклики
    const all = await db.select().from(pingResponses).where(eq(pingResponses.pingId, pingId));
    const yes = all.filter(r => r.response === 'yes').map(r => `<@${r.userId}>`);
    const no = all.filter(r => r.response === 'no').map(r => `<@${r.userId}>`);
    const maybe = all.filter(r => r.response === 'maybe').map(r => `<@${r.userId}>`);

    const message = interaction.message;
    if (message && message.editable && message.embeds.length > 0) {
        const original = message.embeds[0];
        const embed = EmbedBuilder.from(original)
            .spliceFields(0, original.fields?.length || 0)
            .addFields(
                { name: `${t.ops.responses.yes} (${yes.length})`, value: yes.length ? yes.join('\n') : '—', inline: true },
                { name: `${t.ops.responses.no} (${no.length})`, value: no.length ? no.join('\n') : '—', inline: true },
                { name: `${t.ops.responses.maybe} (${maybe.length})`, value: maybe.length ? maybe.join('\n') : '—', inline: true },
            );

        await message.edit({ embeds: [embed] });
    }

    await interaction.reply({
        content: t.pings.saved(safeResponse),
        ephemeral: true,
    });
}
