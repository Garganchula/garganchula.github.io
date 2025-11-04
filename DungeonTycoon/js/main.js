// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.init();

    // Set up control buttons
    document.getElementById('speed-btn').addEventListener('click', () => {
        game.toggleSpeed();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        game.togglePause();
    });

    document.getElementById('clear-dungeon-btn').addEventListener('click', () => {
        game.clearDungeon();
    });

    document.getElementById('reset-game-btn').addEventListener('click', () => {
        if (confirm('⚠️ FULL RESET: This will delete ALL progress, upgrades, and stats. Are you sure?')) {
            if (confirm('This action cannot be undone! Continue?')) {
                localStorage.removeItem('dungeonTycoonSave');
                location.reload();
            }
        }
    });

    // Shop tabs
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            // Update active tab
            document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active content
            document.querySelectorAll('.shop-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(category + '-content').classList.add('active');
        });
    });

    // Notification toggle
    document.getElementById('notification-toggle').addEventListener('click', () => {
        const notifContent = document.getElementById('notification-content');
        notifContent.classList.toggle('open');
    });

    document.getElementById('clear-notifications').addEventListener('click', () => {
        game.eventLog = [];
        game.updateNotifications();
    });

    // Close notifications when clicking outside
    document.addEventListener('click', (e) => {
        const notifPanel = document.getElementById('notification-panel');
        const notifContent = document.getElementById('notification-content');
        if (!notifPanel.contains(e.target) && notifContent.classList.contains('open')) {
            notifContent.classList.remove('open');
        }
    });

    // Add welcome message
    game.addLog('🎮 Welcome to Dungeon Tycoon!', 'info');
    game.addLog('💡 Build traps and hire monsters to kill heroes!', 'info');
    game.addLog('💰 Earn gold from dead adventurers to expand your dungeon.', 'info');
});

// Save game before closing
window.addEventListener('beforeunload', () => {
    if (game) {
        game.saveGame();
    }
});
