// Adventurer class
class Adventurer {
    constructor(type, isLegendary = false, legendaryData = null) {
        if (isLegendary && legendaryData) {
            this.name = legendaryData.name;
            this.type = 'legendary';
            this.icon = legendaryData.icon;
            this.maxHp = legendaryData.hp;
            this.currentHp = legendaryData.hp;
            this.damage = legendaryData.damage;
            this.goldValue = legendaryData.goldValue;
            this.isLegendary = true;
            this.color = '#d946ef';
            this.greed = 0.3; // Legendary heroes are cautious
        } else {
            const typeData = ADVENTURER_TYPES[type];
            this.type = type;
            this.name = this.generateName(type);
            this.icon = typeData.icon;
            this.maxHp = typeData.hp;
            this.currentHp = typeData.hp;
            this.damage = typeData.damage;
            this.goldValue = typeData.goldValue;
            this.healAmount = typeData.healAmount || 0;
            this.color = typeData.color;
            this.isLegendary = false;
            this.ability = typeData.ability;
            this.abilityChance = typeData.abilityChance;
            this.abilityDesc = typeData.abilityDesc;
            
            // Random personality - greed makes them take risky paths
            this.greed = Math.random(); // 0 = cautious, 1 = very greedy
            this.courage = Math.random(); // 0 = cowardly, 1 = brave
        }

        this.x = 0;
        this.y = Math.floor(CONFIG.GRID_HEIGHT / 2);
        this.alive = true;
        this.backstory = BACKSTORIES[Math.floor(Math.random() * BACKSTORIES.length)];
        this.poisoned = false;
        this.poisonDamage = 0;
        this.poisonTurnsLeft = 0;
        this.targetBait = null; // Which treasure they're going for
        this.comboCount = 0; // Track consecutive trap hits
    }

    generateName(type) {
        const namePool = HERO_NAMES[type] || ['Hero'];
        return namePool[Math.floor(Math.random() * namePool.length)];
    }

    takeDamage(amount, source = 'unknown') {
        this.currentHp -= amount;
        if (this.currentHp <= 0) {
            this.currentHp = 0;
            this.alive = false;
            return { died: true, source };
        }
        return { died: false, source };
    }

    applyPoison(damage, duration) {
        this.poisoned = true;
        this.poisonDamage = damage;
        this.poisonTurnsLeft = duration;
    }

    processPoisonTick() {
        if (this.poisoned && this.poisonTurnsLeft > 0) {
            this.takeDamage(this.poisonDamage, 'poison');
            this.poisonTurnsLeft--;
            if (this.poisonTurnsLeft <= 0) {
                this.poisoned = false;
            }
            return this.poisonDamage;
        }
        return 0;
    }

    heal(amount) {
        this.currentHp = Math.min(this.currentHp + amount, this.maxHp);
    }

    attack(target) {
        if (target && target.alive) {
            let damageDealt = this.damage;
            
            // Paladin ability: Smite (bonus vs undead)
            if (this.ability === 'smite' && (target.type === 'skeleton' || target.type === 'ghost') && Math.random() < this.abilityChance) {
                damageDealt *= 1.5;
            }
            
            target.currentHp -= damageDealt;
            if (target.currentHp <= 0) {
                target.currentHp = 0;
                target.alive = false;
                
                // Cleric ability: Heal on kill
                if (this.ability === 'heal' && Math.random() < this.abilityChance) {
                    this.heal(this.healAmount);
                    return { killed: true, damage: damageDealt, healed: this.healAmount };
                }
                
                return { killed: true, damage: damageDealt };
            }
            return { killed: false, damage: damageDealt };
        }
        return { killed: false, damage: 0 };
    }

    canDisarmTrap() {
        return this.ability === 'disarm' && Math.random() < this.abilityChance;
    }

    canResistTrap() {
        return this.ability === 'tank' && Math.random() < this.abilityChance;
    }

    getDisplayName() {
        if (this.isLegendary) {
            return `${this.name} the LEGENDARY`;
        }
        const className = this.type.charAt(0).toUpperCase() + this.type.slice(1);
        return `${this.name} the ${className}`;
    }

    getPersonality() {
        if (this.greed > 0.7) return 'Greedy';
        if (this.greed < 0.3) return 'Cautious';
        if (this.courage > 0.7) return 'Brave';
        if (this.courage < 0.3) return 'Cowardly';
        return 'Balanced';
    }
}
