import { theme } from "./enums";

export const USER_THEME: theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? theme.dark : theme.light;

export const DEFAULTS = {
    theme: USER_THEME,
    isSnkeOSMode: false,
    showModeSwitch: true,
    showWelcomeMsg: true,
    showSubmitAlert: true,
    showFormChangeAlert: true
};

export const THEME_MAP: Record<theme, string> = {
    light: 'lara-light-blue',
    dark: 'lara-dark-blue'
};