# Dark Forest Adventure - Enhancement Plan

## Current State Analysis
The adventure is **1672 lines** with the following structure:

### Existing Major Choice Points:
1. **Awakening** → 4 choices (search self, search clearing, follow trail, wash blood)
2. **Hunter's Body** → 4 choices (read note, take supplies, examine wounds, pray)
3. **Villagers Encounter** → 3 choices (hide, run, meet)
4. **Village Arrival** → 3 choices (tell truth, hide truth, lie)
5. **Investigation Phase** → Multiple paths

### Current Branching Issues:
- Many choices funnel back to same outcomes
- Limited consequences for choices made
- Not enough "remembering" of player decisions
- Village investigation could be more open-ended

## Proposed Enhancements

### 1. EARLY GAME STEALTH VS COMBAT PATH
**Location:** After awakening choices
**Add:**
- Option to avoid the villagers entirely and sneak to village
- Stealth path where you observe from shadows and gather info
- If caught, different encounter based on how much they saw
- Consequences: Stealth = less trust but more info, Combat = more respect but harder investigation

### 2. EXPANDED VILLAGE INVESTIGATION
**Location:** `village_investigation_start()` function
**Current:** Linear progression
**Enhance To:**
- Hub system: 5-6 locations you can visit in any order
  - Tavern (gossip, drunk villagers)
  - Elder's home (official story)
  - Market (witness accounts)
  - Forest edge (physical evidence)
  - Old shrine (supernatural clues)
  - Your supposed "home" (Marcus's house)
- Need to collect 4/6 clues before final confrontation unlocks
- Each location has 2-3 sub-choices
- NPCs remember what you told them - contradictions reduce trust

### 3. MORALITY-BASED ENDINGS
**Location:** Final confrontation
**Current:** Seems to have one main ending
**Add 5 Endings:**
1. **Hero** (High morality, helped everyone) - Destroy cult, reclaim body, honored by village
2. **Pragmatist** (Neutral) - Destroy cult but keep knowledge, leave village
3. **Dark** (Low morality, killed innocents) - Join cult, sacrifice villagers
4. **Coward** (Ran from fights) - Flee forest, never learn truth, haunted forever
5. **Tragic** (Discovered truth but failed) - Die in final fight, cult wins

### 4. MORE COMBAT VS DIPLOMACY CHOICES
**Throughout adventure, add:**
- Option to talk down enemies before each fight
- Spare vs kill choices after winning combat
- Track violence level - affects how NPCs react
- Guards more hostile if you killed their friends earlier

### 5. TIME PRESSURE SYSTEM
**Add urgency:**
- Cult ritual happens in X turns/choices
- If you take too long investigating, villagers start disappearing
- Rush through = miss clues, thorough investigation = save lives
- Creates replayability - can't get everything in one run

## Specific Functions to Add/Enhance

### New Functions Needed:
```javascript
// Investigation hub
async function village_hub() - Central location where player chooses where to go next

// Location functions  
async function investigate_tavern()
async function investigate_market()  
async function investigate_shrine()
async function investigate_marcus_home()

// Diplomacy options
async function attempt_negotiation(enemy)
async function spare_defeated_enemy()

// Ending variations
async function hero_ending()
async function pragmatic_ending()
async function dark_ending()
async function coward_ending()
async function tragic_ending()
```

### Functions to Enhance:
- `arrive_at_village()` - Add more entry options
- `village_investigation_start()` - Make it a hub instead of linear
- Final confrontation - Branch based on morality score

## Quick Wins (Easiest to Implement):

1. **Add consequence tracking** - Already have state variables, just need to reference them more
2. **Add "recall" dialogue** - NPCs reference earlier choices player made
3. **Vary final fight difficulty** - Based on clues found and allies gained
4. **Add 2-3 more investigation locations** - Reuse existing pattern

## What Would You Like Me to Implement?

Tell me which enhancement(s) you want and I'll code them! Options:
1. Full investigation hub system (biggest impact, ~200 lines)
2. Multiple endings system (~150 lines)
3. Stealth/combat path split (~100 lines)
4. All three (~400-500 lines of new content)
5. Something specific you have in mind?
