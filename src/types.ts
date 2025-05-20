import { InferModel } from 'drizzle-orm';
import { guildSettings } from './db/schema.js';

export type GuildSettings = InferModel<typeof guildSettings>;
