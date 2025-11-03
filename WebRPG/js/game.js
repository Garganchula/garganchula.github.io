/**
 * MULTI-VENTURE - Game Logic
 * Core game mechanics and adventure flow
 */

/**
 * Show choice buttons
 * Supports both string arrays and object arrays with {text, value} properties
 */
async function showChoices(choices) {
    return new Promise((resolve) => {
        const choiceDiv = document.getElementById('choiceButtons');
        choiceDiv.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            
            // Handle both string and object formats
            const choiceText = typeof choice === 'string' ? choice : choice.text;
            const choiceValue = typeof choice === 'string' ? index : choice.value;
            
            btn.innerHTML = `${index + 1}. ${choiceText}`;
            btn.onclick = () => {
                playSFX('select');
                // Disable all buttons
                choiceDiv.querySelectorAll('button').forEach(b => b.disabled = true);
                resolve(choiceValue);
            };
            choiceDiv.appendChild(btn);
        });
    });
}

/**
 * Show single continue button
 */
async function showContinue(text = 'Continue...') {
    return new Promise((resolve) => {
        const choiceDiv = document.getElementById('choiceButtons');
        choiceDiv.innerHTML = '';
        
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = text;
        btn.onclick = () => {
            playSFX('select');
            resolve();
        };
        choiceDiv.appendChild(btn);
    });
}

/**
 * Update quest log
 */
function updateQuestLog(text) {
    const questDiv = document.getElementById('questLog');
    const p = document.createElement('p');
    p.style.fontSize = '0.6em';
    p.style.margin = '5px 0';
    p.style.borderBottom = '1px solid var(--border-color)';
    p.style.paddingBottom = '5px';
    p.textContent = `✓ ${text}`;
    questDiv.appendChild(p);
}

console.log('✅ game.js loaded');
