/**
 * UIManager class - Handles all UI interactions and DOM updates
 */
export class UIManager {
	constructor(taskManager, notificationManager) {
		// Managers
		this.taskManager = taskManager;
		this.notificationManager = notificationManager;

		// DOM elements
		this.tasksContainer = document.getElementById('tasks-container');
		this.emptyState = document.getElementById('empty-state');
		this.taskModal = document.getElementById('task-modal');
		this.modalTitle = document.getElementById('modal-title');
		this.taskForm = document.getElementById('task-form');
		this.searchInput = document.getElementById('search-input');

		// DOM elements for task form
		this.taskTitleInput = document.getElementById('task-title');
		this.taskDescriptionInput = document.getElementById('task-description');
		this.taskCategorySelect = document.getElementById('task-category');
		this.taskPrioritySelect = document.getElementById('task-priority');
		this.taskDueDateInput = document.getElementById('task-due-date');
		this.taskIdInput = document.getElementById('task-id');

		// Buttons
		this.addTaskButton = document.getElementById('add-task-button');
		this.closeModalButton = document.getElementById('close-modal');
		this.cancelButton = document.getElementById('cancel-button');
	}

	/**
	 * Initialize the UI
	 */
	init() {
		// Set up event listeners
		this.addTaskButton.addEventListener('click', () => this.openTaskModal());
		this.closeModalButton.addEventListener('click', () =>
			this.closeTaskModal()
		);
		this.cancelButton.addEventListener('click', () => this.closeTaskModal());
		this.taskForm.addEventListener('submit', (e) =>
			this.handleTaskFormSubmit(e)
		);
		this.searchInput.addEventListener('input', (e) => this.handleSearch(e));

		// Close modal when clicking outside of it
		window.addEventListener('click', (e) => {
			if (e.target === this.taskModal) {
				this.closeTaskModal();
			}
		});

		// Check for due soon tasks and overdue tasks
		this.checkTaskReminders();

		// Initialize interval to check for reminders every minute
		setInterval(() => this.checkTaskReminders(), 60000);

		// Render tasks
		this.renderTasks();
	}

	/**
	 * Render all tasks
	 * @param {Array} tasksToRender Optional array of tasks to render, if not provided all tasks will be rendered
	 */
	renderTasks(tasksToRender) {
		// Clear the tasks container except the empty state
		const taskElements = this.tasksContainer.querySelectorAll('.task-card');
		taskElements.forEach((element) => element.remove());

		// Get tasks to render
		const tasks = tasksToRender || this.taskManager.getTasksSortedByPosition();

		// Show or hide empty state
		if (tasks.length === 0) {
			this.emptyState.classList.remove('hidden');
		} else {
			this.emptyState.classList.add('hidden');

			// Render each task
			tasks.forEach((task) => {
				const taskElement = this.createTaskElement(task);
				this.tasksContainer.appendChild(taskElement);
			});
		}
	}

	/**
	 * Create a DOM element for a task
	 * @param {Object} task Task object
	 * @returns {HTMLElement} Task element
	 */
	createTaskElement(task) {
		const taskElement = document.createElement('div');
		taskElement.className = `task-card${task.completed ? ' completed' : ''}`;
		taskElement.dataset.id = task.id;
		taskElement.draggable = true;

		// Set category and priority CSS variables for dynamic coloring
		let categoryColorVar = '';
		switch (task.category) {
			case 'personal':
				categoryColorVar = '156, 39, 176';
				break; // --category-personal
			case 'work':
				categoryColorVar = '33, 150, 243';
				break; // --category-work
			case 'health':
				categoryColorVar = '76, 175, 80';
				break; // --category-health
			case 'shopping':
				categoryColorVar = '255, 152, 0';
				break; // --category-shopping
			default:
				categoryColorVar = '96, 125, 139';
				break; // --category-other
		}

		let priorityColorVar = '';
		switch (task.priority) {
			case 'low':
				priorityColorVar = '139, 195, 74';
				break; // --priority-low
			case 'medium':
				priorityColorVar = '255, 193, 7';
				break; // --priority-medium
			case 'high':
				priorityColorVar = '244, 67, 54';
				break; // --priority-high
			default:
				priorityColorVar = '255, 193, 7';
				break; // Default to medium
		}

		taskElement.style.setProperty('--category-color-rgb', categoryColorVar);
		taskElement.style.setProperty('--priority-color-rgb', priorityColorVar);

		// Format due date if exists
		let formattedDueDate = '';
		if (task.dueDate) {
			const dueDate = new Date(task.dueDate);
			const now = new Date();
			const isOverdue = dueDate < now && !task.completed;

			const options = {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
			};
			formattedDueDate = dueDate.toLocaleDateString(undefined, options);

			if (isOverdue) {
				formattedDueDate += ' (Overdue)';
			}
		}

		// Create task HTML
		taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title-container" style="display: flex; align-items: flex-start;">
                    <div class="task-checkbox${
											task.completed ? ' checked' : ''
										}" data-id="${task.id}"></div>
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                </div>
                <div class="task-actions">
                    <button class="task-action-button edit" data-id="${
											task.id
										}" aria-label="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-button delete" data-id="${
											task.id
										}" aria-label="Delete task">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            ${
							task.description
								? `<p class="task-description">${this.escapeHtml(
										task.description
								  )}</p>`
								: ''
						}
            <div class="task-meta">
                <span class="task-category">
                    <i class="fas fa-tag"></i> ${this.capitalizeFirstLetter(
											task.category
										)}
                </span>
                <span class="task-priority">
                    <i class="fas fa-flag"></i> ${this.capitalizeFirstLetter(
											task.priority
										)}
                </span>
                ${
									task.dueDate
										? `
                <span class="task-due-date">
                    <i class="fas fa-calendar-alt"></i> ${formattedDueDate}
                </span>
                `
										: ''
								}
            </div>
        `;

		// Add event listeners
		const checkboxElement = taskElement.querySelector('.task-checkbox');
		checkboxElement.addEventListener('click', () =>
			this.toggleTaskCompletion(task.id)
		);

		const editButton = taskElement.querySelector('.edit');
		editButton.addEventListener('click', () => this.openTaskModal(task.id));

		const deleteButton = taskElement.querySelector('.delete');
		deleteButton.addEventListener('click', () => this.deleteTask(task.id));

		return taskElement;
	}

	/**
	 * Open the task modal
	 * @param {string} taskId Task ID if editing an existing task
	 */
	openTaskModal(taskId = null) {
		// Reset form
		this.taskForm.reset();
		this.taskIdInput.value = '';

		if (taskId) {
			// Editing existing task
			const task = this.taskManager.getTaskById(taskId);
			if (task) {
				this.modalTitle.textContent = 'Edit Task';
				this.taskTitleInput.value = task.title;
				this.taskDescriptionInput.value = task.description;
				this.taskCategorySelect.value = task.category;
				this.taskPrioritySelect.value = task.priority;
				this.taskIdInput.value = task.id;

				if (task.dueDate) {
					this.taskDueDateInput._flatpickr.setDate(task.dueDate);
				} else {
					this.taskDueDateInput._flatpickr.clear();
				}
			}
		} else {
			// Adding new task
			this.modalTitle.textContent = 'Add New Task';
		}

		// Show modal
		this.taskModal.classList.remove('hidden');
		setTimeout(() => {
			this.taskModal.classList.add('show');
			this.taskTitleInput.focus();
		}, 10);
	}

	/**
	 * Close the task modal
	 */
	closeTaskModal() {
		this.taskModal.classList.remove('show');
		setTimeout(() => {
			this.taskModal.classList.add('hidden');
		}, 300);
	}

	/**
	 * Handle task form submission
	 * @param {Event} e Form submit event
	 */
	handleTaskFormSubmit(e) {
		e.preventDefault();

		// Get form values
		const title = this.taskTitleInput.value.trim();
		const description = this.taskDescriptionInput.value.trim();
		const category = this.taskCategorySelect.value;
		const priority = this.taskPrioritySelect.value;
		const dueDate = this.taskDueDateInput._flatpickr.selectedDates[0]
			? this.taskDueDateInput._flatpickr.selectedDates[0].toISOString()
			: null;
		const taskId = this.taskIdInput.value;

		// Validate form
		if (!title) {
			this.notificationManager.show({
				type: 'error',
				message: 'Please enter a task title',
				icon: 'fa-exclamation-circle',
			});
			return;
		}

		// Prepare task data
		const taskData = {
			title,
			description,
			category,
			priority,
			dueDate,
		};

		if (taskId) {
			// Update existing task
			const updatedTask = this.taskManager.updateTask(taskId, taskData);
			if (updatedTask) {
				this.notificationManager.show({
					type: 'success',
					message: 'Task updated successfully',
					icon: 'fa-check-circle',
				});
			}
		} else {
			// Add new task
			const newTask = this.taskManager.addTask(taskData);
			this.notificationManager.show({
				type: 'success',
				message: 'Task added successfully',
				icon: 'fa-check-circle',
			});
		}

		// Close modal and render tasks
		this.closeTaskModal();
		this.renderTasks();
	}

	/**
	 * Toggle task completion status
	 * @param {string} taskId Task ID
	 */
	toggleTaskCompletion(taskId) {
		const updatedTask = this.taskManager.toggleTaskCompletion(taskId);

		if (updatedTask) {
			// Find task element and update it
			const taskElement = this.tasksContainer.querySelector(
				`.task-card[data-id="${taskId}"]`
			);
			if (taskElement) {
				if (updatedTask.completed) {
					taskElement.classList.add('completed');
					taskElement.querySelector('.task-checkbox').classList.add('checked');
					this.notificationManager.show({
						type: 'success',
						message: 'Task marked as completed',
						icon: 'fa-check-circle',
					});
				} else {
					taskElement.classList.remove('completed');
					taskElement
						.querySelector('.task-checkbox')
						.classList.remove('checked');
					this.notificationManager.show({
						type: 'info',
						message: 'Task marked as active',
						icon: 'fa-info-circle',
					});
				}
			}
		}
	}

	/**
	 * Delete a task
	 * @param {string} taskId Task ID
	 */
	deleteTask(taskId) {
		if (confirm('Are you sure you want to delete this task?')) {
			const deleted = this.taskManager.deleteTask(taskId);

			if (deleted) {
				// Find and remove task element
				const taskElement = this.tasksContainer.querySelector(
					`.task-card[data-id="${taskId}"]`
				);
				if (taskElement) {
					taskElement.classList.add('fadeOut');
					setTimeout(() => {
						taskElement.remove();

						// Show empty state if no tasks left
						if (this.taskManager.getAllTasks().length === 0) {
							this.emptyState.classList.remove('hidden');
						}
					}, 300);
				}

				this.notificationManager.show({
					type: 'success',
					message: 'Task deleted successfully',
					icon: 'fa-trash-alt',
				});
			}
		}
	}

	/**
	 * Handle search input
	 * @param {Event} e Input event
	 */
	handleSearch(e) {
		const query = e.target.value.trim();
		const filteredTasks = this.taskManager.searchTasks(query);
		this.renderTasks(filteredTasks);
	}

	/**
	 * Check for tasks that need reminders
	 */
	checkTaskReminders() {
		// Check for overdue tasks
		const overdueTasks = this.taskManager.getOverdueTasks();
		if (overdueTasks.length > 0) {
			this.notificationManager.show({
				type: 'warning',
				message: `You have ${overdueTasks.length} overdue task${
					overdueTasks.length > 1 ? 's' : ''
				}`,
				icon: 'fa-exclamation-circle',
			});
		}

		// Check for tasks due within the next 24 hours
		const tasksDueSoon = this.taskManager.getTasksDueSoon();
		if (tasksDueSoon.length > 0) {
			this.notificationManager.show({
				type: 'info',
				message: `You have ${tasksDueSoon.length} task${
					tasksDueSoon.length > 1 ? 's' : ''
				} due within 24 hours`,
				icon: 'fa-clock',
			});
		}
	}

	/**
	 * Utility function to escape HTML
	 * @param {string} unsafe Unsafe string
	 * @returns {string} Escaped string
	 */
	escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	/**
	 * Utility function to capitalize the first letter of a string
	 * @param {string} string String to capitalize
	 * @returns {string} Capitalized string
	 */
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}
