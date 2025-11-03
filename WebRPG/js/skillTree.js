/**
 * QUEST OF LEGENDS - Skill Tree System
 * Class-specific skill trees and talent points
 */

const SKILL_TREES = {
    Warrior: {
        name: 'Warrior Skills',
        icon: '⚔️',
        skills: {
            powerStrike: {
                id: 'powerStrike',
                name: 'Power Strike',
                description: 'Increases attack damage by 10%',
                icon: '💪',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { attackBonus: 0.1 }
            },
            ironSkin: {
                id: 'ironSkin',
                name: 'Iron Skin',
                description: 'Increases defense by 10%',
                icon: '🛡️',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { defenseBonus: 0.1 }
            },
            battleRage: {
                id: 'battleRage',
                name: 'Battle Rage',
                description: 'Deal 50% more damage but take 20% more damage',
                icon: '😡',
                maxRank: 1,
                cost: 2,
                requirements: { powerStrike: 3 },
                effects: { attackBonus: 0.5, defenseReduction: 0.2 }
            },
            cleave: {
                id: 'cleave',
                name: 'Cleave',
                description: 'Attacks hit multiple enemies',
                icon: '⚔️⚔️',
                maxRank: 1,
                cost: 3,
                requirements: { powerStrike: 5 },
                effects: { aoeAttack: true }
            },
            lastStand: {
                id: 'lastStand',
                name: 'Last Stand',
                description: 'Survive fatal damage with 1 HP once per battle',
                icon: '💀',
                maxRank: 1,
                cost: 3,
                requirements: { ironSkin: 5 },
                effects: { lastStand: true }
            }
        }
    },
    Mage: {
        name: 'Mage Skills',
        icon: '🔮',
        skills: {
            arcaneKnowledge: {
                id: 'arcaneKnowledge',
                name: 'Arcane Knowledge',
                description: 'Increases max mana by 10',
                icon: '📚',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { manaBonus: 10 }
            },
            spellPower: {
                id: 'spellPower',
                name: 'Spell Power',
                description: 'Increases magic damage by 15%',
                icon: '✨',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { spellDamageBonus: 0.15 }
            },
            fireball: {
                id: 'fireball',
                name: 'Fireball',
                description: 'Unlocks Fireball spell (40 damage, 20 MP)',
                icon: '🔥',
                maxRank: 1,
                cost: 2,
                requirements: { spellPower: 2 },
                effects: { unlockSpell: 'fireball' }
            },
            frostNova: {
                id: 'frostNova',
                name: 'Frost Nova',
                description: 'Unlocks Frost Nova (freezes enemy)',
                icon: '❄️',
                maxRank: 1,
                cost: 2,
                requirements: { arcaneKnowledge: 3 },
                effects: { unlockSpell: 'frostNova' }
            },
            arcaneExplosion: {
                id: 'arcaneExplosion',
                name: 'Arcane Explosion',
                description: 'Massive AOE damage (60 damage, 40 MP)',
                icon: '💥',
                maxRank: 1,
                cost: 3,
                requirements: { spellPower: 5, fireball: 1 },
                effects: { unlockSpell: 'arcaneExplosion' }
            }
        }
    },
    Rogue: {
        name: 'Rogue Skills',
        icon: '🗡️',
        skills: {
            quickFeet: {
                id: 'quickFeet',
                name: 'Quick Feet',
                description: 'Increases evasion by 5%',
                icon: '💨',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { evasionBonus: 0.05 }
            },
            deadlyPrecision: {
                id: 'deadlyPrecision',
                name: 'Deadly Precision',
                description: 'Increases critical hit chance by 5%',
                icon: '🎯',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { critChanceBonus: 0.05 }
            },
            backstab: {
                id: 'backstab',
                name: 'Backstab',
                description: 'Deal 3x damage on critical hits',
                icon: '🔪',
                maxRank: 1,
                cost: 2,
                requirements: { deadlyPrecision: 3 },
                effects: { critMultiplier: 3 }
            },
            shadowStep: {
                id: 'shadowStep',
                name: 'Shadow Step',
                description: 'Avoid the next attack',
                icon: '👤',
                maxRank: 1,
                cost: 2,
                requirements: { quickFeet: 3 },
                effects: { unlockAbility: 'shadowStep' }
            },
            poisonWeapons: {
                id: 'poisonWeapons',
                name: 'Poison Weapons',
                description: 'Attacks apply poison',
                icon: '☠️',
                maxRank: 1,
                cost: 3,
                requirements: { deadlyPrecision: 5 },
                effects: { poisonOnHit: true }
            }
        }
    },
    Cleric: {
        name: 'Cleric Skills',
        icon: '✨',
        skills: {
            divineBlessing: {
                id: 'divineBlessing',
                name: 'Divine Blessing',
                description: 'Increases healing by 10%',
                icon: '🙏',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { healingBonus: 0.1 }
            },
            holyShield: {
                id: 'holyShield',
                name: 'Holy Shield',
                description: 'Increases defense by 8%',
                icon: '✝️',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { defenseBonus: 0.08 }
            },
            smite: {
                id: 'smite',
                name: 'Smite',
                description: 'Holy damage attack (30 damage, 15 MP)',
                icon: '⚡',
                maxRank: 1,
                cost: 2,
                requirements: { divineBlessing: 2 },
                effects: { unlockSpell: 'smite' }
            },
            divineProt: {
                id: 'divineProtection',
                name: 'Divine Protection',
                description: 'Reduces damage taken by 30% for 3 turns',
                icon: '🛡️✨',
                maxRank: 1,
                cost: 2,
                requirements: { holyShield: 3 },
                effects: { unlockAbility: 'divineProtection' }
            },
            resurrection: {
                id: 'resurrection',
                name: 'Resurrection',
                description: 'Auto-revive at half HP when defeated (once per adventure)',
                icon: '👼',
                maxRank: 1,
                cost: 3,
                requirements: { divineBlessing: 5 },
                effects: { resurrection: true }
            }
        }
    },
    Ranger: {
        name: 'Ranger Skills',
        icon: '🏹',
        skills: {
            sharpshooter: {
                id: 'sharpshooter',
                name: 'Sharpshooter',
                description: 'Increases ranged damage by 12%',
                icon: '🎯',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { rangedDamageBonus: 0.12 }
            },
            animalBond: {
                id: 'animalBond',
                name: 'Animal Bond',
                description: 'Increases max HP by 10',
                icon: '🐺',
                maxRank: 5,
                cost: 1,
                requirements: {},
                effects: { hpBonus: 10 }
            },
            multiShot: {
                id: 'multiShot',
                name: 'Multi-Shot',
                description: 'Fire 3 arrows (60% damage each)',
                icon: '🏹🏹🏹',
                maxRank: 1,
                cost: 2,
                requirements: { sharpshooter: 3 },
                effects: { unlockAbility: 'multiShot' }
            },
            trapMaster: {
                id: 'trapMaster',
                name: 'Trap Master',
                description: 'Set trap that stuns enemy',
                icon: '🪤',
                maxRank: 1,
                cost: 2,
                requirements: { sharpshooter: 2 },
                effects: { unlockAbility: 'trap' }
            },
            callPet: {
                id: 'callOfTheWild',
                name: 'Call of the Wild',
                description: 'Summon animal companion to fight alongside you',
                icon: '🐻',
                maxRank: 1,
                cost: 3,
                requirements: { animalBond: 5 },
                effects: { unlockAbility: 'summonPet' }
            }
        }
    }
};

class SkillTreeManager {
    constructor(character) {
        this.character = character;
        this.skills = {};
        this.availablePoints = 0;
    }

    gainTalentPoint() {
        this.availablePoints++;
        showNotification('You gained a talent point!', 'success');
    }

    canLearn(skillId) {
        const tree = SKILL_TREES[this.character.class];
        if (!tree) return { success: false, reason: 'Invalid class' };

        const skill = tree.skills[skillId];
        if (!skill) return { success: false, reason: 'Skill not found' };

        const currentRank = this.skills[skillId] || 0;
        
        if (currentRank >= skill.maxRank) {
            return { success: false, reason: 'Max rank reached' };
        }

        if (this.availablePoints < skill.cost) {
            return { success: false, reason: 'Not enough talent points' };
        }

        // Check requirements
        for (const [reqSkill, reqRank] of Object.entries(skill.requirements)) {
            const currentReqRank = this.skills[reqSkill] || 0;
            if (currentReqRank < reqRank) {
                return { success: false, reason: `Requires ${tree.skills[reqSkill].name} (Rank ${reqRank})` };
            }
        }

        return { success: true };
    }

    learnSkill(skillId) {
        const canLearnResult = this.canLearn(skillId);
        if (!canLearnResult.success) {
            showNotification(canLearnResult.reason, 'error');
            return false;
        }

        const tree = SKILL_TREES[this.character.class];
        const skill = tree.skills[skillId];

        this.skills[skillId] = (this.skills[skillId] || 0) + 1;
        this.availablePoints -= skill.cost;

        this.applySkillEffects(skill, this.skills[skillId]);
        this.updateSkillTreeUI();
        
        showNotification(`Learned ${skill.name} (Rank ${this.skills[skillId]})!`, 'success');
        
        if (effectsManager) {
            effectsManager.flash('rgba(255, 215, 0, 0.3)', 400);
        }

        return true;
    }

    applySkillEffects(skill, rank) {
        const effects = skill.effects;

        if (effects.attackBonus) {
            this.character.skillBonuses = this.character.skillBonuses || {};
            this.character.skillBonuses.attack = 
                (this.character.skillBonuses.attack || 1) + (effects.attackBonus * rank);
        }

        if (effects.defenseBonus) {
            this.character.skillBonuses = this.character.skillBonuses || {};
            this.character.skillBonuses.defense = 
                (this.character.skillBonuses.defense || 1) + (effects.defenseBonus * rank);
        }

        if (effects.manaBonus) {
            this.character.maxMana += effects.manaBonus * rank;
            this.character.mana = this.character.maxMana;
        }

        if (effects.hpBonus) {
            this.character.maxHealth += effects.hpBonus * rank;
            this.character.health = this.character.maxHealth;
        }

        if (effects.unlockSpell) {
            this.character.spells = this.character.spells || [];
            if (!this.character.spells.includes(effects.unlockSpell)) {
                this.character.spells.push(effects.unlockSpell);
            }
        }

        if (effects.unlockAbility) {
            this.character.abilities = this.character.abilities || [];
            if (!this.character.abilities.includes(effects.unlockAbility)) {
                this.character.abilities.push(effects.unlockAbility);
            }
        }

        updateCharacterDisplay();
    }

    resetSkills() {
        if (!confirm('Reset all skills? This will cost 100 gold.')) {
            return false;
        }

        if (this.character.gold < 100) {
            showNotification('Not enough gold!', 'error');
            return false;
        }

        this.character.gold -= 100;
        
        // Refund points
        const totalPoints = Object.values(this.skills).reduce((sum, rank) => sum + rank, 0);
        this.availablePoints += totalPoints;
        
        // Reset skills
        this.skills = {};
        
        // Reset bonuses (would need to recalculate from equipment, etc.)
        this.character.skillBonuses = {};
        
        this.updateSkillTreeUI();
        showNotification('Skills reset!', 'success');
        
        return true;
    }

    updateSkillTreeUI() {
        const container = document.getElementById('skillTreePanel');
        if (!container) return;

        const tree = SKILL_TREES[this.character.class];
        if (!tree) return;

        let html = `
            <div class="skill-tree-header">
                <h3>${tree.icon} ${tree.name}</h3>
                <div class="talent-points">
                    <span>Available Points: ${this.availablePoints}</span>
                    <button class="reset-btn" onclick="playSFX('confirm'); resetSkillTree()">Reset (100g)</button>
                </div>
            </div>
            <div class="skills-grid">
        `;

        for (const [skillId, skill] of Object.entries(tree.skills)) {
            const currentRank = this.skills[skillId] || 0;
            const canLearn = this.canLearn(skillId);
            const isMaxRank = currentRank >= skill.maxRank;

            html += `
                <div class="skill-card ${currentRank > 0 ? 'learned' : ''} ${!canLearn.success && !isMaxRank ? 'locked' : ''}">
                    <div class="skill-icon">${skill.icon}</div>
                    <div class="skill-info">
                        <div class="skill-name">${skill.name}</div>
                        <div class="skill-description">${skill.description}</div>
                        <div class="skill-rank">Rank: ${currentRank}/${skill.maxRank}</div>
                        ${currentRank < skill.maxRank ? `
                            <button class="learn-btn ${canLearn.success ? '' : 'disabled'}" 
                                    onclick="playSFX('confirm'); learnSkill('${skillId}')"
                                    ${!canLearn.success ? 'disabled' : ''}>
                                Learn (${skill.cost} ${skill.cost === 1 ? 'point' : 'points'})
                            </button>
                        ` : '<div class="max-rank">MAX</div>'}
                        ${!canLearn.success && currentRank < skill.maxRank ? 
                            `<div class="requirement-text">${canLearn.reason}</div>` : ''}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        container.innerHTML = html;
    }
}

// Global skill tree functions
function showSkillTree() {
    if (!gameState.currentCharacter) return;
    
    const modal = document.getElementById('skillTreeModal');
    if (modal) {
        modal.classList.add('active');
        if (gameState.currentCharacter.skillTree) {
            gameState.currentCharacter.skillTree.updateSkillTreeUI();
        }
    }
}

function closeSkillTree() {
    const modal = document.getElementById('skillTreeModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function learnSkill(skillId) {
    if (!gameState.currentCharacter || !gameState.currentCharacter.skillTree) return;
    gameState.currentCharacter.skillTree.learnSkill(skillId);
}

function resetSkillTree() {
    if (!gameState.currentCharacter || !gameState.currentCharacter.skillTree) return;
    gameState.currentCharacter.skillTree.resetSkills();
}

console.log('✅ skillTree.js loaded');
