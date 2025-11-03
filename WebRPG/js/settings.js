/**
 * MULTI-VENTURE - Settings System
 * Manages game settings, preferences, and accessibility options
 */

const DEFAULT_SETTINGS = {
    sound: {
        enabled: true,
        volume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.5,
        musicEnabled: true
    },
    display: {
        textSpeed: 50, // milliseconds per character
        screenShake: true,
        particles: true,
        crtEffect: true,
        highContrast: false,
        reduceMotion: false
    },
    gameplay: {
        autoSave: true,
        autoSaveInterval: 120000, // 2 minutes
        confirmActions: true,
        showDamageNumbers: true,
        combatSpeed: 'normal' // slow, normal, fast
    },
    accessibility: {
        colorblindMode: 'none', // none, deuteranopia, protanopia, tritanopia
        fontSize: 'normal', // small, normal, large
        dyslexicFont: false
    }
};

class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.autoSaveInterval = null;
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('qol_settings');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all properties exist
                return this.mergeDeep(DEFAULT_SETTINGS, parsed);
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    }

    saveSettings() {
        try {
            localStorage.setItem('qol_settings', JSON.stringify(this.settings));
            this.applySettings();
            return true;
        } catch (e) {
            console.error('Failed to save settings:', e);
            return false;
        }
    }

    applySettings() {
        // Apply display settings
        document.body.style.fontSize = 
            this.settings.accessibility.fontSize === 'large' ? '14px' :
            this.settings.accessibility.fontSize === 'small' ? '10px' : '12px';

        // Apply CRT effect
        const crtOverlay = document.querySelector('.crt-overlay');
        if (crtOverlay) {
            crtOverlay.style.display = this.settings.display.crtEffect ? 'block' : 'none';
        }

        // Apply colorblind mode
        this.applyColorblindMode();

        // Apply dyslexic font
        if (this.settings.accessibility.dyslexicFont) {
            document.body.style.fontFamily = 'Arial, sans-serif';
        } else {
            document.body.style.fontFamily = "'Press Start 2P', cursive, monospace";
        }

        // Setup auto-save
        if (this.settings.gameplay.autoSave) {
            this.startAutoSave();
        } else {
            this.stopAutoSave();
        }

        // Apply reduce motion
        if (this.settings.display.reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
        
        // Update background music volume and state
        if (typeof updateBackgroundMusicVolume === 'function') {
            updateBackgroundMusicVolume();
        }
    }

    applyColorblindMode() {
        const body = document.body;
        body.classList.remove('cb-deuteranopia', 'cb-protanopia', 'cb-tritanopia');
        
        if (this.settings.accessibility.colorblindMode !== 'none') {
            body.classList.add(`cb-${this.settings.accessibility.colorblindMode}`);
        }
    }

    startAutoSave() {
        this.stopAutoSave();
        this.autoSaveInterval = setInterval(() => {
            if (gameState.currentCharacter) {
                saveGameProgress();
                this.showAutoSaveIndicator();
            }
        }, this.settings.gameplay.autoSaveInterval);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    showAutoSaveIndicator() {
        const indicator = document.getElementById('autoSaveIndicator');
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => {
                indicator.classList.remove('show');
            }, 2000);
        }
    }

    reset() {
        this.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
        this.saveSettings();
    }

    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = this.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}

// Global settings instance
let settingsManager = null;

function initSettings() {
    settingsManager = new SettingsManager();
    settingsManager.applySettings();
}

function showSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.add('active');
        populateSettingsUI();
    }
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function populateSettingsUI() {
    const s = settingsManager.settings;
    
    // Sound settings
    document.getElementById('soundEnabled').checked = s.sound.enabled;
    document.getElementById('musicEnabled').checked = s.sound.musicEnabled;
    document.getElementById('soundVolume').value = s.sound.volume * 100;
    document.getElementById('sfxVolume').value = s.sound.sfxVolume * 100;
    document.getElementById('musicVolume').value = s.sound.musicVolume * 100;
    
    // Display settings
    document.getElementById('textSpeed').value = s.display.textSpeed;
    document.getElementById('screenShake').checked = s.display.screenShake;
    document.getElementById('particles').checked = s.display.particles;
    document.getElementById('crtEffect').checked = s.display.crtEffect;
    document.getElementById('reduceMotion').checked = s.display.reduceMotion;
    
    // Gameplay settings
    document.getElementById('autoSave').checked = s.gameplay.autoSave;
    document.getElementById('confirmActions').checked = s.gameplay.confirmActions;
    document.getElementById('showDamageNumbers').checked = s.gameplay.showDamageNumbers;
    document.getElementById('combatSpeed').value = s.gameplay.combatSpeed;
    
    // Accessibility settings
    document.getElementById('colorblindMode').value = s.accessibility.colorblindMode;
    document.getElementById('fontSize').value = s.accessibility.fontSize;
    document.getElementById('dyslexicFont').checked = s.accessibility.dyslexicFont;
    
    updateSettingsLabels();
}

function updateSettingsLabels() {
    const s = settingsManager.settings;
    document.getElementById('soundVolumeLabel').textContent = Math.round(s.sound.volume * 100) + '%';
    document.getElementById('sfxVolumeLabel').textContent = Math.round(s.sound.sfxVolume * 100) + '%';
    document.getElementById('musicVolumeLabel').textContent = Math.round(s.sound.musicVolume * 100) + '%';
    document.getElementById('textSpeedLabel').textContent = s.display.textSpeed + 'ms';
}

function saveSettingsFromUI() {
    const s = settingsManager.settings;
    
    // Sound
    s.sound.enabled = document.getElementById('soundEnabled').checked;
    s.sound.musicEnabled = document.getElementById('musicEnabled').checked;
    s.sound.volume = document.getElementById('soundVolume').value / 100;
    s.sound.sfxVolume = document.getElementById('sfxVolume').value / 100;
    s.sound.musicVolume = document.getElementById('musicVolume').value / 100;
    
    // Display
    s.display.textSpeed = parseInt(document.getElementById('textSpeed').value);
    s.display.screenShake = document.getElementById('screenShake').checked;
    s.display.particles = document.getElementById('particles').checked;
    s.display.crtEffect = document.getElementById('crtEffect').checked;
    s.display.reduceMotion = document.getElementById('reduceMotion').checked;
    
    // Gameplay
    s.gameplay.autoSave = document.getElementById('autoSave').checked;
    s.gameplay.confirmActions = document.getElementById('confirmActions').checked;
    s.gameplay.showDamageNumbers = document.getElementById('showDamageNumbers').checked;
    s.gameplay.combatSpeed = document.getElementById('combatSpeed').value;
    
    // Accessibility
    s.accessibility.colorblindMode = document.getElementById('colorblindMode').value;
    s.accessibility.fontSize = document.getElementById('fontSize').value;
    s.accessibility.dyslexicFont = document.getElementById('dyslexicFont').checked;
    
    if (settingsManager.saveSettings()) {
        showNotification('Settings saved!', 'success');
        closeSettings();
    } else {
        showNotification('Failed to save settings', 'error');
    }
}

function resetSettings() {
    if (confirm('Reset all settings to default?')) {
        settingsManager.reset();
        populateSettingsUI();
        showNotification('Settings reset to default', 'success');
    }
}

console.log('✅ settings.js loaded');
