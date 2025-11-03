/**
 * MULTI-VENTURE - Utility Functions
 * Helper functions used throughout the game
 */

// Global flag to skip text animation
let skipTyping = false;
let isCurrentlyTyping = false; // Track if we're actively typing

/**
 * Delay execution
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Type text with animation effect
 * Can be called with element and text, or just text (uses story window)
 */
async function typeText(elementOrText, text = null, speed = 10) {
    // If called with just text string, add to story
    if (typeof elementOrText === 'string' && text === null) {
        await addStoryText(elementOrText, true);
        return;
    }
    
    // Otherwise, type to specific element
    const element = elementOrText;
    element.textContent = '';
    
    // Get the scrollable story container (the parent .story-window, not #storyText)
    const storyTextDiv = document.getElementById('storyText');
    const storyWindow = storyTextDiv?.parentElement; // This is the .story-window div with overflow
    
    isCurrentlyTyping = true; // Mark that we're typing
    
    // If skip is requested, show all text immediately
    if (skipTyping) {
        element.textContent = text;
        if (storyWindow && storyWindow.contains(element)) {
            storyWindow.scrollTop = storyWindow.scrollHeight;
        }
        skipTyping = false; // Reset immediately after use
        isCurrentlyTyping = false;
        return;
    }
    
    for (let char of text) {
        // Check if skip was triggered during typing
        if (skipTyping) {
            element.textContent = text; // Show remaining text
            if (storyWindow && storyWindow.contains(element)) {
                storyWindow.scrollTop = storyWindow.scrollHeight;
            }
            skipTyping = false; // Reset immediately after use
            isCurrentlyTyping = false;
            return;
        }
        
        element.textContent += char;
        
        // Auto-scroll the story-window container after every character
        if (storyWindow && storyWindow.contains(element)) {
            storyWindow.scrollTop = storyWindow.scrollHeight;
        }
        
        await sleep(speed);
    }
    
    // Final scroll to ensure we're at the bottom
    if (storyWindow && storyWindow.contains(element)) {
        storyWindow.scrollTop = storyWindow.scrollHeight;
    }
    
    isCurrentlyTyping = false; // Done typing
}

/**
 * Add text to story window with animation
 */
async function addStoryText(text, animate = true) {
    const storyDiv = document.getElementById('storyText');
    if (!storyDiv) return;
    
    // Get the scrollable container (story-window)
    const storyWindow = storyDiv.parentElement;
    
    const p = document.createElement('p');
    
    // Skip animation for decorative lines (borders, titles with ═, ---, or emoji)
    const isDecorative = text.includes('═══') || text.includes('---') || 
                        text.includes('ACT') || text.includes('🌲') || 
                        text.includes('🏆') || text.trim().length < 50;
    
    if (!animate || isDecorative) {
        p.textContent = text;
        storyDiv.appendChild(p);
        // Immediate scroll for non-animated text
        if (storyWindow) {
            storyWindow.scrollTop = storyWindow.scrollHeight;
        }
    } else {
        // Append element first so typing is visible
        storyDiv.appendChild(p);
        
        // Use text speed from settings, default to 30ms if not available
        let speed = 30; // Default fallback
        
        if (settingsManager && settingsManager.settings && settingsManager.settings.display) {
            speed = settingsManager.settings.display.textSpeed;
            console.log('✅ Using settings speed:', speed, 'ms');
        } else {
            console.log('⚠️ Settings not loaded, using default:', speed, 'ms');
        }
        
        await typeText(p, text, speed);
        
        // Ensure scroll after typing completes
        if (storyWindow) {
            storyWindow.scrollTop = storyWindow.scrollHeight;
        }
    }
}

/**
 * Clear story window
 */
function clearStory() {
    document.getElementById('storyText').innerHTML = '';
}

/**
 * Format number with separators
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Roll dice (for random events)
 */
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

/**
 * Check if stat passes threshold
 */
function statCheck(stat, threshold) {
    return stat >= threshold;
}

/**
 * Get random element from array
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Calculate level from experience
 */
function calculateLevel(exp) {
    return Math.floor(Math.sqrt(exp / 50)) + 1;
}

/**
 * Calculate experience needed for next level
 */
function expForNextLevel(level) {
    return Math.pow(level, 2) * 50;
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if character has item
 */
function hasItem(character, itemName) {
    return character.inventory.includes(itemName);
}

/**
 * Add item to inventory
 */
function addItem(character, itemName) {
    character.inventory.push(itemName);
    showMessage(`✓ Obtained: ${itemName}`, 'success');
}

/**
 * Remove item from inventory
 */
function removeItem(character, itemName) {
    const index = character.inventory.indexOf(itemName);
    if (index > -1) {
        character.inventory.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Add gold to character
 */
function addGold(character, amount) {
    character.gold += amount;
    updateCharacterDisplay();
    if (amount > 0) {
        showMessage(`💰 +${amount} gold`, 'success');
    }
}

/**
 * Add experience to character
 */
function addExperience(character, amount) {
    character.experience += amount;
    const oldLevel = character.level;
    
    // Check for level up
    while (character.experience >= character.experienceToNext) {
        character.level++;
        character.experienceToNext = expForNextLevel(character.level);
        
        // Level up bonuses
        const classData = CHARACTER_CLASSES[character.class];
        character.maxHealth += 10;
        character.maxMana += 8;
        character.maxStamina += 5;
        character.health = character.maxHealth;
        character.mana = character.maxMana;
        character.stamina = character.maxStamina;
        
        showMessage(`🎉 LEVEL UP! Now Level ${character.level}!`, 'success');
    }
    
    updateCharacterDisplay();
    
    if (amount > 0) {
        showMessage(`⭐ +${amount} EXP`, 'success');
    }
}

/**
 * Heal character
 */
function heal(character, amount) {
    const oldHealth = character.health;
    character.health = Math.min(character.health + amount, character.maxHealth);
    const healed = character.health - oldHealth;
    
    updateCharacterDisplay();
    
    if (healed > 0) {
        showMessage(`❤️ Restored ${healed} HP`, 'success');
    }
}

/**
 * Restore mana
 */
function restoreMana(character, amount) {
    const oldMana = character.mana;
    character.mana = Math.min(character.mana + amount, character.maxMana);
    const restored = character.mana - oldMana;
    
    updateCharacterDisplay();
    
    if (restored > 0) {
        showMessage(`💙 Restored ${restored} MP`, 'success');
    }
}

/**
 * Take damage
 */
function takeDamage(character, amount) {
    character.health = Math.max(character.health - amount, 0);
    updateCharacterDisplay();
    
    if (amount > 0) {
        showMessage(`💔 Took ${amount} damage!`, 'danger');
    }
    
    return character.health > 0;
}

/**
 * Use mana
 */
function useMana(character, amount) {
    if (character.mana >= amount) {
        character.mana -= amount;
        updateCharacterDisplay();
        return true;
    }
    showMessage('✗ Not enough mana!', 'danger');
    return false;
}

/**
 * Format time difference
 */
function timeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

/**
 * Generate unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Sanitize HTML
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Parse markdown-like text
 */
function parseText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

/**
 * Create an enemy object
 */
function createEnemy(name, hp, mp, level, sprite = 'monster') {
    const spriteMap = {
        'wolf': '🐺',
        'bear': '🐻',
        'tree': '🌳',
        'ghost': '👻',
        'boss': '👹',
        'monster': '👾',
        'goblin': '👺',
        'dragon': '🐲',
        'skeleton': '💀'
    };
    
    return {
        name: name,
        maxHP: hp,
        currentHP: hp,
        maxMP: mp,
        currentMP: mp,
        level: level,
        sprite: spriteMap[sprite] || '👾',
        attacks: []
    };
}

/**
 * Play sound effect
 */
function playSFX(sound) {
    // Placeholder - will work when audio files are added
    const audioElement = document.getElementById(`sfx${sound.charAt(0).toUpperCase() + sound.slice(1)}`);
    if (audioElement && audioElement.src) {
        audioElement.currentTime = 0;
        audioElement.play().catch(e => console.log('Audio play failed:', e));
    }
}

console.log('✅ utils.js loaded');
