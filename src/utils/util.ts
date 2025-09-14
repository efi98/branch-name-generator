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