/**
 * QUEST OF LEGENDS - Main JavaScript Entry Point
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
    console.log('🎮 Quest of Legends - Initializing...');
    
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
            gameState.savedGames = JSON.parse(saved);
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
 * Save game data to localStorage
 */
function saveGameData() {
    try {
        localStorage.setItem('questOfLegends_saves', JSON.stringify(gameState.savedGames));
        localStorage.setItem('questOfLegends_settings', JSON.stringify(gameState.settings));
    } catch (err) {
        console.error('Error saving game data:', err);
    }
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
    showMessage('✅ Game saved successfully!', 'success');
}

/**
 * Show temporary message
 */
function showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00ff00' : '#ff0000'};
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
