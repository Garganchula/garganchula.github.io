/**
 * MULTI-VENTURE - Adventure System
 * Manages adventure loading and execution
 */

// Adventure registry
const ADVENTURES = {
    'dark_forest': {
        id: 'dark_forest',
        name: 'The Dark Forest',
        description: 'A tale of shadows and corruption',
        difficulty: 'Easy',
        recommendedLevel: 1,
        completed: false
    },
    'dragon_cave': {
        id: 'dragon_cave',
        name: "The Dragon's Lair",
        description: 'A tale of greed, honor, and the price of power',
        difficulty: 'Medium',
        recommendedLevel: 3,
        completed: false
    }
};

/**
 * Load adventure list into UI
 */
function loadAdventureList() {
    const listDiv = document.getElementById('adventureList');
    const charInfo = document.getElementById('characterInfo');
    
    // Display character info
    if (gameState.currentCharacter) {
        charInfo.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="color: var(--text-secondary); margin-bottom: 5px;">
                        ${gameState.currentCharacter.name}
                    </h3>
                    <p style="font-size: 0.7em; color: var(--text-highlight);">
                        Level ${gameState.currentCharacter.level} ${gameState.currentCharacter.class}
                    </p>
                </div>
                <div style="text-align: right; font-size: 0.7em;">
                    <p>❤️ ${gameState.currentCharacter.health}/${gameState.currentCharacter.maxHealth}</p>
                    <p>💰 ${gameState.currentCharacter.gold} gold</p>
                </div>
            </div>
        `;
    } else {
        charInfo.innerHTML = '<p>No character loaded. Please create or load a character first.</p>';
        listDiv.innerHTML = '';
        return;
    }
    
    // Load adventures
    listDiv.innerHTML = Object.values(ADVENTURES).map(adv => {
        const isCompleted = gameState.currentCharacter.completedAdventures.includes(adv.name);
        
        return `
            <div class="adventure-card" onclick="selectAdventure('${adv.id}')">
                ${isCompleted ? '<div class="adventure-completed">✓ COMPLETED</div>' : ''}
                <h3>${adv.name}</h3>
                <p>${adv.description}</p>
                <p style="color: var(--text-highlight);">Recommended Level: ${adv.recommendedLevel}</p>
                <div class="adventure-difficulty">${adv.difficulty}</div>
            </div>
        `;
    }).join('');
}

/**
 * Select and start adventure
 */
function selectAdventure(adventureId) {
    if (!gameState.currentCharacter) {
        alert('Please create or load a character first!');
        return;
    }
    
    const adventure = ADVENTURES[adventureId];
    
    if (!adventure) {
        alert('Adventure not found!');
        return;
    }
    
    // Confirm if level is low
    if (gameState.currentCharacter.level < adventure.recommendedLevel) {
        if (!confirm(`Your level (${gameState.currentCharacter.level}) is below the recommended level (${adventure.recommendedLevel}). Continue anyway?`)) {
            return;
        }
    }
    
    // Start adventure
    gameState.currentAdventure = {
        id: adventureId,
        name: adventure.name,
        state: {}
    };
    
    showScreen('gameScreen');
    
    // Set adventure title in header
    const titleElement = document.getElementById('adventureTitle');
    if (titleElement) {
        titleElement.textContent = adventure.name.toUpperCase();
    }
    
    // Initialize game display
    updateCharacterDisplay();
    clearStory();
    
    // Start the specific adventure
    if (adventureId === 'dark_forest') {
        startDarkForestAdventure();
    } else if (adventureId === 'dragon_cave') {
        startDragonCaveAdventure();
    }
}

/**
 * Resume saved adventure
 */
function resumeAdventure() {
    if (!gameState.currentAdventure) return;
    
    updateCharacterDisplay();
    clearStory();
    
    // NOTE: Currently adventures restart from the beginning when loaded
    // TODO: Implement proper scene state saving/restoration
    if (gameState.currentAdventure.id === 'dark_forest') {
        startDarkForestAdventure();
    } else if (gameState.currentAdventure.id === 'dragon_cave') {
        startDragonCaveAdventure();
    }
}

console.log('✅ adventure.js loaded');
