/**
 * FilterManager class - Handles task filtering
 */
export class FilterManager {
	constructor(taskManager, uiManager) {
		this.taskManager = taskManager;
		this.uiManager = uiManager;

		// DOM elements
		this.filterButton = document.getElementById('filter-button');
		this.filterPanel = document.getElementById('filter-panel');
		this.categoryFiltersContainer = document.getElementById('category-filters');
		this.dateFromInput = document.getElementById('date-from');
		this.dateToInput = document.getElementById('date-to');
		this.applyFiltersButton = document.getElementById('apply-filters');
		this.resetFiltersButton = document.getElementById('reset-filters');

		// Initialize filters
		this.init();
	}

	/**
	 * Initialize filter manager
	 */
	init() {
		// Add event listeners
		this.filterButton.addEventListener('click', () => this.toggleFilterPanel());
		this.applyFiltersButton.addEventListener('click', () =>
			this.applyFilters()
		);
		this.resetFiltersButton.addEventListener('click', () =>
			this.resetFilters()
		);

		// Close filter panel when clicking outside
		document.addEventListener('click', (e) => {
			if (
				!this.filterPanel.contains(e.target) &&
				e.target !== this.filterButton &&
				!this.filterButton.contains(e.target) &&
				!this.filterPanel.classList.contains('hidden')
			) {
				this.filterPanel.classList.add('hidden');
			}
		});

		// Update category filters when tasks change
		this.updateCategoryFilters();
	}

	/**
	 * Toggle filter panel visibility
	 */
	toggleFilterPanel() {
		this.filterPanel.classList.toggle('hidden');

		// Update category filters when panel is shown
		if (!this.filterPanel.classList.contains('hidden')) {
			this.updateCategoryFilters();
		}
	}

	/**
	 * Update category filters based on existing categories in tasks
	 */
	updateCategoryFilters() {
		// Clear existing category filters except "All"
		const allCategoryInput =
			this.categoryFiltersContainer.querySelector('input[value="all"]');
		const allCategoryLabel = allCategoryInput
			? allCategoryInput.parentElement
			: null;

		this.categoryFiltersContainer.innerHTML = '';

		if (allCategoryLabel) {
			this.categoryFiltersContainer.appendChild(allCategoryLabel);
		}

		// Add a filter for each category
		const categories = this.taskManager.getAllCategories();
		categories.forEach((category) => {
			const label = document.createElement('label');
			const input = document.createElement('input');

			input.type = 'checkbox';
			input.dataset.filter = 'category';
			input.value = category;

			label.appendChild(input);
			label.appendChild(
				document.createTextNode(` ${this.capitalizeFirstLetter(category)}`)
			);

			this.categoryFiltersContainer.appendChild(label);
		});
	}

	/**
	 * Apply filters to tasks
	 */
	applyFilters() {
		// Get selected status filters
		const statusInputs = document.querySelectorAll(
			'input[data-filter="status"]:checked'
		);
		const selectedStatuses = Array.from(statusInputs).map(
			(input) => input.value
		);

		// Get selected category filters
		const categoryInputs = document.querySelectorAll(
			'input[data-filter="category"]:checked'
		);
		const selectedCategories = Array.from(categoryInputs).map(
			(input) => input.value
		);

		// Get date range
		const dateFrom = this.dateFromInput._flatpickr.selectedDates[0] || null;
		const dateTo = this.dateToInput._flatpickr.selectedDates[0] || null;

		// If date range is set, ensure the end date is the end of the day
		if (dateTo) {
			dateTo.setHours(23, 59, 59, 999);
		}

		// Apply filters
		let filteredTasks = this.taskManager.getAllTasks();

		// Filter by status
		if (!selectedStatuses.includes('all')) {
			if (selectedStatuses.includes('active')) {
				filteredTasks = filteredTasks.filter((task) => !task.completed);
			}

			if (selectedStatuses.includes('completed')) {
				filteredTasks = filteredTasks.filter((task) => task.completed);
			}

			// If no status is selected, return no tasks
			if (selectedStatuses.length === 0) {
				filteredTasks = [];
			}
		}

		// Filter by category
		if (!selectedCategories.includes('all')) {
			filteredTasks = filteredTasks.filter((task) =>
				selectedCategories.includes(task.category)
			);
		}

		// Filter by date range
		if (dateFrom && dateTo) {
			filteredTasks = filteredTasks.filter((task) => {
				if (!task.dueDate) return false;

				const taskDate = new Date(task.dueDate);
				return taskDate >= dateFrom && taskDate <= dateTo;
			});
		} else if (dateFrom) {
			filteredTasks = filteredTasks.filter((task) => {
				if (!task.dueDate) return false;

				const taskDate = new Date(task.dueDate);
				return taskDate >= dateFrom;
			});
		} else if (dateTo) {
			filteredTasks = filteredTasks.filter((task) => {
				if (!task.dueDate) return false;

				const taskDate = new Date(task.dueDate);
				return taskDate <= dateTo;
			});
		}

		// Render filtered tasks
		this.uiManager.renderTasks(filteredTasks);

		// Hide filter panel
		this.filterPanel.classList.add('hidden');
	}

	/**
	 * Reset all filters
	 */
	resetFilters() {
		// Reset status filters
		document
			.querySelectorAll('input[data-filter="status"]')
			.forEach((input) => {
				input.checked = input.value === 'all';
			});

		// Reset category filters
		document
			.querySelectorAll('input[data-filter="category"]')
			.forEach((input) => {
				input.checked = input.value === 'all';
			});

		// Reset date range
		this.dateFromInput._flatpickr.clear();
		this.dateToInput._flatpickr.clear();

		// Render all tasks
		this.uiManager.renderTasks();

		// Hide filter panel
		this.filterPanel.classList.add('hidden');
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
