/**
 * MULTI-VENTURE - Achievement System
 * Track player accomplishments and milestones
 */

const ACHIEVEMENTS = {
    FIRST_BLOOD: {
        id: 'first_blood',
        name: 'First Blood',
        description: 'Defeat your first enemy',
        icon: '⚔️',
        rarity: 'COMMON',
        points: 10
    },
    SURVIVOR: {
        id: 'survivor',
        name: 'Survivor',
        description: 'Complete an adventure',
        icon: '🏆',
        rarity: 'COMMON',
        points: 25
    },
    TREASURE_HUNTER: {
        id: 'treasure_hunter',
        name: 'Treasure Hunter',
        description: 'Collect 1000 gold',
        icon: '💰',
        rarity: 'UNCOMMON',
        points: 15
    },
    LEVEL_10: {
        id: 'level_10',
        name: 'Experienced Adventurer',
        description: 'Reach level 10',
        icon: '⭐',
        rarity: 'UNCOMMON',
        points: 20
    },
    UNSTOPPABLE: {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Win 10 battles in a row',
        icon: '🔥',
        rarity: 'RARE',
        points: 30
    },
    COLLECTOR: {
        id: 'collector',
        name: 'Collector',
        description: 'Own 50 different items',
        icon: '📦',
        rarity: 'RARE',
        points: 25
    },
    MASTER_WARRIOR: {
        id: 'master_warrior',
        name: 'Master Warrior',
        description: 'Defeat 100 enemies',
        icon: '👑',
        rarity: 'EPIC',
        points: 50
    },
    PERFECT_RUN: {
        id: 'perfect_run',
        name: 'Perfect Run',
        description: 'Complete an adventure without taking damage',
        icon: '💎',
        rarity: 'EPIC',
        points: 75
    },
    LEGENDARY_HERO: {
        id: 'legendary_hero',
        name: 'Legendary Hero',
        description: 'Reach level 50',
        icon: '👑',
        rarity: 'LEGENDARY',
        points: 100
    },
    COMPLETIONIST: {
        id: 'completionist',
        name: 'Completionist',
        description: 'Unlock all achievements',
        icon: '🌟',
        rarity: 'LEGENDARY',
        points: 200
    },
    SPEEDRUNNER: {
        id: 'speedrunner',
        name: 'Speedrunner',
        description: 'Complete an adventure in under 10 minutes',
        icon: '⚡',
        rarity: 'RARE',
        points: 40
    },
    CRITICAL_MASTER: {
        id: 'critical_master',
        name: 'Critical Master',
        description: 'Land 50 critical hits',
        icon: '💥',
        rarity: 'UNCOMMON',
        points: 20
    },
    POTION_MASTER: {
        id: 'potion_master',
        name: 'Potion Master',
        description: 'Use 100 potions',
        icon: '🧪',
        rarity: 'COMMON',
        points: 15
    },
    NO_POTIONS: {
        id: 'no_potions',
        name: 'True Warrior',
        description: 'Complete an adventure without using potions',
        icon: '🛡️',
        rarity: 'EPIC',
        points: 60
    },
    FULL_EQUIPMENT: {
        id: 'full_equipment',
        name: 'Fully Armed',
        description: 'Have all equipment slots filled',
        icon: '⚔️🛡️',
        rarity: 'UNCOMMON',
        points: 20
    }
};

class AchievementManager {
    constructor() {
        this.unlockedAchievements = new Set();
        this.progress = {};
        this.totalPoints = 0;
        this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem('qol_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.unlockedAchievements = new Set(data.unlocked || []);
                this.progress = data.progress || {};
                this.totalPoints = data.totalPoints || 0;
            }
        } catch (e) {
            console.error('Failed to load achievements:', e);
        }
    }

    save() {
        try {
            const data = {
                unlocked: Array.from(this.unlockedAchievements),
                progress: this.progress,
                totalPoints: this.totalPoints
            };
            localStorage.setItem('qol_achievements', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save achievements:', e);
        }
    }

    unlock(achievementId) {
        if (this.unlockedAchievements.has(achievementId)) {
            return false; // Already unlocked
        }

        const achievement = ACHIEVEMENTS[achievementId.toUpperCase()];
        if (!achievement) {
            console.error('Achievement not found:', achievementId);
            return false;
        }

        this.unlockedAchievements.add(achievementId);
        this.totalPoints += achievement.points;
        this.save();

        this.showAchievementPopup(achievement);
        
        // Check for completionist
        if (this.unlockedAchievements.size === Object.keys(ACHIEVEMENTS).length - 1) {
            setTimeout(() => this.unlock('completionist'), 1000);
        }

        return true;
    }

    showAchievementPopup(achievement) {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">Achievement Unlocked!</div>
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-points">+${achievement.points} points</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        setTimeout(() => popup.classList.add('show'), 100);
        
        // Play sound effect
        if (settingsManager && settingsManager.settings.sound.enabled) {
            playSFX('confirm');
        }
        
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    }

    isUnlocked(achievementId) {
        return this.unlockedAchievements.has(achievementId);
    }

    getProgress(key) {
        return this.progress[key] || 0;
    }

    incrementProgress(key, amount = 1) {
        this.progress[key] = (this.progress[key] || 0) + amount;
        this.save();
        this.checkProgressAchievements();
    }

    setProgress(key, value) {
        this.progress[key] = value;
        this.save();
        this.checkProgressAchievements();
    }

    checkProgressAchievements() {
        // Check various progress-based achievements
        if (this.getProgress('enemies_defeated') >= 1 && !this.isUnlocked('first_blood')) {
            this.unlock('first_blood');
        }
        
        if (this.getProgress('enemies_defeated') >= 100 && !this.isUnlocked('master_warrior')) {
            this.unlock('master_warrior');
        }
        
        if (this.getProgress('gold_collected') >= 1000 && !this.isUnlocked('treasure_hunter')) {
            this.unlock('treasure_hunter');
        }
        
        if (this.getProgress('critical_hits') >= 50 && !this.isUnlocked('critical_master')) {
            this.unlock('critical_master');
        }
        
        if (this.getProgress('potions_used') >= 100 && !this.isUnlocked('potion_master')) {
            this.unlock('potion_master');
        }
        
        if (this.getProgress('win_streak') >= 10 && !this.isUnlocked('unstoppable')) {
            this.unlock('unstoppable');
        }
        
        if (this.getProgress('unique_items') >= 50 && !this.isUnlocked('collector')) {
            this.unlock('collector');
        }
    }

    showAchievementsList() {
        const modal = document.getElementById('achievementsModal');
        if (!modal) return;

        let html = `
            <div class="achievements-header">
                <h2>🏆 Achievements</h2>
                <div class="achievements-stats">
                    <span>Unlocked: ${this.unlockedAchievements.size}/${Object.keys(ACHIEVEMENTS).length}</span>
                    <span>Total Points: ${this.totalPoints}</span>
                </div>
            </div>
            <div class="achievements-grid">
        `;

        for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
            const unlocked = this.isUnlocked(achievement.id);
            const rarityColor = ITEM_RARITY[achievement.rarity].color;

            html += `
                <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" 
                     style="border-color: ${rarityColor};">
                    <div class="achievement-card-icon" style="color: ${rarityColor};">
                        ${unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div class="achievement-card-content">
                        <div class="achievement-card-name" style="color: ${rarityColor};">
                            ${unlocked ? achievement.name : '???'}
                        </div>
                        <div class="achievement-card-description">
                            ${unlocked ? achievement.description : 'Hidden achievement'}
                        </div>
                        <div class="achievement-card-points">
                            ${achievement.points} points
                        </div>
                    </div>
                </div>
            `;
        }

        html += '</div>';

        const content = document.getElementById('achievementsContent');
        if (content) {
            content.innerHTML = html;
        }

        modal.classList.add('active');
    }
}

// Global achievement manager
let achievementManager = null;

function initAchievements() {
    achievementManager = new AchievementManager();
}

function showAchievements() {
    if (achievementManager) {
        achievementManager.showAchievementsList();
    }
}

function closeAchievements() {
    const modal = document.getElementById('achievementsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Event tracking functions
function trackEnemyDefeat() {
    if (achievementManager) {
        achievementManager.incrementProgress('enemies_defeated', 1);
        const current = achievementManager.getProgress('win_streak') || 0;
        achievementManager.setProgress('win_streak', current + 1);
    }
}

function trackAdventureComplete(withoutDamage = false, withoutPotions = false, timeInSeconds = 0) {
    if (achievementManager) {
        achievementManager.incrementProgress('adventures_completed', 1);
        
        if (!achievementManager.isUnlocked('survivor')) {
            achievementManager.unlock('survivor');
        }
        
        if (withoutDamage && !achievementManager.isUnlocked('perfect_run')) {
            achievementManager.unlock('perfect_run');
        }
        
        if (withoutPotions && !achievementManager.isUnlocked('no_potions')) {
            achievementManager.unlock('no_potions');
        }
        
        if (timeInSeconds < 600 && !achievementManager.isUnlocked('speedrunner')) {
            achievementManager.unlock('speedrunner');
        }
    }
}

function trackCriticalHit() {
    if (achievementManager) {
        achievementManager.incrementProgress('critical_hits', 1);
    }
}

function trackPotionUse() {
    if (achievementManager) {
        achievementManager.incrementProgress('potions_used', 1);
    }
}

function trackGoldGained(amount) {
    if (achievementManager) {
        const current = achievementManager.getProgress('gold_collected') || 0;
        achievementManager.setProgress('gold_collected', current + amount);
    }
}

function trackLevelUp(newLevel) {
    if (achievementManager) {
        if (newLevel >= 10 && !achievementManager.isUnlocked('level_10')) {
            achievementManager.unlock('level_10');
        }
        if (newLevel >= 50 && !achievementManager.isUnlocked('legendary_hero')) {
            achievementManager.unlock('legendary_hero');
        }
    }
}

console.log('✅ achievements.js loaded');
