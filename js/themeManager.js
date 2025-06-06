/**
 * ThemeManager class - Handles theme switching and persistence
 */
export class ThemeManager {
	constructor() {
		this.themeToggleButton = document.getElementById('theme-toggle');
		this.themeToggleIcon = this.themeToggleButton.querySelector('i');
		this.darkThemeClass = 'dark-theme';
		this.darkThemeKey = 'dark-theme-enabled';

		// Initialize theme
		this.init();
	}

	/**
	 * Initialize theme manager
	 */
	init() {
		// Check system preference for dark mode
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

		// Check if user has previously set a theme preference
		const savedThemePreference = localStorage.getItem(this.darkThemeKey);

		if (
			savedThemePreference === 'true' ||
			(savedThemePreference === null && prefersDarkScheme.matches)
		) {
			this.enableDarkTheme();
		} else {
			this.enableLightTheme();
		}

		// Add event listener for theme toggle button
		this.themeToggleButton.addEventListener('click', () => this.toggleTheme());

		// Listen for system theme changes
		prefersDarkScheme.addEventListener('change', (e) => {
			// Only change theme if user hasn't set a preference
			if (localStorage.getItem(this.darkThemeKey) === null) {
				if (e.matches) {
					this.enableDarkTheme();
				} else {
					this.enableLightTheme();
				}
			}
		});
	}

	/**
	 * Toggle between light and dark themes
	 */
	toggleTheme() {
		if (document.body.classList.contains(this.darkThemeClass)) {
			this.enableLightTheme();
		} else {
			this.enableDarkTheme();
		}
	}

	/**
	 * Enable dark theme
	 */
	enableDarkTheme() {
		document.body.classList.add(this.darkThemeClass);
		this.themeToggleIcon.classList.remove('fa-moon');
		this.themeToggleIcon.classList.add('fa-sun');
		localStorage.setItem(this.darkThemeKey, 'true');
	}

	/**
	 * Enable light theme
	 */
	enableLightTheme() {
		document.body.classList.remove(this.darkThemeClass);
		this.themeToggleIcon.classList.remove('fa-sun');
		this.themeToggleIcon.classList.add('fa-moon');
		localStorage.setItem(this.darkThemeKey, 'false');
	}
}
