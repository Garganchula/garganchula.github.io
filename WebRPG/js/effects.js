/**
 * QUEST OF LEGENDS - Visual Effects System
 * Particle effects, screen shake, floating text, and animations
 */

class EffectsManager {
    constructor() {
        this.particles = [];
        this.floatingTexts = [];
        this.isShaking = false;
    }

    // Screen Shake Effect
    screenShake(intensity = 10, duration = 300) {
        if (!settingsManager.settings.display.screenShake || this.isShaking) return;
        
        this.isShaking = true;
        const gameContainer = document.querySelector('.game-container');
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < duration) {
                const progress = 1 - (elapsed / duration);
                const x = (Math.random() - 0.5) * intensity * progress;
                const y = (Math.random() - 0.5) * intensity * progress;
                gameContainer.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                gameContainer.style.transform = '';
                this.isShaking = false;
            }
        };
        
        shake();
    }

    // Floating Damage Numbers
    floatingText(text, x, y, color = '#ff0000', size = '24px') {
        if (!settingsManager.settings.gameplay.showDamageNumbers) return;
        
        const element = document.createElement('div');
        element.className = 'floating-text';
        element.textContent = text;
        element.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: ${size};
            font-family: 'Press Start 2P', cursive;
            font-weight: bold;
            pointer-events: none;
            z-index: 10000;
            text-shadow: 2px 2px 4px #000;
            animation: floatUp 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(element);
        
        setTimeout(() => {
            element.remove();
        }, 1500);
    }

    // Particle System
    createParticles(x, y, count = 20, color = '#ff6600') {
        if (!settingsManager.settings.display.particles) return;
        
        const container = document.getElementById('particleContainer') || this.createParticleContainer();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const life = 1000 + Math.random() * 500;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 4px ${color};
            `;
            
            container.appendChild(particle);
            
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed < life) {
                    const progress = elapsed / life;
                    const x = parseFloat(particle.style.left) + vx;
                    const y = parseFloat(particle.style.top) + vy + (progress * 2);
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = 1 - progress;
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }

    createParticleContainer() {
        const container = document.createElement('div');
        container.id = 'particleContainer';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(container);
        return container;
    }

    // Flash Effect
    flash(color = 'rgba(255, 255, 255, 0.5)', duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            pointer-events: none;
            z-index: 9999;
            animation: flashFade ${duration}ms ease-out forwards;
        `;
        document.body.appendChild(flash);
        
        setTimeout(() => flash.remove(), duration);
    }

    // Glow Effect
    glow(element, color = '#ff6600', duration = 500) {
        const originalBoxShadow = element.style.boxShadow;
        element.style.boxShadow = `0 0 20px ${color}, 0 0 40px ${color}`;
        
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, duration);
    }

    // Pulse Effect
    pulse(element, scale = 1.1, duration = 300) {
        const originalTransform = element.style.transform;
        element.style.transition = `transform ${duration}ms ease-out`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = originalTransform;
        }, duration);
    }

    // Hit Effect
    hitEffect(elementId, isPlayer = false) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        this.createParticles(x, y, 15, isPlayer ? '#8b0000' : '#ff6600');
        this.flash(isPlayer ? 'rgba(139, 0, 0, 0.3)' : 'rgba(255, 102, 0, 0.3)', 150);
        this.screenShake(isPlayer ? 8 : 5, 200);
    }

    // Critical Hit Effect
    criticalHitEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        this.createParticles(x, y, 30, '#ffd700');
        this.flash('rgba(255, 215, 0, 0.4)', 300);
        this.screenShake(15, 400);
        this.glow(element, '#ffd700', 600);
    }

    // Heal Effect
    healEffect(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        this.createParticles(x, y, 20, '#00ff00');
        this.glow(element, '#00ff00', 500);
    }

    // Status Effect Particles
    statusParticles(elementId, type = 'poison') {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const colors = {
            poison: '#9d4edd',
            burn: '#ff6600',
            freeze: '#00bfff',
            stun: '#ffff00',
            bleed: '#8b0000'
        };
        
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        this.createParticles(x, y, 10, colors[type] || '#ffffff');
    }
}

// Global effects instance
let effectsManager = null;

function initEffects() {
    effectsManager = new EffectsManager();
}

// Convenience functions
function showFloatingDamage(damage, elementId, isCritical = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    const color = isCritical ? '#ffd700' : '#ff0000';
    const text = isCritical ? `CRIT! ${damage}` : `-${damage}`;
    
    effectsManager.floatingText(text, x, y, color, isCritical ? '32px' : '24px');
    
    if (isCritical) {
        effectsManager.criticalHitEffect(elementId);
    } else {
        effectsManager.hitEffect(elementId);
    }
}

function showFloatingHeal(amount, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    effectsManager.floatingText(`+${amount}`, x, y, '#00ff00', '24px');
    effectsManager.healEffect(elementId);
}

console.log('✅ effects.js loaded');
