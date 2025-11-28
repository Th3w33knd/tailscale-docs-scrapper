# Tailscale Docs Scraper

A robust CLI tool to scrape the Tailscale documentation and convert it to Markdown.

## Description

This tool spiders the Tailscale documentation starting from `https://tailscale.com/kb/1017/install`. It extracts all links from the sidebar, fetches each page, cleans up the content (removing breadcrumbs and metadata), and converts the HTML to Markdown. It handles relative links, ensuring they are converted to absolute URLs.

## Prerequisites

-   Node.js (v14 or higher recommended)
-   npm

## Installation

1.  Clone the repository.
2.  Install dependencies:

```bash
npm install
```

## Usage

### Run the Scraper

To start scraping the documentation:

```bash
npm start
```

This will:
1.  Compile the TypeScript code.
2.  Start the scraper.
3.  Save the Markdown files to the `docs_output` directory.

### Verify the Output

To verify that all pages from the sidebar have been scraped:

```bash
npm run verify
```

This script compares the unique links found in the sidebar against the files generated in `docs_output`.

### Clean Up

To remove the generated `dist` and `docs_output` directories:

```bash
npm run clean
```

## Project Structure

```
src/
├── scraper.ts      # Main scraper logic (Scraper class)
├── verify.ts       # Verification script
└── utils.ts        # Shared utility functions (URL normalization, link extraction)
```
