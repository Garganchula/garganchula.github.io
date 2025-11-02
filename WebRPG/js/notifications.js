/**
 * QUEST OF LEGENDS - Notification System
 * Toast notifications for game events
 */

class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.init();
    }

    init() {
        if (!document.getElementById('notificationContainer')) {
            this.container = document.createElement('div');
            this.container.id = 'notificationContainer';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        } else {
            this.container = document.getElementById('notificationContainer');
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-message">${message}</span>
        `;
        
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }, duration);
    }
}

// Global notification manager
let notificationManager = null;

function initNotifications() {
    notificationManager = new NotificationManager();
}

function showNotification(message, type = 'info', duration = 3000) {
    if (notificationManager) {
        notificationManager.show(message, type, duration);
    }
}

console.log('✅ notifications.js loaded');
