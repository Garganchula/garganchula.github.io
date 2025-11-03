/**
 * MULTI-VENTURE - Character System
 * Handles character creation, stats, and progression
 */

// Character class definitions
const CHARACTER_CLASSES = {
    Warrior: {
        name: 'Warrior',
        description: 'Strong melee fighter with high HP',
        stats: {
            strength: 14,
            dexterity: 10,
            constitution: 13,
            intelligence: 8,
            wisdom: 10,
            charisma: 9
        },
        baseHP: 120,
        baseMP: 50,
        baseStamina: 100
    },
    Mage: {
        name: 'Mage',
        description: 'Master of magic with high MP',
        stats: {
            strength: 7,
            dexterity: 9,
            constitution: 9,
            intelligence: 15,
            wisdom: 13,
            charisma: 10
        },
        baseHP: 80,
        baseMP: 150,
        baseStamina: 60
    },
    Rogue: {
        name: 'Rogue',
        description: 'Swift and cunning',
        stats: {
            strength: 10,
            dexterity: 15,
            constitution: 10,
            intelligence: 11,
            wisdom: 10,
            charisma: 11
        },
        baseHP: 90,
        baseMP: 70,
        baseStamina: 120
    },
    Cleric: {
        name: 'Cleric',
        description: 'Holy healer and support',
        stats: {
            strength: 10,
            dexterity: 9,
            constitution: 11,
            intelligence: 11,
            wisdom: 15,
            charisma: 12
        },
        baseHP: 100,
        baseMP: 120,
        baseStamina: 80
    },
    Ranger: {
        name: 'Ranger',
        description: "Nature's archer",
        stats: {
            strength: 11,
            dexterity: 14,
            constitution: 11,
            intelligence: 10,
            wisdom: 13,
            charisma: 9
        },
        baseHP: 100,
        baseMP: 80,
        baseStamina: 110
    }
};

/**
 * Create a new character
 */
function createCharacter() {
    const name = document.getElementById('charName').value.trim();
    const className = document.getElementById('charClass').value;
    
    // Validation
    if (!name) {
        alert('Please enter a character name!');
        return;
    }
    
    if (name.length < 3) {
        alert('Name must be at least 3 characters long!');
        return;
    }
    
    // Check if name already exists
    const exists = gameState.savedGames.some(save => 
        save.character.name.toLowerCase() === name.toLowerCase()
    );
    
    if (exists) {
        if (!confirm('A character with this name already exists. Overwrite?')) {
            return;
        }
    }
    
    // Create character object
    const classData = CHARACTER_CLASSES[className];
    const character = {
        name: name,
        class: className,
        level: 1,
        experience: 0,
        experienceToNext: 100,
        gold: 50,
        
        // Stats (with bonus points applied)
        stats: {
            strength: classData.stats.strength + allocatedStats.strength,
            dexterity: classData.stats.dexterity + allocatedStats.dexterity,
            constitution: classData.stats.constitution + allocatedStats.constitution,
            intelligence: classData.stats.intelligence + allocatedStats.intelligence,
            wisdom: classData.stats.wisdom + allocatedStats.wisdom,
            charisma: classData.stats.charisma + allocatedStats.charisma
        },
        
        // Resources
        health: classData.baseHP,
        maxHealth: classData.baseHP,
        mana: classData.baseMP,
        maxMana: classData.baseMP,
        stamina: classData.baseStamina,
        maxStamina: classData.baseStamina,
        
        // Combat stats
        attack: 10,
        defense: 5,
        critChance: 0.1,
        critMultiplier: 2.0,
        evasion: 0.05,
        
        // Progression
        inventory: null, // Will be initialized below
        equipment: null, // Will be initialized below
        skillTree: null, // Will be initialized below
        skillBonuses: {},
        completedAdventures: [],
        questLog: [],
        spells: [],
        abilities: [],
        
        // Adventure tracking
        adventureStartTime: null,
        damageTaken: 0,
        potionsUsed: 0,
        
        // Timestamps
        created: new Date().toISOString(),
        lastPlayed: new Date().toISOString()
    };
    
    // Initialize new systems
    character.inventory = new InventorySystem(100);
    character.equipment = new EquipmentManager(character);
    character.skillTree = new SkillTreeManager(character);
    
    // Add starting items
    character.inventory.addItem(SAMPLE_ITEMS.healthPotion, 3);
    character.inventory.addItem(SAMPLE_ITEMS.manaPotion, 2);
    character.inventory.addItem(SAMPLE_ITEMS.ironSword, 1);
    character.inventory.addItem(SAMPLE_ITEMS.leatherArmor, 1);
    
    // Save character
    gameState.currentCharacter = character;
    
    const saveData = {
        timestamp: new Date().toISOString(),
        character: character,
        adventureState: null
    };
    
    gameState.savedGames.push(saveData);
    saveGameData();
    
    // Reset bonus points for next character creation
    resetBonusPoints();
    
    playSFX('confirm');
    showMessage(`${name} the ${className} created!`, 'success');
    
    // Go to adventure select
    setTimeout(() => {
        showScreen('adventureSelect');
    }, 1500);
}

/**
 * Update stat preview when class is selected
 */
let bonusPoints = 3; // Points available to allocate
let allocatedStats = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
};

function updateStatPreview() {
    const className = document.getElementById('charClass').value;
    const classData = CHARACTER_CLASSES[className];
    
    if (!classData) return;
    
    const previewDiv = document.getElementById('statPreview');
    
    previewDiv.innerHTML = `
        <h4 style="color: var(--text-secondary); margin-bottom: 15px; font-size: 0.8em;">
            ${classData.name} - ${classData.description}
        </h4>
        <div style="text-align: center; margin-bottom: 15px; padding: 10px; background: rgba(0,255,0,0.1); border: 1px solid var(--text-highlight);">
            <span style="color: var(--text-highlight); font-weight: bold; font-size: 0.9em;">
                BONUS POINTS: <span id="bonusPointsDisplay">${bonusPoints}</span>
            </span>
        </div>
        ${generateStatRow('strength', '⚔️ STRENGTH', classData.stats.strength)}
        ${generateStatRow('dexterity', '🏃 DEXTERITY', classData.stats.dexterity)}
        ${generateStatRow('constitution', '💪 CONSTITUTION', classData.stats.constitution)}
        ${generateStatRow('intelligence', '🧠 INTELLIGENCE', classData.stats.intelligence)}
        ${generateStatRow('wisdom', '👁️ WISDOM', classData.stats.wisdom)}
        ${generateStatRow('charisma', '💬 CHARISMA', classData.stats.charisma)}
        <div style="margin-top: 15px; text-align: center; font-size: 0.7em; color: #888;">
            <p>❤️ HP: ${classData.baseHP} | 💙 MP: ${classData.baseMP} | ⚡ Stamina: ${classData.baseStamina}</p>
        </div>
    `;
}

function generateStatRow(statName, label, baseValue) {
    const allocated = allocatedStats[statName];
    const total = baseValue + allocated;
    const canDecrease = allocated > 0;
    const canIncrease = bonusPoints > 0;
    
    return `
        <div class="stat-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <span class="stat-label" style="flex: 1;">${label}:</span>
            <button 
                onclick="playSFX('select'); adjustStat('${statName}', -1)" 
                class="stat-btn" 
                style="width: 30px; height: 30px; margin: 0 5px; ${!canDecrease ? 'opacity: 0.3; cursor: not-allowed;' : ''}"
                ${!canDecrease ? 'disabled' : ''}>
                -
            </button>
            <span class="stat-value" style="min-width: 60px; text-align: center; font-weight: bold;">
                ${baseValue}${allocated > 0 ? ` <span style="color: var(--text-highlight);">+${allocated}</span>` : ''} = ${total}
            </span>
            <button 
                onclick="playSFX('select'); adjustStat('${statName}', 1)" 
                class="stat-btn"
                style="width: 30px; height: 30px; margin: 0 5px; ${!canIncrease ? 'opacity: 0.3; cursor: not-allowed;' : ''}"
                ${!canIncrease ? 'disabled' : ''}>
                +
            </button>
        </div>
    `;
}

function adjustStat(statName, delta) {
    // Check if we can make this adjustment
    if (delta > 0 && bonusPoints <= 0) return;
    if (delta < 0 && allocatedStats[statName] <= 0) return;
    
    // Apply the adjustment
    allocatedStats[statName] += delta;
    bonusPoints -= delta;
    
    // Update the display
    updateStatPreview();
}

function resetBonusPoints() {
    bonusPoints = 3;
    allocatedStats = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    };
}

/**
 * Load saved characters into the list
 */
function loadSavedCharacters() {
    const container = document.getElementById('savedCharacters');
    
    if (gameState.savedGames.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; padding: 30px; color: #888; font-size: 0.7em;">
                No saved characters found.<br>Create a new character to begin!
            </p>
        `;
        return;
    }
    
    container.innerHTML = gameState.savedGames.map((save, index) => {
        const char = save.character;
        const lastPlayed = new Date(save.timestamp).toLocaleDateString();
        
        return `
            <div class="saved-char-card" onclick="selectCharacter(${index})">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <h4 style="color: var(--text-secondary); font-size: 0.9em;">${char.name}</h4>
                    <span style="color: var(--text-highlight); font-size: 0.7em;">Lv.${char.level}</span>
                </div>
                <p style="font-size: 0.6em; color: #aaa; margin: 5px 0;">
                    ${char.class} • ${char.completedAdventures.length} Adventures
                </p>
                <p style="font-size: 0.5em; color: #666; margin-top: 10px;">
                    Last played: ${lastPlayed}
                </p>
                <button class="delete-char-btn" onclick="deleteCharacter(event, ${index})" 
                    style="position: absolute; top: 10px; right: 10px; padding: 5px 10px; 
                    background: var(--hp-color); border: 1px solid #000; color: #fff; 
                    font-size: 0.5em; cursor: pointer;">
                    ✕ DELETE
                </button>
            </div>
        `;
    }).join('');
    
    // Add styles for saved char cards
    const style = document.createElement('style');
    style.textContent = `
        .saved-char-card {
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
        }
        .saved-char-card:hover {
            border-color: var(--text-secondary);
            transform: translateX(5px);
        }
    `;
    if (!document.getElementById('charCardStyles')) {
        style.id = 'charCardStyles';
        document.head.appendChild(style);
    }
}

/**
 * Select a character to play
 */
function selectCharacter(index) {
    const saveData = gameState.savedGames[index];
    gameState.currentCharacter = saveData.character;
    
    // Check if there's a saved adventure
    if (saveData.adventureState) {
        gameState.currentAdventure = saveData.adventureState;
        playSFX('confirm');
        showMessage(`Welcome back, ${gameState.currentCharacter.name}! Resuming adventure...`, 'success');
        
        setTimeout(() => {
            showScreen('gameScreen');
            updateCharacterDisplay();
            
            // Show option to resume or restart
            clearStory();
            addStoryText('═══════════════════════════════════════════════════════════════════', false);
            addStoryText('                      RESUME ADVENTURE?', false);
            addStoryText('═══════════════════════════════════════════════════════════════════', false);
            addStoryText(`\nYou have a saved adventure in progress: ${saveData.adventureState}\n`, false);
            
            showChoices([
                { text: 'Resume from where you left off', value: 'resume' },
                { text: 'Restart adventure from beginning', value: 'restart' },
                { text: 'Back to adventure select', value: 'back' }
            ]).then(choice => {
                if (choice === 'resume') {
                    resumeAdventure();
                } else if (choice === 'restart') {
                    gameState.currentAdventure = null;
                    showScreen('adventureSelect');
                } else {
                    gameState.currentAdventure = null;
                    showScreen('adventureSelect');
                }
            });
        }, 1000);
    } else {
        playSFX('confirm');
        showMessage(`Welcome back, ${gameState.currentCharacter.name}!`, 'success');
        
        setTimeout(() => {
            showScreen('adventureSelect');
        }, 1000);
    }
}

/**
 * Delete a character
 */
function deleteCharacter(event, index) {
    event.stopPropagation();
    
    const char = gameState.savedGames[index].character;
    
    if (confirm(`Are you sure you want to delete ${char.name}? This cannot be undone!`)) {
        gameState.savedGames.splice(index, 1);
        saveGameData();
        loadSavedCharacters();
        showMessage('Character deleted', 'info');
    }
}

/**
 * Generate full character sheet HTML
 */
function generateCharacterSheetHTML(character) {
    return `
        <div style="font-size: 0.8em;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: var(--text-secondary);">${character.name}</h3>
                <p style="color: var(--text-highlight);">Level ${character.level} ${character.class}</p>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;">ATTRIBUTES</h4>
                ${Object.entries(character.stats).map(([stat, value]) => `
                    <div class="stat-row">
                        <span class="stat-label">${stat.toUpperCase()}:</span>
                        <span class="stat-value">${value}</span>
                    </div>
                `).join('')}
            </div>
            
            <div style="background: var(--bg-secondary); padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;">RESOURCES</h4>
                <div class="stat-row">
                    <span class="stat-label">❤️ HP:</span>
                    <span class="stat-value">${character.health}/${character.maxHealth}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">💙 MP:</span>
                    <span class="stat-value">${character.mana}/${character.maxMana}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">⚡ STAMINA:</span>
                    <span class="stat-value">${character.stamina}/${character.maxStamina}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">💰 GOLD:</span>
                    <span class="stat-value">${character.gold}</span>
                </div>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;">PROGRESSION</h4>
                <div class="stat-row">
                    <span class="stat-label">EXP:</span>
                    <span class="stat-value">${character.experience}/${character.experienceToNext}</span>
                </div>
                <div class="exp-bar">
                    <div class="exp-fill" style="width: ${(character.experience / character.experienceToNext) * 100}%"></div>
                </div>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;">INVENTORY</h4>
                ${(() => {
                    const inventoryItems = character.inventory && character.inventory.items ? character.inventory.items : (Array.isArray(character.inventory) ? character.inventory : []);
                    return inventoryItems.length > 0 ? 
                        inventoryItems.map(item => `
                            <div style="padding: 5px; font-size: 0.7em;">• ${item.icon || '📦'} ${item.name || item} ${item.quantity > 1 ? `(x${item.quantity})` : ''}</div>
                        `).join('') :
                        '<p style="color: #888; font-size: 0.7em;">Empty</p>';
                })()}
            </div>
            
            <div style="background: var(--bg-secondary); padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--text-secondary); margin-bottom: 10px;">COMPLETED ADVENTURES</h4>
                ${character.completedAdventures.length > 0 ?
                    character.completedAdventures.map(adv => `
                        <div style="padding: 5px; font-size: 0.7em; color: var(--text-highlight);">✓ ${adv}</div>
                    `).join('') :
                    '<p style="color: #888; font-size: 0.7em;">None yet</p>'
                }
            </div>
        </div>
    `;
}

/**
 * Update character in-game display
 */
function updateCharacterDisplay() {
    if (!gameState.currentCharacter) return;
    
    const char = gameState.currentCharacter;
    const statsDiv = document.getElementById('gameCharStats');
    const inventoryDiv = document.getElementById('gameInventory');
    
    if (statsDiv) {
        statsDiv.innerHTML = `
            <div style="font-size: 0.7em; margin-bottom: 10px;">
                <strong style="color: var(--text-secondary);">${char.name}</strong><br>
                <span style="color: var(--text-highlight);">Lv.${char.level} ${char.class}</span>
            </div>
            
            <div class="hp-bar">
                <div class="hp-fill" style="width: ${(char.health / char.maxHealth) * 100}%"></div>
                <div class="bar-text">${char.health}/${char.maxHealth} HP</div>
            </div>
            
            <div class="mp-bar">
                <div class="mp-fill" style="width: ${(char.mana / char.maxMana) * 100}%"></div>
                <div class="bar-text">${char.mana}/${char.maxMana} MP</div>
            </div>
            
            <div style="margin-top: 15px; font-size: 0.6em;">
                <div class="stat-row">
                    <span>💰 Gold:</span>
                    <span class="text-gold">${char.gold}</span>
                </div>
                <div class="stat-row">
                    <span>⭐ EXP:</span>
                    <span class="text-exp">${char.experience}/${char.experienceToNext}</span>
                </div>
            </div>
        `;
    }
    
    if (inventoryDiv) {
        const inventoryItems = char.inventory && char.inventory.items ? char.inventory.items : (Array.isArray(char.inventory) ? char.inventory : []);
        inventoryDiv.innerHTML = inventoryItems.length > 0 ?
            inventoryItems.map(item => `
                <div style="padding: 5px; font-size: 0.6em; border-bottom: 1px solid var(--border-color);">
                    ${item.icon || '📦'} ${item.name || item} ${item.quantity > 1 ? `(x${item.quantity})` : ''}
                </div>
            `).join('') :
            '<p style="color: #888; font-size: 0.6em; text-align: center;">Empty</p>';
    }
}

console.log('✅ character.js loaded');
