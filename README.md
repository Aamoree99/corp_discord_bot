# Eve Online Discord Bot

A modular Discord bot designed for **EVE Online** communities, built with **TypeScript**, **discord.js v14**, and **PostgreSQL** using Drizzle ORM.

---

## Features

- **Guild Setup**  
  Configure guild settings like officer roles, recruit channels, ping channels, and language.

- **Recruitment System**  
  Private recruitment channels, application forms, officer review, and recruitment history.

- **Operations (Ops)**  
  Create and manage ops/events with RSVP buttons (Yes/No/Maybe), participant pings, and reminders.

- **Fleet Pings**  
  Send fleet-wide pings with interactive response buttons to track participation.

- **Activity Tracking**  
  Monitor user participation, display individual stats, and show leaderboards by activity.

- **Multi-language Support**  
  Language support via custom locale files (`src/locales/en.ts`, `ru.ts`), manually managed.

---

## Supported Languages

- English (`en`)
- Russian (`ru`)
- German (`de`)
- French (`fr`)
- Spanish (`es`)
- Czech (`cz`)

---

## Commands

| Command                  | Description                                          | Access        |
|--------------------------|------------------------------------------------------|---------------|
| `/setup`                 | Configure guild settings (roles, channels, language) | Officers only |
| `/setup-recruit-message` | Send recruit message to a specific channel           | Officers only |
| `/recruit-history`       | View recruitment application history                 | Officers only |
| `/list-ops`              | List upcoming operations/events                      | Everyone      |
| `/create-op`             | Create a new operation/event                         | Officers only |
| `/ping`                  | Send a fleet ping with interactive buttons           | Officers only |
| `/activity`              | Show activity statistics for a user                  | Officers only |
| `/activity-top`          | Show top active users leaderboard                    | Officers only |

---

## Architecture

- Slash commands split into `builder` and `execute` files
- Button and modal handlers in `components`
- PostgreSQL schema and client via Drizzle ORM (`db/schema.ts`)
- Language files under `src/locales` for manual localization
- Utilities in `utils`
- Discord event handlers in `events`

---

## Pricing & Support

This bot is distributed under a single full-featured version license.

- **One-time setup & access fee:** 4 billion ISK
- **Monthly support & updates:** 1.5 billion ISK

For pricing details, custom requests, or to start a subscription, please contact:  
**Discord:** `Aamoree_99#5195`

---

For questions or help with extending the bot, feel free to reach out!
