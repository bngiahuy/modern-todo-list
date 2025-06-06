/**
 * TaskManager class - Handles all task-related operations and data management
 */
export class TaskManager {
	constructor() {
		this.tasks = [];
		this.loadFromLocalStorage();
	}

	/**
	 * Load tasks from local storage
	 */
	loadFromLocalStorage() {
		const savedTasks = localStorage.getItem('tasks');
		if (savedTasks) {
			try {
				this.tasks = JSON.parse(savedTasks);
			} catch (e) {
				console.error('Error loading tasks from localStorage:', e);
				this.tasks = [];
			}
		}
	}

	/**
	 * Save tasks to local storage
	 */
	saveToLocalStorage() {
		localStorage.setItem('tasks', JSON.stringify(this.tasks));
	}

	/**
	 * Get all tasks
	 * @returns {Array} Array of task objects
	 */
	getAllTasks() {
		return [...this.tasks];
	}

	/**
	 * Get a specific task by ID
	 * @param {string} id Task ID
	 * @returns {Object|null} Task object or null if not found
	 */
	getTaskById(id) {
		return this.tasks.find((task) => task.id === id) || null;
	}

	/**
	 * Add a new task
	 * @param {Object} taskData Task data object
	 * @returns {Object} The newly created task
	 */
	addTask(taskData) {
		const newTask = {
			id: crypto.randomUUID(),
			title: taskData.title,
			description: taskData.description || '',
			category: taskData.category || 'other',
			priority: taskData.priority || 'medium',
			dueDate: taskData.dueDate || null,
			completed: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			position: this.tasks.length,
		};

		this.tasks.push(newTask);
		this.saveToLocalStorage();
		return newTask;
	}

	/**
	 * Update an existing task
	 * @param {string} id Task ID
	 * @param {Object} updatedData Updated task data
	 * @returns {Object|null} Updated task or null if not found
	 */
	updateTask(id, updatedData) {
		const taskIndex = this.tasks.findIndex((task) => task.id === id);

		if (taskIndex === -1) {
			return null;
		}

		const updatedTask = {
			...this.tasks[taskIndex],
			...updatedData,
			updatedAt: new Date().toISOString(),
		};

		this.tasks[taskIndex] = updatedTask;
		this.saveToLocalStorage();
		return updatedTask;
	}

	/**
	 * Delete a task
	 * @param {string} id Task ID
	 * @returns {boolean} True if task was deleted, false otherwise
	 */
	deleteTask(id) {
		const initialLength = this.tasks.length;
		this.tasks = this.tasks.filter((task) => task.id !== id);

		if (this.tasks.length !== initialLength) {
			// Update positions after deletion
			this.tasks.forEach((task, index) => {
				task.position = index;
			});

			this.saveToLocalStorage();
			return true;
		}

		return false;
	}

	/**
	 * Toggle task completion status
	 * @param {string} id Task ID
	 * @returns {Object|null} Updated task or null if not found
	 */
	toggleTaskCompletion(id) {
		const task = this.getTaskById(id);

		if (!task) {
			return null;
		}

		task.completed = !task.completed;
		task.updatedAt = new Date().toISOString();

		this.saveToLocalStorage();
		return task;
	}

	/**
	 * Get tasks by category
	 * @param {string} category Category name
	 * @returns {Array} Array of tasks in the specified category
	 */
	getTasksByCategory(category) {
		if (category === 'all') {
			return this.getAllTasks();
		}
		return this.tasks.filter((task) => task.category === category);
	}

	/**
	 * Get tasks by completion status
	 * @param {boolean} completed Completion status
	 * @returns {Array} Array of tasks with the specified completion status
	 */
	getTasksByCompletionStatus(completed) {
		return this.tasks.filter((task) => task.completed === completed);
	}

	/**
	 * Get tasks by priority
	 * @param {string} priority Priority level
	 * @returns {Array} Array of tasks with the specified priority
	 */
	getTasksByPriority(priority) {
		return this.tasks.filter((task) => task.priority === priority);
	}

	/**
	 * Get tasks by date range
	 * @param {Date} startDate Start date
	 * @param {Date} endDate End date
	 * @returns {Array} Array of tasks within the specified date range
	 */
	getTasksByDateRange(startDate, endDate) {
		return this.tasks.filter((task) => {
			if (!task.dueDate) return false;

			const taskDate = new Date(task.dueDate);
			return taskDate >= startDate && taskDate <= endDate;
		});
	}

	/**
	 * Search tasks by query
	 * @param {string} query Search query
	 * @returns {Array} Array of tasks matching the query
	 */
	searchTasks(query) {
		if (!query) return this.getAllTasks();

		const lowerQuery = query.toLowerCase();
		return this.tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(lowerQuery) ||
				task.description.toLowerCase().includes(lowerQuery)
		);
	}

	/**
	 * Get all categories from tasks
	 * @returns {Array} Array of unique categories
	 */
	getAllCategories() {
		const categories = this.tasks.map((task) => task.category);
		return [...new Set(categories)];
	}

	/**
	 * Update task positions after drag and drop
	 * @param {Array} newPositions Array of objects containing {id, position}
	 */
	updateTaskPositions(newPositions) {
		newPositions.forEach(({ id, position }) => {
			const task = this.getTaskById(id);
			if (task) {
				task.position = position;
			}
		});

		this.saveToLocalStorage();
	}

	/**
	 * Get tasks sorted by their position
	 * @returns {Array} Array of tasks sorted by position
	 */
	getTasksSortedByPosition() {
		return [...this.tasks].sort((a, b) => a.position - b.position);
	}

	/**
	 * Check for tasks that are due soon
	 * @param {number} hoursThreshold Hours threshold for due soon tasks
	 * @returns {Array} Array of tasks due within the threshold
	 */
	getTasksDueSoon(hoursThreshold = 24) {
		const now = new Date();
		const thresholdTime = new Date(
			now.getTime() + hoursThreshold * 60 * 60 * 1000
		);

		return this.tasks.filter((task) => {
			if (!task.dueDate || task.completed) return false;

			const dueDate = new Date(task.dueDate);
			return dueDate > now && dueDate <= thresholdTime;
		});
	}

	/**
	 * Check for overdue tasks
	 * @returns {Array} Array of overdue tasks
	 */
	getOverdueTasks() {
		const now = new Date();

		return this.tasks.filter((task) => {
			if (!task.dueDate || task.completed) return false;

			const dueDate = new Date(task.dueDate);
			return dueDate < now;
		});
	}
}
