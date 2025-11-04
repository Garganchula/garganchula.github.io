// Main game logic
class Game {
    constructor() {
        this.dungeon = new Dungeon();
        this.gold = 100; // Starting gold
        this.kills = 0;
        this.reputation = 0;
        this.activeAdventurers = [];
        this.selectedItem = null;
        this.selectedType = null; // 'trap', 'monster', 'bait', 'room'
        this.gameSpeed = 1;
        this.paused = false;
        this.tickCounter = 0;
        this.spawnCounter = 0;
        this.eventLog = [];
        this.legendarySpawned = {};
        this.upgrades = {
            trapDamageBonus: 0,
            goldBonus: 0,
            monsterHealthBonus: 0,
            monsterDamageBonus: 0,
            comboBonus: 0,
            baitBonus: 0
        };
        this.comboActive = false;
        this.comboTimer = 0;
        
        // Day/Night cycle
        this.isNight = false;
        this.cycleTimer = 0;
        this.cycleDuration = CONFIG.DAY_DURATION;
        this.dayCount = 1;
        
        // Random events
        this.activeEvent = null;
        this.eventTimer = 0;
        this.eventCheckTimer = 0;
        this.freePlacementsLeft = 0;
    }

    init() {
        this.renderDungeon();
        this.renderShop();
        this.updateUI();
        this.startGameLoop();
        this.loadGame();
    }

    startGameLoop() {
        setInterval(() => {
            if (!this.paused) {
                this.gameTick();
            }
        }, CONFIG.GAME_TICK / this.gameSpeed);
    }

    gameTick() {
        this.tickCounter++;
        this.spawnCounter += CONFIG.GAME_TICK / this.gameSpeed;
        this.cycleTimer += CONFIG.GAME_TICK / this.gameSpeed;
        this.eventCheckTimer += CONFIG.GAME_TICK / this.gameSpeed;

        // Random event checking
        if (this.eventCheckTimer >= CONFIG.EVENT_CHECK_INTERVAL) {
            this.eventCheckTimer = 0;
            this.tryTriggerRandomEvent();
        }

        // Active event timer
        if (this.activeEvent && this.activeEvent.duration > 0) {
            this.eventTimer -= CONFIG.GAME_TICK / this.gameSpeed;
            if (this.eventTimer <= 0) {
                this.endEvent();
            }
        }

        // Day/Night cycle transition
        if (this.cycleTimer >= this.cycleDuration) {
            this.cycleTimer = 0;
            this.isNight = !this.isNight;
            this.cycleDuration = this.isNight ? CONFIG.NIGHT_DURATION : CONFIG.DAY_DURATION;
            
            if (this.isNight) {
                this.addLog('🌙 Night falls... Elite heroes emerge! (1.5x Gold, Undead bonus)', 'danger');
                document.body.classList.add('night-mode');
                document.querySelector('.time-card').classList.add('night');
            } else {
                this.dayCount++; // New day when night ends
                this.addLog(`☀️ Day ${this.dayCount} breaks! Normal heroes return.`, 'info');
                document.body.classList.remove('night-mode');
                document.querySelector('.time-card').classList.remove('night');
            }
        }

        // Decrement combo timer
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                // Reset all adventurer combos
                this.activeAdventurers.forEach(adv => adv.comboCount = 0);
                this.comboActive = false;
            }
        }

        // Spawn adventurers
        if (this.spawnCounter >= CONFIG.BASE_SPAWN_RATE) {
            this.spawnCounter = 0;
            this.spawnAdventurer();
        }

        // Move and process adventurers
        this.processAdventurers();

        // Update UI
        this.updateUI();
    }

    spawnAdventurer() {
        // Check for legendary hero spawns
        for (const [key, legendary] of Object.entries(LEGENDARY_HEROES)) {
            if (!this.legendarySpawned[key] && this.kills >= legendary.requiredKills) {
                const legendaryHero = new Adventurer(null, true, legendary);
                this.activeAdventurers.push(legendaryHero);
                this.legendarySpawned[key] = true;
                this.addLog(legendary.message, 'legendary');
                return;
            }
        }

        // Spawn regular adventurer
        const types = Object.keys(ADVENTURER_TYPES);
        let randomType;
        
        // At night, favor paladins and clerics (undead hunters)
        if (this.isNight && Math.random() < 0.6) {
            randomType = Math.random() < 0.5 ? 'paladin' : 'cleric';
        } else {
            randomType = types[Math.floor(Math.random() * types.length)];
        }
        
        const adventurer = new Adventurer(randomType);
        
        // Apply event modifiers
        if (this.activeEvent) {
            if (this.activeEvent.effect === 'maxGreed') {
                adventurer.greed = 1.0; // Max greed during treasure map
            } else if (this.activeEvent.effect === 'heroHPBonus') {
                adventurer.maxHp *= (1 + this.activeEvent.value);
                adventurer.currentHp = adventurer.maxHp;
            } else if (this.activeEvent.effect === 'heroGoldBonus') {
                adventurer.goldValue *= (1 + this.activeEvent.value);
            }
        }
        
        this.activeAdventurers.push(adventurer);
        this.addLog(`${adventurer.getDisplayName()} enters the dungeon...`, 'info');
    }

    tryTriggerRandomEvent() {
        // Don't trigger if an event is already active
        if (this.activeEvent) return;
        
        // Random chance to trigger any event
        const eventList = Object.values(RANDOM_EVENTS);
        for (const event of eventList) {
            if (Math.random() < event.chance) {
                this.startEvent(event);
                return;
            }
        }
    }

    startEvent(event) {
        this.activeEvent = event;
        this.eventTimer = event.duration;
        
        // Apply instant effects
        if (event.effect === 'heroParty') {
            // Spawn 3 heroes immediately
            for (let i = 0; i < event.value; i++) {
                const types = Object.keys(ADVENTURER_TYPES);
                const randomType = types[Math.floor(Math.random() * types.length)];
                const hero = new Adventurer(randomType);
                hero.goldValue *= 2; // Double gold for bounty heroes
                this.activeAdventurers.push(hero);
            }
        } else if (event.effect === 'freePlacements') {
            this.freePlacementsLeft = event.value;
        }
        
        // Show event notification
        this.addLog(event.message, event.type === 'good' ? 'gold' : event.type === 'challenge' ? 'danger' : 'info');
        this.showEventPopup(event);
    }

    endEvent() {
        if (!this.activeEvent) return;
        
        const endMessage = `${this.activeEvent.icon} ${this.activeEvent.name} has ended.`;
        this.addLog(endMessage, 'info');
        
        this.activeEvent = null;
        this.eventTimer = 0;
    }

    showEventPopup(event) {
        // Create floating event popup
        const popup = document.createElement('div');
        popup.className = `event-popup event-${event.type}`;
        popup.innerHTML = `
            <div class="event-popup-icon">${event.icon}</div>
            <div class="event-popup-title">${event.name}</div>
            <div class="event-popup-desc">${event.message}</div>
        `;
        
        document.body.appendChild(popup);
        
        // Animate in
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    }

    processAdventurers() {
        for (let i = this.activeAdventurers.length - 1; i >= 0; i--) {
            const adventurer = this.activeAdventurers[i];

            if (!adventurer.alive) {
                this.activeAdventurers.splice(i, 1);
                continue;
            }

            // Process poison
            const poisonDamage = adventurer.processPoisonTick();
            if (poisonDamage > 0) {
                this.spawnParticle(adventurer.x, adventurer.y, '☠️', 'poison');
                this.spawnDamageNumber(adventurer.x, adventurer.y, poisonDamage, '#50c878');
            }

            // Get current cell
            const currentCell = this.dungeon.getCell(adventurer.x, adventurer.y);

            // Check if reached exit
            if (adventurer.x === this.dungeon.exit.x && adventurer.y === this.dungeon.exit.y) {
                this.adventurerEscaped(adventurer);
                this.activeAdventurers.splice(i, 1);
                continue;
            }

            // Trigger trap if present
            if (currentCell.trap && currentCell.trap.active && !currentCell.trap.triggered) {
                this.triggerTrap(currentCell.trap, adventurer, currentCell);
                if (!adventurer.alive) {
                    this.adventurerDied(adventurer, currentCell.trap.name);
                    this.activeAdventurers.splice(i, 1);
                    continue;
                }
            }

            // Fight monster if present
            if (currentCell.monster && currentCell.monster.alive) {
                this.combat(adventurer, currentCell.monster, currentCell);
                if (!adventurer.alive) {
                    this.adventurerDied(adventurer, currentCell.monster.name);
                    this.activeAdventurers.splice(i, 1);
                    continue;
                }
            }

            // Move toward exit using A* pathfinding (or toward bait if greedy!)
            if (this.tickCounter % 5 === 0) { // Move every 5 ticks
                let targetX = this.dungeon.exit.x;
                let targetY = this.dungeon.exit.y;

                // Greedy heroes go for bait!
                if (!adventurer.targetBait && adventurer.greed > 0.4) {
                    const nearestBait = this.dungeon.findNearestBait(adventurer.x, adventurer.y);
                    if (nearestBait) {
                        const baitDistance = Math.abs(nearestBait.x - adventurer.x) + Math.abs(nearestBait.y - adventurer.y);
                        const exitDistance = Math.abs(targetX - adventurer.x) + Math.abs(targetY - adventurer.y);
                        
                        // If bait is closer and hero is greedy enough, go for it!
                        const greedThreshold = nearestBait.bait.lureStrength * adventurer.greed;
                        if (baitDistance < exitDistance || Math.random() < greedThreshold / 10) {
                            adventurer.targetBait = nearestBait;
                            targetX = nearestBait.x;
                            targetY = nearestBait.y;
                        }
                    }
                } else if (adventurer.targetBait) {
                    // Continue going to bait
                    targetX = adventurer.targetBait.x;
                    targetY = adventurer.targetBait.y;
                    
                    // Check if reached bait
                    if (adventurer.x === targetX && adventurer.y === targetY) {
                        this.collectBait(adventurer, adventurer.targetBait);
                        adventurer.targetBait = null;
                    }
                }

                const nextCell = this.dungeon.getNextStep(adventurer.x, adventurer.y, targetX, targetY, adventurer.greed);
                if (nextCell) {
                    adventurer.x = nextCell.x;
                    adventurer.y = nextCell.y;
                }
            }
        }
    }

    collectBait(adventurer, baitCell) {
        if (!baitCell.bait) return;
        
        this.addLog(`${adventurer.getDisplayName()} (${adventurer.getPersonality()}) found ${baitCell.bait.name}!`, 'gold');
        this.spawnParticle(baitCell.x, baitCell.y, '✨', 'gold');
        this.spawnParticle(baitCell.x, baitCell.y, '💰', 'gold');
        
        // Remove bait
        baitCell.bait = null;
        this.renderDungeon();
    }

    triggerTrap(trap, adventurer, cell) {
        // Rogue ability: Disarm trap!
        if (adventurer.canDisarmTrap()) {
            this.addLog(`${adventurer.getDisplayName()} disarmed the ${trap.name}!`, 'info');
            this.spawnParticle(cell.x, cell.y, '🔧', 'hit');
            cell.trap = null; // Trap destroyed
            this.renderDungeon();
            return;
        }

        trap.triggered = true;
        setTimeout(() => { trap.triggered = false; }, 1000); // Reset trap

        // Visual feedback
        this.flashCell(cell.x, cell.y, 'trap-activated');
        
        // Calculate damage with upgrades and room bonuses
        let damage = trap.damage;
        damage *= (1 + this.upgrades.trapDamageBonus);
        
        // Event modifier: Trap Malfunction
        if (this.activeEvent && this.activeEvent.effect === 'trapDebuff') {
            damage *= (1 - this.activeEvent.value);
        }
        
        // Room bonus
        if (cell.room) {
            if (cell.room.effect === 'trapBonus') {
                damage *= (1 + cell.room.bonus);
            } else if (cell.room.effect === 'doubleTrap') {
                damage *= 2;
                this.spawnParticle(cell.x, cell.y, '💥💥', 'hit');
            }
        }

        // Warrior ability: Resist trap damage
        if (adventurer.canResistTrap()) {
            damage *= 0.5;
            this.addLog(`${adventurer.getDisplayName()} resisted the ${trap.name}!`, 'info');
            this.spawnParticle(cell.x, cell.y, '🛡️', 'hit');
        }

        // Combo system
        if (this.comboTimer > 0) {
            adventurer.comboCount++;
            if (adventurer.comboCount >= 2) {
                const comboMultiplier = 1 + (adventurer.comboCount * 0.25);
                damage *= comboMultiplier;
                this.spawnParticle(cell.x, cell.y, `${adventurer.comboCount}x COMBO!`, 'gold');
            }
        } else {
            adventurer.comboCount = 1;
        }
        this.comboTimer = 10; // Reset combo timer
        
        // Particle effects based on trap type
        if (trap.id === 'spike') {
            this.spawnParticle(cell.x, cell.y, '🗡️', 'hit');
        } else if (trap.id === 'arrow') {
            this.spawnParticle(cell.x, cell.y, '🏹', 'hit');
        } else if (trap.id === 'fire') {
            this.spawnParticle(cell.x, cell.y, '🔥', 'fire');
            this.spawnParticle(cell.x, cell.y, '💥', 'fire');
        } else if (trap.id === 'poison') {
            this.spawnParticle(cell.x, cell.y, '☠️', 'poison');
            this.spawnParticle(cell.x, cell.y, '💚', 'poison');
        } else if (trap.id === 'lightning') {
            this.spawnParticle(cell.x, cell.y, '⚡', 'lightning');
            this.spawnParticle(cell.x, cell.y, '✨', 'lightning');
        } else if (trap.id === 'crusher') {
            this.spawnParticle(cell.x, cell.y, '🔨', 'hit');
            this.spawnParticle(cell.x, cell.y, '💢', 'hit');
        }

        const result = adventurer.takeDamage(Math.floor(damage), trap.name);
        this.spawnDamageNumber(cell.x, cell.y, Math.floor(damage), '#ff6600');

        if (trap.dotDamage && trap.dotDuration) {
            adventurer.applyPoison(trap.dotDamage, trap.dotDuration);
        }
    }

    combat(adventurer, monster, cell) {
        // Flash combat
        this.flashCell(cell.x, cell.y, 'combat-flash');

        // Apply room bonuses to monster
        let monsterDamage = monster.damage * (1 + this.upgrades.monsterDamageBonus);
        if (cell.room && cell.room.effect === 'monsterBonus') {
            monsterDamage *= (1 + cell.room.bonus);
        }
        
        // Night bonus for undead monsters
        if (this.isNight && (monster.type === 'skeleton' || monster.type === 'ghost')) {
            monsterDamage *= 1.25;
        }

        // Adventurer attacks monster
        const attackResult = adventurer.attack(monster);
        this.spawnParticle(cell.x, cell.y, '⚔️', 'hit');
        this.spawnDamageNumber(cell.x, cell.y, attackResult.damage, '#ffffff');

        // Cleric healed?
        if (attackResult.healed) {
            this.spawnParticle(cell.x, cell.y, '+' + attackResult.healed, 'gold');
            this.spawnParticle(cell.x, cell.y, '✨', 'gold');
            this.addLog(`${adventurer.getDisplayName()} healed ${attackResult.healed} HP!`, 'info');
        }

        if (attackResult.killed) {
            this.addLog(`${adventurer.getDisplayName()} killed a ${monster.name}!`, 'info');
            this.spawnParticle(cell.x, cell.y, '💀', 'blood');
            this.spawnParticle(cell.x, cell.y, '💥', 'blood');
            cell.monster = null;
            this.renderDungeon();
        } else {
            // Monster counter-attacks
            adventurer.takeDamage(Math.floor(monsterDamage), monster.name);
            this.spawnParticle(cell.x, cell.y, '🩸', 'blood');
            this.spawnDamageNumber(cell.x, cell.y, Math.floor(monsterDamage), '#ff0000');
            this.renderDungeon(); // Update monster HP bar
        }
    }

    adventurerDied(adventurer, killedBy) {
        this.kills++;
        
        // Calculate gold with bonuses
        let goldEarned = adventurer.goldValue * (1 + this.upgrades.goldBonus);
        
        // Night bonus (1.5x gold)
        if (this.isNight) {
            goldEarned *= 1.5;
        }
        
        // Event: Blood Moon (2x gold)
        if (this.activeEvent && this.activeEvent.effect === 'goldMultiplier') {
            goldEarned *= this.activeEvent.value;
        }
        
        // Combo bonus
        if (adventurer.comboCount >= 2) {
            goldEarned *= (1 + (adventurer.comboCount * 0.1) + this.upgrades.comboBonus);
        }
        
        goldEarned = Math.floor(goldEarned);
        this.gold += goldEarned;
        this.reputation += adventurer.isLegendary ? 20 : 2;

        // Death visuals
        this.spawnParticle(adventurer.x, adventurer.y, '💀', 'blood');
        this.spawnParticle(adventurer.x, adventurer.y, '🩸', 'blood');
        this.spawnParticle(adventurer.x, adventurer.y, '💥', 'blood');
        this.spawnParticle(adventurer.x, adventurer.y, `+${goldEarned}💰`, 'gold');
        
        // Show night bonus if applicable
        if (this.isNight) {
            this.spawnParticle(adventurer.x, adventurer.y, '🌙', 'gold');
        }

        // Generate death message
        const template = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
        const message = template
            .replace('{name}', adventurer.name)
            .replace('{class}', adventurer.isLegendary ? 'LEGENDARY' : ADVENTURER_TYPES[adventurer.type]?.name || 'Adventurer')
            .replace('{killer}', killedBy);

        this.addLog(`💀 ${message}`, 'death');
        this.addLog(`   └─ ${adventurer.backstory}`, 'death');
        
        let goldMsg = `   └─ +${goldEarned} gold earned`;
        if (adventurer.comboCount >= 2) {
            goldMsg += ` (${adventurer.comboCount}x COMBO!)`;
        }
        this.addLog(goldMsg, 'gold');

        this.checkUnlocks();
        this.saveGame();
    }

    adventurerEscaped(adventurer) {
        this.addLog(`${adventurer.getDisplayName()} escaped! Your dungeon is too weak!`, 'info');
        this.reputation = Math.max(0, this.reputation - 5);
    }

    checkUnlocks() {
        let unlocked = false;

        // Check trap unlocks
        for (const trap of Object.values(TRAPS)) {
            if (!trap.unlocked && trap.unlockRequirement) {
                const req = trap.unlockRequirement;
                if ((req.kills === undefined || this.kills >= req.kills) &&
                    (req.reputation === undefined || this.reputation >= req.reputation)) {
                    trap.unlocked = true;
                    unlocked = true;
                    this.addLog(`🔓 Unlocked: ${trap.name}!`, 'info');
                }
            }
        }

        // Check monster unlocks
        for (const monster of Object.values(MONSTERS)) {
            if (!monster.unlocked && monster.unlockRequirement) {
                const req = monster.unlockRequirement;
                if ((req.kills === undefined || this.kills >= req.kills) &&
                    (req.reputation === undefined || this.reputation >= req.reputation)) {
                    monster.unlocked = true;
                    unlocked = true;
                    this.addLog(`🔓 Unlocked: ${monster.name}!`, 'info');
                }
            }
        }

        // Check bait unlocks
        for (const bait of Object.values(BAIT_ITEMS)) {
            if (!bait.unlocked && bait.unlockRequirement) {
                const req = bait.unlockRequirement;
                if ((req.kills === undefined || this.kills >= req.kills) &&
                    (req.reputation === undefined || this.reputation >= req.reputation)) {
                    bait.unlocked = true;
                    unlocked = true;
                    this.addLog(`🔓 Unlocked: ${bait.name}!`, 'info');
                }
            }
        }

        if (unlocked) {
            this.renderShop();
        }
    }

    selectItem(itemId, type) {
        this.selectedItem = itemId;
        this.selectedType = type;
        this.renderShop(); // Re-render to show selection
        this.updateSelectedItemDisplay();
    }

    placeSelectedItem(x, y) {
        if (!this.selectedItem || !this.selectedType) return;

        let cost = 0;
        let placed = false;
        let isFree = false;

        // Check for free placement event
        if (this.freePlacementsLeft > 0) {
            isFree = true;
        }

        if (this.selectedType === 'trap') {
            const trap = TRAPS[this.selectedItem];
            if (!trap || !trap.unlocked) return;
            cost = this.getAdjustedCost(trap.cost, 'trap');
            if (isFree || this.gold >= cost) {
                placed = this.dungeon.placeTrap(x, y, this.selectedItem);
            }
        } else if (this.selectedType === 'monster') {
            const monster = MONSTERS[this.selectedItem];
            if (!monster || !monster.unlocked) return;
            cost = this.getAdjustedCost(monster.cost, 'monster');
            if (isFree || this.gold >= cost) {
                placed = this.dungeon.placeMonster(x, y, this.selectedItem);
            }
        } else if (this.selectedType === 'bait') {
            const bait = BAIT_ITEMS[this.selectedItem];
            if (!bait || !bait.unlocked) return;
            cost = this.getAdjustedCost(bait.cost, 'bait');
            if (isFree || this.gold >= cost) {
                placed = this.dungeon.placeBait(x, y, this.selectedItem);
            }
        } else if (this.selectedType === 'room') {
            const room = ROOM_TYPES[this.selectedItem];
            if (!room || !room.unlocked) return;
            cost = this.getAdjustedCost(room.cost, 'room');
            if (isFree || this.gold >= cost) {
                placed = this.dungeon.placeRoom(x, y, this.selectedItem);
            }
        }

        if (placed) {
            if (isFree) {
                this.freePlacementsLeft--;
                this.addLog(`⭐ FREE placement (${this.freePlacementsLeft} left): ${this.selectedItem}!`, 'gold');
            } else {
                this.gold -= cost;
                this.addLog(`Placed ${this.selectedType}: ${this.selectedItem}`, 'info');
            }
            this.renderDungeon();
            this.updateUI();
            this.saveGame();
        }
    }

    getAdjustedCost(baseCost, type) {
        let cost = baseCost;
        
        // Apply event discounts
        if (this.activeEvent) {
            if (this.activeEvent.effect === 'shopDiscount') {
                cost *= (1 - this.activeEvent.value);
            } else if (this.activeEvent.effect === 'monsterDiscount' && type === 'monster') {
                cost *= (1 - this.activeEvent.value);
            }
        }
        
        return Math.floor(cost);
    }

    removeItem(x, y) {
        const cell = this.dungeon.getCell(x, y);
        if (!cell) return;

        // Refund 50% of cost
        if (cell.trap) {
            const refund = Math.floor(TRAPS[cell.trap.type].cost * 0.5);
            this.gold += refund;
            this.addLog(`Removed ${cell.trap.name}, refunded ${refund} gold`, 'info');
        } else if (cell.monster) {
            const refund = Math.floor(MONSTERS[cell.monster.type].cost * 0.5);
            this.gold += refund;
            this.addLog(`Removed ${cell.monster.name}, refunded ${refund} gold`, 'info');
        } else if (cell.bait) {
            const refund = Math.floor(BAIT_ITEMS[cell.bait.type].cost * 0.5);
            this.gold += refund;
            this.addLog(`Removed ${cell.bait.name}, refunded ${refund} gold`, 'info');
        } else if (cell.room) {
            const refund = Math.floor(ROOM_TYPES[cell.room.type].cost * 0.5);
            this.gold += refund;
            this.addLog(`Removed ${cell.room.name}, refunded ${refund} gold`, 'info');
        }

        this.dungeon.removeContent(x, y);
        this.renderDungeon();
        this.updateUI();
        this.saveGame();
    }

    clearDungeon() {
        if (confirm('Clear entire dungeon? You will get 50% refund on all items.')) {
            // Calculate refund
            let refund = 0;
            for (let y = 0; y < this.dungeon.height; y++) {
                for (let x = 0; x < this.dungeon.width; x++) {
                    const cell = this.dungeon.getCell(x, y);
                    if (cell.trap) {
                        refund += Math.floor(TRAPS[cell.trap.type].cost * 0.5);
                    }
                    if (cell.monster) {
                        refund += Math.floor(MONSTERS[cell.monster.type].cost * 0.5);
                    }
                }
            }

            this.dungeon.clearAllContent();
            this.gold += refund;
            this.addLog(`Dungeon cleared! Refunded ${refund} gold`, 'gold');
            this.renderDungeon();
            this.updateUI();
            this.saveGame();
        }
    }

    toggleSpeed() {
        const speeds = [1, 2, 4];
        const currentIndex = speeds.indexOf(this.gameSpeed);
        this.gameSpeed = speeds[(currentIndex + 1) % speeds.length];
        document.getElementById('speed-btn').textContent = `⏩ Speed: ${this.gameSpeed}x`;
    }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-btn').textContent = this.paused ? '▶️ Resume' : '⏸️ Pause';
    }

    addLog(message, type = 'info') {
        // Add to notification system
        this.eventLog.unshift({ message, type, timestamp: Date.now() });
        if (this.eventLog.length > 100) {
            this.eventLog.pop();
        }
        
        // Update notification UI
        this.updateNotifications();
    }

    updateNotifications() {
        const messagesContainer = document.getElementById('notification-messages');
        const countElement = document.getElementById('notification-count');
        
        // Update count
        countElement.textContent = this.eventLog.length;
        
        // Render recent messages (last 50)
        messagesContainer.innerHTML = '';
        this.eventLog.slice(0, 50).forEach(log => {
            const item = document.createElement('div');
            item.className = `notification-item ${log.type}`;
            item.textContent = log.message;
            messagesContainer.appendChild(item);
        });
    }

    spawnParticle(x, y, emoji, type) {
        const gridRect = document.getElementById('dungeon-grid').getBoundingClientRect();
        const cellWidth = gridRect.width / CONFIG.GRID_WIDTH;
        const cellHeight = gridRect.height / CONFIG.GRID_HEIGHT;

        const particle = document.createElement('div');
        particle.className = `particle ${type}`;
        particle.textContent = emoji;
        
        // Random offset for variety
        const randomX = (Math.random() - 0.5) * 40;
        const randomY = (Math.random() - 0.5) * 40;
        particle.style.setProperty('--tx', `${randomX}px`);
        particle.style.setProperty('--ty', `${randomY}px`);
        
        // Calculate position based on grid coordinates
        const left = (x * cellWidth) + (cellWidth / 2);
        const top = (y * cellHeight) + (cellHeight / 2);
        
        particle.style.left = `${left}px`;
        particle.style.top = `${top}px`;
        
        document.getElementById('dungeon-grid').appendChild(particle);
        
        setTimeout(() => particle.remove(), 1500);
    }

    spawnDamageNumber(x, y, damage, color) {
        const gridRect = document.getElementById('dungeon-grid').getBoundingClientRect();
        const cellWidth = gridRect.width / CONFIG.GRID_WIDTH;
        const cellHeight = gridRect.height / CONFIG.GRID_HEIGHT;

        const dmgNum = document.createElement('div');
        dmgNum.className = 'particle hit';
        dmgNum.textContent = `-${damage}`;
        dmgNum.style.color = color;
        dmgNum.style.fontWeight = 'bold';
        dmgNum.style.fontSize = '1.2em';
        
        // Calculate position based on grid coordinates (above center)
        const left = (x * cellWidth) + (cellWidth / 2);
        const top = (y * cellHeight) + (cellHeight / 2) - 10; // Slightly above center
        
        dmgNum.style.left = `${left}px`;
        dmgNum.style.top = `${top}px`;
        
        document.getElementById('dungeon-grid').appendChild(dmgNum);
        
        setTimeout(() => dmgNum.remove(), 1000);
    }

    flashCell(x, y, className) {
        const cell = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (!cell) return;

        cell.classList.add(className);
        setTimeout(() => cell.classList.remove(className), 500);
    }

    saveGame() {
        const saveData = {
            gold: this.gold,
            kills: this.kills,
            reputation: this.reputation,
            dungeon: this.dungeon.toSaveData(),
            traps: Object.values(TRAPS).map(t => ({ id: t.id, unlocked: t.unlocked })),
            monsters: Object.values(MONSTERS).map(m => ({ id: m.id, unlocked: m.unlocked })),
            legendarySpawned: this.legendarySpawned
        };
        localStorage.setItem('dungeonTycoonSave', JSON.stringify(saveData));
    }

    loadGame() {
        const saveDataStr = localStorage.getItem('dungeonTycoonSave');
        if (!saveDataStr) return;

        try {
            const saveData = JSON.parse(saveDataStr);
            this.gold = saveData.gold || 100;
            this.kills = saveData.kills || 0;
            this.reputation = saveData.reputation || 0;
            this.legendarySpawned = saveData.legendarySpawned || {};

            // Load unlocks
            if (saveData.traps) {
                saveData.traps.forEach(t => {
                    if (TRAPS[t.id]) TRAPS[t.id].unlocked = t.unlocked;
                });
            }
            if (saveData.monsters) {
                saveData.monsters.forEach(m => {
                    if (MONSTERS[m.id]) MONSTERS[m.id].unlocked = m.unlocked;
                });
            }

            // Load dungeon layout
            if (saveData.dungeon) {
                this.dungeon.loadFromData(saveData.dungeon);
            }

            this.renderDungeon();
            this.renderShop();
            this.updateUI();
            this.addLog('Game loaded!', 'info');
        } catch (e) {
            console.error('Failed to load game:', e);
        }
    }

    // Shop rendering
    renderShop() {
        // Render traps
        const trapsContainer = document.getElementById('traps-shop');
        trapsContainer.innerHTML = '';
        for (const trap of Object.values(TRAPS)) {
            const itemDiv = this.createShopItem(trap, 'trap');
            trapsContainer.appendChild(itemDiv);
        }

        // Render monsters
        const monstersContainer = document.getElementById('monsters-shop');
        monstersContainer.innerHTML = '';
        for (const monster of Object.values(MONSTERS)) {
            const itemDiv = this.createShopItem(monster, 'monster');
            monstersContainer.appendChild(itemDiv);
        }

        // Render bait
        const roomsContainer = document.getElementById('rooms-shop');
        roomsContainer.innerHTML = '';
        for (const bait of Object.values(BAIT_ITEMS)) {
            const itemDiv = this.createShopItem(bait, 'bait');
            roomsContainer.appendChild(itemDiv);
        }
        for (const room of Object.values(ROOM_TYPES)) {
            const itemDiv = this.createShopItem(room, 'room');
            roomsContainer.appendChild(itemDiv);
        }

        // Render upgrades
        const upgradesContainer = document.getElementById('upgrades-shop');
        upgradesContainer.innerHTML = '';
        for (const upgrade of Object.values(UPGRADES)) {
            const upgradeDiv = this.createUpgradeItem(upgrade);
            upgradesContainer.appendChild(upgradeDiv);
        }
    }

    createShopItem(item, type) {
        const div = document.createElement('div');
        div.className = 'shop-item';

        if (!item.unlocked) {
            div.className += ' locked';
            const reqText = this.getRequirementText(item.unlockRequirement);
            div.innerHTML = `
                <div class="item-header">
                    <span class="item-name">🔒 ${item.name}</span>
                </div>
                <div class="item-description">${reqText}</div>
            `;
            return div;
        }

        if (this.selectedItem === item.id && this.selectedType === type) {
            div.className += ' selected';
        }

        const canAfford = this.gold >= item.cost;
        if (!canAfford) {
            div.style.opacity = '0.6';
        }

        div.innerHTML = `
            <div class="item-header">
                <span class="item-name">${item.icon} ${item.name}</span>
                <span class="item-cost">💰 ${item.cost}</span>
            </div>
            <div class="item-description">${item.description}</div>
            <div class="item-stats">${this.getItemStats(item, type)}</div>
        `;

        div.addEventListener('click', () => {
            if (canAfford) {
                this.selectItem(item.id, type);
            }
        });

        return div;
    }

    getRequirementText(req) {
        if (!req) return 'Locked';
        const parts = [];
        if (req.kills !== undefined) parts.push(`${req.kills} kills`);
        if (req.reputation !== undefined) parts.push(`${req.reputation} reputation`);
        return `Unlock: ${parts.join(', ')}`;
    }

    getItemStats(item, type) {
        if (type === 'trap') {
            let stats = `⚔️ ${item.damage} damage`;
            if (item.dotDamage) {
                stats += ` + ${item.dotDamage}x${item.dotDuration} DoT`;
            }
            return stats;
        } else if (type === 'monster') {
            return `❤️ ${item.hp} HP | ⚔️ ${item.damage} damage`;
        } else if (type === 'bait') {
            return `🎣 Lure Strength: ${item.lureStrength}/10`;
        } else if (type === 'room') {
            return `Special: ${item.description}`;
        }
        return '';
    }

    createUpgradeItem(upgrade) {
        const div = document.createElement('div');
        div.className = 'shop-item upgrade-item';

        // Check if already purchased
        if (upgrade.purchased) {
            div.className += ' purchased';
            div.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${upgrade.icon} ${upgrade.name}</span>
                    <span class="item-cost">✓ OWNED</span>
                </div>
                <div class="item-description">${upgrade.description}</div>
            `;
            return div;
        }

        // Check unlock requirements
        if (upgrade.unlockRequirement) {
            const req = upgrade.unlockRequirement;
            if ((req.kills !== undefined && this.kills < req.kills) ||
                (req.reputation !== undefined && this.reputation < req.reputation)) {
                div.className += ' locked';
                const reqText = this.getRequirementText(upgrade.unlockRequirement);
                div.innerHTML = `
                    <div class="item-header">
                        <span class="item-name">🔒 ${upgrade.name}</span>
                    </div>
                    <div class="item-description">${reqText}</div>
                `;
                return div;
            }
        }

        // Check prerequisites
        if (upgrade.requires && !UPGRADES[upgrade.requires].purchased) {
            div.className += ' locked';
            div.innerHTML = `
                <div class="item-header">
                    <span class="item-name">🔒 ${upgrade.name}</span>
                </div>
                <div class="item-description">Requires: ${UPGRADES[upgrade.requires].name}</div>
            `;
            return div;
        }

        const canAfford = this.gold >= upgrade.cost;
        if (!canAfford) {
            div.style.opacity = '0.6';
        }

        div.innerHTML = `
            <div class="item-header">
                <span class="item-name">${upgrade.icon} ${upgrade.name}</span>
                <span class="item-cost">💰 ${upgrade.cost}</span>
            </div>
            <div class="item-description">${upgrade.description}</div>
            <div class="item-stats">Permanent Upgrade!</div>
        `;

        div.addEventListener('click', () => {
            if (canAfford) {
                this.purchaseUpgrade(upgrade);
            }
        });

        return div;
    }

    purchaseUpgrade(upgrade) {
        if (this.gold < upgrade.cost || upgrade.purchased) return;

        this.gold -= upgrade.cost;
        upgrade.purchased = true;

        // Apply upgrade effect
        switch (upgrade.effect) {
            case 'trapDamageMultiplier':
                this.upgrades.trapDamageBonus += upgrade.value;
                break;
            case 'goldMultiplier':
                this.upgrades.goldBonus += upgrade.value;
                break;
            case 'monsterHealthMultiplier':
                this.upgrades.monsterHealthBonus += upgrade.value;
                break;
            case 'monsterDamageMultiplier':
                this.upgrades.monsterDamageBonus += upgrade.value;
                break;
            case 'comboMultiplier':
                this.upgrades.comboBonus += upgrade.value;
                break;
            case 'baitMultiplier':
                this.upgrades.baitBonus += upgrade.value;
                break;
        }

        this.addLog(`⬆️ Purchased: ${upgrade.name}!`, 'gold');
        this.renderShop();
        this.updateUI();
        this.saveGame();
    }

    renderDungeon() {
        const gridContainer = document.getElementById('dungeon-grid');
        gridContainer.innerHTML = '';

        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                const cell = this.dungeon.getCell(x, y);
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.dataset.x = x;
                cellDiv.dataset.y = y;

                // Apply room background
                if (cell.room) {
                    cellDiv.className += ' has-room room-' + cell.room.type;
                    cellDiv.style.backgroundColor = cell.room.color || 'rgba(100, 50, 50, 0.3)';
                    // Add room icon in corner
                    const roomIcon = document.createElement('div');
                    roomIcon.className = 'room-icon';
                    roomIcon.textContent = cell.room.icon;
                    roomIcon.title = cell.room.name;
                    cellDiv.appendChild(roomIcon);
                }

                // Set cell type class
                if (cell.type === 'entrance') {
                    cellDiv.className += ' entrance';
                    cellDiv.textContent = '🚪';
                } else if (cell.type === 'exit') {
                    cellDiv.className += ' exit';
                    cellDiv.textContent = '🏁';
                } else if (cell.bait) {
                    cellDiv.className += ' has-bait';
                    cellDiv.textContent = cell.bait.icon;
                    cellDiv.title = `${cell.bait.name} (Lure: ${cell.bait.lureStrength})`;
                } else if (cell.trap) {
                    cellDiv.className += ' has-trap';
                    cellDiv.textContent = cell.trap.icon;
                    cellDiv.title = `${cell.trap.name} (${cell.trap.damage} dmg)`;
                } else if (cell.monster) {
                    cellDiv.className += ' has-monster';
                    cellDiv.textContent = cell.monster.icon;
                    cellDiv.title = `${cell.monster.name} (${cell.monster.currentHp}/${cell.monster.hp} HP)`;
                    
                    // Add health bar for monsters
                    const healthBar = document.createElement('div');
                    healthBar.className = 'monster-health-bar';
                    const healthFill = document.createElement('div');
                    healthFill.className = 'monster-health-fill';
                    const healthPercent = (cell.monster.currentHp / cell.monster.hp) * 100;
                    healthFill.style.width = `${healthPercent}%`;
                    healthBar.appendChild(healthFill);
                    cellDiv.appendChild(healthBar);
                }

                // Click handlers
                cellDiv.addEventListener('click', (e) => {
                    if (e.shiftKey || e.ctrlKey) {
                        // Remove item
                        this.removeItem(x, y);
                    } else {
                        // Place item
                        this.placeSelectedItem(x, y);
                    }
                });

                cellDiv.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.removeItem(x, y);
                });

                gridContainer.appendChild(cellDiv);
            }
        }

        // Render adventurers on top
        this.renderAdventurers();
    }

    renderAdventurers() {
        // Remove old adventurer sprites
        document.querySelectorAll('.adventurer-sprite').forEach(el => el.remove());

        for (const adventurer of this.activeAdventurers) {
            if (!adventurer.alive) continue;

            const cell = document.querySelector(`[data-x="${adventurer.x}"][data-y="${adventurer.y}"]`);
            if (!cell) continue;

            const sprite = document.createElement('div');
            sprite.className = 'adventurer-sprite';
            sprite.textContent = adventurer.icon;
            sprite.title = `${adventurer.getDisplayName()} (${adventurer.currentHp}/${adventurer.maxHp} HP)`;
            sprite.style.color = adventurer.color;

            cell.appendChild(sprite);
        }
    }

    updateUI() {
        document.getElementById('gold-display').textContent = this.gold;
        document.getElementById('kills-display').textContent = this.kills;
        document.getElementById('reputation-display').textContent = this.reputation;
        document.getElementById('active-adventurers').textContent = this.activeAdventurers.length;

        // Update day/night display
        const timeOfDayEl = document.getElementById('time-of-day');
        const dayCountEl = document.getElementById('day-count');
        const timeBarEl = document.getElementById('time-bar');
        
        if (timeOfDayEl) {
            timeOfDayEl.textContent = this.isNight ? '🌙 NIGHT' : '☀️ DAY';
        }
        
        if (dayCountEl) {
            dayCountEl.textContent = this.dayCount;
        }
        
        if (timeBarEl) {
            const progress = (this.cycleTimer / this.cycleDuration) * 100;
            timeBarEl.style.width = `${progress}%`;
            
            if (this.isNight) {
                timeBarEl.classList.add('night');
            } else {
                timeBarEl.classList.remove('night');
            }
        }

        this.renderAdventurers();
    }

    updateSelectedItemDisplay() {
        const display = document.getElementById('selected-item');
        if (this.selectedItem && this.selectedType) {
            const item = this.selectedType === 'trap' ? TRAPS[this.selectedItem] : MONSTERS[this.selectedItem];
            display.textContent = `Selected: ${item.icon} ${item.name} (${item.cost} gold) - Click to place, Shift+Click to remove`;
        } else {
            display.textContent = 'Select a trap or monster from the shop ➡️';
        }
    }

}

