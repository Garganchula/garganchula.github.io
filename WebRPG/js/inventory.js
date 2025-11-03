/**
 * MULTI-VENTURE - Enhanced Inventory System
 * Item management, categories, weight, and equipment
 */

const ITEM_CATEGORIES = {
    WEAPON: 'weapon',
    ARMOR: 'armor',
    CONSUMABLE: 'consumable',
    QUEST: 'quest',
    MISC: 'misc'
};

const ITEM_RARITY = {
    COMMON: { name: 'Common', color: '#ffffff' },
    UNCOMMON: { name: 'Uncommon', color: '#00ff00' },
    RARE: { name: 'Rare', color: '#0099ff' },
    EPIC: { name: 'Epic', color: '#9d4edd' },
    LEGENDARY: { name: 'Legendary', color: '#ffd700' }
};

// Equipment slots (must be defined before SAMPLE_ITEMS uses it)
const EQUIPMENT_SLOTS = {
    HEAD: 'head',
    CHEST: 'chest',
    LEGS: 'legs',
    FEET: 'feet',
    HANDS: 'hands',
    WEAPON: 'weapon',
    OFFHAND: 'offhand',
    RING1: 'ring1',
    RING2: 'ring2',
    AMULET: 'amulet'
};

class Item {
    constructor(data) {
        this.id = data.id || Date.now().toString();
        this.name = data.name;
        this.description = data.description || '';
        this.category = data.category || ITEM_CATEGORIES.MISC;
        this.rarity = data.rarity || 'COMMON';
        this.weight = data.weight || 1;
        this.value = data.value || 0;
        this.stackable = data.stackable || false;
        this.quantity = data.quantity || 1;
        this.stats = data.stats || {};
        this.effects = data.effects || {};
        this.icon = data.icon || '📦';
    }

    getTooltipHTML() {
        const rarityInfo = ITEM_RARITY[this.rarity];
        let html = `
            <div class="item-tooltip" style="color: ${rarityInfo.color};">
                <div class="tooltip-header">
                    <span class="tooltip-icon">${this.icon}</span>
                    <span class="tooltip-name">${this.name}</span>
                </div>
                <div class="tooltip-rarity">${rarityInfo.name}</div>
                <div class="tooltip-description">${this.description}</div>
        `;
        
        if (Object.keys(this.stats).length > 0) {
            html += '<div class="tooltip-stats">';
            for (const [stat, value] of Object.entries(this.stats)) {
                const prefix = value > 0 ? '+' : '';
                html += `<div>${stat}: ${prefix}${value}</div>`;
            }
            html += '</div>';
        }
        
        if (Object.keys(this.effects).length > 0) {
            html += '<div class="tooltip-effects">';
            for (const [effect, value] of Object.entries(this.effects)) {
                html += `<div>${effect}: ${value}</div>`;
            }
            html += '</div>';
        }
        
        html += `
                <div class="tooltip-footer">
                    <span>Weight: ${this.weight}</span>
                    <span>Value: ${this.value}g</span>
                </div>
            </div>
        `;
        
        return html;
    }
}

class InventorySystem {
    constructor(maxWeight = 100) {
        this.items = [];
        this.maxWeight = maxWeight;
        this.gold = 0;
    }

    addItem(itemData, quantity = 1) {
        const item = itemData instanceof Item ? itemData : new Item(itemData);
        
        // Check weight limit
        if (this.getCurrentWeight() + (item.weight * quantity) > this.maxWeight) {
            showNotification('Inventory is too heavy!', 'warning');
            return false;
        }
        
        // Check if stackable
        if (item.stackable) {
            const existing = this.items.find(i => i.name === item.name);
            if (existing) {
                existing.quantity += quantity;
            } else {
                item.quantity = quantity;
                this.items.push(item);
            }
        } else {
            for (let i = 0; i < quantity; i++) {
                this.items.push(new Item({...item, id: Date.now() + i}));
            }
        }
        
        showNotification(`Added ${quantity}x ${item.name}`, 'success');
        this.updateInventoryUI();
        return true;
    }

    removeItem(itemId, quantity = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;
        
        const item = this.items[index];
        if (item.stackable && item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            this.items.splice(index, 1);
        }
        
        this.updateInventoryUI();
        return true;
    }

    getItem(itemId) {
        return this.items.find(i => i.id === itemId);
    }

    getItemsByCategory(category) {
        return this.items.filter(i => i.category === category);
    }

    getCurrentWeight() {
        return this.items.reduce((total, item) => {
            return total + (item.weight * (item.quantity || 1));
        }, 0);
    }

    sortBy(criteria = 'name') {
        switch(criteria) {
            case 'name':
                this.items.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rarity':
                const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
                this.items.sort((a, b) => {
                    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
                });
                break;
            case 'weight':
                this.items.sort((a, b) => b.weight - a.weight);
                break;
            case 'value':
                this.items.sort((a, b) => b.value - a.value);
                break;
            case 'category':
                this.items.sort((a, b) => a.category.localeCompare(b.category));
                break;
        }
        this.updateInventoryUI();
    }

    useItem(itemId, character) {
        const item = this.getItem(itemId);
        if (!item) return false;
        
        if (item.category === ITEM_CATEGORIES.CONSUMABLE) {
            // Apply effects
            if (item.effects.heal) {
                character.health = Math.min(character.maxHealth, character.health + item.effects.heal);
                showFloatingHeal(item.effects.heal, 'playerHpBar');
            }
            if (item.effects.mana) {
                character.mana = Math.min(character.maxMana, character.mana + item.effects.mana);
            }
            if (item.effects.stamina) {
                character.stamina = Math.min(character.maxStamina, character.stamina + item.effects.stamina);
            }
            
            this.removeItem(itemId, 1);
            updateCharacterDisplay();
            return true;
        }
        
        return false;
    }

    updateInventoryUI() {
        const container = document.getElementById('gameInventory');
        if (!container) return;
        
        const currentWeight = this.getCurrentWeight();
        const weightPercent = (currentWeight / this.maxWeight) * 100;
        
        let html = `
            <div class="inventory-header">
                <div class="weight-bar">
                    <div class="weight-fill" style="width: ${weightPercent}%"></div>
                    <div class="bar-text">${currentWeight.toFixed(1)}/${this.maxWeight} kg</div>
                </div>
                <div class="inventory-controls">
                    <select id="inventorySort" onchange="if(gameState.currentCharacter) gameState.currentCharacter.inventory.sortBy(this.value)">
                        <option value="name">Sort: Name</option>
                        <option value="rarity">Sort: Rarity</option>
                        <option value="category">Sort: Category</option>
                        <option value="weight">Sort: Weight</option>
                        <option value="value">Sort: Value</option>
                    </select>
                </div>
            </div>
            <div class="inventory-grid">
        `;
        
        this.items.forEach(item => {
            const rarityColor = ITEM_RARITY[item.rarity].color;
            html += `
                <div class="inventory-item" 
                     data-item-id="${item.id}"
                     style="border-color: ${rarityColor};"
                     onmouseover="showItemTooltip(this, '${item.id}')"
                     onmouseout="hideTooltip()"
                     onclick="useInventoryItem('${item.id}')">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                    ${item.stackable ? `<div class="item-quantity">x${item.quantity}</div>` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

// Item tooltip functions
function showItemTooltip(element, itemId) {
    if (!gameState.currentCharacter) return;
    
    const item = gameState.currentCharacter.inventory.getItem(itemId);
    if (!item) return;
    
    let tooltip = document.getElementById('itemTooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'itemTooltip';
        tooltip.className = 'tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = item.getTooltipHTML();
    tooltip.classList.add('show');
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.right + 10) + 'px';
    tooltip.style.top = rect.top + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('itemTooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
    }
}

function useInventoryItem(itemId) {
    if (!gameState.currentCharacter) return;
    
    const item = gameState.currentCharacter.inventory.getItem(itemId);
    if (!item) return;
    
    if (item.category === ITEM_CATEGORIES.CONSUMABLE) {
        if (confirm(`Use ${item.name}?`)) {
            gameState.currentCharacter.inventory.useItem(itemId, gameState.currentCharacter);
        }
    } else if (item.category === ITEM_CATEGORIES.WEAPON || item.category === ITEM_CATEGORIES.ARMOR) {
        // Equipment handled by equipment system
        equipItem(itemId);
    }
}

// Sample items
const SAMPLE_ITEMS = {
    healthPotion: {
        name: 'Health Potion',
        description: 'Restores 50 HP',
        category: ITEM_CATEGORIES.CONSUMABLE,
        rarity: 'COMMON',
        weight: 0.5,
        value: 25,
        stackable: true,
        icon: '🧪',
        effects: { heal: 50 }
    },
    manaPotion: {
        name: 'Mana Potion',
        description: 'Restores 30 MP',
        category: ITEM_CATEGORIES.CONSUMABLE,
        rarity: 'COMMON',
        weight: 0.5,
        value: 20,
        stackable: true,
        icon: '🔮',
        effects: { mana: 30 }
    },
    ironSword: {
        name: 'Iron Sword',
        description: 'A sturdy iron blade',
        category: ITEM_CATEGORIES.WEAPON,
        slot: EQUIPMENT_SLOTS.WEAPON,
        rarity: 'COMMON',
        weight: 5,
        value: 100,
        icon: '⚔️',
        stats: { strength: 5, attack: 10 }
    },
    leatherArmor: {
        name: 'Leather Armor',
        description: 'Light protective armor',
        category: ITEM_CATEGORIES.ARMOR,
        slot: EQUIPMENT_SLOTS.CHEST,
        rarity: 'COMMON',
        weight: 8,
        value: 80,
        icon: '🛡️',
        stats: { defense: 8, constitution: 2 }
    }
};

console.log('✅ inventory.js loaded');
