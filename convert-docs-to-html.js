#!/usr/bin/env node

/**
 * Documentation HTML Generator
 * 
 * This script converts Markdown documentation files to HTML with styled navigation.
 * 
 * Requirements:
 * - Node.js 20+ (required by marked library)
 * - marked npm package
 * 
 * Note: End users don't need to run this script. HTML files are pre-generated.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const DOCS_DIR = path.join(__dirname, 'docs');

// List of markdown files to convert
const mdFiles = [
    'GETTING_STARTED.md',
    'API.md',
    'POST_INSTALL_GUIDE.md',
    'QUICK_REFERENCE.md',
    'PRICING_MODEL.md',
    'LAUNCH_BLOG_POST.md'
];

// Create navigation links
function generateNavigation(currentFile) {
    const navItems = mdFiles.map(file => {
        const htmlFile = file.replace('.md', '.html');
        const title = file.replace('.md', '').replace(/_/g, ' ');
        const isActive = file.replace('.md', '.html') === currentFile;
        return `<a href="${htmlFile}" class="nav-link ${isActive ? 'active' : ''}">${title}</a>`;
    });
    
    return `
        <div class="doc-nav">
            <a href="index.html" class="nav-link home-link">
                <i class="fas fa-home"></i> Home
            </a>
            ${navItems.join('\n            ')}
        </div>
    `;
}

// HTML template wrapper
function wrapWithTemplate(title, content, htmlFile) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SafeguardAI Documentation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-color: #0b0e14;
            --card-bg: #161b22;
            --accent-primary: #00d2ff;
            --accent-secondary: #3a7bd5;
            --text-primary: #f0f6fc;
            --text-secondary: #8b949e;
            --code-bg: #0d1117;
            --border-color: #30363d;
            --gradient: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            --radius: 8px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            line-height: 1.6;
        }

        .container {
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar Navigation */
        .sidebar {
            width: 280px;
            background: var(--card-bg);
            border-right: 1px solid var(--border-color);
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            padding: 2rem 0;
        }

        .brand {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 800;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 0 1.5rem 2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .doc-nav {
            display: flex;
            flex-direction: column;
        }

        .nav-link {
            padding: 0.75rem 1.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            transition: all 0.2s;
            border-left: 3px solid transparent;
            font-size: 0.9rem;
        }

        .nav-link:hover {
            color: var(--accent-primary);
            background: rgba(0, 210, 255, 0.05);
        }

        .nav-link.active {
            color: var(--accent-primary);
            background: rgba(0, 210, 255, 0.1);
            border-left-color: var(--accent-primary);
            font-weight: 600;
        }

        .home-link {
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1rem;
        }

        /* Main Content */
        .main-content {
            margin-left: 280px;
            flex: 1;
            padding: 3rem;
            max-width: 900px;
        }

        .doc-header {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Outfit', sans-serif;
            color: var(--text-primary);
            margin-top: 2rem;
            margin-bottom: 1rem;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-top: 0;
            background: var(--gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        h2 {
            font-size: 1.75rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-color);
        }

        h3 {
            font-size: 1.35rem;
        }

        p {
            margin-bottom: 1rem;
            color: var(--text-secondary);
        }

        a {
            color: var(--accent-primary);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        /* Code Blocks */
        pre {
            background: var(--code-bg);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 1.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
        }

        code {
            font-family: 'Fira Code', 'Courier New', monospace;
            font-size: 0.9rem;
        }

        p code, li code {
            background: var(--code-bg);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #79c0ff;
        }

        /* Lists */
        ul, ol {
            margin: 1rem 0 1rem 2rem;
            color: var(--text-secondary);
        }

        li {
            margin: 0.5rem 0;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            background: var(--card-bg);
        }

        th, td {
            padding: 0.75rem;
            text-align: left;
            border: 1px solid var(--border-color);
        }

        th {
            background: rgba(0, 210, 255, 0.1);
            color: var(--text-primary);
            font-weight: 600;
        }

        td {
            color: var(--text-secondary);
        }

        /* Blockquotes */
        blockquote {
            border-left: 4px solid var(--accent-primary);
            padding-left: 1rem;
            margin: 1.5rem 0;
            color: var(--text-secondary);
            font-style: italic;
        }

        /* Horizontal Rule */
        hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 2rem 0;
        }

        /* Checkboxes (for task lists) */
        input[type="checkbox"] {
            margin-right: 0.5rem;
        }

        /* Mobile */
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }

            .main-content {
                margin-left: 0;
                padding: 1.5rem;
            }

            h1 {
                font-size: 2rem;
            }

            pre {
                padding: 1rem;
            }
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-secondary);
        }
    </style>
</head>
<body>
    <div class="container">
        <aside class="sidebar">
            <div class="brand">
                <i class="fas fa-shield-halved"></i>
                SafeguardAI
            </div>
            ${generateNavigation(htmlFile)}
        </aside>
        <main class="main-content">
            <article class="doc-content">
                ${content}
            </article>
        </main>
    </div>
</body>
</html>`;
}

// Extract title from markdown content
function extractTitle(content) {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : 'Documentation';
}

// Convert markdown to HTML
async function convertMarkdownFiles() {
    console.log('🚀 Starting markdown to HTML conversion...\n');

    for (const mdFile of mdFiles) {
        const mdPath = path.join(DOCS_DIR, mdFile);
        const htmlFile = mdFile.replace('.md', '.html');
        const htmlPath = path.join(DOCS_DIR, htmlFile);

        try {
            // Read markdown file
            const markdown = fs.readFileSync(mdPath, 'utf8');
            
            // Extract title
            const title = extractTitle(markdown);
            
            // Convert markdown to HTML
            const htmlContent = marked(markdown);
            
            // Wrap with template
            const fullHtml = wrapWithTemplate(title, htmlContent, htmlFile);
            
            // Write HTML file
            fs.writeFileSync(htmlPath, fullHtml, 'utf8');
            
            console.log(`✅ Converted: ${mdFile} -> ${htmlFile}`);
        } catch (error) {
            console.error(`❌ Error converting ${mdFile}:`, error.message);
        }
    }

    console.log('\n✨ Conversion complete!\n');
    console.log('📁 HTML files created in:', DOCS_DIR);
    console.log('🌐 Open docs/index.html to view the documentation site\n');
}

// Run conversion
convertMarkdownFiles().catch(console.error);
