import { InferModel } from 'drizzle-orm';
import { guildSettings } from './db/schema';

export type GuildSettings = InferModel<typeof guildSettings>;
