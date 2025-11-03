/**
 * MULTI-VENTURE - Status Effects System
 * Poison, Burn, Stun, Freeze, and other combat effects
 */

const STATUS_TYPES = {
    POISON: {
        name: 'Poison',
        icon: '☠️',
        color: '#9d4edd',
        description: 'Takes damage over time'
    },
    BURN: {
        name: 'Burning',
        icon: '🔥',
        color: '#ff6600',
        description: 'Takes fire damage each turn'
    },
    FREEZE: {
        name: 'Frozen',
        icon: '❄️',
        color: '#00bfff',
        description: 'Cannot act for several turns'
    },
    STUN: {
        name: 'Stunned',
        icon: '💫',
        color: '#ffff00',
        description: 'Cannot act next turn'
    },
    BLEED: {
        name: 'Bleeding',
        icon: '🩸',
        color: '#8b0000',
        description: 'Loses HP each turn'
    },
    REGENERATION: {
        name: 'Regenerating',
        icon: '💚',
        color: '#00ff00',
        description: 'Restores HP each turn'
    },
    STRENGTH_UP: {
        name: 'Strengthened',
        icon: '💪',
        color: '#ffa500',
        description: 'Increased damage output'
    },
    DEFENSE_UP: {
        name: 'Fortified',
        icon: '🛡️',
        color: '#4169e1',
        description: 'Reduced damage taken'
    },
    WEAKNESS: {
        name: 'Weakened',
        icon: '⬇️',
        color: '#808080',
        description: 'Reduced damage output'
    },
    VULNERABLE: {
        name: 'Vulnerable',
        icon: '🎯',
        color: '#ff1493',
        description: 'Takes increased damage'
    }
};

class StatusEffect {
    constructor(type, duration, potency = 1, source = null) {
        this.type = type;
        this.name = STATUS_TYPES[type].name;
        this.icon = STATUS_TYPES[type].icon;
        this.color = STATUS_TYPES[type].color;
        this.description = STATUS_TYPES[type].description;
        this.duration = duration;
        this.potency = potency;
        this.source = source;
        this.turnsActive = 0;
    }

    tick(target) {
        this.turnsActive++;
        let message = '';
        let damage = 0;
        
        switch(this.type) {
            case 'POISON':
                damage = Math.floor(target.maxHealth * 0.05 * this.potency);
                target.health = Math.max(0, target.health - damage);
                message = `${target.name} takes ${damage} poison damage!`;
                if (effectsManager) {
                    effectsManager.statusParticles('enemyHpBar', 'poison');
                }
                break;
                
            case 'BURN':
                damage = Math.floor(10 * this.potency);
                target.health = Math.max(0, target.health - damage);
                message = `${target.name} takes ${damage} burn damage!`;
                if (effectsManager) {
                    effectsManager.statusParticles('enemyHpBar', 'burn');
                }
                break;
                
            case 'BLEED':
                damage = Math.floor(8 * this.potency);
                target.health = Math.max(0, target.health - damage);
                message = `${target.name} is bleeding for ${damage} damage!`;
                if (effectsManager) {
                    effectsManager.statusParticles('enemyHpBar', 'bleed');
                }
                break;
                
            case 'REGENERATION':
                const heal = Math.floor(target.maxHealth * 0.05 * this.potency);
                target.health = Math.min(target.maxHealth, target.health + heal);
                message = `${target.name} regenerates ${heal} HP!`;
                if (effectsManager) {
                    effectsManager.healEffect('playerHpBar');
                }
                break;
                
            case 'FREEZE':
                message = `${target.name} is frozen and cannot act!`;
                break;
                
            case 'STUN':
                message = `${target.name} is stunned and cannot act!`;
                break;
        }
        
        return { message, damage };
    }

    decrementDuration() {
        this.duration--;
        return this.duration <= 0;
    }

    getDisplayInfo() {
        return {
            icon: this.icon,
            name: this.name,
            duration: this.duration,
            color: this.color,
            description: this.description
        };
    }
}

class StatusEffectManager {
    constructor() {
        this.activeEffects = new Map(); // Map of entity -> array of effects
    }

    addEffect(entityId, statusEffect) {
        if (!this.activeEffects.has(entityId)) {
            this.activeEffects.set(entityId, []);
        }
        
        const effects = this.activeEffects.get(entityId);
        
        // Check if effect already exists
        const existing = effects.find(e => e.type === statusEffect.type);
        if (existing) {
            // Refresh duration and increase potency slightly
            existing.duration = Math.max(existing.duration, statusEffect.duration);
            existing.potency = Math.min(existing.potency + 0.2, 3);
        } else {
            effects.push(statusEffect);
        }
        
        this.updateStatusDisplay(entityId);
    }

    removeEffect(entityId, effectType) {
        if (!this.activeEffects.has(entityId)) return;
        
        const effects = this.activeEffects.get(entityId);
        const index = effects.findIndex(e => e.type === effectType);
        if (index !== -1) {
            effects.splice(index, 1);
        }
        
        this.updateStatusDisplay(entityId);
    }

    getEffects(entityId) {
        return this.activeEffects.get(entityId) || [];
    }

    hasEffect(entityId, effectType) {
        const effects = this.getEffects(entityId);
        return effects.some(e => e.type === effectType);
    }

    canAct(entityId) {
        const effects = this.getEffects(entityId);
        return !effects.some(e => e.type === 'FREEZE' || e.type === 'STUN');
    }

    processTurn(entityId, entity) {
        const effects = this.getEffects(entityId);
        const messages = [];
        let totalDamage = 0;
        
        for (const effect of effects) {
            const result = effect.tick(entity);
            if (result.message) {
                messages.push(result.message);
                totalDamage += result.damage || 0;
            }
        }
        
        // Remove expired effects
        const expiredEffects = [];
        for (let i = effects.length - 1; i >= 0; i--) {
            if (effects[i].decrementDuration()) {
                const removed = effects.splice(i, 1)[0];
                expiredEffects.push(removed);
                messages.push(`${entity.name}'s ${removed.name} has worn off.`);
            }
        }
        
        this.updateStatusDisplay(entityId);
        
        return { messages, totalDamage };
    }

    getDamageModifier(entityId) {
        const effects = this.getEffects(entityId);
        let modifier = 1.0;
        
        for (const effect of effects) {
            switch(effect.type) {
                case 'STRENGTH_UP':
                    modifier *= (1 + 0.3 * effect.potency);
                    break;
                case 'WEAKNESS':
                    modifier *= (1 - 0.3 * effect.potency);
                    break;
            }
        }
        
        return modifier;
    }

    getDefenseModifier(entityId) {
        const effects = this.getEffects(entityId);
        let modifier = 1.0;
        
        for (const effect of effects) {
            switch(effect.type) {
                case 'DEFENSE_UP':
                    modifier *= (1 - 0.25 * effect.potency);
                    break;
                case 'VULNERABLE':
                    modifier *= (1 + 0.25 * effect.potency);
                    break;
            }
        }
        
        return modifier;
    }

    updateStatusDisplay(entityId) {
        const container = document.getElementById(`${entityId}StatusEffects`);
        if (!container) return;
        
        const effects = this.getEffects(entityId);
        
        if (effects.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        let html = '';
        
        effects.forEach(effect => {
            const info = effect.getDisplayInfo();
            html += `
                <div class="status-icon" 
                     style="color: ${info.color};"
                     title="${info.name} (${info.duration} turns): ${info.description}">
                    ${info.icon}
                    <span class="status-duration">${info.duration}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    clearAll(entityId) {
        this.activeEffects.delete(entityId);
        this.updateStatusDisplay(entityId);
    }

    clearAllEntities() {
        this.activeEffects.clear();
    }
}

// Global status effect manager
let statusEffectManager = null;

function initStatusEffects() {
    statusEffectManager = new StatusEffectManager();
}

// Convenience functions
function applyPoison(entityId, duration = 3, potency = 1) {
    const effect = new StatusEffect('POISON', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

function applyBurn(entityId, duration = 3, potency = 1) {
    const effect = new StatusEffect('BURN', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

function applyFreeze(entityId, duration = 2) {
    const effect = new StatusEffect('FREEZE', duration, 1);
    statusEffectManager.addEffect(entityId, effect);
}

function applyStun(entityId, duration = 1) {
    const effect = new StatusEffect('STUN', duration, 1);
    statusEffectManager.addEffect(entityId, effect);
}

function applyBleed(entityId, duration = 4, potency = 1) {
    const effect = new StatusEffect('BLEED', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

function applyRegeneration(entityId, duration = 3, potency = 1) {
    const effect = new StatusEffect('REGENERATION', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

function applyStrengthBuff(entityId, duration = 3, potency = 1) {
    const effect = new StatusEffect('STRENGTH_UP', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

function applyDefenseBuff(entityId, duration = 3, potency = 1) {
    const effect = new StatusEffect('DEFENSE_UP', duration, potency);
    statusEffectManager.addEffect(entityId, effect);
}

console.log('✅ statusEffects.js loaded');
