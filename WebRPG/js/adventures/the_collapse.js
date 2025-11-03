/**
 * ADVENTURE: THE COLLAPSE
 * A cryptic post-apocalyptic survival horror where nothing makes sense
 * Setting: Modern day after... something happened
 */

class CollapseState {
    constructor() {
        // Survival stats
        this.sanity = 100;
        this.thirst = 0;
        this.hunger = 0;
        this.exhaustion = 0;
        
        // Items found
        this.hasFlashlight = false;
        this.hasBatteries = false;
        this.hasWater = false;
        this.hasFood = false;
        this.hasWeapon = false;
        this.hasRadio = false;
        
        // Story flags
        this.exploredBuildings = [];
        this.metSurvivors = [];
        this.knownThreats = [];
        this.fragmentsFound = 0;
        
        // The world is wrong
        this.realityGlitches = 0;
        this.sawTheThing = false;
        this.heardTheSound = false;
        this.daysSurvived = 0;
        
        // Choices matter
        this.trustLevel = 0;
        this.violence = 0;
        this.desperation = 0;
    }
}

let collapseState = new CollapseState();

/**
 * Start The Collapse adventure
 */
async function startTheCollapseAdventure() {
    collapseState = new CollapseState();
    
    gameState.currentAdventure = {
        id: 'the_collapse',
        name: 'The Collapse',
        state: collapseState,
        currentScene: 'awakening'
    };
    gameState.adventureState = collapseState;
    saveGameProgress();
    
    await awakening();
}

/**
 * Opening - You wake up
 */
async function awakening() {
    addStoryText(`
═══════════════════════════════════════════════════════════════════
                    THE COLLAPSE
                    DAY ???
═══════════════════════════════════════════════════════════════════
    `);
    
    await typeText(`Your eyes open.

Dust. That's all you see. Dust floating in a beam of light from... somewhere.

You're lying on a floor. Concrete. Cold. Your head is pounding.

You try to remember... anything. How you got here. What day it is. 
What happened.

Nothing.

No, that's not right. There IS something. A sound. A memory of a sound. 
Loud. So loud it made your ears bleed. And then... screaming? Or was 
it laughter? You can't tell anymore.

You sit up slowly. Your body hurts. Everything hurts.

Looking around, you see you're in some kind of building. Office building? 
Hard to tell. The walls are cracked. The ceiling has collapsed in places. 
Papers everywhere, but they're... wrong. The text is smudged, illegible, 
like someone ran them through water and fire.

A desk. A computer. Both covered in that gray dust.

The silence is oppressive. No traffic. No voices. No hum of electricity.

Just... nothing.

And then you hear it.

*tick tick tick tick*

Rhythmic. Mechanical. Coming from somewhere above you.

*tick tick tick tick*

It stops.

You hold your breath.

Something moves in the shadows.
    `);
    
    await showContinue();
    await first_choice();
}

/**
 * First choice - Fight or flight response
 */
async function first_choice() {
    addStoryText('\n--- SURVIVAL INSTINCT ---\n');
    
    await typeText(`Your heart is pounding. Every instinct is screaming DANGER.

The shadow shifts again. It's in the corner of the room. Big. Or maybe 
small but close? Perspective is fucked in this light.

*tick tick tick*

It's moving toward you.

You need to move. NOW.
    `);
    
    const choice = await showChoice([
        'Run toward the light (exit)',
        'Grab something to defend yourself',
        'Stay perfectly still',
        'Call out to it'
    ]);
    
    if (choice === 0) {
        await run_to_light();
    } else if (choice === 1) {
        await grab_weapon();
    } else if (choice === 2) {
        await stay_still();
    } else {
        await call_out();
    }
}

/**
 * Run toward the light
 */
async function run_to_light() {
    await typeText(`\nYou scramble to your feet and run toward the light source.

The shadow lunges. You hear that ticking sound speed up - *tickticktick* - 
and something brushes past your leg.

You don't look back.

You crash through a doorway and find yourself in a hallway. The light 
is coming from the end - a hole in the wall where a window used to be.

You run faster.

Behind you: *TICKTICKTICKTICK*

You leap through the window opening and-

You're outside.

The world hits you like a brick.

Everything is gray. The sky, the buildings, the ground. Like someone 
drained all the color out of reality and left only shades of ash.

The city - at least, what used to be a city - stretches out before you. 
Every building is damaged. Some are collapsed completely. Others are... 
wrong. Twisted. Like they melted and reformed into shapes that don't 
make architectural sense.

No people. No cars. No movement.

Just silence and dust and wrongness.

You're standing on what used to be the second floor. The ground is 
about ten feet down. You can make the jump.

Behind you, in the building, you hear the ticking. It's not following. 
Just... waiting.
    `);
    
    collapseState.desperation += 1;
    updateQuestLog('Escaped the building');
    updateQuestLog('The world outside is destroyed');
    
    await showContinue();
    await outside_world();
}

/**
 * Grab a weapon
 */
async function grab_weapon() {
    await typeText(`\nYou grab the first thing you can reach - a broken piece of desk leg. 
Wood. Heavy. Sharp on one end.

The shadow stops moving.

*tick... tick... tick...*

Slower now. Cautious?

You grip the makeshift club and back toward the light, keeping your 
eyes on the shadow.

It doesn't follow. It just... watches.

As you reach the doorway, you finally see it clearly.

It's...

*What the fuck?*

It looks like someone took a mannequin, a spider, and a broken clock 
and mashed them together into something that shouldn't exist. Too many 
joints. Too many angles. And where its face should be, there's just... 
gears. Turning. Ticking.

It tilts its head at you. The ticking stops.

Then it turns and scuttles away into the darkness.

You don't wait to see where it goes. You run.
    `);
    
    collapseState.hasWeapon = true;
    collapseState.violence += 1;
    collapseState.sawTheThing = true;
    updateQuestLog('Found weapon: Broken desk leg');
    updateQuestLog('Encountered: The Ticking Thing');
    
    await showContinue();
    await outside_world();
}

/**
 * Stay still
 */
async function stay_still() {
    await typeText(`\nYou freeze. Don't move. Don't breathe.

The shadow moves closer.

*tick tick tick tick*

You can see it now. Or rather, you can see parts of it. Long legs? 
Or arms? Something that bends wrong. And gears. Lots of gears.

It stops right in front of you.

*tick*

You're staring at what might be its face. Or might be its chest. Hard 
to tell. Gears turning. Clicking. Measuring.

It tilts its head. Studying you.

You don't move.

After what feels like an eternity, it straightens up and walks away. 
Just... walks. Like you're not even worth its attention.

When it's gone, you let out a shaky breath and run for the light.
    `);
    
    collapseState.sanity -= 10;
    collapseState.sawTheThing = true;
    updateQuestLog('Encountered: The Ticking Thing');
    updateQuestLog('It ignored you... why?');
    
    await showContinue();
    await outside_world();
}

/**
 * Call out to the shadow
 */
async function call_out() {
    await typeText(`\n"Hello?" Your voice cracks. Throat dry.

The ticking stops.

Complete silence.

Then, from the shadow, a sound. Not ticking. Something else.

A voice. Human? Maybe once.

"h̴̗͊e̸͎̚l̶͓̈́l̶̢̛ö̴̘́"

It's your voice. Exactly your voice. Playing back to you.

"What the fuck-" you start.

"w̷̰̑h̴̰̕a̶̪̓t̸͎̾ ̷̣̈t̶̰̾h̶̻̓e̶̩̍ ̴̘̚f̸̳̅u̸̳̒c̸̦̕k̷̘̂-"

It repeats. Same tone. Same inflection.

Then it lunges.

You run.
    `);
    
    collapseState.sanity -= 20;
    collapseState.sawTheThing = true;
    updateQuestLog('Encountered: The Mimic Thing');
    updateQuestLog('DO NOT SPEAK TO THEM');
    
    await showContinue();
    await outside_world();
}

/**
 * Outside in the destroyed world
 */
async function outside_world() {
    addStoryText('\n--- THE GRAY WORLD ---\n');
    
    await typeText(`You jump down to the street level. The impact jars your knees but 
you're okay.

Standing on what used to be a sidewalk, you take in the devastation.

This was a city. A real city. You can see the remnants - street signs 
(bent, melted), traffic lights (dark, hanging by wires), storefronts 
(shattered, empty).

But everything is covered in that gray dust. And everything is... quiet.

Too quiet.

You check yourself. You're wearing... clothes. Normal clothes. Jeans. 
A jacket. Shoes. They're dusty and torn but functional.

In your pocket: a phone. Dead. Screen cracked. Won't turn on.

No wallet. No ID. No keys.

No memory of who you were before waking up.

Your stomach growls. When did you last eat? You don't know.

Looking around, you see several options:

To your left: A convenience store. Door hanging off its hinges.
To your right: An apartment building. Fire escape accessible.
Ahead: A subway entrance. Dark. Very dark.
Behind: The building you came from. The Thing might still be in there.
    `);
    
    collapseState.daysSurvived = 1;
    updateQuestLog('DAY 1: Survive');
    
    const choice = await showChoice([
        'Check the convenience store for supplies',
        'Try the apartment building',
        'Go into the subway',
        'Search nearby cars'
    ]);
    
    if (choice === 0) {
        await convenience_store();
    } else if (choice === 1) {
        await apartment_building();
    } else if (choice === 2) {
        await subway_entrance();
    } else {
        await search_cars();
    }
}

/**
 * Convenience store
 */
async function convenience_store() {
    addStoryText('\n--- QUICK STOP CONVENIENCE ---\n');
    
    await typeText(`The store is a mess. Shelves knocked over. Products scattered. 
Glass everywhere.

But unlike everything else, this place was clearly ransacked. Recently? 
Hard to tell. But someone was here looking for something.

Most of the food is gone. The water too. But you search carefully.

Behind the counter, you find:
• 2 bottles of water (warm, but sealed)
• A bag of beef jerky (expired 6 months ago)
• A flashlight (no batteries)
• A lighter
• A newspaper

The newspaper... the date is smudged. But the headline is clear:

"THEY'RE HERE - EVAC ALL MAJOR CITIES - THIS IS NOT A DRILL"

Below it, a photo. Grainy. Hard to make out. Something in the sky? 
Or maybe it's damage to the paper. You can't tell.

You pocket the supplies.

As you're about to leave, you hear something. Not ticking. Something else.

Breathing.

Heavy. Ragged.

It's coming from the back room.
    `);
    
    collapseState.hasWater = true;
    collapseState.hasFood = true;
    collapseState.hasFlashlight = true;
    collapseState.fragmentsFound++;
    updateQuestLog('Found: Water, food, flashlight');
    updateQuestLog('Fragment: "THEY\'RE HERE"');
    
    const choice = await showChoice([
        'Investigate the breathing',
        'Leave quietly',
        'Call out to whoever it is',
        'Prepare to fight'
    ]);
    
    if (choice === 0) {
        await investigate_breathing();
    } else if (choice === 1) {
        await leave_store();
    } else if (choice === 2) {
        await call_to_breather();
    } else {
        await prepare_fight();
    }
}

/**
 * Investigate the breathing
 */
async function investigate_breathing() {
    await typeText(`\nYou creep toward the back room, moving carefully around broken glass.

The breathing gets louder. Definitely human. Or... was human.

You push the door open slowly.

Inside, huddled in the corner, is a person. Man? Woman? Hard to tell 
in the dim light. Wearing a hoodie. Face hidden.

They're shaking.

"Hey," you say softly. "Are you okay?"

The breathing stops.

The figure slowly lifts its head.

The face underneath the hood is... wrong. The skin is gray. Cracked. 
Like dried clay. The eyes are clouded over.

But it speaks.

"Don't... go... outside... at night..."

The voice is hoarse. Desperate.

"The Signals... they come... at night..."

"What signals? What are you-"

"LEAVE!"

The figure lunges at you, but not to attack. To push. It shoves you 
toward the door with surprising strength.

"GET OUT! IT'S ALMOST SUNSET! YOU DON'T WANT TO BE HERE WHEN-"

The figure stops. Looks at the window.

The gray light outside is getting dimmer.

"Oh god. Oh god no. It's too late."

The figure runs to the back of the room and starts piling boxes against 
the far wall.

"HIDE! HIDE NOW!"
    `);
    
    collapseState.metSurvivors.push('The Gray One');
    collapseState.fragmentsFound++;
    collapseState.sanity -= 15;
    updateQuestLog('Met: Survivor (gray-skinned)');
    updateQuestLog('Warning: Don\'t go outside at night');
    updateQuestLog('Warning: "The Signals"');
    
    await showContinue();
    await nightfall_begins();
}

/**
 * Nightfall begins
 */
async function nightfall_begins() {
    addStoryText('\n--- NIGHTFALL ---\n');
    
    await typeText(`The light outside is fading fast. Too fast. Like someone's dimming 
a switch.

You hear it before you see it.

A sound. Low. Humming. Growing louder.

The survivor is muttering, rocking back and forth: "Don't listen don't 
listen don't listen don't listen-"

The sound gets louder. It's not one sound. It's... multiple. Overlapping. 
Like static mixed with voices mixed with music mixed with screaming.

And then the windows start to glow.

Not with light. With... something else. Colors that don't exist. Shapes 
that hurt to look at.

The Signals.

Your head starts to pound. Your vision blurs. You feel like something 
is trying to push its way into your skull.

The survivor grabs you. "DON'T LOOK! DON'T LISTEN! JUST... JUST THINK 
ABOUT SOMETHING ELSE! ANYTHING ELSE!"

You close your eyes tight. Cover your ears. But you can still hear it.

"g̵̰͂o̷̦̍m̸̙̾e̷̳̓o̴̧̚u̴̻̒t̶̰̕c̸̘̈́o̵̘̐m̸̹̓e̵͖͘o̸̫̓u̸̦̓t̷̻̓c̸̰͝o̶̰̔m̸̹̈́e̷̛̘o̶̰̚u̷̳̓t̶̫̚"

It's calling to you. Demanding. Commanding.

Every fiber of your being wants to obey. To go outside. To look up.

But you fight it.

You think about... what? You don't have memories. So you make something up.

A beach. Warm sand. Blue water. The sound of waves.

The Signals push harder.

"W̷E̶ ̶A̸R̵E̵ ̴H̶E̶R̸E̵ ̷W̸E̵ ̶A̴R̶E̵ ̴W̸A̸I̸T̶I̷N̸G̴ ̷C̸O̷M̸E̴ ̶T̷O̷ ̷U̶S̶"

You push back. Beach. Waves. Sun. Normal things. Human things.

Hours pass. Or maybe minutes. Time doesn't work right anymore.

Eventually, the sound fades. The glow dims. 

Silence.

You open your eyes. The survivor is still there, breathing heavily.

"You... you made it. Most people don't. First time."

"What the FUCK was that?"

"The Signals. They come every night. Trying to... convert us. Change us. 
Make us like Them."

"Like who? What happened to the world?"

The survivor laughs. It's not a happy sound.

"You really don't remember? Lucky you. The rest of us have to live with 
knowing what we lost."
    `);
    
    collapseState.sanity -= 25;
    collapseState.heardTheSound = true;
    collapseState.realityGlitches++;
    updateQuestLog('Survived: The Signals');
    updateQuestLog('Sanity degrading...');
    
    await showContinue();
    await talk_to_survivor();
}

/**
 * Talk to the gray survivor
 */
async function talk_to_survivor() {
    await typeText(`\nMorning comes. The gray light returns. The Signals are gone.

The survivor stands up slowly, joints cracking.

"I'm Marcus. Or I was. Don't know if names matter anymore."

You introduce yourself. ${gameState.currentCharacter.name}.

"How long have you been... like this?" you ask, gesturing at his gray skin.

"Week? Month? Time's fucked. Every night the Signals come. Every night 
they change us a little more. Eventually..." He trails off.

"Eventually what?"

"Eventually you become one of Them. The Things. The ones that tick and 
crawl and... yeah."

Your stomach drops. "So you're turning into one of those things?"

"We all are. Everyone who survived the first wave. We're all turning. 
Slowly. The Signals speed it up, but even without them, it's happening."

"Is there a cure? A way to stop it?"

Marcus shrugs. "Some people think so. There's rumors of a Safe Zone. 
Military installation upstate. They say the Signals can't reach it. 
They say people are normal there."

"You don't believe it?"

"I don't believe anything anymore. But..." He looks at you. "You're 
different. Your skin. It's still... human. How long have you been awake?"

"Today. I woke up today."

His eyes widen. "Then you're fresh. Recently... converted? Or maybe 
you're immune? I don't know. But you might have a chance."

He rummages in a bag and pulls out a map. It's marked with X's and 
circles and notes.

"Here. The Safe Zone. If it exists, it's here. North. About 100 miles. 
Through the city, through the Dead Zones, through... everything."

"Will you come with me?"

Marcus looks at his gray hands. "I'm too far gone. I'd slow you down. 
And when I turn... I don't want anyone nearby."

He hands you the map and a few supplies.

"Go. Now. Before tonight. You don't want to spend another night here."
    `);
    
    collapseState.trustLevel += 2;
    updateQuestLog('Met: Marcus (turning into a Thing)');
    updateQuestLog('Objective: Reach the Safe Zone - 100 miles north');
    updateQuestLog('Warning: Another night might change you');
    
    await showContinue();
    await journey_begins();
}

/**
 * Journey begins
 */
async function journey_begins() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    THE LONG WALK');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`You step back outside into the gray world.

The map shows your location - downtown. The Safe Zone is north, past 
the industrial district, through the suburbs, across the quarantine line.

100 miles on foot. Through hostile territory. With Things hunting and 
Signals calling every night.

You have:
• 2 bottles of water
• Beef jerky
• A flashlight (no batteries)
• A lighter
• A map
${collapseState.hasWeapon ? '• A makeshift club' : ''}

Not much. But it's something.

You start walking north.

The city is a maze of collapsed buildings and twisted metal. Every street 
looks the same - gray, empty, wrong.

After an hour of walking, you see movement ahead.

A group of people. Five of them. Armed with pipes and bats.

They see you.

"Hey! YOU! Stop right there!"
    `);
    
    await showContinue();
    await encounter_survivors();
}

/**
 * Encounter other survivors
 */
async function encounter_survivors() {
    addStoryText('\n--- THE SCAVENGERS ---\n');
    
    await typeText(`The group surrounds you. They're rough-looking. Desperate. But still 
human - no gray skin yet.

The leader, a woman with a shaved head and a scar across her face, 
steps forward.

"What's in the bag?"

"Just supplies. Water. Food."

"Hand it over."

"I need that to-"

"I don't care what you need. We outnumber you. Give us the bag or we 
take it and leave you bleeding."

The others move closer. You're surrounded.
    `);
    
    const choice = await showChoice([
        'Fight them',
        'Give them the supplies',
        'Try to negotiate/trade',
        'Run'
    ]);
    
    if (choice === 0) {
        await fight_scavengers();
    } else if (choice === 1) {
        await give_supplies();
    } else if (choice === 2) {
        await negotiate();
    } else {
        await run_from_scavengers();
    }
}

/**
 * Fight the scavengers
 */
async function fight_scavengers() {
    await typeText(`\nYou make your move.

${collapseState.hasWeapon ? 'You swing the club at the nearest scavenger.' : 'You throw a punch.'}

You manage to hit one, but there are too many.

They swarm you. Fists and clubs rain down.

Pain. Blood. The world spinning.

You fight back as hard as you can, but-
    `);
    
    await showContinue();
    
    const enemies = [
        createEnemy('Scavenger', 30, 0, 2, 'human'),
        createEnemy('Scavenger', 30, 0, 2, 'human'),
        createEnemy('Scavenger Leader', 50, 0, 3, 'human')
    ];
    
    const combat = new Combat(gameState.currentCharacter, enemies);
    const result = await combat.start();
    
    if (result === 'victory') {
        await typeText(`\nYou beat them. Barely.

They run, leaving their wounded behind.

You collapse, breathing hard. You're hurt, but alive.

You search the bodies and find:
• More water
• Canned food
• Batteries!
• A knife

You take what you can carry and keep moving.
        `);
        
        collapseState.violence += 3;
        collapseState.hasBatteries = true;
        collapseState.hasFood = true;
        updateQuestLog('Fought off scavengers');
        updateQuestLog('Found: Batteries, knife, food');
        
        await showContinue();
        await continue_journey();
    } else if (result === 'fled') {
        await typeText(`\nYou manage to break free and run.

They chase you for a while, but you lose them in the ruins.

You've lost your supplies. Everything except the map.

You're alone, hurt, and running out of time.
        `);
        
        collapseState.hasWater = false;
        collapseState.hasFood = false;
        collapseState.hunger += 30;
        collapseState.thirst += 30;
        
        await showContinue();
        await continue_journey();
    }
}

/**
 * Give them the supplies
 */
async function give_supplies() {
    await typeText(`\nYou hand over the bag.

The leader rummages through it. Takes the water and food.

"Flashlight's useless without batteries. Here."

She tosses it back to you. Along with something else - a protein bar.

"You've got guts not fighting. Smart. Stay smart and you might survive."

They leave.

You're down most of your supplies, but alive.

And you still have the map.
    `);
    
    collapseState.hasWater = false;
    collapseState.hasFood = false;
    collapseState.hunger += 20;
    updateQuestLog('Gave supplies to avoid conflict');
    
    await showContinue();
    await continue_journey();
}

/**
 * Negotiate with scavengers
 */
async function negotiate() {
    await typeText(`\n"Wait," you say. "What if we help each other instead?"

The leader pauses. "Keep talking."

"I have a map. To the Safe Zone. North. Past the quarantine line. If 
it's real, there's food, water, safety for everyone."

She considers this.

"The Safe Zone's a myth."

"Maybe. But what if it's not? What if we could actually get there?"

The scavengers exchange glances.

"Why would you share this with us?"

"Because I can't make it alone. 100 miles through... all of this? I 
need people who know how to fight. How to survive."

The leader extends a hand.

"Deal. We'll travel together. To the Safe Zone. If you're lying, we 
kill you. If you're telling the truth... we'll see."

You shake her hand.

"Name's Raven," she says. "This is my crew. Welcome to the apocalypse."
    `);
    
    collapseState.trustLevel += 5;
    collapseState.metSurvivors.push('Raven and her crew');
    updateQuestLog('Allied with: Raven\'s scavenger crew');
    updateQuestLog('Traveling in a group now');
    
    await showContinue();
    await group_journey();
}

/**
 * Continue journey (paths diverge based on alone vs group)
 */
async function continue_journey() {
    await typeText(`\nYou keep walking north.

The sun (if you can call it that) is setting again.

You need to find shelter before the Signals start.

Ahead, you see options:
• An abandoned parking garage
• A subway tunnel
• A high-rise office building

Where do you take shelter?
    `);
    
    const choice = await showChoice([
        'Parking garage',
        'Subway tunnel',
        'Office building'
    ]);
    
    if (choice === 0) {
        await parking_garage_night();
    } else if (choice === 1) {
        await subway_night();
    } else {
        await office_night();
    }
}

/**
 * Second night - parking garage
 */
async function parking_garage_night() {
    addStoryText('\n--- NIGHT 2: PARKING GARAGE ---\n');
    
    await typeText(`You take shelter on the third floor of the garage.

It's dark. Very dark.

${collapseState.hasBatteries ? 'You load the batteries into your flashlight. Click. Light!' : 'You wish you had batteries for that flashlight.'}

As night falls, the Signals begin again.

This time you're ready. You stuff your ears with torn fabric. Close 
your eyes. Focus on breathing.

But the Signals are stronger tonight. More insistent.

"J̵O̸I̸N̴ ̸U̷S̵ ̴B̶E̷C̸O̴M̴E̵ ̶U̷S̴ ̸W̸E̴ ̴A̵R̷E̶ ̷O̶N̸E̵"

Your skin itches. Burns.

You look at your hands.

They're starting to turn gray.

*No no no NO NO-*

You fight it. Mind over matter. But matter is changing anyway.

By morning, you've survived. But your fingers are gray up to the knuckles.

You're running out of time.
    `);
    
    collapseState.sanity -= 30;
    collapseState.daysSurvived = 2;
    collapseState.realityGlitches += 2;
    updateQuestLog('DAY 2: Survived second night');
    updateQuestLog('WARNING: Transformation beginning');
    updateQuestLog('Your hands are turning gray');
    
    await showContinue();
    await day_two();
}

/**
 * Day 2 - Pushing forward
 */
async function day_two() {
    await typeText(`\nMorning. You're still alive. Still mostly human.

But the clock is ticking.

You estimate you're about 30 miles from your starting point. 70 miles 
to go.

At this rate, you'll need at least 3 more days. 3 more nights.

Will you still be human by then?

You keep walking.

The city starts to thin out. More suburbs. Less destruction, but also 
less places to scavenge.

Your water is running low. Your stomach is growling.

And then you see it.

A house. Intact. Lights on inside.

*Lights?*

How is there power? Everything's been dead for... how long?

But the house is definitely lit. You can see movement through the windows.

People.

Do you investigate?
    `);
    
    const choice = await showChoice([
        'Knock on the door',
        'Sneak around to peek inside',
        'Avoid it - something\'s wrong',
        'Break in through the back'
    ]);
    
    if (choice === 0) {
        await knock_on_door();
    } else if (choice === 1) {
        await peek_inside();
    } else if (choice === 2) {
        await avoid_house();
    } else {
        await break_in();
    }
}

/**
 * The house with lights
 */
async function knock_on_door() {
    await typeText(`\nYou walk up to the front door and knock.

Silence.

The lights are on. You saw movement. But no one answers.

You knock again. "Hello? Anyone home?"

The door opens.

A woman stands there. Middle-aged. Wearing an apron. Smiling.

"Oh! A visitor! How wonderful! Please, come in!"

She's... normal. Completely normal. Clean clothes. No gray skin. Warm smile.

Behind her, you see a normal house. Furniture. Pictures on the walls. 
A TV playing in the background.

*This doesn't make sense.*

"Are you... are you real?" you ask.

She laughs. "Of course I'm real! Silly question! Come in, come in! 
I was just making dinner!"

Everything about this screams TRAP.

But she's offering food. Shelter. Normalcy.

Do you enter?
    `);
    
    const choice = await showChoice([
        'Go inside',
        'Ask her questions first',
        'Run away',
        'Attack her (she might be a Thing)'
    ]);
    
    if (choice === 0) {
        await enter_house();
    } else if (choice === 1) {
        await question_woman();
    } else if (choice === 2) {
        await run_from_house();
    } else {
        await attack_woman();
    }
}

/**
 * Enter the wrong house
 */
async function enter_house() {
    await typeText(`\nYou step inside.

The house is warm. It smells like... pot roast? When did you last smell 
actual food cooking?

The woman closes the door behind you.

"Please, sit! Dinner will be ready soon! My husband will be home any minute!"

You sit at the dinner table. There are plates set. Silverware. Napkins.

The TV is playing a sitcom. Canned laughter. Normal dialogue.

*This is insane. The world ended. There are Things and Signals and-*

"Here we are!"

The woman brings out a plate. Pot roast. Potatoes. Carrots. It looks 
perfect. It smells amazing.

Your stomach growls.

"Eat up!"

You pick up the fork.

Something's wrong.

You look closer at the food.

It's not food.

It's... it LOOKS like food. But under the lighting, you can see. The 
texture is wrong. The color is off.

It's the same gray matter as everything else. Shaped. Molded. Dressed 
up to look like a meal.

You drop the fork.

The woman's smile doesn't change.

"What's wrong, dear? Don't you like pot roast?"

"What... what is this?"

"Dinner! Eat up! You need your strength!"

Her smile is too wide. Her eyes don't blink.

You look at the TV. The sitcom is still playing. But the people on 
screen... they're not moving right. Jerky. Glitching.

"WHERE IS YOUR HUSBAND?" you ask.

She points to the living room.

There's a figure sitting in an armchair. Watching TV. Not moving.

You approach slowly.

It's not a person.

It's one of the Things. But dressed in a suit. Tie. Glasses. Propped 
up like a mannequin.

The ticking is very quiet.

*tick tick tick*

You back away.

"STAY FOR DESSERT!" the woman says. Her voice is changing. Deepening. 
Multiple voices overlapping.

You run for the door.

It doesn't open.

"W̵E̶ ̵M̸A̷D̴E̴ ̷T̸H̸I̶S̵ ̸F̵O̸R̷ ̸Y̸O̸U̸ ̷W̵E̶ ̴W̶A̵N̶T̵E̸D̸ ̶Y̵O̷U̶ ̵T̵O̶ ̸F̸E̴E̷L̶ ̷N̸O̸R̶M̵A̴L̸ ̷D̴O̶N̴'̵T̷ ̶Y̸O̸U̷ ̵W̴A̵N̸T̵ ̴T̴O̸ ̷F̸E̶E̷L̶ ̶N̵O̶R̴M̸A̷L̷?̴"

The woman's face starts to split open.

You smash a window and jump through.

Glass cuts your arms but you don't care.

You run.

Behind you, the house lights flicker and die.

When you look back, it's just another ruined building.

The "normal house" was never real.
    `);
    
    collapseState.sanity -= 40;
    collapseState.realityGlitches += 3;
    updateQuestLog('Encountered: The False House');
    updateQuestLog('Reality is breaking down');
    updateQuestLog('Don\'t trust what looks normal');
    
    await showContinue();
    await after_house_escape();
}

/**
 * After escaping the house
 */
async function after_house_escape() {
    await typeText(`\nYou keep running until you can't run anymore.

You collapse in an alley, breathing hard, bleeding from the glass cuts.

Your sanity is fraying. What's real? What's not? Can you trust anything?

${collapseState.sanity < 50 ? 'Your vision is blurring. You see things that aren\'t there. Hear voices.' : 'You\'re holding on. Barely.'}

You check yourself:
• Water: ${collapseState.hasWater ? 'Almost gone' : 'GONE'}
• Food: ${collapseState.hasFood ? 'Running low' : 'GONE'}
• Sanity: CRITICAL
• Humanity: Fading

You need to reach the Safe Zone. Soon.

Or you'll become one of Them.

You force yourself to stand and keep walking.

North. Always north.

The journey continues...
    `);
    
    await showContinue();
    await final_stretch();
}

/**
 * Final stretch to Safe Zone
 */
async function final_stretch() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    DAY 5');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`Five days.

Five nights surviving the Signals.

You've made it 90 miles.

Your arms are gray up to your elbows. Your legs are starting too.

The ticking has started. Faint. Inside your head.

*tick... tick... tick...*

You're running out of time.

But ahead, you see it.

A wall. Concrete. Thirty feet high. Topped with razor wire and 
searchlights.

The quarantine line.

Behind it... could it be? The Safe Zone?

You stumble toward it.

A voice over a loudspeaker: "STOP! IDENTIFY YOURSELF!"

You raise your hands. "I'm human! I need help!"

"SHOW US YOUR HANDS!"

You hold them up. Gray. Cracked.

Silence.

Then: "YOU'RE INFECTED. WE CAN'T LET YOU IN."

"Please! I'm still human! I just need-"

"TURN BACK OR WE WILL FIRE."

You see the rifles now. Pointed at you.

"There's a cure, right? You can fix this? PLEASE!"

"THERE IS NO CURE. LEAVE NOW."

Your heart sinks.

You came all this way.

And they won't let you in.
    `);
    
    const choice = await showChoice([
        'Beg them to reconsider',
        'Try to sneak in',
        'Accept your fate and leave',
        'Attack the wall in desperation'
    ]);
    
    if (choice === 0) {
        await beg_for_entry();
    } else if (choice === 1) {
        await sneak_attempt();
    } else if (choice === 2) {
        await walk_away();
    } else {
        await desperate_attack();
    }
}

/**
 * Walk away from Safe Zone
 */
async function walk_away() {
    await typeText(`\nYou lower your hands.

"I understand," you say quietly.

You turn and walk away.

Behind you, the searchlights follow for a moment, then click off.

You're alone again.

The ticking in your head gets louder.

*tick tick tick tick*

You have maybe a day left before you fully transform.

What do you do with your last hours of humanity?

You think about Marcus. The scavengers. The woman in the false house.

All of them were human once.

Now they're... something else.

And soon, you'll join them.

You find a quiet place. A park. The swings are still there, hanging 
from rusted chains.

You sit on one and wait for sunset.

The Signals come.

This time, you don't fight them.

You let them in.

"ẃ̴͎e̸̟͂l̴͇̓c̸̰̒ỏ̷̰m̶̫̂e̴͖͠ ̴̰̕h̶̳͝o̷͇̿m̸̘̽e̸̯͘"
    `);
    
    await showContinue();
    await transformation_ending();
}

/**
 * Transformation ending
 */
async function transformation_ending() {
    addStoryText('\n═══════════════════════════════════════════════════════════════════');
    addStoryText('                    ENDING: ASSIMILATION');
    addStoryText('═══════════════════════════════════════════════════════════════════\n');
    
    await typeText(`The gray spreads.

Your skin. Your bones. Your thoughts.

The ticking becomes all-consuming.

*ticktickticktickticktick*

You stand up. But you're not "you" anymore.

You're part of something larger. Something that exists between spaces.

The Things aren't monsters. They're what humanity is becoming.

Evolution. Forced. Unnatural. But inevitable.

You walk back into the city.

Your city now.

You find others like you. Other Things.

Together, you hunt. You build. You wait.

For the next survivor.

For the next person who thinks they can escape.

For the next human to welcome home.

THE END?

Days Survived: ${collapseState.daysSurvived}
Humanity Lost: 100%
Sanity Remaining: 0%

Thank you for playing THE COLLAPSE.
    `);
    
    await showContinue();
    await adventure_complete();
}

/**
 * Adventure complete
 */
async function adventure_complete() {
    addGold(gameState.currentCharacter, 100);
    addExperience(gameState.currentCharacter, 300);
    updateQuestLog('Completed: THE COLLAPSE');
    updateQuestLog('Ending: Assimilation');
    
    gameState.currentAdventure = null;
    saveGameProgress();
    
    const choice = await showChoice([
        'Return to Main Menu',
        'Try Different Path',
        'Select New Adventure'
    ]);
    
    if (choice === 0) {
        showMainMenu();
    } else if (choice === 1) {
        await startTheCollapseAdventure();
    } else {
        showAdventureSelect();
    }
}

// Placeholder functions for paths not fully written
async function leave_store() { await investigate_breathing(); }
async function call_to_breather() { await investigate_breathing(); }
async function prepare_fight() { await investigate_breathing(); }
async function apartment_building() { await convenience_store(); }
async function subway_entrance() { await convenience_store(); }
async function search_cars() { await convenience_store(); }
async function run_from_scavengers() { await fight_scavengers(); }
async function group_journey() { await continue_journey(); }
async function subway_night() { await parking_garage_night(); }
async function office_night() { await parking_garage_night(); }
async function peek_inside() { await knock_on_door(); }
async function avoid_house() { await day_two(); }
async function break_in() { await knock_on_door(); }
async function question_woman() { await enter_house(); }
async function run_from_house() { await after_house_escape(); }
async function attack_woman() { await enter_house(); }
async function beg_for_entry() { await walk_away(); }
async function sneak_attempt() { await walk_away(); }
async function desperate_attack() { await walk_away(); }

console.log('✅ the_collapse.js loaded - Welcome to the end of the world');
