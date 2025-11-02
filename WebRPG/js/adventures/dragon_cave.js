/**
 * ADVENTURE 2: THE DRAGON'S LAIR
 * A tale of greed, honor, and the price of power
 */

class DragonState {
    constructor() {
        this.dragon_knowledge = 0;
        this.greed_level = 0;
        this.dwarf_ally = false;
        this.dragon_respect = 0;
        this.secret_passage_found = false;
        this.ancient_pact_known = false;
        this.cursed_gold_taken = 0;
        this.kobold_tribe_status = "hostile"; // "hostile", "neutral", "allied"
        this.sacrifice_made = false;
        this.dragon_weakness_known = false;
        this.treasure_maps_found = 0;
        this.ancient_artifacts_collected = [];
        this.wyrm_slayer_path = false;
        this.merchant_saved = false;
        this.dark_ritual_witnessed = false;
        this.lava_drake_tamed = false;
        this.dwarven_ballad_learned = false;
        this.fire_resistance_gained = false;
    }
}

let dragonState = new DragonState();

/**
 * Main entry point for Dragon Cave adventure
 */
async function startDragonCaveAdventure() {
    dragonState = new DragonState();
    
    // Save adventure start
    gameState.currentAdventure = {
        id: 'dragon_cave',
        name: "The Dragon's Lair",
        state: dragonState,
        currentScene: 'prologue'
    };
    gameState.adventureState = dragonState;
    saveGameProgress();
    
    await prologue_dragon();
}

/**
 * Prologue - The Dragon's Mountain
 */
async function prologue_dragon() {
    addStoryText(`
═══════════════════════════════════════════════════════════════════
          🐉 THE DRAGON'S LAIR - A Legend Awakens 🐉
═══════════════════════════════════════════════════════════════════
    `);
    
    await typeText(`For three hundred years, the dragon Scalefire has slumbered
atop the Ember Mountain, guarding a hoard beyond imagining.

But recently, tremors shake the land. Smoke rises once more.
The dragon stirs. And with it, old debts awaken.

A desperate dwarven clan begs for help. Their ancestor made
a pact with Scalefire centuries ago, sealed with a sacred gem.
Now the gem has been stolen by kobolds, and the dragon's wrath
will fall upon the innocent dwarves unless it's returned.

You've been hired to either:
  • Retrieve the gem and appease the dragon
  • Slay the dragon and claim the hoard
  • Find another solution...

The choice... will be yours to make.`);

    if (gameState.currentCharacter.level < 3) {
        addStoryText(`\n⚠️  WARNING: This adventure is recommended for level 3+`, false);
        addStoryText(`Your current level: ${gameState.currentCharacter.level}`, false);
    }
    
    updateQuestLog('Hired to resolve dragon crisis');
    updateQuestLog('Multiple paths available');
    
    await showContinue();
    await meet_thorgar();
}

/**
 * Meet Thorgar Ironforge
 */
async function meet_thorgar() {
    addStoryText('\n--- ⚒️  THORGAR IRONFORGE ---\n');
    
    await typeText(`A grizzled dwarf in battle-scarred armor waits at the trailhead.

'Ah, you came,' he nods. 'I am Thorgar Ironforge, last of my line.'

'My ancestor, Thrain, made a pact with the dragon three centuries
ago. In exchange for mining rights, we gifted the dragon a sacred
gem - the Heart of the Mountain. It was to symbolize our bond.'

'But kobolds raided our vault and stole it! The dragon will think
WE broke the pact! Unless that gem returns to Scalefire's hoard,
my entire clan will burn!'`);

    const choice = await showChoices([
        { text: "I'll retrieve the gem and return it to the dragon", value: 'retrieve' },
        { text: "Why not just slay the dragon? No pact to honor", value: 'slay' },
        { text: 'Tell me more about this dragon first', value: 'info' },
        { text: 'Your payment better be worth the risk', value: 'payment' }
    ]);
    
    if (choice === 'retrieve') {
        await typeText(`\nThorgar's eyes light up. 'Bless you! You're honorable.
I'll do what I can to help.'

He hands you a map. 'This shows the kobold nest - and a
secret passage into the dragon's lair. Use it wisely.'`);
        
        addGold(gameState.currentCharacter, 50);
        dragonState.dwarf_ally = true;
        dragonState.secret_passage_found = true;
        dragonState.dragon_respect += 1;
        updateQuestLog("Allied with Thorgar - Received map");
        
    } else if (choice === 'slay') {
        await typeText(`\nThorgar's face darkens. 'Slay Scalefire? That's... bold.
But know this: the dragon has lived for millennia. Many have
tried to claim that hoard. None succeeded.'

He sighs. 'If you're determined, I won't stop you. But I
cannot aid in dragonslaying. It would dishonor my ancestors.'`);
        
        dragonState.greed_level += 2;
        dragonState.wyrm_slayer_path = true;
        updateQuestLog("Chosen the dragon slayer path");
        
    } else if (choice === 'info') {
        await typeText(`\nThorgar settles in. 'Scalefire the Eternal, we call her.
A red dragon of immense power and cunning. She's not just
strong - she's SMART. Outwitted kings and archmages alike.'

'She values three things: her hoard, her pride, and...
strangely... honor. She respects those who keep their word.'`);
        
        dragonState.dragon_knowledge += 1;
        dragonState.ancient_pact_known = true;
        addExperience(gameState.currentCharacter, 25);
        updateQuestLog("Learned about Scalefire's nature");
        
    } else {
        await typeText(`\nThorgar nods. 'Fair enough. I offer 200 gold, plus you may
keep whatever treasure you find that ISN'T the cursed dragon
hoard. Touch that, and... well, you'll see.'`);
        
        dragonState.greed_level += 1;
    }
    
    await showContinue();
    await mountain_base_dragon();
}

/**
 * Act 1: Mountain Base
 */
async function mountain_base_dragon() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('              ACT I: THE MOUNTAIN\'S SHADOW');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You stand at the base of Ember Mountain. The path ahead
is treacherous - ancient stairs carved into living rock.

Heat radiates from above. The dragon's lair awaits.`);

    await showContinue();
    await kobold_scouts_dragon();
}

/**
 * Kobold Scouts Encounter
 */
async function kobold_scouts_dragon() {
    addStoryText('\n--- 🦎 KOBOLD TERRITORY ---\n');
    
    await typeText(`You hear chittering ahead. Two kobold scouts spot you!

'Intruder! Intruder in dragon's mountain!' they screech.`);

    if (dragonState.secret_passage_found) {
        await typeText(`\nUsing Thorgar's map, you quickly hide in a side passage.
The kobolds run past, none the wiser.`);
        
        updateQuestLog('Avoided kobold scouts');
        await showContinue();
        await ancient_warning_dragon();
        return;
    }
    
    const choice = await showChoices([
        { text: 'Attack them quickly before they alert others', value: 'attack' },
        { text: 'Try to communicate (Kobolds speak broken Common)', value: 'talk' },
        { text: 'Offer them gold to let you pass', value: 'bribe' },
        { text: 'Run deeper into the cave', value: 'run' }
    ]);
    
    if (choice === 'attack') {
        const scouts = [
            createEnemy('Kobold Scout', 30, 0, 1, 'goblin'),
            createEnemy('Kobold Scout', 30, 0, 1, 'goblin')
        ];
        
        const combat = new Combat(gameState.currentCharacter, scouts);
        const result = await combat.start();
        
        if (result === 'victory') {
            addGold(gameState.currentCharacter, 25);
            addExperience(gameState.currentCharacter, 35);
            updateQuestLog('Defeated kobold scouts');
        } else if (result === 'fled') {
            dragonState.kobold_tribe_status = "hostile";
        }
        
    } else if (choice === 'talk') {
        const charisma = statCheck(gameState.currentCharacter, 'charisma', 11);
        
        if (charisma) {
            await typeText(`\n[SUCCESS] The kobolds listen!

'You... not smell like dragon hunter. What you want?'

You explain about the gem. The kobolds confer in their
chittering language.

'We take gem to chief. Maybe chief talk to you. Maybe not kill.'`);
            
            dragonState.kobold_tribe_status = "neutral";
            addExperience(gameState.currentCharacter, 40);
            updateQuestLog('Negotiated with kobolds');
        } else {
            await typeText(`\n[FAILED] They don't understand and attack!`);
            await kobold_scouts_dragon(); // Restart with attack
            return;
        }
        
    } else if (choice === 'bribe') {
        if (gameState.currentCharacter.gold >= 30) {
            await typeText(`\nYou toss them 30 gold. Their eyes light up!

'Shiny! You pass, you pass!'`);
            
            addGold(gameState.currentCharacter, -30);
            dragonState.kobold_tribe_status = "neutral";
            updateQuestLog('Bribed kobold scouts');
        } else {
            await typeText(`\nYou don't have enough gold! They attack!`);
            // Force combat
            return await kobold_scouts_dragon();
        }
        
    } else {
        const dex = statCheck(gameState.currentCharacter, 'dexterity', 12);
        
        if (dex) {
            await typeText(`\n[SUCCESS] You dash away and lose them in the tunnels!`);
            updateQuestLog('Escaped kobold scouts');
        } else {
            await typeText(`\n[FAILED] They catch up and attack!`);
            return await kobold_scouts_dragon();
        }
    }
    
    await showContinue();
    await ancient_warning_dragon();
}

/**
 * Ancient Warning Inscription
 */
async function ancient_warning_dragon() {
    addStoryText('\n--- 📜 THE ANCIENT INSCRIPTION ---\n');
    
    await typeText(`You find a stone tablet covered in ancient runes.
Near it lie the remains of an adventurer, long dead.`);

    const canRead = gameState.currentCharacter.intelligence >= 12 || 
                   dragonState.dwarf_ally;
    
    if (canRead) {
        await typeText(`\nYou can read the inscription:

'Beware, seeker of gold! Scalefire's hoard is cursed!
 Take but one coin, and madness shall follow.
 The dragon's blessing is needed, or doom awaits.'

'Three have earned the dragon's respect in ages past:
 The Honest Thief, who returned what was stolen.
 The Brave Fool, who challenged with honor.
 The Wise Sage, who offered knowledge, not steel.'`);
        
        dragonState.dragon_knowledge += 2;
        addExperience(gameState.currentCharacter, 40);
        updateQuestLog('Learned about the cursed hoard');
    } else {
        await typeText(`\nThe runes are indecipherable. You find nothing useful.`);
    }
    
    await typeText(`\nSearching the skeleton, you find a Greater Health Potion 
and a Dragon Scale Shield!`);
    
    addExperience(gameState.currentCharacter, 25);
    
    await showContinue();
    
    // Random encounter: Trapped Merchant
    if (rollDice(1, 100) <= 60) {
        await trapped_merchant_dragon();
    } else {
        await cave_depths_dragon();
    }
}

/**
 * Trapped Merchant Encounter
 */
async function trapped_merchant_dragon() {
    addStoryText('\n--- 🎒 THE TRAPPED MERCHANT ---\n');
    
    await typeText(`You hear a cry for help! A merchant is stuck in a pit trap,
his cart overturned nearby.

'Please! I've been here for hours! Those blasted kobolds 
set this trap!'`);

    const choice = await showChoices([
        { text: 'Help him out of the pit (Strength check)', value: 'help' },
        { text: 'Investigate the cart first - could be valuable', value: 'loot' },
        { text: "Ask what he's doing in dragon territory", value: 'question' },
        { text: 'Leave him - you have more important matters', value: 'leave' }
    ]);
    
    if (choice === 'help') {
        const strength = statCheck(gameState.currentCharacter, 'strength', 11);
        
        if (strength) {
            await typeText(`\n[SUCCESS] You pull the merchant free!

'Thank you! Here, take this - you've earned it!'

He gives you a Fire Resistance Potion and 50 gold.`);
            
            addGold(gameState.currentCharacter, 50);
            dragonState.merchant_saved = true;
            dragonState.fire_resistance_gained = true;
            dragonState.dragon_respect += 1;
            updateQuestLog('Saved the merchant');
        } else {
            await typeText(`\n[FAILED] You can't quite pull him up. You'll need help.`);
        }
        
    } else if (choice === 'loot') {
        await typeText(`\nSearching the cart, you find valuable goods!

You take healing potions and Dragon's Bane Arrows.

The merchant cries out: 'Hey! That's MY stuff!'
He looks hurt and betrayed.`);
        
        dragonState.greed_level += 2;
        updateQuestLog('Looted merchant cart');
        
    } else if (choice === 'question') {
        await typeText(`\n'I'm a trader in rare goods,' he explains. 'I heard
rumors of kobolds selling dragon scales cheap.
Thought I could make a fortune... bad idea.'

'But I did learn something - the kobolds worship the dragon!
They bring it offerings. If you have something valuable,
maybe you could use that...'`);
        
        dragonState.dragon_knowledge += 1;
        addExperience(gameState.currentCharacter, 25);
        
    } else {
        await typeText(`\nYou walk past, ignoring his pleas.

His cries fade behind you...`);
        
        dragonState.greed_level += 1;
    }
    
    await showContinue();
    await cave_depths_dragon();
}

/**
 * Act 2: Cave Depths
 */
async function cave_depths_dragon() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                ACT II: THE CAVE DEPTHS');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`The tunnels grow hotter. You're getting closer.

The air shimmers with heat. Sulfur stings your nostrils.`);

    await showContinue();
    await lava_chasm_dragon();
}

/**
 * Lava Chasm
 */
async function lava_chasm_dragon() {
    addStoryText('\n--- 🌋 THE LAVA CHASM ---\n');
    
    await typeText(`A river of molten lava blocks your path!

The heat is intense. You spot three possible ways across:`);

    const choice = await showChoices([
        { text: 'Jump across unstable rocks (Dexterity check)', value: 'jump' },
        { text: 'Climb along the wall (Strength check)', value: 'climb' },
        { text: 'Use magic to create an ice bridge (40 Mana)', value: 'magic' },
        { text: 'Look for secret passage (if you have map)', value: 'secret' }
    ]);
    
    if (choice === 'jump') {
        const dex = statCheck(gameState.currentCharacter, 'dexterity', 14);
        
        if (dex) {
            await typeText(`\n[SUCCESS] You leap gracefully across the rocks!`);
            addExperience(gameState.currentCharacter, 30);
        } else {
            await typeText(`\n[FAILED] Your foot slips! You fall into the lava!`);
            takeDamage(gameState.currentCharacter, 25);
            updateCharacterDisplay();
        }
        
    } else if (choice === 'climb') {
        const str = statCheck(gameState.currentCharacter, 'strength', 13);
        
        if (str) {
            await typeText(`\n[SUCCESS] You climb across safely!`);
            addExperience(gameState.currentCharacter, 30);
        } else {
            await typeText(`\n[FAILED] You slip and get burned!`);
            takeDamage(gameState.currentCharacter, 20);
            updateCharacterDisplay();
        }
        
    } else if (choice === 'magic') {
        if (gameState.currentCharacter.currentMP >= 40) {
            await typeText(`\nYou cast a spell, creating a bridge of ice!
It hisses and steams but holds long enough to cross.`);
            
            gameState.currentCharacter.currentMP -= 40;
            updateCharacterDisplay();
            addExperience(gameState.currentCharacter, 40);
        } else {
            await typeText(`\nYou don't have enough mana!`);
            return await lava_chasm_dragon();
        }
        
    } else {
        if (dragonState.secret_passage_found) {
            await typeText(`\nUsing the map, you find a hidden tunnel that bypasses
the lava completely!`);
            addExperience(gameState.currentCharacter, 50);
        } else {
            await typeText(`\nYou don't have a map showing secret passages.`);
            return await lava_chasm_dragon();
        }
    }
    
    await showContinue();
    await dragon_guardians();
}

/**
 * Dragon's Guardians
 */
async function dragon_guardians() {
    addStoryText('\n--- 🔥 DRAGON\'S GUARDIANS ---\n');
    
    await typeText(`Fire elementals materialize from the volcanic heat!

The dragon's magic sustains them!`);

    const enemies = [
        createEnemy('Fire Elemental', 65, 30, 2, 'monster'),
        createEnemy('Fire Elemental', 65, 30, 2, 'monster')
    ];
    
    const combat = new Combat(gameState.currentCharacter, enemies);
    const result = await combat.start();
    
    if (result === 'victory') {
        addGold(gameState.currentCharacter, 55);
        addExperience(gameState.currentCharacter, 70);
        updateQuestLog('Defeated fire elementals');
        
        await showContinue();
        await inner_sanctum_dragon();
    } else if (result === 'fled') {
        await typeText(`\nYou flee back through the tunnels...`);
        await showContinue();
        await cave_depths_dragon();
    }
}

/**
 * Act 3: Inner Sanctum
 */
async function inner_sanctum_dragon() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('               ACT III: THE INNER SANCTUM');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You enter a MASSIVE cavern. The ceiling disappears into darkness.

And there... MOUNTAINS of gold, jewels, artifacts!

The legendary dragon hoard!`);

    await showContinue();
    await hoard_temptation_dragon();
}

/**
 * The Hoard Temptation
 */
async function hoard_temptation_dragon() {
    addStoryText('\n--- 💰 THE HOARD ---\n');
    
    await typeText(`Wealth beyond measure surrounds you. You could take just
a little... the dragon wouldn't even notice...

What do you do?`);

    const choice = await showChoices([
        { text: 'Take a handful of gems (worth ~100 gold)', value: 'handful' },
        { text: 'Take a specific magical item you spot', value: 'item' },
        { text: 'Fill your pockets! (worth ~300 gold)', value: 'fill' },
        { text: "Don't touch anything - it's cursed", value: 'resist' }
    ]);
    
    if (choice === 'handful') {
        await typeText(`\nYou take a small handful of gems...

You feel a chill. Something's wrong...`);
        
        addGold(gameState.currentCharacter, 100);
        dragonState.cursed_gold_taken += 100;
        dragonState.greed_level += 2;
        updateQuestLog('Took cursed treasure (100g)');
        
    } else if (choice === 'item') {
        await typeText(`\nYou spot an ornate sword - the Flamekiss Spear!

You take it carefully...`);
        
        dragonState.cursed_gold_taken += 50;
        dragonState.greed_level += 1;
        updateQuestLog('Took Flamekiss Spear');
        
    } else if (choice === 'fill') {
        await typeText(`\nYou stuff your pockets with gold and gems!

A voice like thunder rumbles: 'THIEF...'`);
        
        addGold(gameState.currentCharacter, 300);
        dragonState.cursed_gold_taken += 300;
        dragonState.greed_level += 5;
        dragonState.dragon_respect -= 3;
        updateQuestLog('Took massive cursed treasure (300g)');
        
    } else {
        await typeText(`\nYou resist the temptation. You know better.

The curse won't claim you.`);
        
        dragonState.dragon_respect += 2;
        addExperience(gameState.currentCharacter, 75);
        updateQuestLog('Resisted greed - No curse!');
    }
    
    await showContinue();
    await dragon_awakens();
}

/**
 * The Dragon Awakens
 */
async function dragon_awakens() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('              🐉 SCALEFIRE THE ETERNAL 🐉');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`A sound like rolling thunder. The hoard SHIFTS.

Something enormous moves beneath the gold...

'I... smell... mortal flesh...' a voice like grinding stone says.

The golden mountain ERUPTS! A massive red dragon emerges,
scales gleaming like molten copper, eyes like burning suns!

Scalefire is MAGNIFICENT and TERRIFYING!`);

    await showContinue();
    
    // Check for different ending paths
    if (dragonState.cursed_gold_taken >= 200) {
        await cursed_battle_dragon();
    } else if (dragonState.dragon_knowledge >= 2 && dragonState.greed_level <= 1) {
        await diplomatic_path_dragon();
    } else {
        await final_choice_dragon();
    }
}

/**
 * Final Choice Before Dragon
 */
async function final_choice_dragon() {
    await typeText(`\nScalefire regards you with ancient eyes.

'Another mortal seeks my hoard. How... predictable.
Speak quickly, before I decide you're not worth my time.'`);

    const choices = [
        { text: 'Challenge the dragon to honorable combat', value: 'challenge' },
        { text: 'Explain about the stolen gem and the pact', value: 'explain' },
        { text: 'Offer tribute and ask for mercy', value: 'tribute' },
        { text: 'Try to flee', value: 'flee' }
    ];
    
    const choice = await showChoices(choices);
    
    if (choice === 'challenge') {
        await typeText(`\nYou draw your weapon. 'I challenge you, Scalefire!'

The dragon's eyes narrow. 'Bold. Very well. Let us see
if you have the strength to back those words.'`);
        
        dragonState.dragon_respect += 1;
        await epic_dragon_battle();
        
    } else if (choice === 'explain') {
        if (dragonState.ancient_pact_known) {
            await diplomatic_path_dragon();
        } else {
            await typeText(`\nThe dragon listens, then snorts flames.

'You speak of pacts but know nothing of honor.
If you wish to live, you must prove yourself worthy.'`);
            
            await epic_dragon_battle();
        }
        
    } else if (choice === 'tribute') {
        await typeText(`\nScalefire laughs, a sound like an avalanche.

'Tribute? You have NOTHING I want, mortal.
Except perhaps... your life.'`);
        
        dragonState.dragon_respect -= 1;
        await epic_dragon_battle();
        
    } else {
        await typeText(`\nYou turn to run!

'COWARD!' the dragon roars. Flames engulf you!`);
        
        takeDamage(gameState.currentCharacter, 50);
        updateCharacterDisplay();
        
        await typeText(`\nYou barely escape with your life...`);
        await adventure_failed_dragon();
    }
}

/**
 * Diplomatic Path
 */
async function diplomatic_path_dragon() {
    addStoryText('\n--- 🕊️  THE DIPLOMATIC PATH ---\n');
    
    await typeText(`You speak calmly of the ancient pact, of honor,
and of the stolen gem.

Scalefire's eyes gleam with interest.

'You... know of the pact? And you seek to HONOR it?
How... refreshing.'

The dragon settles, though still imposing.

'Very well. Return the Heart of the Mountain to me,
and the dwarves will be spared. Do this, and you will
have earned my respect.'`);

    const choice = await showChoices([
        { text: 'Accept the quest to retrieve the gem', value: 'accept' },
        { text: 'Ask for a reward for completing this task', value: 'reward' },
        { text: 'Attack while the dragon is calm', value: 'betray' }
    ]);
    
    if (choice === 'accept') {
        await typeText(`\n'Wise choice,' Scalefire nods. 'Bring me the gem,
and I shall grant you a boon from my hoard - WITHOUT the curse.'`);
        
        dragonState.dragon_respect += 3;
        await diplomatic_victory_dragon();
        
    } else if (choice === 'reward') {
        await typeText(`\nScalefire's eyes narrow. 'Greedy, are we?
Very well. 200 gold for your service. No more.'`);
        
        addGold(gameState.currentCharacter, 200);
        dragonState.dragon_respect += 1;
        await diplomatic_victory_dragon();
        
    } else {
        await typeText(`\nYou attack while the dragon is vulnerable!

'TREACHERY!' Scalefire roars. 'You will DIE for this!'`);
        
        dragonState.dragon_respect -= 5;
        await epic_dragon_battle();
    }
}

/**
 * Epic Dragon Battle
 */
async function epic_dragon_battle() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('           ⚔️  BATTLE WITH SCALEFIRE ⚔️');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Scalefire attacks! This is it!

The legendary battle begins!`);

    const boss = createEnemy('Scalefire the Eternal', 150, 80, 5, 'dragon');
    boss.attacks = [
        { name: 'Inferno Breath', damage: 35, mpCost: 20 },
        { name: 'Tail Sweep', damage: 28, mpCost: 0 },
        { name: "Dragon's Roar", damage: 20, mpCost: 15 },
        { name: 'Crushing Bite', damage: 40, mpCost: 0 }
    ];
    
    // Adjust difficulty based on player choices
    if (dragonState.dragon_respect > 0) {
        boss.currentHP = Math.floor(boss.maxHP * 0.9);
    }
    
    if (dragonState.fire_resistance_gained) {
        await typeText(`\nYour fire resistance protects you from the worst of the flames!`);
    }
    
    const combat = new Combat(gameState.currentCharacter, [boss]);
    const result = await combat.start();
    
    if (result === 'victory') {
        await dragon_victory();
    } else if (result === 'fled') {
        await typeText(`\nYou barely escape with your life...`);
        await adventure_failed_dragon();
    } else {
        await adventure_failed_dragon();
    }
}

/**
 * Cursed Battle
 */
async function cursed_battle_dragon() {
    addStoryText('\n--- 💀 THE CURSED PATH ---\n');
    
    await typeText(`Scalefire ROARS! 'YOU DARE STEAL FROM MY HOARD?!'

'FOOL! The curse will be your undoing!'

⚠️  The curse weakens you! Your health drains...`);

    takeDamage(gameState.currentCharacter, 30);
    updateCharacterDisplay();
    
    await showContinue();
    await epic_dragon_battle();
}

/**
 * Dragon Victory
 */
async function dragon_victory() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('            🎉 VICTORY OVER THE DRAGON! 🎉');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Scalefire falls! The mighty dragon's reign ends!

With her dying breath: 'You... are worthy... take... my hoard...'
'But beware... the curse... is real...'

The dragon's body dissolves into golden light.`);

    addExperience(gameState.currentCharacter, 300);
    
    if (dragonState.cursed_gold_taken > 0) {
        await typeText(`\nBut the curse still lingers on the gold you took...`);
        addGold(gameState.currentCharacter, 300);
    } else {
        await typeText(`\nThe hoard is yours, and it's no longer cursed!`);
        addGold(gameState.currentCharacter, 500);
    }
    
    updateQuestLog('VICTORY: Slayed Scalefire!');
    await adventure_complete_dragon();
}

/**
 * Diplomatic Victory
 */
async function diplomatic_victory_dragon() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('          🎉 DIPLOMATIC VICTORY! 🎉');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Scalefire is impressed by your honor and wisdom.

'You have done well, mortal. The dwarves are spared,
and you have earned a place in my memory.'

The dragon grants you treasure from her hoard - uncursed!

'Few mortals have earned my respect. You are one of them.
Go now, and tell the tale of Scalefire the Eternal.'`);

    addGold(gameState.currentCharacter, 400);
    addExperience(gameState.currentCharacter, 250);
    dragonState.dragon_respect += 5;
    
    updateQuestLog('PERFECT ENDING: Peace with Scalefire!');
    await adventure_complete_dragon();
}

/**
 * Adventure Failed
 */
async function adventure_failed_dragon() {
    addStoryText('\n--- 💀 RETREAT ---\n');
    
    await typeText(`You flee the dragon's lair, wounded and defeated.

The dragon's laughter echoes behind you.

Perhaps... you'll return stronger next time.`);

    heal(gameState.currentCharacter, gameState.currentCharacter.maxHP / 2);
    updateCharacterDisplay();
    
    updateQuestLog('Fled from the dragon');
    
    await showChoices([
        { text: 'Return to Adventure Select', value: 'return' }
    ]).then(() => {
        showScreen('adventureSelect');
        loadAdventureList();
    });
}

/**
 * Adventure Complete
 */
async function adventure_complete_dragon() {
    addStoryText('\n\n🏆 THE DRAGON\'S LAIR - QUEST COMPLETE! 🏆\n');
    
    await typeText(`
═══════════════════════════════════════════════════════════════════
                   ADVENTURE STATISTICS
═══════════════════════════════════════════════════════════════════

Dragon Respect: ${dragonState.dragon_respect}/10
Greed Level: ${dragonState.greed_level}
Dragon Knowledge: ${dragonState.dragon_knowledge}
Kobold Relations: ${dragonState.kobold_tribe_status}
Cursed Gold Taken: ${dragonState.cursed_gold_taken}

Final Level: ${calculateLevel(gameState.currentCharacter.experience)}
Total Gold: ${gameState.currentCharacter.gold}

The Dragon's Lair adventure is complete!
═══════════════════════════════════════════════════════════════════
    `);
    
    // Mark complete
    if (!gameState.currentCharacter.completedAdventures.includes("The Dragon's Lair")) {
        gameState.currentCharacter.completedAdventures.push("The Dragon's Lair");
    }
    
    // Clear current adventure
    gameState.currentAdventure = null;
    gameState.adventureState = null;
    saveGameData();
    
    await showChoices([
        { text: 'Return to Adventure Select', value: 'return' },
        { text: 'View Character Sheet', value: 'sheet' }
    ]).then(choice => {
        if (choice === 'return') {
            showScreen('adventureSelect');
            loadAdventureList();
        } else {
            showCharacterSheet();
        }
    });
}

console.log('✅ dragon_cave.js loaded');
