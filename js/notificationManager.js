/**
 * NotificationManager class - Handles creating and showing notifications
 */
export class NotificationManager {
	constructor() {
		this.container = document.getElementById('notification-container');
		this.defaultDuration = 3000; // Duration in milliseconds
	}

	/**
	 * Show a notification
	 * @param {Object} options Notification options
	 * @param {string} options.type Notification type (success, error, warning, info)
	 * @param {string} options.message Notification message
	 * @param {string} options.icon Font Awesome icon class
	 * @param {number} options.duration Notification duration in milliseconds
	 */
	show({
		type = 'info',
		message,
		icon = 'fa-info-circle',
		duration = this.defaultDuration,
	}) {
		// Create notification element
		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

		// Add notification to container
		this.container.appendChild(notification);

		// Auto-remove notification after duration
		setTimeout(() => {
			notification.style.opacity = '0';
			setTimeout(() => {
				notification.remove();
			}, 300);
		}, duration);
	}
}
