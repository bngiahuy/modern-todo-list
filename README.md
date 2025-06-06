# Modern Todo App

A responsive, feature-rich todo application built with HTML5, CSS3, and vanilla JavaScript. This application offers a clean, modern user interface with intuitive controls and full task management capabilities.

![Modern Todo App](https://via.placeholder.com/800x400?text=Modern+Todo+App)

## Features

- **Full CRUD Functionality**: Create, read, update, and delete tasks
- **Modern UI**: Clean design using CSS Grid and Flexbox
- **Task Categorization**: Organize tasks with color-coded categories
- **Priority Levels**: Assign low, medium, or high priority to tasks
- **Due Dates**: Set deadlines with an integrated date-picker
- **Reminder Notifications**: Get notified about tasks due soon or overdue
- **Search Functionality**: Quickly find tasks by title or description
- **Advanced Filtering**: Filter tasks by status, category, and date range
- **Drag and Drop Reordering**: Easily reorder tasks using HTML5 Drag and Drop API
- **Responsive Design**: Works seamlessly on all devices with appropriate breakpoints
- **Dark/Light Theme**: Toggle between themes, respects system preferences
- **Micro-interactions**: Subtle animations and transitions for better user experience
- **Data Persistence**: All tasks are saved between sessions

## Data Storage

The application uses the browser's **localStorage API** to persist tasks between sessions. This means:

- All tasks are stored locally in the user's browser
- No server or external database is required
- Data remains on the device and doesn't transfer between different browsers or devices
- Tasks remain saved even when the browser is closed and reopened
- Data will be lost if the user clears their browser cache/localStorage

## Project Structure

```
todo-list/
├── index.html            # Main HTML structure
├── css/
│   └── styles.css        # All styling and animations
├── js/
│   ├── app.js            # Main application entry point
│   ├── taskManager.js    # Task data management and operations
│   ├── uiManager.js      # UI rendering and interactions
│   ├── notificationManager.js # Notification system
│   ├── themeManager.js   # Theme switching functionality
│   ├── filterManager.js  # Task filtering logic
│   └── dragDropManager.js # Drag and drop functionality
└── README.md             # Project documentation
```

## Architecture

The application follows a modular design pattern, with clear separation of concerns:

1. **TaskManager**: Handles all task-related operations and data persistence
   - Creates, updates, and deletes tasks
   - Manages task data in localStorage
   - Provides methods for filtering and searching tasks

2. **UIManager**: Manages the user interface
   - Renders tasks in the DOM
   - Handles user interactions
   - Creates and updates task elements

3. **NotificationManager**: Manages notifications
   - Shows success/error messages for user actions
   - Provides reminders for upcoming and overdue tasks

4. **ThemeManager**: Handles theme switching
   - Toggles between light and dark themes
   - Respects user's system preferences
   - Persists theme preference

5. **FilterManager**: Manages task filtering
   - Applies filters based on status, category, and date
   - Updates UI based on filter criteria

6. **DragDropManager**: Implements drag and drop functionality
   - Handles HTML5 Drag and Drop events
   - Updates task positions after reordering

## How to Use

1. **Add a Task**: Click the "New Task" button and fill in the details
2. **Edit a Task**: Click the edit icon on any task to modify it
3. **Complete a Task**: Click the checkbox to mark a task as complete
4. **Delete a Task**: Click the trash icon to remove a task
5. **Search**: Type in the search box to find tasks by title or description
6. **Filter Tasks**: Click the filter icon to open the filter panel
7. **Reorder Tasks**: Drag and drop tasks to change their order
8. **Switch Theme**: Click the moon/sun icon to toggle between light and dark themes

## Setup and Installation

1. Clone or download this repository
2. Open `index.html` in your browser
3. No build process or server required!

## Browser Compatibility

The application works in all modern browsers that support:
- ES6 JavaScript features
- CSS Grid and Flexbox
- localStorage API
- HTML5 Drag and Drop API

## License

MIT License

## Future Enhancements

- Cloud synchronization
- Multiple task lists
- Recurring tasks
- Collaboration features
- Mobile applications
