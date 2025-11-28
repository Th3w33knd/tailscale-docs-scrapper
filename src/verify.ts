import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { BASE_URL, getSidebarLinks, getFilenameFromUrl } from './utils';

const startUrl = 'https://tailscale.com/kb/1017/install';
const outputDir = './docs_output';

async function verify() {
    console.log('Starting verification...');

    // Step 1: Establish Source of Truth
    console.log(`Fetching sidebar from ${startUrl}...`);
    let response;
    try {
        response = await axios.get(startUrl);
    } catch (error) {
        console.error('Failed to fetch sidebar:', error);
        process.exit(1);
    }

    const $ = cheerio.load(response.data);
    const expectedLinks = getSidebarLinks($);
    console.log(`Expected Unique Links in Sidebar: ${expectedLinks.length}`);

    // Step 2: Establish Actual Result
    if (!fs.existsSync(outputDir)) {
        console.error(`Output directory ${outputDir} does not exist.`);
        process.exit(1);
    }

    const actualFiles = fs.readdirSync(outputDir).filter(file => {
        return file.endsWith('.md') && fs.statSync(path.join(outputDir, file)).isFile();
    });

    console.log(`Actual Markdown Files generated: ${actualFiles.length}`);

    // Step 3: Comparison
    if (expectedLinks.length === actualFiles.length) {
        console.log('\x1b[32m%s\x1b[0m', `✅ Verification Successful: ${actualFiles.length}/${expectedLinks.length} files present`);
    } else {
        console.log('\x1b[31m%s\x1b[0m', `❌ Verification Failed: Expected ${expectedLinks.length}, Found ${actualFiles.length}`);

        const diff = expectedLinks.length - actualFiles.length;
        console.log(`Difference: ${Math.abs(diff)} files`);

        // Identify missing files
        const expectedFilenames = new Set(expectedLinks.map(url => getFilenameFromUrl(url)));
        const actualFilenames = new Set(actualFiles);

        const missingFiles = [...expectedFilenames].filter(x => !actualFilenames.has(x));
        const extraFiles = [...actualFilenames].filter(x => !expectedFilenames.has(x));

        if (missingFiles.length > 0) {
            console.log('Missing Files (based on URL mapping):');
            missingFiles.forEach(f => console.log(` - ${f}`));
        }

        if (extraFiles.length > 0) {
            console.log('Extra Files (found but not in sidebar):');
            extraFiles.forEach(f => console.log(` - ${f}`));
        }
    }
}

verify();
