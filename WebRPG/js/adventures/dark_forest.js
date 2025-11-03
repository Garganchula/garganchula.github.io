/**
 * ADVENTURE 1: BLOOD IN THE WOODS
 * A mysterious adventure about awakening with no memory in 800 AD
 */

class ForestState {
    constructor() {
        // Memory fragments collected
        this.memoryFragments = 0;
        
        // Items
        this.hasWoodenSpear = false;
        this.hasWaterSkin = false;
        this.hasTravelerCloak = false;
        this.hasWolfPendant = false;
        this.hasHuntersKnife = false;
        
        // Key story flags
        this.metOldHunter = false;
        this.savedVillager = false;
        this.foundCampsite = false;
        this.discoveredTruth = false;
        this.readHuntersNote = false;
        
        // Relationships
        this.hunterTrust = 0;
        this.villagersSuspicion = 0;
        
        // Investigation progress
        this.cluesFound = 0;
        this.knowsAboutBandits = false;
        this.knowsAboutRitual = false;
        this.examedBody = false;
        
        // NEW: Player choices and morality
        this.moralityScore = 0; // Positive = good, negative = dark
        this.washedBlood = false;
        this.keptEvidence = false;
        this.helpedStranger = false;
        this.liedToVillagers = false;
        this.stealthApproach = false;
        this.violenceLevel = 0; // Track how violent player is
        
        // NEW: NPC relationships
        this.elderTrust = 0;
        this.guardHostility = 0;
        this.cultistAwareness = 0;
        
        // NEW: Investigation paths
        this.visitedLocations = [];
        this.interrogatedNPCs = [];
        this.foundClueTypes = {
            physical: 0,
            witness: 0,
            supernatural: 0
        };
    }
}

let forestState = new ForestState();

/**
 * Main entry point for Blood in the Woods adventure
 */
async function startDarkForestAdventure() {
    forestState = new ForestState();
    
    // Save adventure start
    gameState.currentAdventure = {
        id: 'dark_forest',
        name: 'Blood in the Woods',
        state: forestState,
        currentScene: 'prologue'
    };
    gameState.adventureState = forestState;
    saveGameProgress();
    
    await prologue();
}

/**
 * Prologue - Awakening
 */
async function prologue() {
    addStoryText(`🌲 BLOOD IN THE WOODS 🌲 - 800 AD`);
    
    await typeText(`Pain.

That's the first thing you feel. A throbbing in your head, sharp and insistent.

Then cold. The morning dew has soaked through your clothes. You try to 
move, and your muscles scream in protest.

Your eyes open slowly. Leaves. Branches. Gray sky filtering through a 
dense forest canopy. You're lying on the forest floor.

You try to sit up. Your hands are covered in blood.

*Not your blood.*

You scramble to your feet, panic rising in your chest. Your tunic is 
torn and stained dark red. More blood. Dried on your arms, under your 
fingernails, splattered across your chest.

Your heart pounds. *What happened? What did I do?*

You search your memory for... anything. Where you are. How you got here. 
What day it is. Everything is a void, a black emptiness where your past 
should be.

But one thing remains. One single fragment of identity floating in the 
darkness:

Your name. ${gameState.currentCharacter.name}.

That's all you know. That's all you *are*.
    `);
    
    updateQuestLog('OBJECTIVE: Figure out what happened');
    updateQuestLog('STATUS: Covered in blood, no memory, alone in the forest');
    
    await showContinue();
    await awakening_choices();
}

/**
 * First choices after awakening
 */
async function awakening_choices() {
    addStoryText('\n--- THE AWAKENING ---\n');
    
    await typeText(`You stand in a small clearing, surrounded by ancient oak trees. 
The morning sun is just starting to burn through the mist.

Looking down, you see the blood on your hands is dry - this happened 
hours ago. Maybe last night?

You need to think. You need to figure out what happened. But where to start?
    `);
    
    const choice = await showChoices([
        'Search yourself for clues',
        'Look around the clearing',
        'Follow a trail of blood leading into the trees',
        'Try to wash the blood off in a nearby stream'
    ]);
    
    if (choice === 0) {
        await search_yourself();
    } else if (choice === 1) {
        await search_clearing();
    } else if (choice === 2) {
        await follow_blood_trail();
    } else {
        await wash_blood();
    }
}

/**
 * Search yourself
 */
async function search_yourself() {
    addStoryText('\n--- SEARCHING YOURSELF ---\n');
    
    await typeText(`You check your pockets and belongings, hoping for some clue 
to who you are or what happened.

Your belt has a small leather pouch. Inside you find:
• A few copper coins (about 5 silver worth)
• A worn piece of cloth with strange symbols
• A wooden pendant carved with a wolf's head

You pocket the items. The pendant feels... familiar somehow. But you 
can't remember why.

Your clothes are simple - rough-spun wool, the kind a traveler or 
peasant might wear. Nothing noble or remarkable. Just a common person 
caught in an uncommon situation.

No weapons. No pack. No food or water.

*Whoever I am, I wasn't prepared for this.*
    `);
    
    addGold(gameState.currentCharacter, 5);
    forestState.cluesFound++;
    forestState.hasWolfPendant = true;
    updateQuestLog('Found: Wolf pendant, strange cloth, 5 silver');
    
    await showContinue();
    await search_clearing();
}

/**
 * Search the clearing
 */
async function search_clearing() {
    addStoryText('\n--- THE CLEARING ---\n');
    
    await typeText(`You examine the clearing more carefully.

The grass is trampled in several places. There was a struggle here.

Near the base of a large oak tree, you find more blood - a lot of it. 
A dark pool has soaked into the earth. Someone died here. Recently.

But there's no body.

Scattered around the blood pool are:
• Broken arrows (about a dozen)
• A torn piece of fabric - looks like it was ripped from a cloak
• Deep gouges in the tree bark, like something with claws climbed it

This wasn't a simple murder. This was a hunt.

*Am I the hunter... or was I running from something?*
    `);
    
    forestState.cluesFound++;
    updateQuestLog('Found: Evidence of a violent struggle');
    updateQuestLog('Clue: Arrows, torn cloak, claw marks');
    
    const choice = await showChoices([
        'Follow the blood trail into the forest',
        'Search for more clues',
        'Try to find a stream to wash off',
        'Look for signs of civilization'
    ]);
    
    if (choice === 0) {
        await follow_blood_trail();
    } else if (choice === 1) {
        await find_more_clues();
    } else if (choice === 2) {
        await wash_blood();
    } else {
        await find_village();
    }
}

/**
 * Follow the blood trail
 */
async function follow_blood_trail() {
    addStoryText('\n--- THE BLOOD TRAIL ---\n');
    
    await typeText(`You follow drops of blood leading away from the clearing. 
The trail winds through the trees, getting fainter as you go.

After about ten minutes of walking, the trail leads to a rocky outcrop. 
Behind it, hidden in the shadows, you find...

A body.

A man, middle-aged, wearing hunter's garb. Multiple stab wounds. 
He's been dead for hours - probably died sometime in the night.

His face is frozen in terror.

Next to him lies a bow and a quiver of arrows - matching the broken 
ones you found. He was the one being hunted.

*Did I do this? Why can't I remember?*

You search the body. In his pack you find:
• A water skin (half full)
• Some dried meat
• A hunter's knife (crude but sharp)
• A note
    `);
    
    forestState.examedBody = true;
    forestState.cluesFound++;
    
    const choice = await showChoices([
        'Read the note',
        'Take the supplies and leave quickly',
        'Examine the wounds more closely',
        'Say a prayer for the dead'
    ]);
    
    if (choice === 0) {
        await read_hunters_note();
    } else if (choice === 1) {
        await take_supplies_and_flee();
    } else if (choice === 2) {
        await examine_wounds();
    } else {
        await pray_for_dead();
    }
}

/**
 * Read the hunter's note
 */
async function read_hunters_note() {
    addStoryText('\n--- THE NOTE ---\n');
    
    await typeText(`You unfold the blood-stained parchment. The handwriting is rough 
but legible:

"Day 3 - Tracking the wolf pack north of Oakridge. Signs they've been 
attacking travelers on the forest road. Found their den near the old 
standing stones.

Day 4 - Something's wrong. These aren't normal wolves. They hunt like 
they're organized. Like they're being led by something intelligent.

Day 5 - Saw a man last night. Covered in blood, stumbling through the 
woods like he was drunk or injured. Tried to approach him but he ran 
when he saw me. Going to track him tomorrow. He might need help.

Day 6 - Following the bloody man. He's heading deeper into the forest. 
Found his camp - signs of a struggle. Whatever attacked him might come 
back. I'll-"

The note ends abruptly.

*This was about ME. He was tracking ME. And now he's dead.*

*Did I kill him? Or did whatever attacked me come back and get him too?*
    `);
    
    forestState.readHuntersNote = true;
    forestState.cluesFound++;
    forestState.knowsAboutWolves = true;
    updateQuestLog('Read: Hunter was tracking YOU');
    updateQuestLog('Clue: Wolf pack near old standing stones');
    updateQuestLog('Clue: You were attacked before losing memory');
    
    await showContinue();
    await after_hunter_body();
}

/**
 * Take supplies from hunter
 */
async function take_supplies_and_flee() {
    await typeText(`\nYou grab the water skin, dried meat, and knife. You leave the 
note unread - you don't want to know.

Some part of you whispers that this is wrong, that you should at least 
bury him. But fear overrides conscience. You need to survive.

You hurry away from the body, trying not to look back.
    `);
    
    forestState.hasWaterSkin = true;
    forestState.hasHuntersKnife = true;
    addGold(gameState.currentCharacter, 3);
    updateQuestLog('Took: Water, food, knife from dead hunter');
    
    await showContinue();
    await after_hunter_body();
}

/**
 * Examine the wounds
 */
async function examine_wounds() {
    addStoryText('\n--- EXAMINING THE BODY ---\n');
    
    await typeText(`You steel yourself and look more closely at the wounds.

Multiple stab wounds to the chest and abdomen. The weapon was thin - 
a knife or dagger, not a sword.

But what catches your attention is the pattern. These aren't random 
stabs from a panicked fight. They're precise. Calculated. Like someone 
knew exactly where to strike.

*This was murder. Professional. Efficient.*

Your hands are shaking. Not from fear... from something else. 
Something that feels almost like... muscle memory?

You look down at your own hands, still stained with blood.

*No. Please, no.*
    `);
    
    forestState.cluesFound++;
    forestState.realizedSkilled = true;
    updateQuestLog('Realized: The killer was skilled');
    updateQuestLog('Disturbing thought: Your hands remember this?');
    
    const choice = await showChoices([
        'Read the note he was carrying',
        'Take his supplies and leave',
        'Search the area for more clues'
    ]);
    
    if (choice === 0) {
        await read_hunters_note();
    } else if (choice === 1) {
        await take_supplies_and_flee();
    } else {
        await search_around_body();
    }
}

/**
 * Pray for the dead hunter
 */
async function pray_for_dead() {
    await typeText(`\nYou kneel beside the body and bow your head.

The words come automatically, without thought:

"May the gods guide you to the halls of your fathers. 
May your spirit find peace in the next world.
May your death not be in vain."

It's a prayer. An old one. You don't know how you know it, but the 
words flow like water.

*At least I'm not completely heartless,* you think.

You take a moment of silence, then rise. Whatever happened, this man 
deserves better than to be left here for the wolves.

You find some loose stones and pile them over the body - a simple cairn, 
but it's something.
    `);
    
    forestState.paidRespects = true;
    addExperience(gameState.currentCharacter, 25);
    updateQuestLog('Paid respects to the fallen hunter');
    
    await showContinue();
    
    await typeText(`\nAs you place the last stone, you hear something behind you.

A low growl.

You turn slowly.

Three wolves emerge from the treeline. But these aren't normal wolves. 
Their eyes glow with an unnatural yellow light. Foam drips from their jaws.

They spread out, surrounding you.

*This is it. This is what killed him.*

You grab the hunter's knife from his pack.

The wolves attack.
    `);
    
    forestState.hasHuntersKnife = true;
    await showContinue();
    await first_combat();
}

/**
 * After examining hunter's body
 */
async function after_hunter_body() {
    await typeText(`\nYou stand over the hunter's body, mind racing with questions.

Before you can decide what to do next, you hear voices in the distance.

"...over here! I saw smoke from the outcrop!"
"Could be bandits. Stay alert."

*People. Coming this way.*

You look down at yourself - covered in blood, standing over a corpse, 
holding a knife you just took from the dead man.

*This looks... really bad.*
    `);
    
    const choice = await showChoices([
        'Hide and observe who\'s coming',
        'Run before they see you',
        'Stay and try to explain',
        'Prepare to defend yourself'
    ]);
    
    if (choice === 0) {
        await hide_from_villagers();
    } else if (choice === 1) {
        await run_from_villagers();
    } else if (choice === 2) {
        await meet_villagers();
    } else {
        await prepare_for_fight();
    }
}

/**
 * Hide from the approaching villagers
 */
async function hide_from_villagers() {
    addStoryText('\n--- HIDING ---\n');
    
    await typeText(`You quickly duck behind a large boulder, holding your breath.

Three men emerge into the clearing. They're dressed in simple tunics 
and carry hunting spears. Villagers, not soldiers.

They spot the body immediately.

"Gods preserve us... it's Marcus!"

"The hunter from Oakridge. What was he doing this deep in the forest?"

One of them kneels by the body. "Multiple stab wounds. This was murder."

"We need to tell the village headman. Could be bandits in these woods."

They lift the body carefully, preparing to carry it back.

As they leave, one of them pauses and looks around, frowning.

"Strange... I could have sworn I heard someone..."

You press yourself tighter against the rock, not daring to breathe.

After a long moment, he shakes his head and follows the others.

You're alone again.
    `);
    
    forestState.villagersSuspicion += 0; // They don't know about you yet
    forestState.heardAboutVillage = true;
    updateQuestLog('Overheard: There\'s a village called Oakridge nearby');
    updateQuestLog('The dead hunter was named Marcus');
    
    await showContinue();
    await after_villagers_leave();
}

/**
 * Run from villagers
 */
async function run_from_villagers() {
    await typeText(`\nPanic takes over. You run.

You crash through the undergrowth, branches tearing at your clothes. 
Behind you, you hear shouts:

"There! Someone's running!"
"After them!"

You run faster, your lungs burning. The forest is thick here, and you 
use that to your advantage, weaving between trees.

After what feels like an eternity, you can't hear them anymore. You've 
lost them.

You collapse against a tree, gasping for air.

*That was stupid. Now they know someone was there. They'll be looking for me.*

But at least you're free. For now.
    `);
    
    forestState.villagersSuspicion += 2;
    forestState.ranFromVillagers = true;
    updateQuestLog('Fled from villagers - they\'re now searching for you');
    
    await showContinue();
    await deeper_forest();
}

/**
 * Meet the villagers
 */
async function meet_villagers() {
    addStoryText('\n--- MEETING THE VILLAGERS ---\n');
    
    await typeText(`You step out from behind the rocks, hands raised.

"I didn't kill him!"

The three men spin toward you, raising their spears. They see the blood 
on your clothes and their expressions harden.

"Don't move!"
"Drop the weapon!"

You quickly drop the knife.

"I know how this looks," you say quickly. "But I woke up like this. 
I don't remember what happened. I found him already dead."

The men exchange glances. One of them - older, with a gray beard - 
steps forward.

"You expect us to believe that? Covered in blood, standing over Marcus 
with his own knife?"

"I'm telling the truth! I have no memory of last night. My name is 
${gameState.currentCharacter.name}, and that's all I know!"

The old man studies you carefully.
    `);
    
    const persuasion = statCheck(gameState.currentCharacter, 'charisma', 14);
    
    if (persuasion) {
        await typeText(`\n[SUCCESS] The old man sees something in your eyes - genuine confusion, 
maybe even fear. He lowers his spear slightly.

"Torin, wait..." one of the others protests.

"Look at him," Torin says. "He's terrified. If he killed Marcus, why 
would he still be here? Why not run?"

"Maybe he's mad. Or cursed."

Torin shakes his head. "Or maybe he's telling the truth. We'll take 
him to the village. Let the headman decide."

He turns to you. "You're coming with us. Try to run, and we won't 
hesitate to use these spears. Understand?"

You nod.
        `);
        
        forestState.capturedByVillagers = true;
        forestState.villagersSuspicion += 1;
        await showContinue();
        await journey_to_village();
    } else {
        await typeText(`\n[FAILED] The old man's expression doesn't change.

"Liar. Bind him."

Before you can protest, they rush you. You try to fight back, but three 
against one - and they have weapons - the outcome is inevitable.

They bind your hands roughly.

"We're taking you to the village," the old man says grimly. "The headman 
will decide your fate. And if you killed Marcus... the gods help you."

They march you into the forest at spearpoint.
        `);
        
        forestState.capturedByVillagers = true;
        forestState.villagersSuspicion += 3;
        await showContinue();
        await journey_to_village();
    }
}

/**
 * First combat - wolves
 */
async function first_combat() {
    addStoryText('\n--- COMBAT: RABID WOLVES ---\n');
    
    const wolves = [
        createEnemy('Corrupted Wolf', 25, 0, 1, 'wolf'),
        createEnemy('Corrupted Wolf', 25, 0, 1, 'wolf'),
        createEnemy('Alpha Wolf', 40, 10, 2, 'wolf')
    ];
    
    const combat = new Combat(gameState.currentCharacter, wolves);
    const result = await combat.start();
    
    if (result === 'victory') {
        await typeText(`\nThe last wolf falls with a pitiful whimper. 

As it dies, the yellow glow fades from its eyes. For a moment, it 
looks like a normal wolf again - just an animal, scared and sick.

*What made them like this?*

You're bleeding from several scratches, but you're alive. And more 
importantly... you can fight.

*How did I know how to do that? Those movements... they were automatic. 
Like I've done this before.*

More questions. No answers.
        `);
        
        addGold(gameState.currentCharacter, 15);
        addExperience(gameState.currentCharacter, 50);
        updateQuestLog('Survived: Attack by rabid wolves');
        updateQuestLog('Discovery: You know how to fight');
        
        await showContinue();
        await after_first_combat();
    } else if (result === 'fled') {
        await typeText(`\nYou turn and run, the wolves snapping at your heels.

You barely make it away alive. Your heart pounds as you crash through 
the undergrowth.

Finally, you can't hear them anymore. You collapse, gasping.

*I'm not a fighter. At least... I don't think I am.*
        `);
        await showContinue();
        await deeper_forest();
    } else {
        // Death handled by combat system
        return;
    }
}

/**
 * After first combat
 */
async function after_first_combat() {
    await typeText(`\nAs you catch your breath, you hear that sound again - voices.

"Did you hear that? Fighting!"
"This way!"

The villagers. They must have heard the combat.

You need to decide - do you wait for them, or keep moving?
    `);
    
    const choice = await showChoices([
        'Wait for the villagers to arrive',
        'Leave before they see you',
        'Try to clean the blood off before they arrive',
        'Hide the wolf bodies and pretend nothing happened'
    ]);
    
    if (choice === 0) {
        await meet_villagers_after_combat();
    } else if (choice === 1) {
        await deeper_forest();
    } else if (choice === 2) {
        await quick_cleanup();
    } else {
        await hide_evidence();
    }
}

/**
 * Meet villagers after combat
 */
async function meet_villagers_after_combat() {
    await typeText(`\nYou stand over the dead wolves, knife in hand, as the three villagers 
burst into the clearing.

They stop, taking in the scene - you, covered in blood, three dead 
wolves at your feet.

"By the gods..." one of them breathes.

The older one - Torin - steps forward cautiously.

"You killed these? Alone?"

You nod. "They attacked me. I had no choice."

He examines the wolves, then looks at you with new respect.

"These are the beasts that have been plaguing the forest roads. We've 
lost two hunters to them already." He pauses. "You've done the village 
a service, stranger. Even if you are covered in suspicious blood."

"Found a dead hunter back there," you say. "Marcus, I think his name was."

Torin's expression darkens. "Marcus. Damn. He was a good man." He looks 
at you carefully. "Did you kill him?"

You meet his gaze. "I don't know. I woke up this morning with no memory 
and blood on my hands. I'm trying to find out the truth."

Torin considers this for a long moment, then nods.

"Come to the village. The headman will want to hear about this. And... 
maybe we can help you figure out what happened. If you're willing to 
help us in return."
    `);
    
    forestState.metVillagers = true;
    forestState.killedWolves = true;
    forestState.villagersSuspicion += 0; // They're impressed, not suspicious
    forestState.hunterTrust += 2;
    updateQuestLog('Impressed villagers by slaying the wolves');
    
    await showContinue();
    await journey_to_village();
}

/**
 * Journey to village
 */
async function journey_to_village() {
    addStoryText('\n--- JOURNEY TO OAKRIDGE ---\n');
    
    await typeText(`The villagers lead you through the forest. Torin walks beside you, 
the other two keeping their distance.

"The village is about an hour's walk," he says. "Oakridge. Been here 
for generations. Good people, mostly."

"Mostly?"

He shrugs. "Every village has its troubles. We've had more than our 
share lately. Bandits on the roads. Strange things in the woods. 
People going missing."

"The wolves?"

"Among other things." He gives you a sidelong glance. "You really don't 
remember anything? Not even where you're from?"

You shake your head. "Just my name. ${gameState.currentCharacter.name}. 
Everything else is... blank."

"That's not natural. Could be a curse. Or maybe you hit your head." 
He pauses. "Or maybe someone wanted you to forget something."

That thought sends a chill down your spine.

After an hour of walking, you see smoke rising through the trees.

"Welcome to Oakridge," Torin says.
    `);
    
    await showContinue();
    await arrive_at_village();
}

/**
 * Arrive at Oakridge Village
 */
async function arrive_at_village() {
    addStoryText('\n--- OAKRIDGE VILLAGE ---\n');
    
    await typeText(`Oakridge is larger than you expected. Maybe three dozen wooden 
buildings clustered around a central square. A well in the middle. 
A blacksmith's forge. An inn with a painted sign.

People stop and stare as you pass. You're still covered in blood.

Torin leads you to the largest building - the headman's hall.

Inside, a large man with a thick beard sits at a table, discussing 
something with a woman in travel-worn clothes.

He looks up as you enter.

"Torin. What's this?"

"Found him in the forest, Aldric. Standing over Marcus's body."

The headman's expression hardens. "Marcus is dead?"

"Murdered. Multiple stab wounds."

The headman stands, his hand moving to the axe at his belt. "And you 
brought the murderer HERE?"

"We don't know he did it," Torin says quickly. "He claims he has no 
memory. And he killed the wolf pack that's been plaguing the roads."

The headman looks at you, his eyes sharp and assessing.

"Is this true? You have no memory?"

You meet his gaze. "It's the truth. I woke up this morning in the 
forest. I remember my name - ${gameState.currentCharacter.name} - 
and nothing else. I'm trying to find out what happened."
    `);
    
    const choice = await showChoices([
        'Tell them everything you found',
        'Keep some details to yourself',
        'Ask for their help investigating',
        'Demand to be released'
    ]);
    
    if (choice === 0) {
        await tell_full_truth();
    } else if (choice === 1) {
        await partial_truth();
    } else if (choice === 2) {
        await ask_for_help();
    } else {
        await demand_release();
    }
}

/**
 * Tell villagers everything
 */
async function tell_full_truth() {
    await typeText(`\nYou tell them everything. The blood. The clearing. The broken arrows. 
The hunter's note. The strange pendant. Everything.

When you finish, Aldric exchanges a look with the woman.

"What do you think, Elara?"

The woman steps forward. She has sharp features and intelligent eyes. 
A traveler's cloak is pinned with a bronze brooch.

"I'm a scholar," she says. "I've been researching disappearances in 
this region. Your story matches a pattern I've been tracking."

"What pattern?" you ask.

"People found with no memory. Often covered in blood. Sometimes they 
remember eventually. Sometimes they don't." She pulls out a journal. 
"It's happened six times in the last two months. All within ten miles 
of these woods."

Your heart races. "What causes it?"

"I don't know yet. That's what I'm trying to find out." She looks at 
Aldric. "I believe him. This is part of something bigger."

The headman grunts. "Even if you didn't kill Marcus... someone did. 
And until we know more, you're a suspect."

He pauses, then makes a decision.

"You'll stay in the village. Under watch. Help us investigate these 
disappearances, and maybe you'll find your answers too. Refuse, and 
I'll have you locked up until we figure this out."
    `);
    
    forestState.metScholar = true;
    forestState.knowsAboutPattern = true;
    forestState.villagersSuspicion += 0;
    updateQuestLog('Met Elara the Scholar');
    updateQuestLog('Discovery: Six others lost their memories this way');
    updateQuestLog('New objective: Investigate the disappearances');
    
    await showContinue();
    await village_investigation_start();
}

/**
 * Village investigation begins
 */
async function village_investigation_start() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    ACT II: THE INVESTIGATION');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Aldric assigns you a small room at the inn. Torin keeps watch, but 
he's not hostile - just cautious.

Elara finds you that evening.

"I want to help you," she says. "Not just for your sake - this is 
connected to my research. Six people with lost memories, and now you 
make seven. There's a pattern here, and I need to understand it."

She spreads her journal on the table.

"The other six - they all had similar experiences. Found in or near 
the forest. No memory. Often bloodied. Three of them eventually 
remembered what happened. The other three..." She trails off.

"What happened to them?"

"They went mad. Started claiming they were someone else. Had to be 
restrained. Eventually they escaped and vanished into the woods."

Your blood runs cold.

"What did the three who recovered remember?"

Elara flips through her notes. "They all described the same thing - 
a ritual. In the forest, at the old standing stones. Hooded figures. 
Some kind of ceremony. And then... nothing. They woke up with no 
memory of who they were."

She looks at you intensely.

"I think someone is conducting experiments. Testing something. And 
you're the latest victim."
    `);
    
    forestState.knowsAboutRitual = true;
    updateQuestLog('Theory: Someone is performing memory-wiping rituals');
    updateQuestLog('Location: Old standing stones in the forest');
    
    await showContinue();
    
    await typeText(`\n"We need to find those standing stones," you say.

"Agreed. But it's dangerous. The others who went back... some of them 
didn't return."

She pauses. "There's also the matter of Marcus. The hunter. We need to 
find out who really killed him. If it wasn't you, then the real killer 
is still out there."

"And if it was me?"

"Then we need to know WHY. What would make you kill a hunter? Unless..." 
Her eyes widen. "Unless you weren't you when you did it."

"What do you mean?"

"The ritual. What if it doesn't just erase memories? What if it... 
changes people? Makes them do things?"

The implications are terrifying.

"So I might have killed him. While under some kind of control."

"It's a theory. We won't know until we investigate."

She looks at you seriously. "Tomorrow we start. We have three leads:

1. The old standing stones - where the ritual supposedly happens
2. Marcus's cabin - we might find clues about what he was investigating
3. The other survivors - talk to the ones who got their memory back

Where do you want to start?"
    `);
    
    const choice = await showChoices([
        'Go to the standing stones',
        'Investigate Marcus\'s cabin',
        'Talk to the survivors',
        'Search the forest for more clues'
    ]);
    
    if (choice === 0) {
        await standing_stones_quest();
    } else if (choice === 1) {
        await marcus_cabin_quest();
    } else if (choice === 2) {
        await survivor_interviews();
    } else {
        await forest_search();
    }
}

/**
 * Standing stones quest
 */
async function standing_stones_quest() {
    addStoryText('\n--- THE OLD STANDING STONES ---\n');
    
    await typeText(`Elara leads you deep into the forest. It's midday, but under the 
thick canopy, it feels like twilight.

"The standing stones are ancient," she explains as you walk. "Pre-Roman. 
Maybe even older. The locals avoid them - say they're cursed."

"Are they?"

"I don't believe in curses. But there's definitely something unnatural 
about them. I've measured strange energy readings. Fluctuations in 
temperature. Animals refuse to go near."

After an hour of walking, you see them.

Four massive stones, each twice the height of a man, arranged in a circle. 
The ground inside the circle is bare earth - no grass, no life.

And in the center... bloodstains. Fresh.

"Someone was here recently," Elara whispers.

You approach cautiously. The air feels wrong here - heavy, oppressive.

On the stones themselves, you see carvings. Symbols you don't recognize. 
But looking at them makes your head throb.

Suddenly, pain explodes behind your eyes.

A MEMORY:

*Torches. Hooded figures. Chanting in a language you don't understand.*
*You're kneeling in the circle. Your hands are bound.*
*One of the figures approaches. Raises a knife.*
*"The ritual must be completed," a voice says. "Only through sacrifice..."*
*The knife comes down-*

You gasp and stumble backward.

"What happened?" Elara asks, concerned.

"I remembered something. I was here. There was a ritual. They were 
going to sacrifice me."

"But you escaped?"

"I... I don't know. The memory ended."
    `);
    
    forestState.memoryFragments++;
    forestState.visitedStones = true;
    updateQuestLog('MEMORY FRAGMENT 1: You were brought here for a ritual');
    updateQuestLog('MEMORY FRAGMENT 1: They tried to sacrifice you');
    
    await showContinue();
    await investigate_stones();
}

/**
 * Investigate the standing stones
 */
async function investigate_stones() {
    await typeText(`\nYou and Elara search the area carefully.

You find:
• More bloodstains leading away from the circle
• Torn fabric caught on branches - black cloth, like a ritual robe
• Footprints - at least six different people were here
• A dropped knife - ceremonial, with strange engravings

Elara examines the knife. "This is the same symbol pattern I've seen 
in ancient texts. It's connected to old Celtic rituals. Death magic."

"Death magic?"

"Rituals that involve sacrifice to gain power or knowledge. Forbidden 
for over a thousand years."

She pockets the knife. "Someone in this region is practicing the old ways. 
And they're using people like you as test subjects."

Before you can respond, you hear a sound.

Footsteps. Multiple people. Approaching fast.

"We need to hide," Elara hisses.

You duck behind one of the standing stones.

Three hooded figures enter the clearing. They move to the center of the 
circle and begin setting up... another ritual.

One of them speaks: "The last sacrifice escaped. We need a replacement 
for tonight's ceremony. The master won't tolerate another failure."

"What about the one in Oakridge?" another says. "The one who claims to 
have no memory?"

"Perfect. We'll take him tonight."

*They're talking about ME.*
    `);
    
    const choice = await showChoices([
        'Attack them now while they\'re unprepared',
        'Sneak away and warn the village',
        'Try to capture one for questioning',
        'Keep listening to learn more'
    ]);
    
    if (choice === 0) {
        await attack_cultists();
    } else if (choice === 1) {
        await sneak_away();
    } else if (choice === 2) {
        await capture_cultist();
    } else {
        await keep_listening();
    }
}

/**
 * Keep listening to the cultists
 */
async function keep_listening() {
    await typeText(`\nYou signal to Elara to stay quiet. You need to hear more.

The cultists continue their conversation:

"The master says we're close to perfecting the ritual. Once we succeed, 
we'll be able to transfer memories, identities, even souls from one 
body to another."

"Immortality," one breathes.

"For those worthy. The sacrifices provide the energy. Their life force 
fuels the transformation."

*They're trying to steal people's identities. Transfer souls into new bodies.*

"What about the ones who went mad?"

"Failed transfers. The old consciousness fought back. Drove both souls 
insane." A pause. "But the last few have been more successful. The hunter 
especially."

Your blood runs cold.

"Marcus was a perfect host. Strong. Skilled. We used the wanderer's soul 
to inhabit his body."

*Marcus wasn't killed. He was POSSESSED. Someone's soul was transferred 
into him, driving out his own consciousness.*

*And the real Marcus - his soul - where did it go?*

Then the horrible realization hits you.

*The bloodied wanderer. The one Marcus was tracking. The one with no memory.*

*That was Marcus's soul. In someone else's body. YOUR body.*

*You're not you. You're Marcus. And your real body is walking around 
with someone else inside it.*
    `);
    
    forestState.memoryFragments++;
    forestState.discoveredTruth = true;
    updateQuestLog('TRUTH REVEALED: You are Marcus the Hunter');
    updateQuestLog('Your soul was transferred into another body');
    updateQuestLog('Your real body was taken by the cultists');
    
    await showContinue();
    await after_revelation();
}

/**
 * After the terrible revelation
 */
async function after_revelation() {
    await typeText(`\nThe world spins. You look down at your hands - not YOUR hands. 
Someone else's.

You are Marcus. Your body was stolen. You've been wearing someone 
else's skin.

*And the person in my original body... they killed this body's original 
owner and made it look like I did it.*

Elara grabs your arm. "We need to go. Now. Before they see us."

You let her pull you away, moving on autopilot.

The cultists don't notice.

Once you're far enough away, Elara stops.

"Did you hear what they said? Body-swapping. Soul transference. It's 
impossible. It's-"

"It's real," you say quietly. "I remember now. Not everything, but... 
pieces. I'm Marcus. I was tracking someone in the woods - the real 
owner of this body. We fought. They knocked me out. When I woke up... 
I was in their body. And they were in mine."

Elara stares at you. "That's... that's horrible."

"They killed me. Or tried to. They stabbed me - this body - and left 
me to die. But I survived. Barely. Wandered into the forest, confused, 
bleeding, until I passed out."

You touch your head. "The trauma. The blood loss. That's why I couldn't 
remember. Not magic - just injury."

"But you remember now?"

"Some of it. The fight. Being drugged. Waking up wrong. Everything else 
is still foggy."

Elara paces. "This changes everything. If they can really transfer souls... 
anyone could be a victim. Your friends. Your family. How would you know?"

"We have to stop them. Get my body back. And save anyone else they've 
trapped."
    `);
    
    await showContinue();
    
    await typeText(`\n"First we need proof," Elara says. "The village won't believe us 
without evidence. We need to catch one of the cultists. Or find where 
they're keeping the original owners' souls."

"Or both."

She nods. "Tonight. They said they're planning another ritual. We can 
ambush them."

"And get my body back."

"That too. But we'll need help. This is too dangerous for just the 
two of us."

"Torin. And the other hunters. They'll help if we can prove what's 
happening."

"Then let's go. We have until nightfall to prepare."

You head back to Oakridge, mind racing with plans.

This is no longer about recovering lost memories.

This is about reclaiming your life.

And stopping a cult of soul-stealers from destroying anyone else's.
    `);
    
    await showContinue();
    await prepare_for_final_confrontation();
}

/**
 * Prepare for the final battle
 */
async function prepare_for_final_confrontation() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    ACT III: RECLAMATION');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Back in Oakridge, you gather allies.

Torin listens to your story with growing horror. "Soul-swapping? That's... 
that's dark magic. The darkest kind."

"Will you help us?"

He doesn't hesitate. "Marcus was my friend. If there's a chance to save 
him - to save YOU - I'll fight."

Aldric, the headman, is harder to convince. But Elara's research and your 
detailed knowledge of Marcus's life (memories returning in fragments) 
eventually persuade him.

"We'll gather the hunters. Twenty good men. If these cultists want a 
fight, we'll give them one."

You spend the afternoon preparing:
• The blacksmith makes you proper weapons
• The healer provides potions and bandages
• Elara draws maps of the standing stones
• Torin briefs the hunters on the plan

As sunset approaches, you stand ready.

Twenty armed villagers. One scholar. And you - a hunter's soul trapped 
in a stranger's body, fighting to reclaim what was stolen.

"One thing I don't understand," Torin says as you prepare to leave. 
"If they transferred your soul into that body... where's the original 
owner's soul? The person who used to be you?"

You pause. That's a good question.

"Maybe it was destroyed in the process," Elara suggests. "Or maybe..."

"Maybe they're in MY body," you finish. "Maybe the transfer was mutual. 
They're Marcus now, and I'm..."

You realize you still don't know the name of the body you're wearing.

"Tonight we get answers," you say grimly. "And we end this."

The sun sets.

You march toward the standing stones.

Toward your final confrontation.
    `);
    
    await showContinue();
    await final_battle();
}

/**
 * Final battle at the standing stones
 */
async function final_battle() {
    addStoryText('\n--- FINAL CONFRONTATION ---\n');
    
    await typeText(`The standing stones loom in the darkness, illuminated by torchlight.

The cultists are there - a dozen of them, gathered around the circle. 
At the center, bound to a stake, is a young woman. Their next victim.

And standing at the head of the circle, directing the ritual...

Your body. Marcus's body. Stolen and worn by someone else.

The cult leader turns, and you see your own face twisted into an 
expression you've never worn - cruel, arrogant, hungry for power.

"Well well," he says in your voice - but the accent is wrong, the 
mannerisms foreign. "The lost soul returns. Tell me, do you like your 
new skin? I quite enjoy mine."

"Who are you?" you demand.

"Someone who was dying. Someone who needed a second chance at life. 
Your body was... convenient."

"You killed me. Stole my body. Murdered innocent people."

He shrugs. "Casualties of progress. You should be honored - your flesh 
serves a greater purpose now."

Rage boils in your chest. "I want my body back."

"Come and take it."

He raises his hands, and the cultists move to attack.

The villagers surge forward. Battle erupts around the standing stones.
    `);
    
    await showContinue();
    
    // Create a boss version of the possessed body
    const boss = createEnemy('The Possessed Marcus', 120, 80, 5, 'boss');
    
    await typeText(`\nYou charge toward your stolen body, pushing through cultists.

He meets you in the center of the circle, a sword in hand.

"How ironic," he laughs. "Fighting yourself. Shall we see who's the 
better Marcus?"

The final battle begins.
    `);
    
    await showContinue();
    
    const combat = new Combat(gameState.currentCharacter, boss);
    const result = await combat.start();
    
    if (result === 'victory') {
        await victory_ending();
    } else if (result === 'fled') {
        await fled_ending();
    }
    // Death handled by system
}

/**
 * Victory ending
 */
async function victory_ending() {
    await typeText(`\nYour blade finds its mark. The cult leader - wearing your body - 
falls to his knees, blood spreading across his chest.

Your chest. Your blood.

"Clever," he gasps. "You... aimed for the heart. Quick death. Almost... 
merciful."

"I couldn't let you suffer in my body," you say. "Even if you don't 
deserve mercy."

He laughs, blood on his lips. "The ritual... it can't be reversed. 
You know that, right? You're stuck. Forever wearing someone else's skin."

Horror washes over you. "No. There has to be a way-"

"There isn't. I made sure of that." His eyes are fading. "You'll live 
the rest of your life as an imposter. Every mirror a reminder. Every 
friend a stranger. Enjoy your victory... Marcus."

He dies.

You stand over your own corpse, numb.

Elara approaches, placing a hand on your shoulder. "I'm sorry."

The other cultists are dead or captured. The ritual broken. The bound 
woman freed.

But you... you're trapped.

Marcus the hunter is dead. His body cold on the ground.

And you're... someone else. Some unfortunate soul whose body you now 
inhabit. Whose name you still don't know.
    `);
    
    await showContinue();
    await epilogue();
}

/**
 * Epilogue
 */
async function epilogue() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                         EPILOGUE');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Three months later.

You stand in Oakridge village, no longer a stranger. The villagers know 
the truth now - that their friend Marcus died protecting them, and his 
soul lives on in a borrowed body.

They've accepted you. Call you Marcus still. But you know the truth.

Elara found records eventually. The body you wear belonged to a wanderer 
named Erik - a nobody, a drifter with no family, no ties. Convenient 
for the cultists.

Erik is gone. You're what remains.

You've taken over Marcus's old cabin. His work. The villagers pay you 
to hunt and track, same as they did before.

Almost like nothing changed.

Except everything changed.

You catch your reflection in the well water sometimes - Erik's face 
staring back. Still strange. Still wrong.

But you're alive. The cult is destroyed. The village is safe.

It's not the ending you wanted.

But it's the ending you earned.

The adventure continues. Just... not as yourself.
    `);
    
    await showContinue();
    
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    ADVENTURE COMPLETE');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    addGold(gameState.currentCharacter, 200);
    addExperience(gameState.currentCharacter, 500);
    updateQuestLog('COMPLETED: Blood in the Woods');
    updateQuestLog('The cult was destroyed, but at great cost');
    updateQuestLog('You live on in Erik\'s body, Marcus\'s soul enduring');
    
    await typeText(`\nYou have completed BLOOD IN THE WOODS!

Rewards:
• 200 Gold
• 500 Experience
• Title: "Soul Survivor"
• The knowledge that some mysteries are better left unsolved

Thank you for playing!
    `);
    
    await showContinue();
    await adventure_complete();
}

/**
 * Adventure complete - return to main menu
 */
async function adventure_complete() {
    gameState.currentAdventure = null;
    saveGameProgress();
    
    const choice = await showChoices([
        'Return to Main Menu',
        'Explore Oakridge (Free Roam)',
        'Start New Adventure'
    ]);
    
    if (choice === 0) {
        showMainMenu();
    } else if (choice === 1) {
        await freeRoamOakridge();
    } else {
        showAdventureSelect();
    }
}

// Placeholder functions for branches not fully implemented
async function wash_blood() {
    addStoryText('\n--- THE STREAM ---\n');
    
    await typeText(`You follow the sound of running water until you find a small stream, 
crystal clear and cold.

You kneel beside it and plunge your hands into the icy water. The blood 
turns the stream pink as it washes away. You scrub your arms, your face, 
trying to remove every trace of what happened.

But some stains run deeper than skin.

As you wash, you notice your reflection in the water. Your face is gaunt, 
exhausted. There are scratches on your cheek you don't remember getting.

*Who am I? What did I do?*

The blood washes away, but not the questions. Not the guilt.`);
    
    forestState.washedBlood = true;
    forestState.moralityScore += 1; // Trying to clean up = slight good tendency
    updateQuestLog('Washed the blood away - but questions remain');
    
    await showContinue();
    
    await typeText(`As you finish washing, you hear something - footsteps approaching 
through the undergrowth.

Someone's coming!`);
    
    const choice = await showChoices([
        'Hide behind the rocks and observe',
        'Stand up and call out to them',
        'Grab a rock as a weapon and wait',
        'Run deeper into the forest'
    ]);
    
    if (choice === 0) {
        await hide_by_stream();
    } else if (choice === 1) {
        await call_out_at_stream();
    } else if (choice === 2) {
        await prepare_ambush_stream();
    } else {
        await run_from_stream();
    }
}

async function hide_by_stream() {
    addStoryText('\n--- HIDDEN OBSERVER ---\n');
    
    await typeText(`You quickly duck behind the rocks, peering out carefully.

A young woman emerges from the trees carrying a water jug. She can't be 
more than twenty, with long dark hair and simple peasant clothes.

She kneels at the stream to fill her jug, humming softly to herself.

Then she stops. She's staring at the water - at the pink tinge from your 
blood-washing.

Her eyes widen. She looks around nervously.`);
    
    forestState.stealthApproach = true;
    
    const choice = await showChoices([
        'Reveal yourself calmly - "I mean no harm"',
        'Stay hidden until she leaves',
        'Approach quietly and grab her - demand answers',
        'Make noise to scare her away'
    ]);
    
    if (choice === 0) {
        await reveal_to_water_girl();
    } else if (choice === 1) {
        await wait_for_girl_to_leave();
    } else if (choice === 2) {
        forestState.violenceLevel++;
        await attack_water_girl();
    } else {
        await scare_water_girl();
    }
}

async function reveal_to_water_girl() {
    await typeText(`You step out slowly, hands raised. "I mean no harm."

She gasps and jumps back, nearly dropping her jug. Her hand goes to a 
small knife at her belt.

"Who... who are you?" she stammers. "That blood in the water - what 
happened?"

You look down at yourself. The blood is gone, but your clothes are still 
stained and torn.

"I... I don't know," you admit. "I woke up in the forest. I can't 
remember anything."

She studies you warily. "You're the one they're looking for, aren't you? 
The bloody stranger from the forest?"

*They're looking for me?*`);
    
    const choice = await showChoices([
        'Ask who is looking for you',
        'Beg her not to tell anyone',
        'Demand she tell you everything she knows',
        'Offer her money to keep quiet'
    ]);
    
    if (choice === 0) {
        await ask_about_searchers();
    } else if (choice === 1) {
        await beg_for_silence();
    } else if (choice === 2) {
        forestState.violenceLevel++;
        await threaten_water_girl();
    } else {
        await bribe_water_girl();
    }
}

async function ask_about_searchers() {
    await typeText(`"Who's looking for me?" you ask.

She hesitates, then: "The village sent out search parties this morning. 
Old Marcus the hunter didn't come home last night. They found... they 
found blood. And tracks. Leading into the deep forest."

*Marcus. The dead hunter.*

"They think someone killed him," she continues. "Bandits, maybe. Or... 
something worse. There are stories about these woods."

You feel a chill. "What kind of stories?"

"Strange things," she whispers. "People disappearing. Voices in the 
night. Some say there's a cult in the old ruins, doing dark rituals."

She looks at you differently now - not just with fear, but with a strange 
kind of understanding.

"You really don't remember anything?" she asks softly.

You shake your head.

"Then maybe..." she pauses. "Maybe you should come to the village. Talk 
to Elder Aldric. He might be able to help you."

Or he might throw you in chains.`);
    
    forestState.metWaterGirl = true;
    forestState.elderTrust += 5;
    
    const choice = await showChoices([
        'Accept her offer - go to the village',
        'Ask her to bring the Elder here instead',
        'Decline and go deeper into the forest',
        'Ask her to tell you more about Marcus first'
    ]);
    
    if (choice === 0) {
        await follow_water_girl_to_village();
    } else if (choice === 1) {
        await request_elder_visit();
    } else if (choice === 2) {
        await decline_village_offer();
    } else {
        await ask_about_marcus();
    }
}

async function find_village() {
    addStoryText('\n--- SEARCHING FOR CIVILIZATION ---\n');
    
    await typeText(`You decide to find help - or at least answers. Somewhere nearby 
there must be a village or settlement.

You walk for about an hour, following what looks like an old game trail. 
The forest is dense here, the canopy blocking most of the sunlight.

Then you smell it - woodsmoke.

Following the scent, you emerge onto a small rise. Below, nestled in a 
valley, you see a village. Perhaps two dozen buildings, a small chapel, 
fields of crops.

Normal. Peaceful. Everything you're not right now.

From this vantage point, you can observe the village before approaching. 
Several villagers are going about their daily work. You can see:

• A market square with a merchant's stall
• The village chapel with an elderly priest tending the garden
• A smithy with smoke rising from the forge
• What looks like a tavern or inn
• Guards patrolling - about four armed men

They haven't seen you yet. You're still covered in blood-stained clothes.`);
    
    forestState.foundVillagePath = true;
    forestState.cluesFound++;
    updateQuestLog('Found a village - but how to approach?');
    
    const choice = await showChoices([
        'Walk in openly and ask for help',
        'Sneak into the village and steal fresh clothes first',
        'Observe from hiding and gather information',
        'Approach the isolated priest at the chapel',
        'Try to signal the merchant to come meet you privately'
    ]);
    
    if (choice === 0) {
        await walk_into_village_bloody();
    } else if (choice === 1) {
        forestState.stealthApproach = true;
        await sneak_into_village();
    } else if (choice === 2) {
        await observe_village();
    } else if (choice === 3) {
        await approach_priest();
    } else {
        await signal_merchant();
    }
}

async function find_more_clues() {
    addStoryText('\n--- THOROUGH SEARCH ---\n');
    
    await typeText(`You search the clearing methodically, looking for anything that 
might explain what happened here.

Examining the broken arrows more closely, you notice they're crudely made - 
not military or hunter's arrows. Bandits? Or something worse?

You find several footprints in the soft earth:
• Your own boots (you recognize the pattern now)
• Bare feet - large, with claw-like impressions
• Standard boots - probably the hunter's
• And something else... strange symbols scraped into the dirt

The symbols are unlike anything you've seen. They form a rough circle 
around the blood pool. Ritual markings?

Then you find something else - partially buried under leaves. A small 
leather journal.`);
    
    forestState.cluesFound++;
    forestState.foundClueTypes.physical++;
    
    const choice = await showChoices([
        'Read the journal',
        'Examine the ritual symbols more closely',
        'Follow the bare footprints',
        'Continue searching for more evidence'
    ]);
    
    if (choice === 0) {
        await read_mysterious_journal();
    } else if (choice === 1) {
        await examine_ritual_symbols();
    } else if (choice === 2) {
        await follow_bare_footprints();
    } else {
        await continue_search_clearing();
    }
}

async function read_mysterious_journal() {
    await typeText(`You open the journal. The handwriting is shaky, desperate.

"They came for me in the night. The Others. They said I was chosen. 
Said I would be reborn.

I ran. God help me, I ran. But they're in my head now. I can hear 
them whispering. Telling me to come back. To accept it.

The ritual happens on the new moon. At the old stone circle. They'll 
transfer the soul of their fallen leader into a new vessel. A hunter. 
A strong body to house an ancient evil.

Marcus is tracking me. Good man. Maybe he can stop this. Maybe he can 
end me before I become... something else.

If you're reading this, I'm probably dead. Or worse.

Destroy the stone circle. Break the ritual. Don't let them complete it.

My name is... was... Thomas. And I was a fool to trust them."

The journal ends there.

*Thomas. The body in the woods must be Thomas. But where's Marcus?*

*And what about me? Am I another victim? Or...*`);
    
    forestState.knowsAboutRitual = true;
    forestState.cluesFound += 2;
    forestState.foundClueTypes.supernatural++;
    updateQuestLog('CRITICAL: Learned about the soul transfer ritual!');
    updateQuestLog('The stone circle must be destroyed');
    
    await showContinue();
    await after_journal_discovery();
}

async function after_journal_discovery() {
    await typeText(`The pieces are starting to come together, but questions remain.

If Thomas was the target of the ritual, and Marcus was tracking him... 
then where do YOU fit into all this?

You need more information.`);
    
    const choice = await showChoices([
        'Head to the stone circle immediately',
        'Try to find Marcus - he might still be alive',
        'Go to the village and warn them',
        'Search for more evidence about the cult'
    ]);
    
    if (choice === 0) {
        await rush_to_stone_circle();
    } else if (choice === 1) {
        await search_for_marcus();
    } else if (choice === 2) {
        await warn_village();
    } else {
        await investigate_cult_further();
    }
}

async function search_around_body() {
    await typeText("\nThis path is still being written...");
    await showContinue();
    await after_hunter_body();
}

async function after_villagers_leave() {
    await typeText("\nYou're alone again. Time to decide your next move...");
    await showContinue();
    await deeper_forest();
}

async function deeper_forest() {
    await typeText("\nYou venture deeper into the forest...");
    await showContinue();
    await find_village();
}

async function prepare_for_fight() {
    await typeText("\nYou prepare to defend yourself...");
    await showContinue();
    await meet_villagers();
}

async function partial_truth() {
    await tell_full_truth(); // For now, same outcome
}

async function ask_for_help() {
    await tell_full_truth(); // For now, same outcome
}

async function demand_release() {
    await typeText("\nDemanding your freedom doesn't go well...");
    forestState.villagersSuspicion += 2;
    await showContinue();
    await tell_full_truth();
}

async function marcus_cabin_quest() {
    await typeText("\nMarcus's cabin might hold clues...");
    await showContinue();
    await standing_stones_quest();
}

async function survivor_interviews() {
    await typeText("\nTalking to other survivors...");
    await showContinue();
    await standing_stones_quest();
}

async function forest_search() {
    await typeText("\nSearching the forest for clues...");
    await showContinue();
    await standing_stones_quest();
}

async function attack_cultists() {
    await typeText("\nYou attack, but they overwhelm you...");
    await showContinue();
    await keep_listening();
}

async function sneak_away() {
    await typeText("\nYou sneak away to warn the village...");
    await showContinue();
    await keep_listening();
}

async function capture_cultist() {
    await typeText("\nYou try to capture one, but they escape...");
    await showContinue();
    await keep_listening();
}

async function fled_ending() {
    await typeText("\nYou flee, but the cult remains...");
    await showContinue();
    await bad_ending();
}

async function bad_ending() {
    await typeText("\nThe adventure ends in failure. The cult continues their dark work...");
    await showContinue();
    await adventure_complete();
}

async function quick_cleanup() {
    await typeText("\nYou try to clean up, but it's too late...");
    await showContinue();
    await meet_villagers_after_combat();
}

async function hide_evidence() {
    await typeText("\nYou try to hide the bodies, but the villagers arrive...");
    await showContinue();
    await meet_villagers_after_combat();
}

async function freeRoamOakridge() {
    await typeText("\nFree roam mode not yet implemented...");
    await showContinue();
    showMainMenu();
}

// ============================================
// NEW EXPANDED CONTENT - WATER GIRL PATH
// ============================================

async function call_out_at_stream() {
    await typeText(`You stand up and call out: "Hello! I need help!"

The woman screams and drops her jug, stumbling backwards.

"Please, wait!" you shout. "I'm not going to hurt you!"

But she's already running, crashing through the undergrowth.

Damn it.`);
    
    forestState.villagersSuspicion += 10;
    updateQuestLog('Scared the water-carrier - she will warn the village');
    
    await showContinue();
    await village_on_alert();
}

async function prepare_ambush_stream() {
    await typeText(`You grab a heavy rock and crouch low, waiting.

When the woman kneels to fill her jug, you stand up behind her.

"Don't scream," you say quietly, menacingly.

She freezes, terrified.

This isn't who you want to be. But you need answers.`);
    
    forestState.violenceLevel += 2;
    forestState.moralityScore -= 5;
    
    await threaten_water_girl();
}

async function run_from_stream() {
    await typeText(`You turn and run deeper into the forest before she can see you.

Better to avoid people until you understand what's happening.

You run until your lungs burn, then collapse against a tree.

You're alone. Lost. And no closer to answers.`);
    
    await showContinue();
    await deeper_into_forest_alone();
}

async function wait_for_girl_to_leave() {
    await typeText(`You wait silently as she fills her jug. She keeps glancing at the 
pink water, clearly disturbed.

Finally, she hurries away, constantly looking back over her shoulder.

You're alone again.

But now you know: there's a village nearby. And they're probably looking 
for whoever left that blood.`);
    
    forestState.stealthApproach = true;
    
    const choice = await showChoices([
        'Follow her to the village at a distance',
        'Search for another way to approach',
        'Go deeper into the forest instead'
    ]);
    
    if (choice === 0) {
        await follow_to_village_stealthily();
    } else if (choice === 1) {
        await find_village();
    } else {
        await deeper_into_forest_alone();
    }
}

async function beg_for_silence() {
    await typeText(`"Please," you say, your voice breaking. "I don't know what happened. 
I woke up covered in blood and I can't remember anything. If they find 
me like this, they'll kill me."

She studies your face, searching for deception.

"You really don't remember?" she asks softly.

You shake your head.

She bites her lip, thinking. "My name is Elena. I... I believe you. 
There's something wrong in these woods. People have been acting strange. 
Disappearing."

She makes a decision. "Come with me. There's an old hunting cabin not 
far from here. You can hide there while I bring you some clean clothes 
and food. Then we'll figure out what to do."

Maybe there's still kindness in this dark world.`);
    
    forestState.metElena = true;
    forestState.helperCount = (forestState.helperCount || 0) + 1;
    forestState.moralityScore += 3;
    
    await showContinue();
    await hide_in_cabin_with_elena();
}

async function threaten_water_girl() {
    await typeText(`You grab her roughly. "Tell me everything. What village? Who's looking 
for me? What happened to Marcus?"

She whimpers in fear. "P-please! I'll tell you anything! Just don't 
hurt me!"

"Talk," you growl.

She tells you about Oakridge village, about the search parties, about 
the strange disappearances. She's terrified, trembling.

When you finally let her go, she runs without looking back.

You feel sick. This isn't right. But you got what you needed.`);
    
    forestState.villagersSuspicion += 20;
    forestState.violenceLevel += 3;
    forestState.moralityScore -= 10;
    updateQuestLog('Threatened an innocent woman - the village will know');
    
    await showContinue();
    await village_on_high_alert();
}

async function bribe_water_girl() {
    await typeText(`You pull out the few copper coins you found. "I have money. Not much, 
but it's yours if you help me. I need information and I need you to 
stay quiet."

She eyes the coins. For a peasant girl, even a few copper might mean 
the difference between eating and starving.

"How much?" she asks warily.`);
    
    const playerGold = gameState.currentCharacter.gold;
    
    const choice = await showChoices([
        `Give her all your gold (${playerGold} gold)`,
        'Give her half (promise more later)',
        'Just a few coins to start',
        'Never mind - withdraw the offer'
    ]);
    
    if (choice === 0 && playerGold >= 5) {
        removeGold(gameState.currentCharacter, playerGold);
        forestState.bribedElena = true;
        forestState.elderTrust += 10;
        await elena_fully_bribed();
    } else if (choice === 1 && playerGold >= 3) {
        removeGold(gameState.currentCharacter, Math.floor(playerGold / 2));
        forestState.bribedElena = true;
        await elena_partially_bribed();
    } else if (choice === 2) {
        removeGold(gameState.currentCharacter, 2);
        await elena_small_bribe();
    } else {
        await elena_insulted();
    }
}

async function follow_water_girl_to_village() {
    await typeText(`Elena leads you through the forest, taking hidden paths you would 
never have found alone.

"Stay close," she whispers. "And let me do the talking."

After about twenty minutes, you reach the edge of Oakridge village.`);
    
    forestState.metElena = true;
    forestState.hasAlly = true;
    
    await showContinue();
    await arrive_at_oakridge_with_elena();
}

// ============================================
// VILLAGE APPROACH PATHS
// ============================================

async function walk_into_village_bloody() {
    addStoryText('\n--- BOLD APPROACH ---\n');
    
    await typeText(`You take a deep breath and walk straight down the hill toward the 
village.

People stop what they're doing and stare. A woman gasps and pulls her 
child close. The guards immediately draw their weapons.

"HALT!" one shouts. "Identify yourself!"

You're surrounded in seconds. Four guards, weapons pointed at you.

"I... I need help," you say. "I can explain."

"Explain the blood?" the guard captain snarls. "Marcus the hunter went 
missing last night. You're covered in blood. I think we found our killer."

This isn't going well.`);
    
    forestState.villagersSuspicion += 30;
    forestState.guardHostility += 20;
    
    const choice = await showChoices([
        'Surrender peacefully',
        'Try to explain about your amnesia',
        'Fight your way out',
        'Run back to the forest'
    ]);
    
    if (choice === 0) {
        await surrender_to_guards();
    } else if (choice === 1) {
        await explain_amnesia_to_guards();
    } else if (choice === 2) {
        forestState.violenceLevel += 5;
        await fight_village_guards();
    } else {
        await flee_from_village();
    }
}

async function sneak_into_village() {
    addStoryText('\n--- STEALTH APPROACH ---\n');
    
    await typeText(`You wait until dusk, then circle around to the back of the village.

There's a clothesline behind one of the houses. Perfect.

You creep forward, staying in the shadows. Grab a simple tunic and 
trousers. They smell of woodsmoke and honest labor.

You change quickly, burying your blood-stained clothes under some leaves.

Now you look like any other peasant.`);
    
    forestState.hasStolenClothes = true;
    forestState.stealthApproach = true;
    forestState.moralityScore -= 2;
    
    await showContinue();
    await typeText(`You slip into the village, joining the evening crowd. No one gives you 
a second glance.

You can see:
• The tavern - warm light and laughter spilling out
• The market stalls are closing for the night  
• The chapel - a priest is lighting candles
• The guard post - men changing shifts

Where to start?`);
    
    const choice = await showChoices([
        'Go to the tavern - loosen some tongues with ale',
        'Visit the merchant before he closes',
        'Speak with the priest - maybe confess?',
        'Eavesdrop on the guards'
    ]);
    
    if (choice === 0) {
        await visit_tavern();
    } else if (choice === 1) {
        await visit_merchant();
    } else if (choice === 2) {
        await visit_priest();
    } else {
        await eavesdrop_on_guards();
    }
}

// ============================================
// MERCHANT / SHOP SYSTEM
// ============================================

async function visit_merchant() {
    addStoryText('\n--- THE MERCHANT\'S STALL ---\n');
    
    await typeText(`The merchant is an older man with sharp eyes and a calculating smile. 
His stall is filled with goods - weapons, tools, potions, and trinkets.

"Welcome, friend!" he says cheerily. "Oswald's Oddities and Essentials. 
Looking for anything in particular?"

He looks you over carefully, noting your simple clothes.

"Just arrived in Oakridge, have you? Terrible time for it. There's been... 
unpleasantness in the forest."

You try to keep your expression neutral.`);
    
    const playerGold = gameState.currentCharacter.gold;
    
    await typeText(`\nYou have ${playerGold} gold.

OSWALD'S SHOP:
• Health Potion (Heals 50 HP) - 15 gold
• Better Knife (Attack +3) - 25 gold
• Leather Armor (Defense +5) - 40 gold
• Rope and Grappling Hook - 10 gold
• Lantern and Oil - 8 gold
• Information about the forest - 20 gold
• Map of the area - 5 gold
• "Special item" (???) - 50 gold`);
    
    const choice = await showChoices([
        'Buy Health Potion (15g)',
        'Buy Better Knife (25g)',
        'Buy Leather Armor (40g)',
        'Buy Information (20g)',
        'Buy Map (5g)',
        'Ask about the "special item"',
        'Just browse and leave'
    ]);
    
    if (choice === 0 && playerGold >= 15) {
        await buy_health_potion();
    } else if (choice === 1 && playerGold >= 25) {
        await buy_better_knife();
    } else if (choice === 2 && playerGold >= 40) {
        await buy_leather_armor();
    } else if (choice === 3 && playerGold >= 20) {
        await buy_information_from_merchant();
    } else if (choice === 4 && playerGold >= 5) {
        await buy_map();
    } else if (choice === 5) {
        await ask_about_special_item();
    } else if (playerGold < 5) {
        await too_poor_for_shop();
    } else {
        await leave_merchant();
    }
}

async function buy_health_potion() {
    removeGold(gameState.currentCharacter, 15);
    gameState.currentCharacter.inventory.addItem(SAMPLE_ITEMS.healthPotion, 1);
    
    await typeText(`You buy the health potion. Oswald wraps it carefully in cloth.

"Good choice," he says. "You never know when you might need healing out 
here."

He gives you a knowing look.`);
    
    await showContinue();
    await merchant_followup();
}

async function buy_better_knife() {
    removeGold(gameState.currentCharacter, 25);
    gameState.currentCharacter.stats.attack += 3;
    forestState.hasBetterKnife = true;
    
    await typeText(`You purchase the knife. It's well-balanced, sharp, and deadly.

"That's hunter's steel," Oswald says. "Belonged to old Marcus, actually. 
He sold it to me last week. Said he had a bad feeling and wanted the gold..."

He trails off, realizing what he's said.

"Poor bastard," he mutters.`);
    
    updateQuestLog('Acquired Marcus\'s knife - Attack +3');
    
    await showContinue();
    await merchant_followup();
}

async function buy_information_from_merchant() {
    removeGold(gameState.currentCharacter, 20);
    
    await typeText(`"Information, eh?" Oswald leans in close. "What do you want to know?"

"The forest," you say. "The disappearances. What's really going on?"

He glances around to make sure no one's listening.

"There's a cult," he whispers. "Been around for years, hiding in the old 
ruins north of here. The Stone Circle. They worship something dark - 
something that predates the village."

"What do they want?"

"Immortality," he says. "They believe they can transfer souls from dying 
bodies into healthy ones. Keep living forever by stealing new flesh."

Your blood runs cold.

"Three people have gone missing in the last month," he continues. "Including 
a traveler named Thomas. And now Marcus..."

He looks at you meaningfully. "You should leave Oakridge, stranger. Before 
you're next."

But you might already BE next.`);
    
    forestState.knowsAboutCult = true;
    forestState.cluesFound += 3;
    updateQuestLog('CRITICAL: Learned cult seeks immortality through soul transfer!');
    
    await showContinue();
    await merchant_followup();
}

async function merchant_followup() {
    await typeText(`"Anything else?" Oswald asks.`);
    
    const playerGold = gameState.currentCharacter.gold;
    
    if (playerGold >= 5) {
        const choice = await showChoices([
            'Buy something else',
            'Ask more questions',
            'Leave the shop'
        ]);
        
        if (choice === 0) {
            await visit_merchant();
        } else if (choice === 1) {
            await ask_merchant_questions();
        } else {
            await leave_merchant();
        }
    } else {
        await typeText(`You're out of gold.`);
        await showContinue();
        await leave_merchant();
    }
}

// ============================================
// TAVERN PATH
// ============================================

async function visit_tavern() {
    addStoryText('\n--- THE RUSTY BOAR TAVERN ---\n');
    
    await typeText(`The tavern is warm and crowded. The smell of roasted meat and cheap 
ale fills the air.

You slip inside and find a dark corner table. A barmaid approaches.

"What'll it be?" she asks, eyeing you. "We got ale, wine, or stew."

Around the tavern you can hear fragments of conversation:
• A group of hunters discussing Marcus's disappearance
• Two farmers whispering about "the cult"
• A drunk man ranting about monsters in the woods
• A hooded figure sitting alone in the far corner

Where to focus your attention?`);
    
    const playerGold = gameState.currentCharacter.gold;
    
    const choice = await showChoices([
        `Buy ale and listen to the hunters (3 gold)`,
        `Buy drinks for the farmers and chat (5 gold)`,
        'Try to talk to the drunk man (free but risky)',
        'Approach the hooded figure',
        'Just listen from your corner'
    ]);
    
    if (choice === 0 && playerGold >= 3) {
        await eavesdrop_on_hunters();
    } else if (choice === 1 && playerGold >= 5) {
        await drink_with_farmers();
    } else if (choice === 2) {
        await talk_to_drunk();
    } else if (choice === 3) {
        await approach_hooded_figure();
    } else {
        await tavern_passive_listening();
    }
}

console.log('✅ dark_forest.js loaded - BLOOD IN THE WOODS edition');


// ============================================
// PLACEHOLDER FUNCTIONS (To be expanded)
// ============================================

async function village_on_alert() {
    await typeText("\nThe village is now on high alert. Guards patrol everywhere...");
    await showContinue();
    await find_village();
}

async function deeper_into_forest_alone() {
    await typeText("\nYou venture deeper into the dark forest, alone and afraid...");
    await showContinue();
    await deeper_forest();
}

async function hide_in_cabin_with_elena() {
    await typeText("\nElena leads you to a hidden cabin. 'Stay here,' she says. 'I'll help you.'");
    forestState.helperCount = (forestState.helperCount || 0) + 1;
    await showContinue();
    await elena_brings_supplies();
}

async function village_on_high_alert() {
    await typeText("\nThe entire village is mobilizing. You've made enemies today...");
    forestState.villagersSuspicion += 30;
    await showContinue();
    await hunted_by_village();
}

async function elena_fully_bribed() {
    await typeText("\nElena pockets the gold, eyes wide. 'This is... more than I make in a month. Thank you. I'll help you however I can.'");
    forestState.hasStrongAlly = true;
    await showContinue();
    await elena_offers_full_help();
}

async function elena_partially_bribed() {
    await typeText("\nElena takes the gold. 'It's a start. I'll tell you what I know.'");
    await showContinue();
    await ask_about_searchers();
}

async function elena_small_bribe() {
    await typeText("\nElena frowns. 'That's... not much. But I suppose it's honest. Fine.'");
    await showContinue();
    await ask_about_searchers();
}

async function elena_insulted() {
    await typeText("\nElena's face hardens. 'You try to bribe me then take it back? I'm telling the village about you!'");
    forestState.villagersSuspicion += 15;
    await showContinue();
    await village_on_alert();
}

async function arrive_at_oakridge_with_elena() {
    await typeText("\nElena smuggles you into the village through a back way. 'Come to my home,' she says. 'We can talk safely there.'");
    await showContinue();
    await elena_home_base();
}

async function surrender_to_guards() {
    await typeText("\nYou drop to your knees. 'I surrender. But I'm not your killer.' The guards bind your hands...");
    await showContinue();
    await imprisoned_path();
}

async function explain_amnesia_to_guards() {
    await typeText("\nYou try to explain, but they don't believe you. 'A likely story!' the captain sneers.");
    await showContinue();
    await surrender_to_guards();
}

async function fight_village_guards() {
    await typeText("\nYou grab a weapon and fight! Bad idea - you're outnumbered...");
    await showContinue();
    await combat_guards();
}

async function flee_from_village() {
    await typeText("\nYou turn and run! Arrows whistle past your head...");
    await showContinue();
    await escape_to_forest();
}

async function leave_merchant() {
    await typeText("\n'Come back anytime,' Oswald says with a wave.");
    await showContinue();
    await village_exploration_hub();
}

async function too_poor_for_shop() {
    await typeText("\nOswald sees your empty purse. 'Come back when you have coin, friend.'");
    await showContinue();
    await village_exploration_hub();
}

async function ask_about_special_item() {
    await typeText("\nOswald grins. 'Ah, interested in the special, are we? It's a charm - protects against dark magic. Very useful against... certain rituals.' He winks.");
    const playerGold = gameState.currentCharacter.gold;
    if (playerGold >= 50) {
        const choice = await showChoices(['Buy it (50g)', 'Maybe later']);
        if (choice === 0) {
            await buy_anti_ritual_charm();
        } else {
            await leave_merchant();
        }
    } else {
        await typeText("\nBut you can't afford it.");
        await showContinue();
        await leave_merchant();
    }
}

async function buy_anti_ritual_charm() {
    removeGold(gameState.currentCharacter, 50);
    forestState.hasAntiRitualCharm = true;
    await typeText("\nYou buy the charm. It pulses with strange energy. 'This will save your life,' Oswald promises.");
    updateQuestLog('Acquired Anti-Ritual Charm - may be critical later!');
    await showContinue();
    await merchant_followup();
}

async function ask_merchant_questions() {
    await typeText("\n'What do you want to know?' Oswald asks.");
    const choice = await showChoices([
        'Ask about Marcus',
        'Ask about the cult',
        'Ask about strange happenings',
        'Never mind'
    ]);
    if (choice === 0) await ask_about_marcus_merchant();
    else if (choice === 1) await ask_about_cult_merchant();
    else if (choice === 2) await ask_about_strange_events();
    else await leave_merchant();
}

async function eavesdrop_on_hunters() {
    removeGold(gameState.currentCharacter, 3);
    await typeText("\nYou buy ale and sit near the hunters. They're planning a search party for Marcus. 'He was tracking something,' one says. 'Something dangerous.'");
    forestState.foundClueTypes.witness++;
    await showContinue();
    await tavern_continue();
}

async function drink_with_farmers() {
    removeGold(gameState.currentCharacter, 5);
    await typeText("\nYou buy drinks and join the farmers. They loosen up. 'Strange lights in the forest,' one whispers. 'And chanting. We heard chanting near the old stones.'");
    forestState.knowsAboutCult = true;
    await showContinue();
    await tavern_continue();
}

async function talk_to_drunk() {
    await typeText("\nThe drunk grabs you. 'The wolves! They walk like men! I seen 'em!' No one believes him, but maybe there's truth in the madness...");
    forestState.foundClueTypes.supernatural++;
    await showContinue();
    await tavern_continue();
}

async function approach_hooded_figure() {
    await typeText("\nYou approach the hooded figure. They look up - a woman, scarred and dangerous-looking. 'You're new,' she says. 'And you're looking for answers. I might have some... for a price.'");
    await showContinue();
    await meet_mysterious_contact();
}

async function tavern_passive_listening() {
    await typeText("\nYou listen quietly. Bits and pieces. Marcus. The forest. Disappearances. It's all connected.");
    await showContinue();
    await tavern_continue();
}

async function tavern_continue() {
    const choice = await showChoices([
        'Stay longer in the tavern',
        'Leave and explore elsewhere'
    ]);
    if (choice === 0) await visit_tavern();
    else await village_exploration_hub();
}

async function village_exploration_hub() {
    await typeText("\nYou're in Oakridge village. Where to next?");
    const choice = await showChoices([
        'Visit the merchant',
        'Go to the tavern',
        'Speak with the priest',
        'Investigate the forest edge',
        'Continue the main quest'
    ]);
    if (choice === 0) await visit_merchant();
    else if (choice === 1) await visit_tavern();
    else if (choice === 2) await visit_priest();
    else if (choice === 3) await investigate_forest_edge();
    else await village_investigation_start();
}

// Additional stubs for referenced functions
async function follow_to_village_stealthily() { await find_village(); }
async function elena_brings_supplies() { await village_investigation_start(); }
async function elena_offers_full_help() { await village_investigation_start(); }
async function elena_home_base() { await village_investigation_start(); }
async function imprisoned_path() { await typeText("\nYou're thrown in the village jail..."); await showContinue(); }
async function combat_guards() { await first_combat(); }
async function escape_to_forest() { await deeper_forest(); }
async function buy_map() { removeGold(gameState.currentCharacter, 5); await typeText("\nYou buy the map. Useful!"); await showContinue(); await merchant_followup(); }
async function buy_leather_armor() { removeGold(gameState.currentCharacter, 40); gameState.currentCharacter.stats.defense += 5; await typeText("\nYou buy the armor. Defense +5!"); await showContinue(); await merchant_followup(); }
async function ask_about_marcus_merchant() { await typeText("\n'Marcus was a good man,' Oswald says sadly. 'The best hunter we had.'"); await showContinue(); await merchant_followup(); }
async function ask_about_cult_merchant() { await typeText("\n'Dangerous topic,' Oswald warns. 'But for 20 gold, I'll tell you everything.'"); await showContinue(); await merchant_followup(); }
async function ask_about_strange_events() { await typeText("\n'People disappearing. Animals acting strange. The forest itself feels... wrong.'"); await showContinue(); await merchant_followup(); }
async function meet_mysterious_contact() { await typeText("\n'I'm a hunter of the supernatural,' she says. 'And something very dark is happening here.'"); await showContinue(); await village_investigation_start(); }
async function investigate_forest_edge() { await typeText("\nYou investigate the forest edge, finding more clues..."); await showContinue(); await find_more_clues(); }
async function visit_priest() { await typeText("\nThe priest welcomes you. 'My child, you look troubled. How can I help?'"); await showContinue(); await village_investigation_start(); }
async function eavesdrop_on_guards() { await typeText("\nYou listen to the guards. They're planning patrols and talking about the missing hunter."); await showContinue(); await village_exploration_hub(); }
async function observe_village() { await typeText("\nYou observe from the shadows, learning the village routines..."); await showContinue(); await find_village(); }
async function approach_priest() { await typeText("\nYou approach the priest at the chapel. He seems kind and welcoming."); await showContinue(); await visit_priest(); }
async function signal_merchant() { await typeText("\nYou signal the merchant. He comes to meet you privately."); await showContinue(); await visit_merchant(); }
async function examine_ritual_symbols() { await typeText("\nThe symbols are ancient and dark. They speak of soul transfer and rebirth."); forestState.knowsAboutRitual = true; await showContinue(); await find_more_clues(); }
async function follow_bare_footprints() { await typeText("\nYou follow the strange prints deeper into the forest..."); await showContinue(); await deeper_forest(); }
async function continue_search_clearing() { await typeText("\nYou continue searching and find more disturbing clues..."); await showContinue(); await after_hunter_body(); }
async function rush_to_stone_circle() { await typeText("\nYou rush toward the stone circle, ready to confront the cult!"); await showContinue(); await final_confrontation(); }
async function search_for_marcus() { await typeText("\nYou search for Marcus, hoping he's still alive..."); await showContinue(); await follow_blood_trail(); }
async function warn_village() { await typeText("\nYou rush to warn the village of the danger!"); await showContinue(); await find_village(); }
async function investigate_cult_further() { await typeText("\nYou decide to learn more about the cult before acting..."); await showContinue(); await village_investigation_start(); }
async function hunted_by_village() { await typeText("\nThe entire village is hunting you now. You must flee or fight!"); await showContinue(); await deeper_forest(); }
async function attack_water_girl() { await typeText("\nYou grab her violently. This is wrong. So wrong."); forestState.moralityScore -= 15; await showContinue(); await threaten_water_girl(); }
async function scare_water_girl() { await typeText("\nYou make a loud noise. She screams and runs."); forestState.villagersSuspicion += 5; await showContinue(); await wait_for_girl_to_leave(); }
async function request_elder_visit() { await typeText("\n'I'll ask him,' Elena says. 'But stay hidden until I return.'"); await showContinue(); await hide_and_wait_for_elder(); }
async function decline_village_offer() { await typeText("\n'I understand,' Elena says sadly. 'Be careful out there.'"); await showContinue(); await deeper_into_forest_alone(); }
async function ask_about_marcus() { await typeText("\n'Marcus was tracking someone,' Elena says. 'A man covered in blood. Like you...'"); await showContinue(); await reveal_to_water_girl(); }
async function hide_and_wait_for_elder() { await typeText("\nYou hide and wait for Elena to return with the village elder..."); await showContinue(); await meet_elder_in_forest(); }
async function meet_elder_in_forest() { await typeText("\nThe elder arrives. An old man with wise eyes. 'Tell me your story,' he says."); await showContinue(); await village_investigation_start(); }
async function final_confrontation() { await typeText("\nYou arrive at the stone circle for the final battle..."); await showContinue(); }

