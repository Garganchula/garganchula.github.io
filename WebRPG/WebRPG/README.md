# 🎮 QUEST OF LEGENDS - Web RPG

A retro-styled browser-based RPG adventure game with classic turn-based combat and branching storylines.

## 🌟 Features

- **5 Character Classes**: Warrior, Mage, Rogue, Cleric, Ranger
- **Turn-Based Combat System**: Strategic battles with HP, MP, and Stamina management
- **Branching Storylines**: Your choices matter! Multiple endings based on your decisions
- **Save/Load System**: Uses browser LocalStorage to save your progress
- **Retro Aesthetic**: CRT screen effects, glitch animations, and 80s-inspired design
- **Quest System**: Track your progress with an integrated quest log

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

## 🎮 How to Play

1. **Open `index.html` in a web browser** (preferably Chrome, Firefox, or Edge)
2. **Create a Character**: Choose your name and class
3. **Select an Adventure**: Choose from available quests
4. **Make Choices**: Read the story and select your actions
5. **Combat**: Fight enemies using Attack, Defend, Magic, and Special abilities
6. **Complete the Quest**: Reach one of multiple endings!

## 📁 Project Structure

```
WebRPG/
├── index.html              # Main game interface
├── css/
│   └── style.css          # Complete retro styling
├── js/
│   ├── main.js            # Core game initialization
│   ├── character.js       # Character creation/management
│   ├── combat.js          # Turn-based combat system
│   ├── adventure.js       # Adventure loading system
│   ├── game.js            # Game flow and choices
│   ├── utils.js           # Helper functions
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
