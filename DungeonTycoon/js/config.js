// Game configuration and data
const CONFIG = {
    GRID_WIDTH: 10,
    GRID_HEIGHT: 8,
    BASE_SPAWN_RATE: 3000, // ms between adventurer spawns
    GAME_TICK: 100, // ms per game tick
    DAY_DURATION: 30000, // 30 seconds of day
    NIGHT_DURATION: 30000, // 30 seconds of night
    EVENT_CHECK_INTERVAL: 25000, // Check for events every 25 seconds
};

// Random Events
const RANDOM_EVENTS = {
    merchantCaravan: {
        id: 'merchantCaravan',
        name: 'Merchant Caravan',
        icon: '🛒',
        message: '🛒 Merchant Caravan arrives! 30% discount on all shop items for 45 seconds!',
        type: 'good',
        chance: 0.15,
        duration: 45000,
        effect: 'shopDiscount',
        value: 0.3
    },
    heroBounty: {
        id: 'heroBounty',
        name: 'Hero Guild Bounty',
        icon: '⚔️',
        message: '⚔️ HERO GUILD BOUNTY! A party of 3 heroes attacks together! (2x Gold reward)',
        type: 'challenge',
        chance: 0.12,
        duration: 0,
        effect: 'heroParty',
        value: 3
    },
    treasureMap: {
        id: 'treasureMap',
        name: 'Treasure Map Found',
        icon: '🗺️',
        message: '🗺️ Treasure Map found! Heroes are extremely greedy for 40 seconds!',
        type: 'mixed',
        chance: 0.15,
        duration: 40000,
        effect: 'maxGreed',
        value: 1
    },
    darkBlessing: {
        id: 'darkBlessing',
        name: 'Dark Blessing',
        icon: '🌟',
        message: '🌟 Dark Blessing! Next 3 defenses placed are FREE!',
        type: 'good',
        chance: 0.08,
        duration: 0,
        effect: 'freePlacements',
        value: 3
    },
    divineProtection: {
        id: 'divineProtection',
        name: 'Divine Protection',
        icon: '🛡️',
        message: '🛡️ Divine Protection! Next wave of heroes have +50% HP!',
        type: 'challenge',
        chance: 0.10,
        duration: 30000,
        effect: 'heroHPBonus',
        value: 0.5
    },
    monsterDiscount: {
        id: 'monsterDiscount',
        name: 'Monster Recruitment',
        icon: '👹',
        message: '👹 Monster Recruitment Event! All monsters cost 40% less for 50 seconds!',
        type: 'good',
        chance: 0.12,
        duration: 50000,
        effect: 'monsterDiscount',
        value: 0.4
    },
    bloodMoon: {
        id: 'bloodMoon',
        name: 'Blood Moon',
        icon: '🔴',
        message: '🔴 BLOOD MOON RISES! All kills worth 2x gold for 35 seconds!',
        type: 'good',
        chance: 0.10,
        duration: 35000,
        effect: 'goldMultiplier',
        value: 2
    },
    trapMalfunction: {
        id: 'trapMalfunction',
        name: 'Trap Malfunction',
        icon: '⚠️',
        message: '⚠️ Trap Malfunction! All traps deal 30% less damage for 30 seconds!',
        type: 'bad',
        chance: 0.08,
        duration: 30000,
        effect: 'trapDebuff',
        value: 0.3
    },
    goldRush: {
        id: 'goldRush',
        name: 'Gold Rush',
        icon: '💰',
        message: '💰 GOLD RUSH! Heroes carry 50% more gold for 40 seconds!',
        type: 'good',
        chance: 0.10,
        duration: 40000,
        effect: 'heroGoldBonus',
        value: 0.5
    }
};

// Hero name pools by class
const HERO_NAMES = {
    warrior: ['Borin', 'Throk', 'Marcus', 'Gareth', 'Roland', 'Bjorn', 'Thorin', 'Ragnar', 'Cedric', 'Gunther'],
    mage: ['Zephyr', 'Gandor', 'Luna', 'Arcanus', 'Merlin', 'Morgana', 'Celestia', 'Vorin', 'Alaric', 'Sylas'],
    rogue: ['Shadow', 'Whisper', 'Silk', 'Quinn', 'Raven', 'Sable', 'Nyx', 'Vex', 'Kael', 'Lark'],
    cleric: ['Faith', 'Hope', 'Seraph', 'Benedict', 'Grace', 'Mercy', 'Althea', 'Cassia', 'Lysander', 'Theron'],
    paladin: ['Valor', 'Justice', 'Percival', 'Galahad', 'Siegfried', 'Tristan', 'Lancelot', 'Aldric', 'Brennan', 'Cador']
};

// Trap definitions
const TRAPS = {
    spike: {
        id: 'spike',
        name: 'Spike Trap',
        icon: '🗡️',
        damage: 15,
        cost: 15,
        description: 'Classic spike trap. Reliable damage.',
        unlocked: true
    },
    arrow: {
        id: 'arrow',
        name: 'Arrow Trap',
        icon: '🏹',
        damage: 25,
        cost: 30,
        description: 'Fires arrows at intruders.',
        unlockRequirement: { kills: 5 },
        unlocked: false
    },
    fire: {
        id: 'fire',
        name: 'Fire Trap',
        icon: '🔥',
        damage: 35,
        cost: 60,
        description: 'Burns heroes to a crisp.',
        unlockRequirement: { kills: 15 },
        unlocked: false
    },
    poison: {
        id: 'poison',
        name: 'Poison Gas',
        icon: '☠️',
        damage: 20,
        dotDamage: 5,
        dotDuration: 3,
        cost: 50,
        description: 'Poison damage over time.',
        unlockRequirement: { kills: 10 },
        unlocked: false
    },
    lightning: {
        id: 'lightning',
        name: 'Lightning Rune',
        icon: '⚡',
        damage: 50,
        cost: 100,
        description: 'Devastating electrical damage.',
        unlockRequirement: { kills: 30 },
        unlocked: false
    },
    crusher: {
        id: 'crusher',
        name: 'Crusher',
        icon: '🔨',
        damage: 70,
        cost: 150,
        description: 'Massive damage. Slow reset.',
        unlockRequirement: { kills: 50, reputation: 100 },
        unlocked: false
    }
};

// Monster definitions
const MONSTERS = {
    goblin: {
        id: 'goblin',
        name: 'Goblin',
        icon: '👺',
        hp: 30,
        damage: 10,
        cost: 25,
        description: 'Weak but cheap guard.',
        unlocked: true
    },
    skeleton: {
        id: 'skeleton',
        name: 'Skeleton Warrior',
        icon: '💀',
        hp: 50,
        damage: 15,
        cost: 50,
        description: 'Undead guardian with decent stats.',
        unlockRequirement: { kills: 8 },
        unlocked: false
    },
    orc: {
        id: 'orc',
        name: 'Orc Brute',
        icon: '👹',
        hp: 80,
        damage: 25,
        cost: 85,
        description: 'Tough and hits hard.',
        unlockRequirement: { kills: 20 },
        unlocked: false
    },
    ghost: {
        id: 'ghost',
        name: 'Phantom',
        icon: '👻',
        hp: 40,
        damage: 30,
        cost: 120,
        description: 'High damage ethereal attacker.',
        unlockRequirement: { kills: 35 },
        unlocked: false
    },
    demon: {
        id: 'demon',
        name: 'Lesser Demon',
        icon: '😈',
        hp: 120,
        damage: 40,
        cost: 200,
        description: 'Demonic powerhouse.',
        unlockRequirement: { kills: 60, reputation: 150 },
        unlocked: false
    },
    dragon: {
        id: 'dragon',
        name: 'Young Dragon',
        icon: '🐉',
        hp: 200,
        damage: 60,
        cost: 400,
        description: 'THE ultimate guardian.',
        unlockRequirement: { kills: 100, reputation: 300 },
        unlocked: false
    }
};

// Bait/Lure items
const BAIT_ITEMS = {
    treasure: {
        id: 'treasure',
        name: 'Treasure Chest',
        icon: '💰',
        cost: 10,
        lureStrength: 3,
        description: 'Lures greedy heroes. Place near traps!',
        unlocked: true
    },
    goldPile: {
        id: 'goldPile',
        name: 'Gold Pile',
        icon: '🪙',
        cost: 25,
        lureStrength: 5,
        description: 'Strong lure. Heroes will risk danger.',
        unlockRequirement: { kills: 12 },
        unlocked: false
    },
    artifact: {
        id: 'artifact',
        name: 'Cursed Artifact',
        icon: '💎',
        cost: 50,
        lureStrength: 8,
        description: 'Irresistible! Heroes ignore all danger.',
        unlockRequirement: { kills: 25 },
        unlocked: false
    }
};

// Room types
const ROOM_TYPES = {
    corridor: {
        id: 'corridor',
        name: 'Narrow Corridor',
        icon: '🚪',
        cost: 20,
        description: 'Forces single file. +50% trap damage.',
        effect: 'trapBonus',
        bonus: 0.5,
        unlocked: true
    },
    chamber: {
        id: 'chamber',
        name: 'Large Chamber',
        icon: '🏛️',
        cost: 35,
        description: 'Monsters deal +30% damage here.',
        effect: 'monsterBonus',
        bonus: 0.3,
        unlockRequirement: { kills: 10 },
        unlocked: false
    },
    ambush: {
        id: 'ambush',
        name: 'Ambush Room',
        icon: '🕳️',
        cost: 60,
        description: 'Traps trigger twice! Very deadly.',
        effect: 'doubleTrap',
        unlockRequirement: { kills: 20 },
        unlocked: false
    },
    cursed: {
        id: 'cursed',
        name: 'Cursed Zone',
        icon: '💀',
        cost: 80,
        description: 'Heroes lose 5 HP per turn here.',
        effect: 'damageOverTime',
        damage: 5,
        unlockRequirement: { kills: 35 },
        unlocked: false
    }
};

// Permanent upgrades
const UPGRADES = {
    trapDamage1: {
        id: 'trapDamage1',
        name: 'Sharper Blades I',
        icon: '⚔️',
        cost: 100,
        description: '+10% trap damage',
        effect: 'trapDamageMultiplier',
        value: 0.1,
        unlocked: true,
        purchased: false
    },
    trapDamage2: {
        id: 'trapDamage2',
        name: 'Sharper Blades II',
        icon: '⚔️⚔️',
        cost: 250,
        description: '+20% trap damage',
        effect: 'trapDamageMultiplier',
        value: 0.2,
        requires: 'trapDamage1',
        unlocked: true,
        purchased: false
    },
    goldBonus1: {
        id: 'goldBonus1',
        name: 'Treasure Hunter I',
        icon: '💰',
        cost: 150,
        description: '+15% gold from kills',
        effect: 'goldMultiplier',
        value: 0.15,
        unlocked: true,
        purchased: false
    },
    goldBonus2: {
        id: 'goldBonus2',
        name: 'Treasure Hunter II',
        icon: '💰💰',
        cost: 300,
        description: '+30% gold from kills',
        effect: 'goldMultiplier',
        value: 0.3,
        requires: 'goldBonus1',
        unlocked: true,
        purchased: false
    },
    monsterHealth: {
        id: 'monsterHealth',
        name: 'Necromancy',
        icon: '👻',
        cost: 200,
        description: 'Monsters have +25% HP',
        effect: 'monsterHealthMultiplier',
        value: 0.25,
        unlockRequirement: { kills: 15 },
        unlocked: false,
        purchased: false
    },
    monsterDamage: {
        id: 'monsterDamage',
        name: 'Dark Blessing',
        icon: '😈',
        cost: 200,
        description: 'Monsters deal +25% damage',
        effect: 'monsterDamageMultiplier',
        value: 0.25,
        unlockRequirement: { kills: 15 },
        unlocked: false,
        purchased: false
    },
    comboBonus: {
        id: 'comboBonus',
        name: 'Chain Reaction',
        icon: '💥',
        cost: 350,
        description: 'Trap combos give +50% gold',
        effect: 'comboMultiplier',
        value: 0.5,
        unlockRequirement: { kills: 25 },
        unlocked: false,
        purchased: false
    },
    baitPower: {
        id: 'baitPower',
        name: 'Temptation Master',
        icon: '🎣',
        cost: 180,
        description: 'Bait is 50% more effective',
        effect: 'baitMultiplier',
        value: 0.5,
        unlockRequirement: { kills: 18 },
        unlocked: false,
        purchased: false
    }
};

// Adventurer types
const ADVENTURER_TYPES = {
    warrior: {
        name: 'Warrior',
        icon: '⚔️',
        hp: 100,
        damage: 20,
        goldValue: 15,
        color: '#ef4444',
        ability: 'tank',
        abilityChance: 0.3,
        abilityDesc: 'Takes reduced damage from traps'
    },
    mage: {
        name: 'Mage',
        icon: '🔮',
        hp: 60,
        damage: 35,
        goldValue: 25,
        color: '#8b5cf6',
        ability: 'aoe',
        abilityChance: 0.2,
        abilityDesc: 'Can damage multiple monsters at once'
    },
    rogue: {
        name: 'Rogue',
        icon: '🗡️',
        hp: 70,
        damage: 25,
        goldValue: 20,
        color: '#10b981',
        ability: 'disarm',
        abilityChance: 0.4,
        abilityDesc: 'Can disarm traps before triggering them'
    },
    cleric: {
        name: 'Cleric',
        icon: '✝️',
        hp: 80,
        damage: 15,
        healAmount: 20,
        goldValue: 30,
        color: '#fbbf24',
        ability: 'heal',
        abilityChance: 0.5,
        abilityDesc: 'Heals after killing monsters'
    },
    paladin: {
        name: 'Paladin',
        icon: '🛡️',
        hp: 120,
        damage: 30,
        goldValue: 40,
        color: '#f59e0b',
        ability: 'smite',
        abilityChance: 0.3,
        abilityDesc: 'Deals bonus damage to undead monsters'
    }
};

// Humorous death messages
const DEATH_MESSAGES = [
    "{name} the {class} met their end. They had dreams, you know.",
    "{name} died to a {killer}. How embarrassing.",
    "{name}'s last words: 'This dungeon looks easy...'",
    "{name} should have stayed home. Now they're plant food.",
    "{name} the {class} joins the body count. Family notified.",
    "RIP {name}. Killed by {killer}. What a way to go.",
    "{name} thought they were special. They were wrong.",
    "{name}'s adventure ended abruptly at the hands of {killer}.",
    "{name} the {class}: Born brave, died screaming.",
    "{name} won't be coming home for dinner tonight.",
];

// Adventurer backstories
const BACKSTORIES = [
    "Had 3 kids and a loving spouse",
    "Was saving up for a farm",
    "Only needed one more quest to retire",
    "Was the sole provider for their family",
    "Had just gotten engaged last week",
    "Owed money to a loan shark",
    "Was running from a dark past",
    "Wanted to prove themselves to their father",
    "Was actually a terrible person, so...",
    "Had a sick mother who needed medicine"
];

// First names
const FIRST_NAMES = [
    'Bob', 'Alice', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah',
    'Igor', 'Julia', 'Kevin', 'Luna', 'Marcus', 'Nina', 'Oliver', 'Petra',
    'Quinn', 'Rosa', 'Steve', 'Tara', 'Uma', 'Victor', 'Wendy', 'Xavier',
    'Yara', 'Zack', 'Arthur', 'Bella', 'Carl', 'Dora', 'Erik', 'Grace'
];

// Legendary heroes (appear after certain milestones)
const LEGENDARY_HEROES = {
    slayer: {
        name: 'The Dragon Slayer',
        icon: '👑',
        hp: 300,
        damage: 50,
        goldValue: 200,
        requiredKills: 50,
        message: '⚠️ LEGENDARY HERO APPROACHES: The Dragon Slayer has heard of your dungeon!'
    },
    necromancer: {
        name: 'Dark Necromancer',
        icon: '🧙',
        hp: 200,
        damage: 70,
        goldValue: 250,
        requiredKills: 75,
        message: '⚠️ LEGENDARY HERO APPROACHES: A powerful Necromancer seeks vengeance!'
    },
    champion: {
        name: 'Divine Champion',
        icon: '✨',
        hp: 400,
        damage: 60,
        goldValue: 300,
        requiredKills: 100,
        message: '⚠️ LEGENDARY HERO APPROACHES: The Divine Champion has come to end your reign!'
    }
};
