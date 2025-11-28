import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import { BASE_URL, getSidebarLinks, getFilenameFromUrl } from './utils';

const program = new Command();

program
    .name('tailscale-scraper')
    .description('Scrapes Tailscale documentation and converts it to Markdown')
    .version('1.0.0')
    .action(async () => {
        const scraper = new Scraper();
        await scraper.run();
    });

class Scraper {
    private startUrl = 'https://tailscale.com/kb/1017/install';
    private outputDir = './docs_output';
    private turndownService: TurndownService;

    constructor() {
        this.turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced',
            hr: '---',
            bulletListMarker: '-',
        });

        // Handle relative links
        this.turndownService.addRule('absoluteLinks', {
            filter: (node, options) => {
                return (
                    node.nodeName === 'A' &&
                    node.hasAttribute('href') &&
                    node.getAttribute('href')!.startsWith('/')
                );
            },
            replacement: (content, node) => {
                const element = node as HTMLAnchorElement;
                const href = element.getAttribute('href');
                if (href && href.startsWith('/')) {
                    return `[${content}](${BASE_URL}${href})`;
                }
                return `[${content}](${href})`;
            },
        });
    }

    public async run() {
        console.log('Starting scraper...');

        // Ensure output directory exists
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        try {
            const links = await this.fetchSidebarLinks();
            console.log(`Found ${links.length} links in sidebar.`);

            for (const link of links) {
                await this.processPage(link);
                // Be polite
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            console.log('Scraping completed!');
        } catch (error) {
            console.error('Scraping failed:', error);
        }
    }

    private async fetchSidebarLinks(): Promise<string[]> {
        console.log(`Fetching sidebar from ${this.startUrl}...`);
        const response = await axios.get(this.startUrl);
        const $ = cheerio.load(response.data);
        return getSidebarLinks($);
    }

    private async processPage(url: string) {
        console.log(`Processing ${url}...`);
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            let mainContent = $('#main-content');

            if (mainContent.length === 0) {
                // Fallback for pages like /changelog, /security which might not have #main-content
                mainContent = $('main');
            }
            if (mainContent.length === 0) {
                mainContent = $('article');
            }

            if (mainContent.length === 0) {
                console.warn(`No main content found for ${url}`);
                return;
            }

            // Clean up
            mainContent.find('header').remove(); // Remove breadcrumbs

            // Remove "Last updated" text.
            mainContent.find('p').each((_, el) => {
                if ($(el).text().includes('Last updated')) {
                    $(el).remove();
                }
            });

            const html = mainContent.html();
            if (!html) {
                console.warn(`Empty content for ${url}`);
                return;
            }

            const markdown = this.turndownService.turndown(html);

            const filename = getFilenameFromUrl(url);
            const filepath = path.join(this.outputDir, filename);

            fs.writeFileSync(filepath, markdown);
            console.log(`Saved to ${filepath}`);

        } catch (error) {
            console.error(`Failed to process ${url}:`, error);
        }
    }
}

program.parse(process.argv);
