// Import modules
import { TaskManager } from './taskManager.js';
import { UIManager } from './uiManager.js';
import { NotificationManager } from './notificationManager.js';
import { ThemeManager } from './themeManager.js';
import { FilterManager } from './filterManager.js';
import { DragDropManager } from './dragDropManager.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
	// Initialize managers
	const notificationManager = new NotificationManager();
	const taskManager = new TaskManager();
	const uiManager = new UIManager(taskManager, notificationManager);
	const themeManager = new ThemeManager();
	const filterManager = new FilterManager(taskManager, uiManager);
	const dragDropManager = new DragDropManager(taskManager, uiManager);

	// Initialize the UI
	uiManager.init();

	// Initialize date pickers
	flatpickr('#task-due-date', {
		enableTime: true,
		dateFormat: 'Y-m-d H:i',
		altInput: true,
		altFormat: 'F j, Y at h:i K',
		minDate: 'today',
		position: 'auto',
	});

	flatpickr('#date-from', {
		dateFormat: 'Y-m-d',
		altInput: true,
		altFormat: 'F j, Y',
	});

	flatpickr('#date-to', {
		dateFormat: 'Y-m-d',
		altInput: true,
		altFormat: 'F j, Y',
	});

	// Show notification when app is loaded
	notificationManager.show({
		type: 'info',
		message: 'Welcome to Modern Todo App!',
		icon: 'fa-info-circle',
	});
});
