import * as cheerio from 'cheerio';

export const BASE_URL = 'https://tailscale.com';

export function normalizeUrl(href: string): string | null {
    if (!href) return null;
    try {
        const urlObj = new URL(href, BASE_URL);

        // Validation: Ensure origin matches BASE_URL
        if (urlObj.origin !== BASE_URL) {
            return null;
        }

        // Sanitization: Remove hash and search
        urlObj.hash = '';
        urlObj.search = '';

        // Normalization: Remove trailing slash
        if (urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1) {
            urlObj.pathname = urlObj.pathname.slice(0, -1);
        }

        return urlObj.toString();
    } catch (e) {
        return null;
    }
}

export function getSidebarLinks($: cheerio.Root): string[] {
    const links: Set<string> = new Set();
    const sidebar = $('aside.js-docHighlight');

    sidebar.find('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
            const normalized = normalizeUrl(href);
            if (normalized) {
                links.add(normalized);
            }
        }
    });

    return Array.from(links);
}

export function getFilenameFromUrl(url: string): string {
    const parts = url.split('/').filter(p => p.length > 0);
    if (parts.length >= 2) {
        const last = parts[parts.length - 1];
        const secondLast = parts[parts.length - 2];
        if (/^\d+$/.test(secondLast)) {
            return `${secondLast}-${last}.md`;
        }
        return `${last}.md`;
    }
    return 'unknown.md';
}
