# 🎮 QUEST OF LEGENDS - Web RPG

A retro-styled browser-based RPG adventure game with classic turn-based combat, branching storylines, and extensive character progression systems.

## 🌟 Features

### **Core Gameplay**
- **5 Character Classes**: Warrior, Mage, Rogue, Cleric, Ranger - each with unique stats and skill trees
- **Enhanced Turn-Based Combat**: Strategic battles with HP, MP, Stamina management, status effects, and critical hits
- **Branching Storylines**: Your choices matter! Multiple endings based on your decisions
- **Save/Load System**: Uses browser LocalStorage to save your progress with auto-save support

### **🆕 NEW: Advanced Systems**

#### **Equipment System** ⚔️🛡️
- 10 equipment slots (Head, Chest, Legs, Feet, Hands, Weapon, Offhand, 2 Rings, Amulet)
- Item rarity system (Common, Uncommon, Rare, Epic, Legendary)
- Stat bonuses from equipment
- Item comparison tooltips
- Level and stat requirements

#### **Inventory Management** 🎒
- Category-based organization (Weapons, Armor, Consumables, Quest Items, Misc)
- Weight limit system
- Item stacking for consumables
- Multiple sorting options (Name, Rarity, Category, Weight, Value)
- Interactive tooltips with full item details

#### **Skill Trees** �
- Unique skill tree for each class
- 5+ skills per class with multiple ranks
- Unlockable abilities and spells
- Talent points gained on level up
- Skill reset option (costs gold)

**Class Skills:**
- **Warrior**: Power Strike, Iron Skin, Battle Rage, Cleave, Last Stand
- **Mage**: Arcane Knowledge, Spell Power, Fireball, Frost Nova, Arcane Explosion
- **Rogue**: Quick Feet, Deadly Precision, Backstab, Shadow Step, Poison Weapons
- **Cleric**: Divine Blessing, Holy Shield, Smite, Divine Protection, Resurrection
- **Ranger**: Sharpshooter, Animal Bond, Multi-Shot, Trap Master, Call of the Wild

#### **Status Effects System** 💫
- **Damage Over Time**: Poison ☠️, Burn 🔥, Bleed 🩸
- **Crowd Control**: Freeze ❄️, Stun 💫
- **Buffs**: Regeneration 💚, Strength Up 💪, Defense Up 🛡️
- **Debuffs**: Weakness ⬇️, Vulnerable 🎯
- Visual indicators with turn counters
- Strategic combat decisions

#### **Visual Effects** ✨
- Screen shake on hits
- Floating damage numbers
- Particle effects (customizable)
- Flash effects for special attacks
- Hit animations
- Critical hit explosions

#### **Achievement System** 🏆
- 15+ achievements to unlock
- Point-based progression
- Hidden achievements
- Rarity tiers (Common to Legendary)
- Achievement popup notifications
- Progress tracking

**Sample Achievements:**
- First Blood, Survivor, Treasure Hunter
- Level 10, Unstoppable, Master Warrior
- Perfect Run, Legendary Hero, Completionist

#### **Settings & Accessibility** ⚙️
- **Sound**: Volume controls for SFX, Music, and Master
- **Display**: Text speed, Screen shake, Particles, CRT effect toggle
- **Gameplay**: Auto-save, Confirm actions, Damage numbers, Combat speed
- **Accessibility**: Colorblind modes, Font size options, Dyslexic font, Reduce motion

### **UI/UX Improvements**
- Fullscreen responsive layout
- Collapsible side panels
- Notification system (toast messages)
- Auto-save indicator
- Enhanced tooltips
- Retro CRT aesthetic (toggleable)

## 🎮 How to Play

1. **Open `index.html` in a web browser** (preferably Chrome, Firefox, or Edge)
2. **Create a Character**: Choose your name and class
3. **Build Your Character**: Equip items and spend talent points
4. **Select an Adventure**: Choose from available quests
5. **Make Choices**: Read the story and select your actions
6. **Combat**: Fight enemies using Attack, Defend, Magic, and Special abilities
7. **Manage Resources**: Use potions, manage status effects, upgrade equipment
8. **Progress**: Level up, unlock skills, earn achievements
9. **Complete the Quest**: Reach one of multiple endings!

## 🎯 Current Adventures

### 🌲 The Dark Forest
**Difficulty**: Medium | **Recommended Level**: 1

Investigate the corrupted Shadowfen Forest and discover what darkness has taken hold. Face corrupted creatures, make crucial decisions, and determine the fate of the forest.

**Features**:
- Multiple story paths and endings
- Corruption vs Purity system
- Boss battle with Elara the Corrupted
- Moral choices that affect the outcome
- 400+ gold and epic experience rewards

### 🐉 Dragon's Cave (Coming Soon)
More adventures to be added!

## 📁 Project Structure

```
WebRPG/
├── index.html              # Main game interface
├── css/
│   ├── style.css          # Original retro styling
│   └── enhanced.css       # NEW: Enhanced features styling
├── js/
│   ├── main.js            # Core game initialization
│   ├── character.js       # Character creation/management
│   ├── combat.js          # Enhanced turn-based combat
│   ├── adventure.js       # Adventure loading system
│   ├── game.js            # Game flow and choices
│   ├── utils.js           # Helper functions
│   ├── notifications.js   # NEW: Toast notification system
│   ├── settings.js        # NEW: Settings management
│   ├── effects.js         # NEW: Visual effects system
│   ├── statusEffects.js   # NEW: Status effect system
│   ├── inventory.js       # NEW: Advanced inventory
│   ├── equipment.js       # NEW: Equipment management
│   ├── skillTree.js       # NEW: Skill tree system
│   ├── achievements.js    # NEW: Achievement tracking
│   └── adventures/
│       ├── dark_forest.js # Complete adventure
│       └── dragon_cave.js # Adventure template
└── README.md              # This file
```

## 🎨 Customization

### Adding New Items
Edit `js/inventory.js` and add to `SAMPLE_ITEMS`:
```javascript
newSword: {
    name: 'Epic Blade',
    category: ITEM_CATEGORIES.WEAPON,
    rarity: 'EPIC',
    stats: { attack: 35, strength: 8 },
    icon: '⚔️'
}
```

### Adding New Skills
Edit `js/skillTree.js` and add to class skill trees:
```javascript
newSkill: {
    name: 'Awesome Skill',
    description: 'Does awesome things',
    maxRank: 5,
    cost: 1,
    effects: { attackBonus: 0.15 }
}
```

### Adding New Achievements
Edit `js/achievements.js` and add to `ACHIEVEMENTS`:
```javascript
NEW_ACHIEVEMENT: {
    id: 'new_achievement',
    name: 'Achievement Name',
    description: 'Complete this task',
    icon: '🎖️',
    rarity: 'RARE',
    points: 30
}
```

## 🔧 Technical Details

- **Storage**: LocalStorage for save data, settings, and achievements
- **Frameworks**: Vanilla JavaScript (no dependencies!)
- **Styling**: CSS3 with custom properties and animations
- **Font**: Press Start 2P (Google Fonts)
- **Compatibility**: Modern browsers (Chrome, Firefox, Edge, Safari)

## 🆕 Version 2.0 Features

- ✅ Equipment system with 10 slots
- ✅ Advanced inventory with weight and categories
- ✅ Skill trees for all 5 classes
- ✅ Status effect system (10+ effects)
- ✅ Visual effects (particles, shake, floating text)
- ✅ Achievement system (15+ achievements)
- ✅ Settings & accessibility options
- ✅ Auto-save functionality
- ✅ Notification system
- ✅ Enhanced combat with criticals
- ✅ Fullscreen responsive layout
- ✅ Item tooltips and comparisons

## 🎯 Roadmap

- [ ] More adventures and quests
- [ ] Crafting system
- [ ] Pet/companion system
- [ ] Difficulty modes
- [ ] Random dungeon generator
- [ ] Daily challenges
- [ ] Cloud save support
- [ ] Mobile-optimized controls

## 📝 Credits

**Game Design**: Classic RPG Engine  
**Programming**: JavaScript & Enhanced Systems  
**Inspired by**: Final Fantasy • Dragon Quest • The Elder Scrolls • Ultima  

## 📄 License

Free to use and modify for personal projects!

---

**Version**: 2.0 Enhanced Edition  
**Last Updated**: November 2025  
**Status**: Fully Playable with Advanced Features

**🎮 Ready to become a Legend? Start your quest now!**
│   └── adventures/
│       └── dark_forest.js # The Dark Forest adventure
└── README.md
```

## 🎨 Character Classes

### ⚔️ Warrior
- **HP**: 120 | **MP**: 30 | **Stamina**: 100
- **Strengths**: High health, powerful melee attacks
- **Special**: Shield Bash - Stun enemies

### 🔮 Mage
- **HP**: 70 | **MP**: 120 | **Stamina**: 70
- **Strengths**: Powerful magic, ranged attacks
- **Special**: Fireball - AOE damage

### 🗡️ Rogue
- **HP**: 90 | **MP**: 60 | **Stamina**: 120
- **Strengths**: High critical hits, evasion
- **Special**: Backstab - Massive damage

### ✨ Cleric
- **HP**: 100 | **MP**: 100 | **Stamina**: 80
- **Strengths**: Healing, support magic
- **Special**: Holy Light - Heal and damage

### 🏹 Ranger
- **HP**: 100 | **MP**: 70 | **Stamina**: 100
- **Strengths**: Balanced stats, nature magic
- **Special**: Volley - Multiple attacks

## ⚔️ Combat System

### Player Actions:
- **Attack**: Standard melee/ranged attack (costs stamina)
- **Defend**: Reduce incoming damage by 50%
- **Magic**: Cast spells using MP
- **Special**: Class-specific powerful abilities
- **Item**: Use healing potions or elixirs
- **Flee**: Attempt to escape (not always successful)

### Stats:
- **HP (Health Points)**: Your life force
- **MP (Mana Points)**: Used for magic and special abilities
- **Stamina**: Used for physical attacks
- **Level**: Increases with experience
- **Gold**: Currency for items and upgrades

## 🎭 The Dark Forest - Story Paths

### Key Decisions:
1. **Wounded Traveler**: Save him or leave him?
2. **Corrupted Pool**: Drink the power or resist temptation?
3. **The Hermit**: Trust him or attack?
4. **Elara's Fate**: Redeem her or defeat her?

### Endings:
- **Purification Ending**: Defeat Elara and cleanse the forest
- **Redemption Ending**: Save Elara and heal the forest together (BEST ENDING)
- **Multiple failure states based on corruption level**

## 🔧 Technical Details

- **Technology**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API for save data
- **Animation**: Custom typewriter effects and CSS animations
- **Design**: Retro CRT aesthetic with scanlines and glitch effects
- **Font**: Press Start 2P (Google Fonts)

## 🎯 Future Adventures (Planned)

- 🐉 **Dragon Cave**: Face a legendary dragon
- 🏰 **The Shifting Halls**: Navigate a magical dungeon
- More adventures coming soon!

## 💾 Save System

Your progress is automatically saved:
- Character data persists between sessions
- Adventure progress can be resumed
- Multiple characters can be created
- Save data stored in browser's LocalStorage

## 🎨 Customization

The game uses CSS variables for easy theme customization:
```css
--bg-primary: #1a1a2e;
--bg-secondary: #16213e;
--border-color: #e94560;
--text-primary: #0fff50;
--text-secondary: #ffd700;
--text-highlight: #00d9ff;
```

## 🐛 Known Issues / Limitations

- Audio files are placeholders (no sound yet)
- Some adventure paths are simplified
- No multiplayer support
- Requires modern browser with ES6 support

## 📝 Credits

Created as a conversion of a Python text-based RPG to web format.

**Original Concept**: Text-based adventure RPG  
**Web Conversion**: 2025  
**Font**: Press Start 2P by CodeMan38

## 🚀 Quick Start

Simply open `index.html` in your browser - no installation or build process required!

**Minimum Requirements**:
- Modern web browser (Chrome 90+, Firefox 88+, Edge 90+)
- JavaScript enabled
- LocalStorage enabled

---

**Enjoy your adventure! May the dice roll in your favor! 🎲**
