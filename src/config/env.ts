import dotenv from 'dotenv';
dotenv.config();

if (!process.env.BOT_TOKEN) {
    throw new Error('❌ BOT_TOKEN не указан в .env');
}
if (!process.env.BOT_APP_ID) {
    throw new Error('❌ BOT_APP_ID не указан в .env');
}
if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL не указан в .env');
}

export const config = {
    token: process.env.BOT_TOKEN!,
    appId: process.env.BOT_APP_ID!,
    db: process.env.DATABASE_URL!,
    env: process.env.NODE_ENV || 'production',
    devGuildId: process.env.DEV_GUILD_ID,
};
