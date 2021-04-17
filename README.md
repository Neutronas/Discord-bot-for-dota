# Discord bot for Dota 2

This Discord bot is dedicated to track games of players who have linked the match.

Originally this bot is dedicated for lithuanians therefore all texts are Lithuanian.
If you want to adjust language, just edit strings in three files: commands/link.js, commands/match.js and helpers.js

## Installation

Use npm to install necessary discord.js package

```bash
nvm install
```

## Database
There was no need for better security to be created (it was just for public testing), we simply use public firebase realtime database that can update info without any keys.

Rename config.json.example to config.json and adjust necessary keys:
## config.json

```json
{
	"prefix": "!",
	"token": "<yourDiscordBotToken>,
	"steamKey": "<yourSteamAPIkey>",
	"channelID": "<discord CHANNEL ID>",
	"firebase": "<firebasebase.app> link"
}
```
- **prefix** is dedicated to select global prefix for your communication with bot in Discord server
token
- **token** is dedicated to be your Discord bot token that can be retrieved in Discord developer app
- **steamKey** Steam API key that is provided by Steam development app
- **channelID** Discord Channel (not server) ID that bot will automatically publish changes to
- **firebase** Firebase realtime database application URL (that ends with .app)

## Running
To run bot simply do
```bash
node index.js
```
