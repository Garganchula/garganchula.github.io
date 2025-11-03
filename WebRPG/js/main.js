/**
 * MULTI-VENTURE - Main JavaScript Entry Point
 * Handles screen transitions and initialization
 */

// Global game state
let gameState = {
    currentCharacter: null,
    currentAdventure: null,
    currentScene: null,
    savedGames: [],
    settings: {
        soundEnabled: true,
        musicEnabled: true
    }
};

/**
 * Show a specific screen and hide others
 */
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        
        // Initialize screen-specific content
        if (screenId === 'adventureSelect') {
            loadAdventureList();
        } else if (screenId === 'characterSelect') {
            loadSavedCharacters();
        }
    }
    
    playSFX('select');
    
    // Try to start background music on first user interaction
    if (typeof startBackgroundMusic === 'function') {
        startBackgroundMusic();
    }
}

/**
 * Switch between tabs in character select
 */
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'create') {
        document.getElementById('createTab').classList.add('active');
        updateStatPreview();
    } else if (tabName === 'load') {
        document.getElementById('loadTab').classList.add('active');
        loadSavedCharacters();
    }
}

/**
 * Play sound effect
 */
function playSFX(type) {
    // Check if settings manager exists and sound is enabled
    if (settingsManager && !settingsManager.settings.sound.enabled) return;
    
    const sfx = document.getElementById(`sfx${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (sfx && sfx.src) {
        sfx.currentTime = 0;
        // Apply volume settings
        if (settingsManager) {
            sfx.volume = settingsManager.settings.sound.sfxVolume * settingsManager.settings.sound.volume;
        }
        sfx.play().catch(err => {
            // Ignore autoplay errors (browsers block autoplay before user interaction)
            console.log('Audio playback prevented:', err.message);
        });
    }
}

/**
 * Start background music
 */
function startBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (!bgMusic) {
        console.log('Background music element not found');
        return;
    }
    
    // Check if settingsManager exists and music is enabled
    const musicEnabled = settingsManager ? settingsManager.settings.sound.musicEnabled : true;
    if (!musicEnabled) {
        console.log('Music is disabled in settings');
        return;
    }
    
    // Set volume
    if (settingsManager) {
        const masterVolume = settingsManager.settings.sound.volume;
        const musicVolume = settingsManager.settings.sound.musicVolume;
        bgMusic.volume = masterVolume * musicVolume;
    } else {
        bgMusic.volume = 0.5; // Default volume
    }
    
    console.log('Attempting to play background music...');
    bgMusic.play().catch(err => {
        console.log('Background music autoplay prevented:', err.message);
        console.log('Music will start on next user interaction');
        // Try to play on next user interaction
        document.addEventListener('click', () => {
            console.log('User clicked, attempting to start music...');
            bgMusic.play().catch(e => console.log('Music play failed:', e.message));
        }, { once: true });
    });
}

/**
 * Stop background music
 */
function stopBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

/**
 * Update background music volume
 */
function updateBackgroundMusicVolume() {
    if (!settingsManager) return;
    
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        const masterVolume = settingsManager.settings.sound.volume;
        const musicVolume = settingsManager.settings.sound.musicVolume;
        bgMusic.volume = masterVolume * musicVolume;
        
        // Play or pause based on settings
        if (settingsManager.settings.sound.musicEnabled && bgMusic.paused) {
            bgMusic.play().catch(err => console.log('Music play error:', err));
        } else if (!settingsManager.settings.sound.musicEnabled && !bgMusic.paused) {
            bgMusic.pause();
        }
    }
}

/**
 * Show confirmation dialog
 */
function confirmQuit() {
    if (confirm('Are you sure you want to quit? Any unsaved progress will be lost.')) {
        showScreen('titleScreen');
        gameState.currentAdventure = null;
    }
}

/**
 * Back to main menu from game screen
 */
function backToMenu() {
    if (gameState.currentAdventure) {
        if (confirm('Return to main menu? Your progress will be saved.')) {
            saveGameData();
            showScreen('titleScreen');
        }
    } else {
        showScreen('titleScreen');
    }
}

/**
 * Initialize the game on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Multi-Venture - Initializing...');
    
    // Load saved games from localStorage
    loadGameData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize character class selector
    const classSelect = document.getElementById('charClass');
    if (classSelect) {
        classSelect.addEventListener('change', updateStatPreview);
    }
    
    // Show title screen
    showScreen('titleScreen');
    
    // Start background music (will handle autoplay restrictions)
    startBackgroundMusic();
    
    console.log('✅ Game initialized successfully');
});

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                activeModal.classList.remove('active');
            } else if (document.getElementById('gameScreen').classList.contains('active')) {
                confirmQuit();
            } else {
                showScreen('titleScreen');
            }
        }
    });
}

/**
 * Load game data from localStorage
 */
function loadGameData() {
    try {
        const saved = localStorage.getItem('questOfLegends_saves');
        if (saved) {
            const parsedSaves = JSON.parse(saved);
            // Deserialize characters
            gameState.savedGames = parsedSaves.map(save => ({
                timestamp: save.timestamp,
                character: deserializeCharacter(save.character),
                adventureState: save.adventureState
            }));
        }
        
        const settings = localStorage.getItem('questOfLegends_settings');
        if (settings) {
            gameState.settings = JSON.parse(settings);
        }
    } catch (err) {
        console.error('Error loading game data:', err);
    }
}

/**
 * Deserialize character when loading (restore proper objects)
 */
function deserializeCharacter(characterData) {
    if (!characterData) return null;
    
    const character = { ...characterData };
    
    // Restore InventorySystem
    if (character.inventory && Array.isArray(character.inventory)) {
        const inventorySystem = new InventorySystem(100);
        character.inventory.forEach(itemData => {
            inventorySystem.addItem(itemData, itemData.quantity || 1);
        });
        character.inventory = inventorySystem;
    } else if (!character.inventory) {
        character.inventory = new InventorySystem(100);
    }
    
    // Restore EquipmentManager
    if (character.equipment && !character.equipment.equip) {
        const equipmentManager = new EquipmentManager(character);
        if (character.equipment.slots) {
            equipmentManager.slots = character.equipment.slots;
        }
        character.equipment = equipmentManager;
    } else if (!character.equipment) {
        character.equipment = new EquipmentManager(character);
    }
    
    // Restore SkillTreeManager
    if (character.skillTree && !character.skillTree.learnSkill) {
        const skillTreeManager = new SkillTreeManager(character);
        if (character.skillTree.skills) {
            skillTreeManager.skills = character.skillTree.skills;
        }
        if (character.skillTree.availablePoints !== undefined) {
            skillTreeManager.availablePoints = character.skillTree.availablePoints;
        }
        character.skillTree = skillTreeManager;
    } else if (!character.skillTree) {
        character.skillTree = new SkillTreeManager(character);
    }
    
    return character;
}

/**
 * Save game data to localStorage
 */
function saveGameData() {
    try {
        // Serialize saved games with proper handling of circular references
        const serializedSaves = gameState.savedGames.map(save => {
            return {
                timestamp: save.timestamp,
                character: serializeCharacter(save.character),
                adventureState: save.adventureState
            };
        });
        
        localStorage.setItem('questOfLegends_saves', JSON.stringify(serializedSaves));
        localStorage.setItem('questOfLegends_settings', JSON.stringify(gameState.settings));
    } catch (err) {
        console.error('Error saving game data:', err);
    }
}

/**
 * Serialize character for saving (remove circular references)
 */
function serializeCharacter(character) {
    if (!character) return null;
    
    const serialized = { ...character };
    
    // Convert InventorySystem to simple array
    if (serialized.inventory && serialized.inventory.items) {
        serialized.inventory = serialized.inventory.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            category: item.category,
            rarity: item.rarity,
            weight: item.weight,
            value: item.value,
            stackable: item.stackable,
            quantity: item.quantity,
            stats: item.stats,
            effects: item.effects,
            icon: item.icon
        }));
    }
    
    // Convert EquipmentManager to simple object
    if (serialized.equipment && serialized.equipment.slots) {
        serialized.equipment = {
            slots: { ...serialized.equipment.slots }
        };
    }
    
    // Convert SkillTreeManager to simple object
    if (serialized.skillTree && serialized.skillTree.skills) {
        serialized.skillTree = {
            skills: { ...serialized.skillTree.skills },
            availablePoints: serialized.skillTree.availablePoints || 0
        };
    }
    
    return serialized;
}

/**
 * Load game (continue)
 */
function loadGame() {
    if (gameState.savedGames.length === 0) {
        alert('No saved games found. Please create a new character first.');
        showScreen('characterSelect');
        return;
    }
    
    // Load the most recent save
    const latestSave = gameState.savedGames[gameState.savedGames.length - 1];
    gameState.currentCharacter = latestSave.character;
    
    if (latestSave.adventureState) {
        // Resume adventure
        gameState.currentAdventure = latestSave.adventureState;
        showScreen('gameScreen');
        resumeAdventure();
    } else {
        // Go to adventure select
        showScreen('adventureSelect');
    }
}

/**
 * Show character sheet modal
 */
function showCharacterSheet() {
    if (!gameState.currentCharacter) return;
    
    const modal = document.getElementById('charSheetModal');
    const sheetDiv = document.getElementById('fullCharSheet');
    
    sheetDiv.innerHTML = generateCharacterSheetHTML(gameState.currentCharacter);
    modal.classList.add('active');
}

/**
 * Close character sheet modal
 */
function closeCharSheet() {
    document.getElementById('charSheetModal').classList.remove('active');
}

/**
 * Save game progress
 */
function saveGameProgress() {
    if (!gameState.currentCharacter) return;
    
    const saveData = {
        timestamp: new Date().toISOString(),
        character: gameState.currentCharacter,
        adventureState: gameState.currentAdventure
    };
    
    // Find existing save or create new one
    const existingIndex = gameState.savedGames.findIndex(
        save => save.character.name === gameState.currentCharacter.name
    );
    
    if (existingIndex >= 0) {
        gameState.savedGames[existingIndex] = saveData;
    } else {
        gameState.savedGames.push(saveData);
    }
    
    saveGameData();
    
    // Show different message based on whether in adventure
    if (gameState.currentAdventure) {
        showMessage('✅ Character saved! (Adventure will restart on load)', 'warning');
    } else {
        showMessage('✅ Game saved successfully!', 'success');
    }
}

/**
 * Show temporary message
 */
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    
    let bgColor = '#00ff00'; // success
    if (type === 'error') bgColor = '#ff0000';
    if (type === 'warning') bgColor = '#ffaa00';
    if (type === 'info') bgColor = '#00aaff';
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: #000;
        padding: 15px 25px;
        border: 3px solid #000;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.7em;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('✅ main.js loaded');
