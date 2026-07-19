# TitanBot

A feature-rich Discord bot built with Discord.js v14 and PostgreSQL. Includes moderation, economy, leveling, giveaways, tickets, music (Lavalink), and more.

## How to run

The `Start application` workflow runs `npm start` → `node src/app.js`.

## Required secrets (set in Replit Secrets)

| Secret | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal → Bot tab |
| `CLIENT_ID` | Application/client ID from OAuth2 tab |
| `GUILD_ID` | Test server ID for single-guild slash command registration |

## Environment variables (set in Replit)

| Variable | Value |
|---|---|
| `NODE_ENV` | `development` — avoids production-only PostgreSQL validation checks; bot still uses Replit's managed `DATABASE_URL` |
| `PORT` | `3000` — Express health/ready endpoints |
| `AUTO_MIGRATE` | `true` — runs DB migrations on startup |
| `MULTI_GUILD` | `false` — single-server slash command registration |

## Database

Uses Replit's built-in PostgreSQL (connection string auto-provided via `DATABASE_URL`). Migrations run automatically on startup via `AUTO_MIGRATE=true`. Tables are created on first run.

## Music (Lavalink)

The music system requires a separate Lavalink v4 server. Without one the bot logs a disconnection warning but all other features work normally. See `docker-compose.yml` for local Lavalink setup or configure `LAVALINK_HOST/PORT/PASSWORD` to point to an external node.

## Useful commands

```bash
npm start           # start the bot
npm run migrate     # apply DB migrations manually
npm run migrate:status  # check migration status
npm test            # run tests
```

## User preferences

- Keep `NODE_ENV=development` on Replit (avoids the production PostgreSQL env var check that conflicts with Replit's PG* naming convention).
