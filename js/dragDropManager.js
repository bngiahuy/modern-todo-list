/**
 * DragDropManager class - Handles drag and drop functionality for tasks
 */
export class DragDropManager {
	constructor(taskManager, uiManager) {
		this.taskManager = taskManager;
		this.uiManager = uiManager;
		this.draggedElement = null;
		this.tasksContainer = document.getElementById('tasks-container');

		// Initialize drag and drop
		this.init();
	}

	/**
	 * Initialize drag and drop functionality
	 */
	init() {
		// Add event listeners to the tasks container
		this.tasksContainer.addEventListener('dragstart', (e) =>
			this.handleDragStart(e)
		);
		this.tasksContainer.addEventListener('dragover', (e) =>
			this.handleDragOver(e)
		);
		this.tasksContainer.addEventListener('dragenter', (e) =>
			this.handleDragEnter(e)
		);
		this.tasksContainer.addEventListener('dragleave', (e) =>
			this.handleDragLeave(e)
		);
		this.tasksContainer.addEventListener('drop', (e) => this.handleDrop(e));
		this.tasksContainer.addEventListener('dragend', (e) =>
			this.handleDragEnd(e)
		);
	}

	/**
	 * Handle the drag start event
	 * @param {DragEvent} e Drag event
	 */
	handleDragStart(e) {
		// Only handle task cards
		if (!e.target.classList.contains('task-card')) {
			return;
		}

		this.draggedElement = e.target;
		e.dataTransfer.setData('text/plain', e.target.dataset.id);
		e.dataTransfer.effectAllowed = 'move';

		// Add a dragging class after a short delay to prevent flicker
		setTimeout(() => {
			this.draggedElement.classList.add('dragging');
		}, 0);
	}

	/**
	 * Handle the drag over event
	 * @param {DragEvent} e Drag event
	 */
	handleDragOver(e) {
		// Prevent default to allow drop
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}

	/**
	 * Handle the drag enter event
	 * @param {DragEvent} e Drag event
	 */
	handleDragEnter(e) {
		// Find the task card we're dragging over
		const taskCard = this.findTaskCard(e.target);

		if (taskCard && taskCard !== this.draggedElement) {
			taskCard.classList.add('drag-over');
		}
	}

	/**
	 * Handle the drag leave event
	 * @param {DragEvent} e Drag event
	 */
	handleDragLeave(e) {
		// Find the task card we're leaving
		const taskCard = this.findTaskCard(e.target);

		if (taskCard) {
			taskCard.classList.remove('drag-over');
		}
	}

	/**
	 * Handle the drop event
	 * @param {DragEvent} e Drag event
	 */
	handleDrop(e) {
		// Prevent default action
		e.preventDefault();

		// Find the task card we're dropping onto
		const dropTarget = this.findTaskCard(e.target);

		// Remove drag-over class
		if (dropTarget) {
			dropTarget.classList.remove('drag-over');
		}

		// If dropping onto a task card and it's not the dragged element
		if (
			dropTarget &&
			this.draggedElement &&
			dropTarget !== this.draggedElement
		) {
			this.reorderTasks(this.draggedElement, dropTarget);
		}
	}

	/**
	 * Handle the drag end event
	 * @param {DragEvent} e Drag event
	 */
	handleDragEnd(e) {
		// Remove dragging class
		if (this.draggedElement) {
			this.draggedElement.classList.remove('dragging');
			this.draggedElement = null;
		}

		// Remove drag-over class from all task cards
		const taskCards = this.tasksContainer.querySelectorAll('.task-card');
		taskCards.forEach((card) => {
			card.classList.remove('drag-over');
		});
	}

	/**
	 * Reorder tasks after a drag and drop operation
	 * @param {HTMLElement} draggedElement The dragged element
	 * @param {HTMLElement} dropTarget The drop target element
	 */
	reorderTasks(draggedElement, dropTarget) {
		// Get all task cards
		const taskCards = Array.from(
			this.tasksContainer.querySelectorAll('.task-card')
		);

		// Get indices
		const draggedIndex = taskCards.indexOf(draggedElement);
		const dropIndex = taskCards.indexOf(dropTarget);

		// Move the dragged element in the DOM
		if (draggedIndex < dropIndex) {
			// If dragged downwards, insert after drop target
			dropTarget.parentNode.insertBefore(
				draggedElement,
				dropTarget.nextSibling
			);
		} else {
			// If dragged upwards, insert before drop target
			dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
		}

		// Update task positions in the task manager
		const newPositions = Array.from(
			this.tasksContainer.querySelectorAll('.task-card')
		).map((card, index) => ({
			id: card.dataset.id,
			position: index,
		}));

		this.taskManager.updateTaskPositions(newPositions);
	}

	/**
	 * Find the task card element
	 * @param {HTMLElement} element The element to start from
	 * @returns {HTMLElement|null} The task card element or null
	 */
	findTaskCard(element) {
		// If element is not part of the DOM anymore, return null
		if (!document.contains(element)) {
			return null;
		}

		// If the element is a task card, return it
		if (element.classList && element.classList.contains('task-card')) {
			return element;
		}

		// Otherwise, check the parent elements
		let current = element;
		while (current && current !== this.tasksContainer) {
			if (current.classList && current.classList.contains('task-card')) {
				return current;
			}
			current = current.parentElement;
		}

		return null;
	}
}
