/**
 * MULTI-VENTURE - Combat System
 * Turn-based combat with animations
 */

let currentCombat = null;

class Combat {
    constructor(character, enemy, onComplete) {
        this.character = character;
        // Handle both single enemy and array of enemies (for now, use first enemy if array)
        this.enemy = Array.isArray(enemy) ? enemy[0] : enemy;
        this.onComplete = onComplete;
        this.turn = 'player';
        this.combatLog = [];
        
        // Create a promise that resolves when combat ends
        this.combatPromise = new Promise((resolve) => {
            this.resolveCombat = resolve;
        });
    }

    async start() {
        currentCombat = this;
        
        console.log('🎮 Combat starting - Enemy snapshot:', JSON.parse(JSON.stringify(this.enemy)));
        
        // Validate enemy data
        if (!this.enemy || !this.enemy.name) {
            console.error('Invalid enemy data:', this.enemy);
            alert('Combat error: Invalid enemy data. Skipping combat.');
            if (this.onComplete) this.onComplete('victory');
            return 'victory';
        }
        
        // Show combat modal
        const modal = document.getElementById('combatModal');
        if (!modal) {
            console.error('Combat modal not found!');
            return 'fled';
        }
        modal.classList.add('active');
        
        // Initialize combat screen
        this.renderCombatScreen();
        
        // Wait for combat to complete (resolved when endCombat is called)
        return await this.combatPromise;
    }

    renderCombatScreen() {
        const screen = document.getElementById('combatScreen');
        if (!screen) {
            console.error('Combat screen element not found!');
            return;
        }
        
        console.log('Rendering combat screen for enemy:', this.enemy.name);
        
        screen.innerHTML = `
            <div class="combat-container">
                <!-- Enemy Display -->
                <div class="enemy-display">
                    <h3 style="color: var(--border-color);">${this.enemy.name || 'Unknown Enemy'}</h3>
                    <div class="hp-bar" style="margin: 15px 0;">
                        <div class="hp-fill" id="enemyHpBar" style="width: 100%"></div>
                        <div class="bar-text">${this.enemy.health || 0}/${this.enemy.maxHealth || 0} HP</div>
                    </div>
                    <div id="enemyStatusEffects" class="status-effects-container" style="display: none;"></div>
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
                    <div id="playerStatusEffects" class="status-effects-container" style="display: none;"></div>
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
        // Handle both old array inventory and new InventorySystem
        let potions = [];
        if (this.character.inventory) {
            if (this.character.inventory.items) {
                // New InventorySystem
                potions = this.character.inventory.items.filter(item => 
                    item.name && item.name.includes('Potion')
                );
            } else if (Array.isArray(this.character.inventory)) {
                // Old array inventory
                potions = this.character.inventory.filter(item => 
                    typeof item === 'string' && item.includes('Potion')
                );
            }
        }
        
        return `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('attack')">
                    ⚔️ ATTACK
                </button>
                <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('defend')">
                    🛡️ DEFEND
                </button>
                <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('magic')" 
                    ${this.character.mana < 20 ? 'disabled' : ''}>
                    🔮 MAGIC (20 MP)
                </button>
                <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('special')"
                    ${this.character.stamina < 30 ? 'disabled' : ''}>
                    ⚡ SPECIAL (30 ST)
                </button>
                ${potions.length > 0 ? `
                    <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('item')">
                        🎒 USE ITEM
                    </button>
                ` : ''}
                <button class="combat-btn" onclick="playSFX('select'); currentCombat.playerAction('flee')">
                    🏃 FLEE
                </button>
            </div>
        `;
    }

    async playerAction(action) {
        if (this.turn !== 'player') return;
        
        // Check if player can act (status effects)
        if (statusEffectManager && !statusEffectManager.canAct('player')) {
            this.log('❌ You cannot act due to status effects!');
            await sleep(1000);
            await this.enemyTurn();
            return;
        }
        
        this.turn = 'processing';
        
        // Disable action buttons
        document.getElementById('combatActions').style.opacity = '0.5';
        document.getElementById('combatActions').style.pointerEvents = 'none';
        
        let damage = 0;
        let didAction = false;
        let isCritical = false;
        
        switch(action) {
            case 'attack':
                // Check for critical hit
                const critChance = this.character.critChance || 0.1;
                isCritical = Math.random() < critChance;
                
                damage = this.calculatePlayerDamage();
                
                // Apply critical multiplier
                if (isCritical) {
                    const critMultiplier = this.character.critMultiplier || 2.0;
                    damage = Math.floor(damage * critMultiplier);
                    this.log(`💥 CRITICAL HIT for ${damage} damage!`);
                    if (achievementManager) trackCriticalHit();
                } else {
                    this.log(`⚔️ You attack for ${damage} damage!`);
                }
                
                this.enemy.health -= damage;
                
                // Visual effects
                if (effectsManager) {
                    showFloatingDamage(damage, 'enemyHpBar', isCritical);
                }
                
                // Apply poison if player has poison weapons skill
                if (this.character.skillTree && this.character.skillTree.skills.poisonWeapons) {
                    applyPoison('enemy', 3);
                    this.log('☠️ Your poisoned blade infects the enemy!');
                }
                
                didAction = true;
                break;
                
            case 'defend':
                this.character.defending = true;
                this.log(`🛡️ You brace for impact!`);
                if (statusEffectManager) {
                    applyDefenseBuff('player', 1, 1);
                }
                didAction = true;
                break;
                
            case 'magic':
                if (this.character.mana >= 20) {
                    this.character.mana -= 20;
                    damage = Math.floor(this.character.stats.intelligence * 2.5);
                    
                    // Apply spell damage bonus if available
                    if (this.character.skillBonuses && this.character.skillBonuses.spellDamage) {
                        damage = Math.floor(damage * (1 + this.character.skillBonuses.spellDamage));
                    }
                    
                    this.enemy.health -= damage;
                    this.log(`🔮 Magic blast for ${damage} damage!`);
                    
                    // Visual effects
                    if (effectsManager) {
                        showFloatingDamage(damage, 'enemyHpBar', false);
                        effectsManager.createParticles(window.innerWidth / 2, window.innerHeight / 2, 25, '#9d4edd');
                    }
                    
                    // Chance to apply burn
                    if (Math.random() < 0.3) {
                        applyBurn('enemy', 3);
                        this.log('🔥 The enemy is burning!');
                    }
                    
                    didAction = true;
                }
                break;
                
            case 'special':
                if (this.character.stamina >= 30) {
                    this.character.stamina -= 30;
                    damage = Math.floor(this.character.stats.strength * 2);
                    
                    // Apply attack bonus if available
                    if (this.character.skillBonuses && this.character.skillBonuses.attack) {
                        damage = Math.floor(damage * this.character.skillBonuses.attack);
                    }
                    
                    this.enemy.health -= damage;
                    this.log(`⚡ Special attack for ${damage} damage!`);
                    
                    // Visual effects
                    if (effectsManager) {
                        showFloatingDamage(damage, 'enemyHpBar', false);
                        effectsManager.screenShake(15, 400);
                    }
                    
                    // Chance to stun
                    if (Math.random() < 0.4) {
                        applyStun('enemy', 1);
                        this.log('💫 The enemy is stunned!');
                    }
                    
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
            // Process player status effects
            if (statusEffectManager) {
                const playerEffects = statusEffectManager.processTurn('player', this.character);
                playerEffects.messages.forEach(msg => this.log(msg));
            }
            
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
        console.log('🏁 Combat ending with result:', result);
        
        const modal = document.getElementById('combatModal');
        modal.classList.remove('active');
        currentCombat = null;
        
        // Resolve the combat promise so start() returns
        if (this.resolveCombat) {
            this.resolveCombat(result);
        }
        
        // Also call the callback if provided (for backwards compatibility)
        if (this.onComplete) {
            this.onComplete(result);
        }
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
 * Can be called as: createEnemy(name, level) or createEnemy(name, health, mana, level, type) for backwards compatibility
 */
function createEnemy(name, healthOrLevel, mana, level, type) {
    console.log(`🔨 createEnemy called with:`, { name, healthOrLevel, mana, level, type });
    
    // Handle both old and new signatures
    let actualLevel = 1;
    let customHealth = null;
    
    if (arguments.length === 2) {
        // New signature: createEnemy(name, level)
        actualLevel = healthOrLevel || 1;
    } else if (arguments.length >= 4) {
        // Old signature: createEnemy(name, health, mana, level, type)
        customHealth = healthOrLevel;
        actualLevel = level || 1;
    }
    
    const enemies = {
        'Corrupted Stag': {
            name: 'Corrupted Stag',
            health: 45,
            maxHealth: 45,
            damage: 12,
            gold: 25,
            exp: 40
        },
        'Corrupted Wolf': {
            name: 'Corrupted Wolf',
            health: 25,
            maxHealth: 25,
            damage: 8,
            gold: 15,
            exp: 20
        },
        'Alpha Wolf': {
            name: 'Alpha Wolf',
            health: 40,
            maxHealth: 40,
            damage: 12,
            gold: 25,
            exp: 35
        },
        'Corrupted Bear': {
            name: 'Corrupted Bear',
            health: 60,
            maxHealth: 60,
            damage: 15,
            gold: 35,
            exp: 50
        },
        'Twisted Treant': {
            name: 'Twisted Treant',
            health: 45,
            maxHealth: 45,
            damage: 12,
            gold: 30,
            exp: 40
        },
        'Shadow Wraith': {
            name: 'Shadow Wraith',
            health: 30,
            maxHealth: 30,
            damage: 18,
            gold: 40,
            exp: 45
        },
        'Kobold Scout': {
            name: 'Kobold Scout',
            health: 30,
            maxHealth: 30,
            damage: 10,
            gold: 20,
            exp: 25
        },
        'Fire Elemental': {
            name: 'Fire Elemental',
            health: 65,
            maxHealth: 65,
            damage: 20,
            gold: 50,
            exp: 60
        },
        'Elara the Corrupted': {
            name: 'Elara the Corrupted',
            health: 120,
            maxHealth: 120,
            damage: 25,
            gold: 200,
            exp: 300
        },
        'Scalefire the Eternal': {
            name: 'Scalefire the Eternal',
            health: 150,
            maxHealth: 150,
            damage: 30,
            gold: 300,
            exp: 500
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
    
    let enemy = enemies[name] || {
        name: name,
        health: 30 + (actualLevel * 10),
        maxHealth: 30 + (actualLevel * 10),
        damage: 8 + (actualLevel * 2),
        gold: 15 + (actualLevel * 5),
        exp: 25 + (actualLevel * 10)
    };
    
    console.log(`📋 Enemy template for "${name}":`, JSON.parse(JSON.stringify(enemy)));
    
    // Override with custom health if provided (old signature)
    if (customHealth !== null) {
        enemy = deepClone(enemy);
        enemy.health = customHealth;
        enemy.maxHealth = customHealth;
        console.log(`🔧 Applied custom health ${customHealth} to ${name}`);
    }
    
    const finalEnemy = deepClone(enemy);
    console.log(`✅ createEnemy returning:`, finalEnemy);
    return finalEnemy;
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
