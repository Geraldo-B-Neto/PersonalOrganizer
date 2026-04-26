/**
 * THEME SWITCHER
 * Alterna entre .dark e .light e persiste no localStorage.
 */
export function initThemeSwitcher(options = {}) {
  const {
    target = document.body,
    storageKey = 'ds-theme',
    toggleBtnId = 'themeToggle',
  } = options;

  function getPreference() {
    const stored = localStorage.getItem(storageKey);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      target.classList.add('dark');
      target.setAttribute('data-theme', 'dark');
    } else {
      target.classList.remove('dark');
      target.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(storageKey, theme);
  }

  function toggle() {
    const current = localStorage.getItem(storageKey) || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  applyTheme(getPreference());

  const btn = document.getElementById(toggleBtnId);
  if (btn) btn.addEventListener('click', toggle);

  return { toggle, applyTheme };
}
