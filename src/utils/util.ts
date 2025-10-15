import { theme } from "./enums";
import { THEME_MAP } from "./consts";

export function stringToBoolean(boolStr: 'false' | 'true'): boolean {
    return boolStr === 'true' || boolStr === null;
}

export function formatTitleWithHyphens(title: any): string {
    return title.replace(/"/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/\/+/g, '/')
        .replace(/[-\/]+$/, '');
}

export function switchPrimeTheme(current: theme) {
    const linkEl = document.getElementById('theme-css') as HTMLLinkElement | null;
    if (!linkEl) return;
    const themeName = THEME_MAP[current];
    linkEl.href = `assets/primeng-themes/${themeName}/theme.css`;
}