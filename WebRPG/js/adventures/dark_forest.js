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
    addStoryText(`
═══════════════════════════════════════════════════════════════════
               🌲 BLOOD IN THE WOODS 🌲
                      800 AD
═══════════════════════════════════════════════════════════════════
    `);
    
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    
    const choice = await showChoice([
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
    await typeText("\nThis path is still being written...");
    await showContinue();
    await search_clearing();
}

async function find_village() {
    await typeText("\nThis path is still being written...");
    await showContinue();
    await search_clearing();
}

async function find_more_clues() {
    await typeText("\nThis path is still being written...");
    await showContinue();
    await after_hunter_body();
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

console.log('✅ dark_forest.js loaded - BLOOD IN THE WOODS edition');
