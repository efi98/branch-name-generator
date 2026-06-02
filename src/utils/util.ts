import { theme } from './enums';
import { USER_THEME } from './consts';

export function stringToBoolean(boolStr: 'false' | 'true'): boolean {
  return boolStr === 'true' || boolStr === null;
}

export function formatTitleWithHyphens(title: string): string {
  return title
    .replaceAll('"', '')
    .replaceAll(/[\s_]+/g, '-')
    .replaceAll(/-+/g, '-')
    .replaceAll(/\/+/g, '/')
    .replaceAll(/([-/]+)$/g, '');
}

export function switchTheme(current?: theme) {
  let currentTheme = (localStorage.getItem('theme') as theme) || USER_THEME;
  if (current) {
    currentTheme = current;
  }

  const isDarkTheme = currentTheme === theme.dark;
  if (isDarkTheme) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
