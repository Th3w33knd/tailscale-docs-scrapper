If you don't want to scape by yourself, go [here](https://github.com/Th3w33knd/tailscale-docs-for-AI)

# 🦎 Tailscale Docs Scraper

![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen) ![Language](https://img.shields.io/badge/language-TypeScript-blue) ![License](https://img.shields.io/badge/license-MIT-orange)

> **A robust CLI tool to scrape the Tailscale documentation and convert it to clean Markdown for LLM ingestion.**

## 📖 Description

This tool spiders the Tailscale documentation starting from the installation guide. It is designed to create high-quality datasets by:

* 🕷️ **Spidering** all links found in the sidebar.
* 🧹 **Cleaning** content (removing breadcrumbs, metadata, and footer noise).
* 🔗 **Normalizing** relative links to absolute URLs.
* 📄 **Converting** raw HTML to formatted Markdown.

---

## ⚙️ Prerequisites

* **Node.js**: v14 or higher recommended
* **npm**: Installed automatically with Node

## 🚀 Installation

1.  **Clone the repository**
2.  **Install dependencies**

```bash
npm install
```

----------

## 🛠️ Usage

### 1. Run the Scraper

Compiles the TypeScript code and spiders the documentation.

Bash

```
npm start
```

_Output: Markdown files will be saved to the `docs_output/` directory._

### 2. Verify Completeness

Ensures that every link found in the sidebar has a corresponding file on your disk.

Bash

```
npm run verify
```

### 3. Clean Workspace

Removes the generated `dist` and `docs_output` directories.

Bash

```
npm run clean
```

----------

## 📂 Project Structure

```Plaintext
src/
├── scraper.ts      # 🧠 Main scraper logic & class definitions
├── verify.ts       # 🔍 Integrity check script
└── utils.ts        # 🔧 Shared utilities (URL normalization, parsing)
```
