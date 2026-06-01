import { theme } from './enums';
import { THEME_MAP } from './consts';

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

export function switchPrimeTheme(current: theme) {
  const linkEl = document.getElementById('theme-css') as HTMLLinkElement | null;
  if (!linkEl) return;
  const themeName = THEME_MAP[current];
  linkEl.href = `assets/primeng-themes/${themeName}/theme.css`;
}
