import {
    ButtonInteraction,
    EmbedBuilder,
} from 'discord.js';
import { db } from '../../db/client.js';
import { ops, opResponses } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { getGuildSettings } from '../../db/queries/getGuildSettings.js';
import { getLocale } from '../../locales/index.js'; // если в locales есть index.ts

export const customId = 'op:';

export async function handle(interaction: ButtonInteraction) {
    const [_, response, opIdStr] = interaction.customId.split(':');
    const opId = parseInt(opIdStr);
    const userId = interaction.user.id;
    const guild = interaction.guild!;

    const validResponses = ['yes', 'no', 'maybe'] as const;
    if (!validResponses.includes(response as any)) {
        await interaction.reply({ content: '❌ Invalid response.', ephemeral: true });
        return;
    }

    const safeResponse = response as 'yes' | 'no' | 'maybe';

    const settings = await getGuildSettings(guild.id);
    const t = getLocale(settings.language);

    const [op] = await db.select().from(ops).where(eq(ops.id, opId));
    if (!op) {
        await interaction.reply({ content: '❌ This operation no longer exists.', ephemeral: true });
        return;
    }

    const now = Date.now();
    const startUtc = op.startTime.getTime();

    if (now >= startUtc) {
        console.log('NOW:', new Date(now).toISOString(), 'START:', op.startTime);
        console.log('startTime typeof', typeof op.startTime);
        console.log('startTime raw', op.startTime);
        console.log('startTime ISO', op.startTime.toISOString());
        console.log('startTime getTime', op.startTime.getTime());

        await interaction.reply({ content: t.ops.expired, ephemeral: true });
        return;
    }


    await db.insert(opResponses).values({
        opId,
        userId,
        response: safeResponse,
    }).onConflictDoUpdate({
        target: [opResponses.opId, opResponses.userId],
        set: { response: safeResponse, respondedAt: new Date() }
    });

    const all = await db.select().from(opResponses).where(eq(opResponses.opId, opId));

    const yes = all.filter(r => r.response === 'yes').map(r => `<@${r.userId}>`);
    const no = all.filter(r => r.response === 'no').map(r => `<@${r.userId}>`);
    const maybe = all.filter(r => r.response === 'maybe').map(r => `<@${r.userId}>`);

    const message = interaction.message;
    if (!message.editable) {
        await interaction.reply({ content: '⚠️ Message is not editable.', ephemeral: true });
        return;
    }

    const embed = EmbedBuilder.from(message.embeds[0])
        .spliceFields(1, 3)
        .addFields(
            { name: `${t.ops.responses.yes} (${yes.length})`, value: yes.length ? yes.join('\n') : '—', inline: true },
            { name: `${t.ops.responses.no} (${no.length})`, value: no.length ? no.join('\n') : '—', inline: true },
            { name: `${t.ops.responses.maybe} (${maybe.length})`, value: maybe.length ? maybe.join('\n') : '—', inline: true },
        );

    await message.edit({ embeds: [embed] });
    await interaction.deferUpdate();
}
