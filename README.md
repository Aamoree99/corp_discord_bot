# Eve Online Discord Bot

Discord bot for EVE Online communities, built with TypeScript, `discord.js` v14 and PostgreSQL (Drizzle ORM).

## Features
- Guild setup and per-guild settings (`/setup`)
- Recruitment flow with private channels, forms, approval/rejection and history
- Ops management (`/create-op`, `/list-ops`) with RSVP buttons
- Fleet pings (`/ping`) with Yes/No/Maybe tracking
- Activity analytics (`/activity`, `/activity-top`)
- Multi-language locales (`en`, `ru`, `de`, `fr`, `es`, `cz`)

## Commands
| Command | Description | Access |
| --- | --- | --- |
| `/setup` | Configure guild settings | Officers |
| `/setup-recruit-message` | Post recruit message in a selected channel | Officers |
| `/recruit-history` | Show recruitment history | Officers |
| `/list-ops` | Show upcoming ops with pagination | Everyone |
| `/create-op` | Create an op with RSVP buttons | Officers |
| `/ping` | Send fleet ping with response buttons | Officers |
| `/activity` | Show activity for a selected user | Officers |
| `/activity-top` | Show activity leaderboard | Officers |

## Behavior
- Ops reminders are checked every 15 minutes via cron.
- Users who answered `yes` are mentioned shortly before op start.
- Ping responses are accepted for 15 minutes after ping creation.
- Expired op/ping responses are ignored.

## Quick Start
1. Install dependencies:
```bash
npm install
```
2. Configure environment in `.env`:
```env
BOT_TOKEN=...
BOT_APP_ID=...
DATABASE_URL=postgresql://...
NODE_ENV=development
DEV_GUILD_ID=...
DB_POOL_MAX=10
```
3. Initialize DB schema:
```bash
psql "$DATABASE_URL" -f src/db/schema.sql
```
4. Build and run:
```bash
npm run build
npm run dev
```

## Performance Notes
- DB pool size is configurable with `DB_POOL_MAX` (default: `10`).
- Ops ping scheduler was optimized to avoid N+1 queries:
  - batched fetch of `yes` responses
  - guild settings/channel caching during one cron pass
  - batched `ping_sent` update
- `/activity` and `/activity-top` now use SQL aggregation (`count`, `group by`) instead of loading large raw datasets into memory.
- Indexes for heavy queries are included in `src/db/schema.sql`:
  - `idx_ops_ping_window`
  - `idx_ops_guild_start_time`
  - `idx_op_responses_op_response`
  - `idx_op_responses_user`
  - `idx_pings_guild_created_at`
  - `idx_ping_responses_ping_response`
  - `idx_ping_responses_user`

## Project Structure
- `src/commands` slash command builders and handlers
- `src/components` button/modal handlers
- `src/events` Discord event subscriptions
- `src/db` schema, DB client and queries
- `src/locales` localization files
- `src/utils` shared utilities
