import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
    unique,
} from 'drizzle-orm/pg-core';

// guild_settings
export const guildSettings = pgTable('guild_settings', {
    id: serial('id').primaryKey(),
    guildId: text('guild_id').notNull().unique(),
    language: text('language').default('en'),
    officerRoleIds: text('officer_role_ids').array(),
    recruitCategoryId: text('recruit_category_id'),
    pingChannelId: text('ping_channel_id'),
    recruitAcceptedRoleId: text('recruit_accepted_role_id'),
    setNickname: boolean('set_nickname').default(true),
    activeUntil: timestamp('active_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
});

// recruits
export const recruits = pgTable('recruits', {
    id: serial('id').primaryKey(),
    guildId: text('guild_id').notNull(),
    userId: text('user_id').notNull(),
    characterName: text('character_name').notNull(),
    source: text('source'),
    experience: text('experience'),
    timezone: text('timezone'),
    channelId: text('channel_id'),
    status: text('status').default('pending'),
    decidedBy: text('decided_by'),
    decisionReason: text('decision_reason'),
    decidedAt: timestamp('decided_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ops
export const ops = pgTable('ops', {
    id: serial('id').primaryKey(),
    guildId: text('guild_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    pingSent: boolean('ping_sent').default(false),
    startTime: timestamp('start_time', { withTimezone: false}).notNull(),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// op_responses
export const opResponses = pgTable('op_responses', {
    id: serial('id').primaryKey(),
    opId: integer('op_id').notNull().references(() => ops.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    response: text('response').$type<'yes' | 'no' | 'maybe'>(),
    respondedAt: timestamp('responded_at', { withTimezone: true }).defaultNow(),
}, (table) => {
    return {
        uniqueOpUser: unique().on(table.opId, table.userId)
    };
});

// pings
export const pings = pgTable('pings', {
    id: serial('id').primaryKey(),
    guildId: text('guild_id').notNull(),
    message: text('message').notNull(),
    createdBy: text('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ping_responses
export const pingResponses = pgTable('ping_responses', {
    id: serial('id').primaryKey(),
    pingId: integer('ping_id').notNull().references(() => pings.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    response: text('response').$type<'yes' | 'no' | 'maybe'>(),
    respondedAt: timestamp('responded_at', { withTimezone: true }).defaultNow(),
}, (table) => {
    return {
        uniquePingUser: unique().on(table.pingId, table.userId)
    };
});
