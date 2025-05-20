import {
    ModalSubmitInteraction,
    TextChannel,
} from 'discord.js';
import { db } from '../../db/client.js';
import { recruits } from '../../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { getLocale } from '../../locales/index.js'; // если locales — папка с index.ts

export async function handle(interaction: ModalSubmitInteraction) {
    const [_, __, ___, recruitIdStr] = interaction.customId.split(':');
    const recruitId = parseInt(recruitIdStr);
    const guildId = interaction.guildId!;
    const user = interaction.user;
    const t = getLocale((await interaction.guild?.fetch())?.preferredLocale || 'en');

    const reason = interaction.fields.getTextInputValue('reason').trim();

    const [recruit] = await db.select().from(recruits).where(
        and(eq(recruits.id, recruitId), eq(recruits.guildId, guildId))
    );

    if (!recruit) {
        await interaction.reply({ content: t.recruit.errors.notFound, ephemeral: true });
        return;
    }

    await db.update(recruits).set({
        status: 'rejected',
        decisionReason: reason,
        decidedBy: user.id,
        decidedAt: new Date(),
    }).where(eq(recruits.id, recruitId));

    await interaction.reply({ content: t.recruit.rejected, ephemeral: true });

    const channelId = recruit.channelId;
    if (channelId) {
        setTimeout(async () => {
            try {
                const rawChannel = await interaction.guild!.channels.fetch(channelId);
                const channel = rawChannel as TextChannel;

                if (channel?.deletable) {
                    await channel.delete();
                }
            } catch (err) {
                console.warn(`⚠️ Не удалось удалить канал ${channelId}:`, err);
            }
        }, 5000);
    }
}
