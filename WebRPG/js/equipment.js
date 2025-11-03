/**
 * MULTI-VENTURE - Equipment System
 * Manage character equipment with slots and stat bonuses
 */

// EQUIPMENT_SLOTS is now defined in inventory.js to avoid circular dependencies

class EquipmentManager {
    constructor(character) {
        this.character = character;
        this.slots = {
            [EQUIPMENT_SLOTS.HEAD]: null,
            [EQUIPMENT_SLOTS.CHEST]: null,
            [EQUIPMENT_SLOTS.LEGS]: null,
            [EQUIPMENT_SLOTS.FEET]: null,
            [EQUIPMENT_SLOTS.HANDS]: null,
            [EQUIPMENT_SLOTS.WEAPON]: null,
            [EQUIPMENT_SLOTS.OFFHAND]: null,
            [EQUIPMENT_SLOTS.RING1]: null,
            [EQUIPMENT_SLOTS.RING2]: null,
            [EQUIPMENT_SLOTS.AMULET]: null
        };
    }

    canEquip(item, slot) {
        // Check class restrictions
        if (item.classRestriction && item.classRestriction !== this.character.class) {
            return { success: false, reason: `Only ${item.classRestriction}s can equip this.` };
        }

        // Check level requirements
        if (item.levelRequirement && this.character.level < item.levelRequirement) {
            return { success: false, reason: `Requires level ${item.levelRequirement}.` };
        }

        // Check stat requirements
        if (item.statRequirements) {
            for (const [stat, required] of Object.entries(item.statRequirements)) {
                const charStat = this.character.stats[stat] || 0;
                if (charStat < required) {
                    return { success: false, reason: `Requires ${stat}: ${required}.` };
                }
            }
        }

        return { success: true };
    }

    equip(item, slot) {
        const canEquipResult = this.canEquip(item, slot);
        if (!canEquipResult.success) {
            showNotification(canEquipResult.reason, 'error');
            return false;
        }

        // Unequip current item in slot
        if (this.slots[slot]) {
            this.unequip(slot);
        }

        // Equip new item
        this.slots[slot] = item;
        this.applyStats(item, true);
        this.updateEquipmentUI();
        showNotification(`Equipped ${item.name}`, 'success');
        
        // Visual effect
        if (effectsManager) {
            effectsManager.flash('rgba(255, 215, 0, 0.2)', 300);
        }
        
        return true;
    }

    unequip(slot) {
        const item = this.slots[slot];
        if (!item) return false;

        this.applyStats(item, false);
        this.slots[slot] = null;
        
        // Add back to inventory
        if (this.character.inventory) {
            this.character.inventory.addItem(item, 1);
        }
        
        this.updateEquipmentUI();
        showNotification(`Unequipped ${item.name}`, 'info');
        return true;
    }

    applyStats(item, equipping = true) {
        if (!item.stats) return;

        const multiplier = equipping ? 1 : -1;
        
        for (const [stat, value] of Object.entries(item.stats)) {
            if (stat === 'attack') {
                this.character.attack = (this.character.attack || 0) + (value * multiplier);
            } else if (stat === 'defense') {
                this.character.defense = (this.character.defense || 0) + (value * multiplier);
            } else if (this.character.stats && this.character.stats[stat] !== undefined) {
                this.character.stats[stat] += (value * multiplier);
            }
            
            // Update derived stats
            if (stat === 'constitution') {
                const hpBonus = value * 5 * multiplier;
                this.character.maxHealth += hpBonus;
                this.character.health = Math.min(this.character.health, this.character.maxHealth);
            } else if (stat === 'intelligence') {
                const mpBonus = value * 3 * multiplier;
                this.character.maxMana += mpBonus;
                this.character.mana = Math.min(this.character.mana, this.character.maxMana);
            }
        }
        
        updateCharacterDisplay();
    }

    getTotalStats() {
        const totalStats = {};
        
        for (const item of Object.values(this.slots)) {
            if (item && item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    totalStats[stat] = (totalStats[stat] || 0) + value;
                }
            }
        }
        
        return totalStats;
    }

    getEquipped(slot) {
        return this.slots[slot];
    }

    updateEquipmentUI() {
        console.log('🔄 Updating equipment UI...');
        
        const container = document.getElementById('equipmentPanel');
        if (!container) {
            console.error('❌ Equipment panel container not found!');
            return;
        }

        console.log('📦 Equipment slots:', this.slots);

        let html = '<div class="equipment-grid">';
        
        for (const [slotName, item] of Object.entries(this.slots)) {
            const slotLabel = slotName.charAt(0).toUpperCase() + slotName.slice(1);
            const isEmpty = !item;
            const rarityColor = item ? ITEM_RARITY[item.rarity].color : '#666';
            
            html += `
                <div class="equipment-slot ${isEmpty ? 'empty' : ''}" 
                     data-slot="${slotName}"
                     style="border-color: ${rarityColor};">
                    <div class="slot-label">${slotLabel}</div>
                    <div class="slot-content">
                        ${item ? `
                            <div class="slot-icon">${item.icon}</div>
                            <div class="slot-name">${item.name}</div>
                            <button class="unequip-btn" onclick="playSFX('select'); unequipSlot('${slotName}')">✖</button>
                        ` : `
                            <div class="slot-empty">Empty</div>
                        `}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Add total stats display
        const totalStats = this.getTotalStats();
        if (Object.keys(totalStats).length > 0) {
            html += '<div class="equipment-totals"><h4>Equipment Bonuses:</h4>';
            for (const [stat, value] of Object.entries(totalStats)) {
                const prefix = value > 0 ? '+' : '';
                html += `<div>${stat}: ${prefix}${value}</div>`;
            }
            html += '</div>';
        }
        
        // Add equippable items from inventory
        const equippableItems = this.character.inventory.items.filter(item => 
            item.category === ITEM_CATEGORIES.WEAPON || 
            item.category === ITEM_CATEGORIES.ARMOR
        );
        
        if (equippableItems.length > 0) {
            html += '<div class="equipment-inventory"><h4>📦 Equippable Items:</h4><div class="inventory-items">';
            for (const item of equippableItems) {
                const rarityColor = ITEM_RARITY[item.rarity]?.color || '#666';
                html += `
                    <div class="inventory-item" style="border-color: ${rarityColor};">
                        <span class="item-icon">${item.icon || '📦'}</span>
                        <span class="item-name">${item.name}</span>
                        <button class="equip-btn" onclick="playSFX('select'); equipItemFromInventory('${item.name}')">Equip</button>
                    </div>
                `;
            }
            html += '</div></div>';
        } else {
            html += '<div class="equipment-inventory"><p style="text-align: center; color: #888; padding: 20px;">No equippable items in inventory</p></div>';
        }
        
        container.innerHTML = html;
    }

    compareItems(item1, item2) {
        if (!item1 || !item2) return null;
        
        const comparison = {
            name1: item1.name,
            name2: item2.name,
            differences: []
        };
        
        const allStats = new Set([
            ...Object.keys(item1.stats || {}),
            ...Object.keys(item2.stats || {})
        ]);
        
        for (const stat of allStats) {
            const value1 = (item1.stats && item1.stats[stat]) || 0;
            const value2 = (item2.stats && item2.stats[stat]) || 0;
            const diff = value2 - value1;
            
            if (diff !== 0) {
                comparison.differences.push({
                    stat,
                    value1,
                    value2,
                    diff,
                    better: diff > 0
                });
            }
        }
        
        return comparison;
    }

    showComparison(newItem, slot) {
        const currentItem = this.slots[slot];
        if (!currentItem) return;
        
        const comparison = this.compareItems(currentItem, newItem);
        if (!comparison) return;
        
        let html = `
            <div class="item-comparison">
                <div class="comparison-header">
                    <div class="current-item">${comparison.name1} (Current)</div>
                    <div class="vs">VS</div>
                    <div class="new-item">${comparison.name2} (New)</div>
                </div>
                <div class="comparison-stats">
        `;
        
        comparison.differences.forEach(diff => {
            const color = diff.better ? '#00ff00' : '#ff0000';
            const arrow = diff.better ? '▲' : '▼';
            html += `
                <div class="stat-comparison">
                    <span>${diff.stat}:</span>
                    <span>${diff.value1}</span>
                    <span style="color: ${color};">${arrow} ${Math.abs(diff.diff)}</span>
                    <span>${diff.value2}</span>
                </div>
            `;
        });
        
        html += '</div></div>';
        
        return html;
    }
}

// Global equipment functions
function equipItem(itemId) {
    if (!gameState.currentCharacter) return;
    
    const item = gameState.currentCharacter.inventory.getItem(itemId);
    if (!item) return;
    
    let slot = null;
    
    // Determine slot based on item category and type
    if (item.category === ITEM_CATEGORIES.WEAPON) {
        slot = EQUIPMENT_SLOTS.WEAPON;
    } else if (item.category === ITEM_CATEGORIES.ARMOR) {
        // Determine armor slot based on item.slot property
        slot = item.slot || EQUIPMENT_SLOTS.CHEST;
    }
    
    if (!slot) {
        showNotification('This item cannot be equipped', 'error');
        return;
    }
    
    if (gameState.currentCharacter.equipment.equip(item, slot)) {
        gameState.currentCharacter.inventory.removeItem(itemId, 1);
    }
}

function unequipSlot(slotName) {
    if (!gameState.currentCharacter) return;
    gameState.currentCharacter.equipment.unequip(slotName);
}

function equipItemFromInventory(itemName) {
    console.log('⚔️ Equipping item:', itemName);
    
    if (!gameState.currentCharacter) {
        console.error('❌ No current character!');
        return;
    }
    
    // Find the item in inventory
    const item = gameState.currentCharacter.inventory.items.find(i => i.name === itemName);
    if (!item) {
        showMessage('Item not found in inventory!', 'error');
        return;
    }
    
    // Determine the slot - use item.slot if available, otherwise infer from category
    let slot = item.slot;
    if (!slot) {
        // Infer slot from category
        if (item.category === ITEM_CATEGORIES.WEAPON) {
            slot = EQUIPMENT_SLOTS.WEAPON;
        } else if (item.category === ITEM_CATEGORIES.ARMOR) {
            // For armor without a specific slot, default to chest
            // TODO: Better logic for different armor types
            slot = EQUIPMENT_SLOTS.CHEST;
        }
    }
    
    if (!slot) {
        showMessage('This item cannot be equipped!', 'error');
        console.warn('⚠️ Item has no slot:', item);
        return;
    }
    
    console.log(`📍 Equipping to slot: ${slot}`);
    
    // Equip the item
    const result = gameState.currentCharacter.equipment.equip(item, slot);
    if (result.success) {
        showMessage(`Equipped ${itemName}!`, 'success');
        updateCharacterDisplay();
    }
}

function showEquipmentPanel() {
    console.log('🎒 Opening equipment panel...');
    
    const modal = document.getElementById('equipmentModal');
    if (!modal) {
        console.error('❌ Equipment modal not found!');
        return;
    }
    
    if (!gameState.currentCharacter) {
        console.error('❌ No current character!');
        alert('Please create or select a character first.');
        return;
    }
    
    if (!gameState.currentCharacter.equipment) {
        console.warn('⚠️ Character has no equipment manager, creating one...');
        gameState.currentCharacter.equipment = new EquipmentManager(gameState.currentCharacter);
    }
    
    modal.classList.add('active');
    gameState.currentCharacter.equipment.updateEquipmentUI();
    console.log('✅ Equipment panel opened');
}

function closeEquipmentPanel() {
    const modal = document.getElementById('equipmentModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Sample equipment items
const SAMPLE_EQUIPMENT = {
    ironHelm: {
        name: 'Iron Helm',
        description: 'Basic iron helmet',
        category: ITEM_CATEGORIES.ARMOR,
        slot: EQUIPMENT_SLOTS.HEAD,
        rarity: 'COMMON',
        weight: 3,
        value: 50,
        icon: '⛑️',
        stats: { defense: 5, constitution: 1 }
    },
    steelPlate: {
        name: 'Steel Plate Armor',
        description: 'Heavy steel armor',
        category: ITEM_CATEGORIES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: 'UNCOMMON',
        weight: 15,
        value: 200,
        icon: '🛡️',
        stats: { defense: 15, constitution: 3 },
        levelRequirement: 5
    },
    flamingSword: {
        name: 'Flaming Sword',
        description: 'A blade wreathed in flames',
        category: ITEM_CATEGORIES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: 'RARE',
        weight: 6,
        value: 500,
        icon: '🔥⚔️',
        stats: { attack: 25, strength: 5 },
        levelRequirement: 10
    }
};

console.log('✅ equipment.js loaded');
