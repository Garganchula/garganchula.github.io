/**
 * QUEST OF LEGENDS - Combat System
 * Turn-based combat with animations
 */

let currentCombat = null;

class Combat {
    constructor(character, enemy, onComplete) {
        this.character = character;
        this.enemy = enemy;
        this.onComplete = onComplete;
        this.turn = 'player';
        this.combatLog = [];
    }

    async start() {
        currentCombat = this;
        
        // Show combat modal
        const modal = document.getElementById('combatModal');
        modal.classList.add('active');
        
        // Initialize combat screen
        this.renderCombatScreen();
        
        // Start combat loop
        await this.combatLoop();
    }

    renderCombatScreen() {
        const screen = document.getElementById('combatScreen');
        
        screen.innerHTML = `
            <div class="combat-container">
                <!-- Enemy Display -->
                <div class="enemy-display">
                    <h3 style="color: var(--border-color);">${this.enemy.name}</h3>
                    <div class="hp-bar" style="margin: 15px 0;">
                        <div class="hp-fill" id="enemyHpBar" style="width: 100%"></div>
                        <div class="bar-text">${this.enemy.health}/${this.enemy.maxHealth} HP</div>
                    </div>
                    <div class="enemy-sprite" style="text-align: center; font-size: 4em; margin: 20px 0;">
                        ${this.getEnemySprite()}
                    </div>
                </div>

                <!-- Combat Log -->
                <div class="combat-log" style="background: var(--bg-secondary); border: 2px solid var(--border-color); padding: 15px; margin: 20px 0; height: 150px; overflow-y: auto; font-size: 0.7em;">
                    <div id="combatLogContent"></div>
                </div>

                <!-- Player Display -->
                <div class="player-display" style="background: var(--bg-secondary); border: 2px solid var(--text-secondary); padding: 15px; margin-bottom: 15px;">
                    <h4 style="color: var(--text-secondary);">${this.character.name}</h4>
                    <div class="hp-bar" style="margin: 10px 0;">
                        <div class="hp-fill" id="playerHpBar" style="width: ${(this.character.health / this.character.maxHealth) * 100}%"></div>
                        <div class="bar-text">${this.character.health}/${this.character.maxHealth} HP</div>
                    </div>
                    <div class="mp-bar" style="margin: 10px 0;">
                        <div class="mp-fill" id="playerMpBar" style="width: ${(this.character.mana / this.character.maxMana) * 100}%"></div>
                        <div class="bar-text">${this.character.mana}/${this.character.maxMana} MP</div>
                    </div>
                </div>

                <!-- Combat Actions -->
                <div id="combatActions" class="combat-actions">
                    ${this.renderActions()}
                </div>
            </div>
        `;
    }

    getEnemySprite() {
        const sprites = {
            'Corrupted Stag': '🦌',
            'Wolf Pack': '🐺',
            'Corrupted Treant': '🌲',
            'Shadow Tendrils': '🌑',
            'Shadow Beast': '👹',
            'Corrupted Wolf': '🐺',
            'Dark Wraith': '👻',
            'Giant Spider': '🕷️',
            'Goblin Warrior': '👺',
            'Forest Bandit': '🗡️'
        };
        return sprites[this.enemy.name] || '👾';
    }

    renderActions() {
        const potions = this.character.inventory.filter(item => item.includes('Potion'));
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button class="combat-btn" onclick="currentCombat.playerAction('attack')">
                    ⚔️ ATTACK
                </button>
                <button class="combat-btn" onclick="currentCombat.playerAction('defend')">
                    🛡️ DEFEND
                </button>
                <button class="combat-btn" onclick="currentCombat.playerAction('magic')" 
                    ${this.character.mana < 20 ? 'disabled' : ''}>
                    🔮 MAGIC (20 MP)
                </button>
                <button class="combat-btn" onclick="currentCombat.playerAction('special')"
                    ${this.character.stamina < 30 ? 'disabled' : ''}>
                    ⚡ SPECIAL (30 ST)
                </button>
                ${potions.length > 0 ? `
                    <button class="combat-btn" onclick="currentCombat.playerAction('item')">
                        🎒 USE ITEM
                    </button>
                ` : ''}
                <button class="combat-btn" onclick="currentCombat.playerAction('flee')">
                    🏃 FLEE
                </button>
            </div>
        `;
    }

    async playerAction(action) {
        if (this.turn !== 'player') return;
        
        this.turn = 'processing';
        
        // Disable action buttons
        document.getElementById('combatActions').style.opacity = '0.5';
        document.getElementById('combatActions').style.pointerEvents = 'none';
        
        let damage = 0;
        let didAction = false;
        
        switch(action) {
            case 'attack':
                damage = this.calculatePlayerDamage();
                this.enemy.health -= damage;
                this.log(`⚔️ You attack for ${damage} damage!`);
                didAction = true;
                break;
                
            case 'defend':
                this.character.defending = true;
                this.log(`🛡️ You brace for impact!`);
                didAction = true;
                break;
                
            case 'magic':
                if (this.character.mana >= 20) {
                    this.character.mana -= 20;
                    damage = Math.floor(this.character.stats.intelligence * 2.5);
                    this.enemy.health -= damage;
                    this.log(`🔮 Magic blast for ${damage} damage!`);
                    didAction = true;
                }
                break;
                
            case 'special':
                if (this.character.stamina >= 30) {
                    this.character.stamina -= 30;
                    damage = Math.floor(this.character.stats.strength * 2);
                    this.enemy.health -= damage;
                    this.log(`⚡ Special attack for ${damage} damage!`);
                    didAction = true;
                }
                break;
                
            case 'item':
                await this.useItem();
                didAction = true;
                break;
                
            case 'flee':
                if (Math.random() < 0.5) {
                    this.log(`🏃 You escaped!`);
                    await sleep(1000);
                    this.endCombat('fled');
                    return;
                } else {
                    this.log(`✗ Failed to escape!`);
                    didAction = true;
                }
                break;
        }
        
        if (didAction) {
            this.updateDisplay();
            await sleep(1000);
            
            // Check if enemy defeated
            if (this.enemy.health <= 0) {
                await this.victory();
                return;
            }
            
            // Enemy turn
            await this.enemyTurn();
            
            // Check if player defeated
            if (this.character.health <= 0) {
                await this.defeat();
                return;
            }
            
            // Next player turn
            this.turn = 'player';
            document.getElementById('combatActions').style.opacity = '1';
            document.getElementById('combatActions').style.pointerEvents = 'auto';
        } else {
            // Re-enable if action failed
            this.turn = 'player';
            document.getElementById('combatActions').style.opacity = '1';
            document.getElementById('combatActions').style.pointerEvents = 'auto';
        }
    }

    async enemyTurn() {
        this.turn = 'enemy';
        await sleep(500);
        
        let damage = this.calculateEnemyDamage();
        
        // Check if player is defending
        if (this.character.defending) {
            damage = Math.floor(damage * 0.5);
            this.log(`🛡️ Defense reduces damage to ${damage}!`);
            this.character.defending = false;
        }
        
        this.character.health -= damage;
        this.log(`💥 ${this.enemy.name} attacks for ${damage} damage!`);
        
        this.updateDisplay();
        await sleep(1000);
    }

    async useItem() {
        const potions = this.character.inventory.filter(item => item.includes('Potion'));
        
        if (potions.length === 0) return;
        
        // Show item selection (simplified for now - just use first potion)
        const item = potions[0];
        removeItem(this.character, item);
        
        if (item.includes('Health')) {
            const healing = item.includes('Greater') ? 60 : 40;
            heal(this.character, healing);
            this.log(`❤️ Used ${item}! Restored ${healing} HP!`);
        } else if (item.includes('Mana')) {
            const restore = item.includes('Greater') ? 70 : 50;
            restoreMana(this.character, restore);
            this.log(`💙 Used ${item}! Restored ${restore} MP!`);
        }
        
        this.updateDisplay();
    }

    calculatePlayerDamage() {
        const baseDamage = Math.floor(this.character.stats.strength * 1.5);
        const variance = Math.floor(Math.random() * 10) - 5;
        return Math.max(1, baseDamage + variance);
    }

    calculateEnemyDamage() {
        const baseDamage = this.enemy.damage || 10;
        const variance = Math.floor(Math.random() * 8) - 4;
        return Math.max(1, baseDamage + variance);
    }

    log(message) {
        this.combatLog.push(message);
        const logDiv = document.getElementById('combatLogContent');
        const p = document.createElement('p');
        p.style.margin = '5px 0';
        p.textContent = message;
        logDiv.appendChild(p);
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    updateDisplay() {
        // Update HP bars
        const playerHpBar = document.getElementById('playerHpBar');
        const enemyHpBar = document.getElementById('enemyHpBar');
        
        if (playerHpBar) {
            const playerHpPercent = (this.character.health / this.character.maxHealth) * 100;
            playerHpBar.style.width = `${playerHpPercent}%`;
            playerHpBar.parentElement.querySelector('.bar-text').textContent = 
                `${Math.max(0, this.character.health)}/${this.character.maxHealth} HP`;
        }
        
        if (enemyHpBar) {
            const enemyHpPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
            enemyHpBar.style.width = `${enemyHpPercent}%`;
            enemyHpBar.parentElement.querySelector('.bar-text').textContent = 
                `${Math.max(0, this.enemy.health)}/${this.enemy.maxHealth} HP`;
        }
        
        // Update MP bar
        const playerMpBar = document.getElementById('playerMpBar');
        if (playerMpBar) {
            const playerMpPercent = (this.character.mana / this.character.maxMana) * 100;
            playerMpBar.style.width = `${playerMpPercent}%`;
            playerMpBar.parentElement.querySelector('.bar-text').textContent = 
                `${Math.max(0, this.character.mana)}/${this.character.maxMana} MP`;
        }
        
        updateCharacterDisplay();
    }

    async victory() {
        this.log(`\n🎉 VICTORY! ${this.enemy.name} defeated!`);
        
        const gold = this.enemy.gold || 0;
        const exp = this.enemy.exp || 0;
        
        if (gold > 0) {
            addGold(this.character, gold);
            this.log(`💰 Gained ${gold} gold!`);
        }
        
        if (exp > 0) {
            addExperience(this.character, exp);
            this.log(`⭐ Gained ${exp} EXP!`);
        }
        
        await sleep(2000);
        this.endCombat('victory');
    }

    async defeat() {
        this.log(`\n💀 You have been defeated...`);
        await sleep(2000);
        this.endCombat('defeat');
    }

    endCombat(result) {
        const modal = document.getElementById('combatModal');
        modal.classList.remove('active');
        currentCombat = null;
        
        if (this.onComplete) {
            this.onComplete(result);
        }
    }

    async combatLoop() {
        // Combat is now driven by player actions
        // The loop is handled by the action -> enemy turn -> action cycle
    }
}

/**
 * Start combat encounter
 */
function startCombat(enemy, onComplete) {
    const combat = new Combat(gameState.currentCharacter, enemy, onComplete);
    combat.start();
}

/**
 * Create enemy
 */
function createEnemy(name, level) {
    const enemies = {
        'Corrupted Stag': {
            name: 'Corrupted Stag',
            health: 45,
            maxHealth: 45,
            damage: 12,
            gold: 25,
            exp: 40
        },
        'Wolf Pack': {
            name: 'Wolf Pack',
            health: 55,
            maxHealth: 55,
            damage: 14,
            gold: 30,
            exp: 45
        },
        'Corrupted Treant': {
            name: 'Corrupted Treant',
            health: 60,
            maxHealth: 60,
            damage: 15,
            gold: 40,
            exp: 60
        },
        'Shadow Tendrils': {
            name: 'Shadow Tendrils',
            health: 50,
            maxHealth: 50,
            damage: 16,
            gold: 35,
            exp: 55
        },
        'Shadow Beast': {
            name: 'Shadow Beast',
            health: 100,
            maxHealth: 100,
            damage: 20,
            gold: 150,
            exp: 200
        }
    };
    
    const enemy = enemies[name] || {
        name: name,
        health: 30 + (level * 10),
        maxHealth: 30 + (level * 10),
        damage: 8 + (level * 2),
        gold: 15 + (level * 5),
        exp: 25 + (level * 10)
    };
    
    return deepClone(enemy);
}

// Add combat button styles
const combatStyle = document.createElement('style');
combatStyle.textContent = `
    .combat-btn {
        padding: 12px;
        background: var(--button-bg);
        border: 2px solid var(--border-color);
        color: var(--text-primary);
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7em;
        cursor: pointer;
        transition: all 0.2s;
    }
    .combat-btn:hover:not(:disabled) {
        background: var(--button-hover);
        transform: translateY(-2px);
    }
    .combat-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .combat-container {
        font-size: 0.9em;
    }
`;
document.head.appendChild(combatStyle);

console.log('✅ combat.js loaded');
