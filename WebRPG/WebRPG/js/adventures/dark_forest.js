/**
 * ADVENTURE 1: THE DARK FOREST
 * A mysterious adventure into the corrupted Shadowfen Forest
 */

class ForestState {
    constructor() {
        this.hasWoodenShield = false;
        this.hasMoonStone = false;
        this.hasPurifiedWater = false;
        this.hasHermitBlessing = false;
        this.hasOldKey = false;
        this.savedTraveler = false;
        this.foundGuardianSpirit = false;
        this.corruption_level = 0;
        this.purity_level = 0;
        this.elara_relation = 0;
        this.ancientTreesExamined = false;
    }
}

let forestState = new ForestState();

/**
 * Main entry point for Dark Forest adventure
 */
async function startDarkForestAdventure() {
    forestState = new ForestState();
    
    // Save adventure start
    gameState.currentAdventure = {
        id: 'dark_forest',
        name: 'The Dark Forest',
        state: forestState,
        currentScene: 'prologue'
    };
    gameState.adventureState = forestState;
    saveGameProgress();
    
    await prologue();
}

/**
 * Helper to update current scene and save progress
 */
function updateScene(sceneName) {
    if (gameState.currentAdventure) {
        gameState.currentAdventure.currentScene = sceneName;
        gameState.currentAdventure.state = forestState;
        saveGameProgress();
    }
}

/**
 * Resume Dark Forest from saved checkpoint
 */
async function resumeDarkForest(sceneName) {
    addStoryText(`
═══════════════════════════════════════════════════════════════════
               🌲 THE DARK FOREST 🌲
═══════════════════════════════════════════════════════════════════
    `);
    
    await typeText(`\nResuming your adventure from checkpoint: ${sceneName.replace(/_/g, ' ').toUpperCase()}\n`);
    await showContinue();
    
    // Jump to the correct scene based on saved state
    const sceneMap = {
        'prologue': prologue,
        'act1_start': act1_start,
        'wounded_traveler': wounded_traveler,
        'corrupted_clearing': corrupted_clearing,
        'wolf_pack': wolf_pack_encounter,
        'hermit_hut': hermit_hut,
        'act2_ruins': act2_ancient_ruins,
        'ruins_combat': ruins_combat,
        'elara_encounter': elara_encounter,
        'boss_battle': boss_battle,
        'peaceful_resolution': peaceful_resolution
    };
    
    const sceneFunction = sceneMap[sceneName];
    if (sceneFunction) {
        await sceneFunction();
    } else {
        // Default to prologue if scene not found
        await prologue();
    }
}

/**
 * Prologue - Setting the scene
 */
async function prologue() {
    addStoryText(`
═══════════════════════════════════════════════════════════════════
               🌲 THE DARK FOREST 🌲
═══════════════════════════════════════════════════════════════════
    `);
    
    await typeText(`The village elders speak in hushed tones of the Shadowfen Forest. 
Once a place of great beauty and ancient magic, it has become twisted 
and dangerous. Dark forces stir within its depths.

Strange creatures have been spotted near the village, and travelers 
who venture too close rarely return. The forest seems to be... growing.

You stand at the edge of the woods, the morning mist swirling around 
gnarled trees. Somewhere deep within lies the source of the corruption.

The elders have offered you a reward of 100 gold pieces to investigate 
the forest and discover what darkness has taken hold. They warn you 
to be careful - the forest is said to corrupt those who linger too long.
    `);
    
    updateQuestLog('Accepted quest: Investigate Shadowfen Forest');
    updateQuestLog('Warning: The forest corrupts those who linger');
    
    await showContinue();
    await act1_start();
}

/**
 * ACT 1: ENTERING THE FOREST
 */
async function act1_start() {
    updateScene('act1_start');
    
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    ACT I: INTO THE SHADOWS');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You step into the forest, and immediately the temperature drops. 
The canopy above is so thick that only scattered beams of sunlight 
penetrate the gloom.

Strange sounds echo through the trees - whispers, rustling, and 
something that might be laughter. The path ahead splits in two directions.
    `);
    
    const choice = await showChoices([
        { text: 'Take the LEFT path - it looks more traveled', value: 'left' },
        { text: 'Take the RIGHT path - you hear water flowing', value: 'right' },
        { text: 'Examine the area more carefully first', value: 'examine' }
    ]);
    
    if (choice === 'examine') {
        await examine_entrance();
    } else if (choice === 'left') {
        await wounded_traveler();
    } else {
        await corrupted_clearing();
    }
}

/**
 * Examine the entrance area
 */
async function examine_entrance() {
    await typeText(`You carefully examine the area around the forest entrance. 
The left path has recent footprints - someone passed through here not 
long ago. The right path has an eerie glow coming from deeper within.
    `);
    
    const perception = statCheck(gameState.currentCharacter, 'perception', 12);
    
    if (perception) {
        await typeText(`\n[SUCCESS] Your keen eyes spot something unusual - claw marks on 
the trees along the right path. They're fresh, and whatever made them 
was large.
        `);
        updateQuestLog('Noticed: Fresh claw marks on right path');
    }
    
    const choice = await showChoices([
        { text: 'Take the LEFT path (footprints)', value: 'left' },
        { text: 'Take the RIGHT path (glowing)', value: 'right' }
    ]);
    
    if (choice === 'left') {
        await wounded_traveler();
    } else {
        await corrupted_clearing();
    }
}

/**
 * Encounter: Wounded Traveler
 */
async function wounded_traveler() {
    updateScene('wounded_traveler');
    
    addStoryText('\n--- THE WOUNDED TRAVELER ---\n');
    
    await typeText(`Following the left path, you soon come across a man slumped 
against a tree. His clothing is torn and bloodied. He looks up at you 
with desperate eyes.

"Please... help me..." he gasps. "Those creatures... they came out 
of nowhere. I barely escaped..."

You notice deep claw marks across his chest. He's losing blood quickly.
    `);
    
    const choice = await showChoices([
        { text: 'Use healing magic or medicine to help him', value: 'heal' },
        { text: 'Give him a health potion', value: 'potion' },
        { text: 'Ask him what happened before helping', value: 'question' },
        { text: 'Leave him and continue on', value: 'leave' }
    ]);
    
    if (choice === 'heal') {
        const canHeal = gameState.currentCharacter.currentMP >= 15 || 
                       gameState.currentCharacter.class === 'Cleric';
        
        if (canHeal) {
            gameState.currentCharacter.currentMP = Math.max(0, gameState.currentCharacter.currentMP - 15);
            updateCharacterDisplay();
            
            await typeText(`\nYou channel healing energy into the wounded traveler. 
His wounds begin to close, and color returns to his face.

"Thank you! I thought I was done for..." He reaches into his pack 
and pulls out a small wooden shield. "Here, take this. It's not much, 
but it might help you survive this cursed place."
            `);
            
            forestState.hasWoodenShield = true;
            forestState.savedTraveler = true;
            forestState.purity_level += 1;
            
            addGold(gameState.currentCharacter, 25);
            updateQuestLog('Saved wounded traveler - Received wooden shield and 25 gold');
            
            await typeText(`\nThe traveler warns you: "There's something deeper in the forest. 
An old hermit. If anyone knows what's happening here, it's him. But 
beware the wolves - they're not natural anymore."`);
            
        } else {
            await typeText(`\nYou try to help, but you don't have enough magical energy. 
The traveler's breathing becomes shallow...`);
            forestState.corruption_level += 1;
            updateQuestLog('Failed to save traveler');
        }
        
    } else if (choice === 'potion') {
        // Check if player has potion
        await typeText(`\nYou give the traveler one of your health potions. 
He drinks it gratefully, and his wounds begin to heal.

"Bless you, stranger. Here, take this moonstone - I found it near 
a strange glowing pool. It might be important."
        `);
        
        forestState.hasMoonStone = true;
        forestState.savedTraveler = true;
        forestState.purity_level += 1;
        updateQuestLog('Saved traveler - Received mysterious moonstone');
        
    } else if (choice === 'question') {
        await typeText(`\nYou ask him about the creatures while he struggles to breathe.

"They were... wolves... but wrong. Glowing eyes... too smart..." 
He coughs up blood. "The forest... it's alive... and angry..."

As you hesitate, his eyes glaze over. He's gone.
        `);
        forestState.corruption_level += 2;
        updateQuestLog('Traveler died while you questioned him');
        
    } else {
        await typeText(`\nYou decide to leave him. As you walk away, you hear his final 
gasps echo through the trees. The forest seems to grow darker.
        `);
        forestState.corruption_level += 3;
        updateQuestLog('Abandoned wounded traveler');
    }
    
    await showContinue();
    await hermit_hut();
}

/**
 * Encounter: Corrupted Clearing
 */
async function corrupted_clearing() {
    updateScene('corrupted_clearing');
    
    addStoryText('\n--- CORRUPTED CLEARING ---\n');
    
    await typeText(`The right path leads to a small clearing. In the center, 
a pool of water glows with an unnatural purple light. The plants around 
it are twisted and dead.

You feel a strange pull toward the water. It whispers promises of power...
    `);
    
    const choice = await showChoices([
        { text: 'Drink from the glowing pool', value: 'drink' },
        { text: 'Collect water in a container', value: 'collect' },
        { text: 'Examine the pool carefully', value: 'examine' },
        { text: 'Leave the clearing immediately', value: 'leave' }
    ]);
    
    if (choice === 'drink') {
        await typeText(`\nYou cup your hands and drink the glowing water. It tastes 
sweet at first, then bitter. Energy surges through your body!

[You gain +2 to all stats temporarily, but...]

The world tilts. Purple veins spread across your skin. You feel the 
forest's corruption seeping into your very soul.
        `);
        
        gameState.currentCharacter.strength += 2;
        gameState.currentCharacter.intelligence += 2;
        gameState.currentCharacter.dexterity += 2;
        gameState.currentCharacter.constitution += 2;
        forestState.corruption_level += 5;
        updateCharacterDisplay();
        
        updateQuestLog('Drank corrupted water - Gained power but corruption increased');
        
    } else if (choice === 'collect') {
        await typeText(`\nYou carefully collect some of the water in a flask. 
Even through the glass, you can feel it pulsing with dark energy.

This might be useful for understanding the corruption...
        `);
        
        forestState.hasPurifiedWater = true;
        forestState.corruption_level += 1;
        updateQuestLog('Collected corrupted water sample');
        
    } else if (choice === 'examine') {
        const intelligence = statCheck(gameState.currentCharacter, 'intelligence', 14);
        
        if (intelligence) {
            await typeText(`\n[SUCCESS] You recognize dark magic at work here. This water 
is a focal point of corruption. You notice symbols carved into nearby 
stones - someone has been performing rituals here.

You make careful notes of the symbols.
            `);
            forestState.purity_level += 1;
            updateQuestLog('Identified corruption source - Ritual site discovered');
        } else {
            await typeText(`\nThe magic is too complex for you to understand. 
You feel dizzy just looking at the water.
            `);
        }
    } else {
        await typeText(`\nYour instincts scream danger. You quickly leave the clearing. 
As you depart, you hear what sounds like disappointed whispers.
        `);
        forestState.purity_level += 1;
        updateQuestLog('Wisely avoided corrupted pool');
    }
    
    await showContinue();
    await wolf_pack_encounter();
}

/**
 * Encounter: Wolf Pack
 */
async function wolf_pack_encounter() {
    updateScene('wolf_pack');
    
    addStoryText('\n--- CORRUPTED WOLVES ---\n');
    
    await typeText(`As you continue deeper into the forest, you hear growling. 
Three wolves emerge from the shadows, but they're like no wolves you've 
seen before. Their eyes glow purple, and dark energy crackles around them.

They circle you, snarling. Combat is inevitable!
    `);
    
    // First fight: Two corrupted wolves
    await typeText(`\nTwo corrupted wolves lunge at you!`);
    
    const wolf1 = createEnemy('Corrupted Wolf', 30, 0, 1, 'wolf');
    const combat1 = new Combat(gameState.currentCharacter, wolf1);
    const result1 = await combat1.start();
    
    if (result1 === 'fled') {
        await typeText(`\nYou manage to escape the wolves and find another path.`);
        forestState.corruption_level += 1;
        await showContinue();
        await hermit_hut();
        return;
    } else if (result1 === 'defeat') {
        // Death handled by combat system
        return;
    }
    
    // Second fight: Alpha wolf
    await typeText(`\nAs the first wolf falls, the massive Alpha Wolf emerges, 
eyes blazing with purple fire. It's much larger and more dangerous!`);
    
    const alphaWolf = createEnemy('Alpha Wolf', 50, 10, 2, 'wolf');
    const combat2 = new Combat(gameState.currentCharacter, alphaWolf);
    const result2 = await combat2.start();
    
    if (result2 === 'victory') {
        await typeText(`\nThe Alpha Wolf falls with a pitiful howl. As it dies, 
the purple glow fades from its eyes, and for a moment, it looks like 
a normal wolf again.

You find 50 gold pieces and a strange charm among the remains.
        `);
        
        addGold(gameState.currentCharacter, 50);
        addExperience(gameState.currentCharacter, 85);
        updateQuestLog('Defeated corrupted wolf pack');
        
        await showContinue();
        await hermit_hut();
        
    } else if (result2 === 'fled') {
        await typeText(`\nYou manage to escape the alpha wolf and find another path.`);
        forestState.corruption_level += 1;
        await showContinue();
        await hermit_hut();
    } else {
        // Death handled by combat system
        return;
    }
}

/**
 * Encounter: The Hermit's Hut
 */
async function hermit_hut() {
    updateScene('hermit_hut');
    
    addStoryText('\n--- THE HERMIT\'S HUT ---\n');
    
    await typeText(`Through the thick trees, you spot a small hut. Smoke rises 
from a chimney, and strange symbols are carved into the door frame.

An old man sits outside, tending a small garden that seems untouched 
by the forest's corruption. He looks up as you approach.

"Another one drawn to the darkness," he says calmly. "Or perhaps... 
seeking to stop it?"
    `);
    
    const choice = await showChoices([
        { text: 'Ask about the corruption', value: 'ask' },
        { text: 'Ask for help or healing', value: 'help' },
        { text: 'Ask if he has supplies to trade', value: 'trade' },
        { text: 'Attack the hermit (he might be corrupted)', value: 'attack' }
    ]);
    
    if (choice === 'ask') {
        await typeText(`\nThe hermit nods slowly. "The forest was not always like this. 
Three months ago, something awakened in the ancient ruins to the north. 
An old darkness, sealed away by druids long ago.

A woman came seeking power. Elara was her name. She broke the seals, 
and now the forest pays the price. The corruption spreads from the 
ruins like a disease."

He looks at you with ancient eyes. "If you truly wish to stop this, 
you must find the Heart of the Forest - an ancient spirit that slumbers 
at the old standing stones. Only it has the power to purify the ruins.

But be warned - Elara will not let you interfere with her plans easily."
        `);
        
        updateQuestLog('Learned about Elara and the ancient ruins');
        updateQuestLog('New objective: Find the Heart of the Forest at the standing stones');
        forestState.purity_level += 2;
        
    } else if (choice === 'help') {
        await typeText(`\nThe hermit examines you with wise eyes.

"You are brave to venture here. Here, let me help you."

He places his hands on your shoulders, and you feel warm energy flow 
through you. Your wounds heal, and you feel refreshed!
        `);
        
        heal(gameState.currentCharacter, 50);
        gameState.currentCharacter.currentMP = Math.min(
            gameState.currentCharacter.maxMP,
            gameState.currentCharacter.currentMP + 30
        );
        updateCharacterDisplay();
        
        forestState.hasHermitBlessing = true;
        forestState.purity_level += 1;
        updateQuestLog('Received hermit\'s blessing');
        
    } else if (choice === 'trade') {
        await typeText(`\nThe hermit gestures to his small garden.

"I have little to trade, but I can offer you some supplies for your journey:
- Healing herbs (30 gold) - Restores 40 HP
- Magic elixir (50 gold) - Restores 40 MP  
- Ward charm (75 gold) - Reduces corruption effects"
        `);
        
        // Simple trade interface
        updateQuestLog('Found hermit\'s trading post');
        
    } else {
        await typeText(`\nYou draw your weapon and attack the hermit!

But before your strike can land, he raises a hand. You freeze in place, 
unable to move.

"Fool," he says sadly. "The corruption has already touched your heart."

He releases you, and you stumble backward. The hermit vanishes into 
thin air, along with his hut. You're alone in the forest once more.
        `);
        
        forestState.corruption_level += 3;
        updateQuestLog('Attacked the hermit - Lost his aid');
    }
    
    await showContinue();
    await act2_ancient_ruins();
}

/**
 * ACT 2: THE ANCIENT RUINS
 */
async function act2_ancient_ruins() {
    updateScene('act2_ruins');
    
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                  ACT II: THE ANCIENT RUINS');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Following the hermit's directions, you travel deeper into 
the forest. The corruption grows stronger here - the very air feels thick 
with dark magic.

You come to a massive clearing dominated by crumbling stone ruins. 
Broken pillars and vine-covered walls speak of great age. At the center, 
a dark purple light pulses rhythmically.

Strange creatures patrol the area - twisted, corrupted beings that 
were once forest animals.
    `);
    
    updateQuestLog('Reached the ancient ruins');
    
    const choice = await showChoices([
        { text: 'Sneak around to investigate', value: 'sneak' },
        { text: 'Charge in directly', value: 'charge' },
        { text: 'Look for another entrance', value: 'search' }
    ]);
    
    if (choice === 'sneak') {
        const stealth = statCheck(gameState.currentCharacter, 'dexterity', 14);
        
        if (stealth) {
            await typeText(`\n[SUCCESS] You silently move through the shadows, 
avoiding the patrol routes of the corrupted creatures.

You get close enough to see into the heart of the ruins. A woman in 
dark robes stands before an altar, channeling purple energy. This must 
be Elara!
            `);
            forestState.purity_level += 1;
            updateQuestLog('Successfully infiltrated the ruins');
            await elara_encounter();
        } else {
            await typeText(`\n[FAILED] You step on a branch! The crack echoes 
through the clearing. The corrupted creatures turn toward you!
            `);
            await ruins_combat();
        }
        
    } else if (choice === 'charge') {
        await typeText(`\nYou charge forward, weapon drawn!

The corrupted creatures screech and rush to meet you!
        `);
        forestState.corruption_level += 1;
        await ruins_combat();
        
    } else {
        await typeText(`\nYou circle the ruins, searching for another way in.

After some time, you find old drainage tunnels beneath the structure. 
They're dark and cramped, but they might let you bypass the guards.
        `);
        
        const choice2 = await showChoices([
            { text: 'Enter the tunnels', value: 'tunnel' },
            { text: 'Go back and try another approach', value: 'back' }
        ]);
        
        if (choice2 === 'tunnel') {
            await tunnel_exploration();
        } else {
            await ruins_combat();
        }
    }
}

/**
 * Ruins combat encounter
 */
async function ruins_combat() {
    addStoryText('\n--- CORRUPTED GUARDIANS ---\n');
    
    const enemies = [
        createEnemy('Corrupted Bear', 60, 20, 3, 'bear'),
        createEnemy('Twisted Treant', 45, 30, 2, 'tree'),
        createEnemy('Shadow Wraith', 30, 40, 2, 'ghost')
    ];
    
    const combat = new Combat(gameState.currentCharacter, enemies);
    const result = await combat.start();
    
    if (result === 'victory') {
        addGold(gameState.currentCharacter, 75);
        addExperience(gameState.currentCharacter, 150);
        updateQuestLog('Defeated corrupted guardians');
        await showContinue();
        await elara_encounter();
    } else if (result === 'fled') {
        forestState.corruption_level += 2;
        await showContinue();
        await tunnel_exploration();
    }
}

/**
 * Tunnel exploration
 */
async function tunnel_exploration() {
    addStoryText('\n--- THE DRAINAGE TUNNELS ---\n');
    
    await typeText(`You descend into the dank tunnels beneath the ruins. 
Water drips from the ceiling, and the walls are covered in strange fungi 
that glow with a faint purple light.

As you navigate the narrow passages, you hear something moving in the 
darkness ahead...
    `);
    
    const perception = statCheck(gameState.currentCharacter, 'perception', 13);
    
    if (perception) {
        await typeText(`\n[SUCCESS] You spot the danger just in time - 
massive poisonous mushrooms that would have released spores if disturbed!

You carefully navigate around them.
        `);
        forestState.purity_level += 1;
    } else {
        await typeText(`\n[FAILED] You brush against a large mushroom, and 
it bursts, releasing toxic spores!
        `);
        takeDamage(gameState.currentCharacter, 15);
        updateCharacterDisplay();
        updateQuestLog('Poisoned by spore mushrooms');
    }
    
    await typeText(`\nThe tunnel opens into a small chamber. In the center 
sits an old chest, partially buried in debris.
    `);
    
    const choice = await showChoices([
        { text: 'Open the chest', value: 'open' },
        { text: 'Check for traps first', value: 'check' },
        { text: 'Leave it and continue', value: 'leave' }
    ]);
    
    if (choice === 'check') {
        const investigation = statCheck(gameState.currentCharacter, 'intelligence', 12);
        
        if (investigation) {
            await typeText(`\n[SUCCESS] You find and disarm a poison needle trap!

Inside the chest, you find:
- 100 gold pieces
- An ornate key with runic inscriptions
- A scroll of protection
            `);
            addGold(gameState.currentCharacter, 100);
            forestState.hasOldKey = true;
            forestState.purity_level += 2;
            updateQuestLog('Found ancient key in trapped chest');
        } else {
            await typeText(`\n[FAILED] The trap springs as you open the chest!

A needle jabs your hand, and you feel poison enter your bloodstream.
            `);
            takeDamage(gameState.currentCharacter, 20);
            addGold(gameState.currentCharacter, 50);
            updateCharacterDisplay();
        }
    } else if (choice === 'open') {
        await typeText(`\nYou open the chest without checking. A needle 
shoots out, stabbing your hand!
        `);
        takeDamage(gameState.currentCharacter, 20);
        addGold(gameState.currentCharacter, 50);
        updateCharacterDisplay();
    }
    
    await showContinue();
    await elara_encounter();
}

/**
 * Elara encounter - Main antagonist
 */
async function elara_encounter() {
    updateScene('elara_encounter');
    
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                      ELARA THE CORRUPTED');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You enter the heart of the ruins. The woman you saw before 
stands at an altar, dark energy swirling around her. She turns to face you.

"So, someone finally comes to stop me," Elara says with a cold smile. 
"The village sent you, I assume? To 'save' their precious forest?"

She laughs bitterly. "This forest killed my family. Took everything 
from me. Now I take everything from it. I'll harness its power, bend 
it to my will, and burn the whole cursed place to ash!"

The corruption around her intensifies. You can feel her pain and rage.
    `);
    
    const choice = await showChoices([
        { text: 'Try to reason with her', value: 'reason' },
        { text: 'Offer to help her another way', value: 'help' },
        { text: 'Attack her immediately', value: 'attack' },
        { text: 'Use the moonstone (if you have it)', value: 'moonstone' }
    ]);
    
    if (choice === 'reason') {
        const persuasion = statCheck(gameState.currentCharacter, 'charisma', 16);
        
        if (persuasion && forestState.purity_level >= 5) {
            await typeText(`\n[SUCCESS] Your words reach her through the corruption!

"You've suffered terrible loss," you say. "But destroying the forest 
won't bring them back. This power is consuming you. Please, let me 
help you find peace."

Elara's eyes clear for a moment. Tears stream down her face.

"I... I've gone too far, haven't I? The darkness... it promised me 
revenge, but all it gave me was hate..."

She falls to her knees, and the dark energy begins to dissipate.
            `);
            await peaceful_resolution();
            
        } else {
            await typeText(`\n[FAILED] "Empty words!" she shouts. 
"You know nothing of my pain!"

She attacks!
            `);
            await boss_battle();
        }
        
    } else if (choice === 'help') {
        await typeText(`\nYou offer to help her find justice another way, 
without destroying the forest.

"It's too late for that," she says sadly. "The corruption has already 
taken root in me. There's only one way this ends now..."

She raises her hands, dark energy crackling.
        `);
        await boss_battle();
        
    } else if (choice === 'moonstone' && forestState.hasMoonStone) {
        await typeText(`\nYou hold up the moonstone, and it begins to glow 
with pure white light!

Elara recoils. "What is that?! That light... it's burning the darkness!"

The moonstone pulses, and the corruption around Elara begins to crack 
and fall away like shattered glass. She gasps, her eyes clearing.

"What... what have I done?" She looks at her hands in horror. "The 
darkness... it was controlling me..."
        `);
        await peaceful_resolution();
        
    } else {
        await typeText(`\nYou attack without hesitation!

"So be it!" Elara raises her hands, and corrupted energy surges forth!
        `);
        await boss_battle();
    }
}

/**
 * Final boss battle
 */
async function boss_battle() {
    updateScene('boss_battle');
    
    addStoryText('\n--- BOSS: ELARA THE CORRUPTED ---\n');
    
    await typeText(`Elara transforms, dark energy wrapping around her like 
armor. Her eyes glow purple, and shadow tendrils lash out!

This will be your greatest challenge!
    `);
    
    const boss = createEnemy('Elara the Corrupted', 120, 80, 5, 'boss');
    boss.attacks = [
        { name: 'Shadow Bolt', damage: 20, mpCost: 15 },
        { name: 'Corruption Wave', damage: 30, mpCost: 25 },
        { name: 'Life Drain', damage: 15, heal: 15, mpCost: 20 }
    ];
    
    const combat = new Combat(gameState.currentCharacter, boss);
    const result = await combat.start();
    
    if (result === 'victory') {
        await typeText(`\nElara falls to her knees, the dark energy dissipating. 
She looks at you with clear eyes, free from corruption at last.

"Thank you..." she whispers. "I was lost in the darkness. End it... 
please..."

She closes her eyes and fades into silver mist, finally at peace.
        `);
        
        addGold(gameState.currentCharacter, 200);
        addExperience(gameState.currentCharacter, 500);
        updateQuestLog('Defeated Elara and freed her from corruption');
        
        await showContinue();
        await epilogue_purify();
        
    } else {
        // Death handled by combat system
        return;
    }
}

/**
 * Peaceful resolution path
 */
async function peaceful_resolution() {
    await typeText(`\nWith Elara's cooperation, you work together to undo 
the damage. She uses her knowledge of the rituals to reverse the corruption.

The forest around you begins to heal. The purple glow fades, replaced 
by natural moonlight. You hear the sounds of normal animals returning.

"I can never undo what I've done," Elara says quietly. "But at least 
I can make sure the forest heals. I'll stay here, as its guardian, 
to atone for my crimes."

She places a hand on your shoulder. "Thank you for saving me from myself."
    `);
    
    addGold(gameState.currentCharacter, 250);
    addExperience(gameState.currentCharacter, 750);
    updateQuestLog('Redeemed Elara - Peaceful resolution achieved');
    
    await showContinue();
    await epilogue_peaceful();
}

/**
 * Epilogue - Purification ending
 */
async function epilogue_purify() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                          EPILOGUE');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`With Elara defeated, you work to purify the corruption. 
Using the ancient knowledge from the hermit and the power of the moonstone, 
you perform a cleansing ritual at the altar.

Light spreads from the ruins, washing over the forest. The twisted 
trees straighten, poisoned water runs clear, and the darkness recedes.

The forest is saved.

You return to the village as a hero. The elders reward you with 
the promised gold, plus extra for your bravery. Tales of your 
adventure will be told for generations.
    `);
    
    addGold(gameState.currentCharacter, 300);
    updateQuestLog('QUEST COMPLETE: The Dark Forest has been purified!');
    
    await showContinue();
    await adventure_complete();
}

/**
 * Epilogue - Peaceful ending
 */
async function epilogue_peaceful() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                          EPILOGUE');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You return to the village with news of the forest's healing. 
The elders are amazed that you managed to redeem the corrupted sorceress 
rather than simply defeating her.

Elara keeps her word, becoming the forest's guardian. Under her watchful 
care, the Shadowfen Forest becomes a place of wonder and magic once more.

The village prospers, and you are hailed as both a hero and a peacemaker. 
Your wisdom and compassion have not only saved the forest, but also 
saved a lost soul.

This is the best possible outcome.
    `);
    
    addGold(gameState.currentCharacter, 400);
    addExperience(gameState.currentCharacter, 200); // Bonus XP for perfect ending
    updateQuestLog('QUEST COMPLETE: Perfect ending - Forest healed, Elara redeemed!');
    
    await showContinue();
    await adventure_complete();
}

/**
 * Adventure completion
 */
async function adventure_complete() {
    addStoryText('\n\n🏆 ADVENTURE COMPLETE! 🏆\n');
    
    await typeText(`
═══════════════════════════════════════════════════════════════════
                      ADVENTURE STATISTICS
═══════════════════════════════════════════════════════════════════

Final Level: ${calculateLevel(gameState.currentCharacter.experience)}
Total Experience: ${gameState.currentCharacter.experience}
Total Gold Earned: ${gameState.currentCharacter.gold}

Corruption Level: ${forestState.corruption_level}
Purity Level: ${forestState.purity_level}

The Dark Forest adventure is complete!
═══════════════════════════════════════════════════════════════════
    `);
    
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

console.log('✅ dark_forest.js loaded');
