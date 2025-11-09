# WINC Casino - Backend Integration Guide

## Overview
This guide will help you set up a Linux SQL server and Discord bot to integrate with the WINC Casino game for persistent player data and cross-platform currency.

---

## Table of Contents
1. [Database Setup](#database-setup)
2. [API Server Setup](#api-server-setup)
3. [Discord Bot Setup](#discord-bot-setup)
4. [Testing & Deployment](#testing--deployment)

---

## 1. Database Setup

### Recommended: PostgreSQL or MySQL

### Database Schema

```sql
-- Players Table
CREATE TABLE players (
    player_id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    discord_id VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255), -- Optional if using Discord OAuth
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_discord_id (discord_id),
    INDEX idx_username (username)
);

-- Game State Table
CREATE TABLE game_state (
    player_id VARCHAR(255) PRIMARY KEY,
    balance INT DEFAULT 1000,
    total_winnings INT DEFAULT 0,
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    max_bet INT DEFAULT 500,
    sound_enabled BOOLEAN DEFAULT TRUE,
    last_sync_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Statistics Table
CREATE TABLE player_stats (
    player_id VARCHAR(255) PRIMARY KEY,
    slots_played INT DEFAULT 0,
    slots_won INT DEFAULT 0,
    blackjack_played INT DEFAULT 0,
    blackjack_won INT DEFAULT 0,
    roulette_played INT DEFAULT 0,
    roulette_won INT DEFAULT 0,
    horses_played INT DEFAULT 0,
    horses_won INT DEFAULT 0,
    biggest_win INT DEFAULT 0,
    total_bet INT DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Game History Table (for detailed analytics)
CREATE TABLE game_history (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- 'slots', 'blackjack', 'roulette', 'horses'
    bet_amount INT NOT NULL,
    result VARCHAR(10) NOT NULL, -- 'win', 'lose'
    winnings INT DEFAULT 0,
    balance_after INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    INDEX idx_player_timestamp (player_id, timestamp),
    INDEX idx_game_type (game_type)
);

-- Balance History Table (for charts)
CREATE TABLE balance_history (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(255) NOT NULL,
    balance INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE,
    INDEX idx_player_timestamp (player_id, timestamp)
);
```

---

## 2. API Server Setup

### Technology Stack Options
- **Node.js + Express** (Recommended for Discord.js compatibility)
- **Python + Flask/FastAPI**
- **PHP + Laravel**

### Example Node.js API Structure

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'winc_casino',
    password: 'your_password',
    port: 5432,
});

// Authentication endpoint
app.post('/api/auth/login', async (req, res) => {
    const { username, discordId } = req.body;
    
    try {
        // Check if player exists
        let result = await pool.query(
            'SELECT * FROM players WHERE username = $1',
            [username]
        );
        
        let playerId;
        
        if (result.rows.length === 0) {
            // Create new player
            playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            await pool.query(
                'INSERT INTO players (player_id, username, discord_id) VALUES ($1, $2, $3)',
                [playerId, username, discordId]
            );
            
            // Initialize game state
            await pool.query(
                'INSERT INTO game_state (player_id) VALUES ($1)',
                [playerId]
            );
            
            // Initialize stats
            await pool.query(
                'INSERT INTO player_stats (player_id) VALUES ($1)',
                [playerId]
            );
        } else {
            playerId = result.rows[0].player_id;
            
            // Update last login
            await pool.query(
                'UPDATE players SET last_login = CURRENT_TIMESTAMP WHERE player_id = $1',
                [playerId]
            );
        }
        
        res.json({ success: true, playerId, discordId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save game state endpoint
app.post('/api/game/save', async (req, res) => {
    const { playerId, balance, totalWinnings, level, xp, stats } = req.body;
    
    try {
        // Update game state
        await pool.query(
            `UPDATE game_state SET 
                balance = $1, 
                total_winnings = $2, 
                level = $3, 
                xp = $4,
                last_sync_time = CURRENT_TIMESTAMP
            WHERE player_id = $5`,
            [balance, totalWinnings, level, xp, playerId]
        );
        
        // Update stats
        await pool.query(
            `UPDATE player_stats SET 
                slots_played = $1, slots_won = $2,
                blackjack_played = $3, blackjack_won = $4,
                roulette_played = $5, roulette_won = $6,
                horses_played = $7, horses_won = $8,
                biggest_win = $9, total_bet = $10
            WHERE player_id = $11`,
            [
                stats.slotsPlayed, stats.slotsWon,
                stats.blackjackPlayed, stats.blackjackWon,
                stats.roulettePlayed, stats.rouletteWon,
                stats.horsesPlayed, stats.horsesWon,
                stats.biggestWin, stats.totalBet,
                playerId
            ]
        );
        
        // Record balance history
        await pool.query(
            'INSERT INTO balance_history (player_id, balance) VALUES ($1, $2)',
            [playerId, balance]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Load game state endpoint
app.get('/api/game/load', async (req, res) => {
    const { playerId } = req.query;
    
    try {
        const stateResult = await pool.query(
            'SELECT * FROM game_state WHERE player_id = $1',
            [playerId]
        );
        
        const statsResult = await pool.query(
            'SELECT * FROM player_stats WHERE player_id = $1',
            [playerId]
        );
        
        if (stateResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Player not found' });
        }
        
        const gameState = {
            balance: stateResult.rows[0].balance,
            totalWinnings: stateResult.rows[0].total_winnings,
            level: stateResult.rows[0].level,
            xp: stateResult.rows[0].xp,
            stats: {
                slotsPlayed: statsResult.rows[0].slots_played,
                slotsWon: statsResult.rows[0].slots_won,
                blackjackPlayed: statsResult.rows[0].blackjack_played,
                blackjackWon: statsResult.rows[0].blackjack_won,
                roulettePlayed: statsResult.rows[0].roulette_played,
                rouletteWon: statsResult.rows[0].roulette_won,
                horsesPlayed: statsResult.rows[0].horses_played,
                horsesWon: statsResult.rows[0].horses_won,
                biggestWin: statsResult.rows[0].biggest_win,
                totalBet: statsResult.rows[0].total_bet
            }
        };
        
        res.json({ success: true, gameState });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Leaderboard endpoint
app.get('/api/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.username, g.balance, g.level, s.biggest_win
            FROM players p
            JOIN game_state g ON p.player_id = g.player_id
            JOIN player_stats s ON p.player_id = s.player_id
            ORDER BY g.balance DESC
            LIMIT 50`
        );
        
        res.json({ success: true, leaderboard: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WINC Casino API running on port ${PORT}`);
});
```

### Environment Variables (.env)
```bash
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=winc_casino
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
DISCORD_BOT_TOKEN=your_bot_token
```

---

## 3. Discord Bot Setup

### Discord.js Bot Example

```javascript
// bot.js
const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { Pool } = require('pg');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ]
});

// Database connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'balance') {
        // Get player's casino balance
        const discordId = interaction.user.id;
        
        try {
            const result = await pool.query(
                `SELECT p.username, g.balance, g.level
                FROM players p
                JOIN game_state g ON p.player_id = g.player_id
                WHERE p.discord_id = $1`,
                [discordId]
            );
            
            if (result.rows.length === 0) {
                await interaction.reply('You don\'t have a casino account yet! Visit the casino to create one.');
                return;
            }
            
            const player = result.rows[0];
            await interaction.reply(
                `🎰 **${player.username}**\n` +
                `💰 Balance: $${player.balance}\n` +
                `⭐ Level: ${player.level}`
            );
        } catch (error) {
            console.error(error);
            await interaction.reply('Error fetching balance.');
        }
    }

    if (commandName === 'casino') {
        await interaction.reply('🎰 Visit WINC Casino at: https://your-casino-url.com');
    }

    if (commandName === 'leaderboard') {
        try {
            const result = await pool.query(
                `SELECT p.username, g.balance, g.level
                FROM players p
                JOIN game_state g ON p.player_id = g.player_id
                ORDER BY g.balance DESC
                LIMIT 10`
            );
            
            let leaderboard = '🏆 **WINC Casino Leaderboard**\n\n';
            result.rows.forEach((player, index) => {
                leaderboard += `${index + 1}. ${player.username} - $${player.balance} (Lvl ${player.level})\n`;
            });
            
            await interaction.reply(leaderboard);
        } catch (error) {
            console.error(error);
            await interaction.reply('Error fetching leaderboard.');
        }
    }
});

// Currency sync endpoint (called from casino)
const express = require('express');
const app = express();
app.use(express.json());

app.post('/discord/sync', async (req, res) => {
    const { discordId, balance, totalWinnings, level } = req.body;
    
    try {
        // Update player balance
        await pool.query(
            `UPDATE game_state g
            SET balance = $1, total_winnings = $2, level = $3
            FROM players p
            WHERE p.player_id = g.player_id AND p.discord_id = $4`,
            [balance, totalWinnings, level, discordId]
        );
        
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3001, () => {
    console.log('Discord bot sync API running on port 3001');
});

client.login(process.env.DISCORD_BOT_TOKEN);
```

### Register Discord Slash Commands

```javascript
// deploy-commands.js
const { REST, Routes } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your casino balance'),
    new SlashCommandBuilder()
        .setName('casino')
        .setDescription('Get the casino website link'),
    new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('View top casino players'),
].map(command => command.toJSON());

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('Successfully registered commands!');
    } catch (error) {
        console.error(error);
    }
})();
```

---

## 4. Testing & Deployment

### Local Testing
1. Start PostgreSQL database
2. Run migrations to create tables
3. Start API server: `node server.js`
4. Start Discord bot: `node bot.js`
5. Update `casino_game.html` CONFIG.USE_BACKEND to `true`
6. Update CONFIG.API_BASE_URL to `http://localhost:3000/api`

### Production Deployment

#### Linux Server Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repo
git clone your-repo-url
cd your-repo

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# Start services
pm2 start server.js --name casino-api
pm2 start bot.js --name casino-bot
pm2 save
pm2 startup
```

#### Nginx Configuration (for HTTPS)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location / {
        root /var/www/casino;
        index casino_game.html;
        try_files $uri $uri/ =404;
    }
}
```

---

## Security Considerations

1. **Use HTTPS** - Always use SSL/TLS for production
2. **Password Hashing** - Use bcrypt for password storage
3. **Rate Limiting** - Prevent API abuse with rate limiting
4. **Input Validation** - Validate all user inputs
5. **SQL Injection Prevention** - Use parameterized queries (already done in examples)
6. **CORS Configuration** - Restrict to your domain only in production
7. **Environment Variables** - Never commit sensitive data to git

---

## Package.json Example

```json
{
  "name": "winc-casino-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "bot": "node bot.js",
    "deploy-commands": "node deploy-commands.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "pg": "^8.11.0",
    "discord.js": "^14.11.0",
    "dotenv": "^16.0.3"
  }
}
```

---

## Next Steps

1. Create the database and tables
2. Set up your Linux server
3. Deploy the API server
4. Deploy the Discord bot
5. Update the casino game CONFIG
6. Test the integration
7. Monitor logs and performance

For questions or issues, check the logs in PM2:
```bash
pm2 logs casino-api
pm2 logs casino-bot
```

Good luck with your WINC Casino backend! 🎰
