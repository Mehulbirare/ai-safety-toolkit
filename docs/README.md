# SafeguardAI Documentation Website

This folder contains the documentation website for SafeguardAI, generated from Markdown files.

## Structure

- **index.html** - Main landing page for the documentation
- **[PAGE].html** - Individual documentation pages converted from Markdown
- **[PAGE].md** - Original Markdown source files

## Viewing the Documentation

### Local Viewing

Simply open `index.html` in your web browser:

```bash
# On Linux/Mac
open docs/index.html

# On Windows
start docs/index.html

# Using Python's HTTP server (recommended for testing)
cd docs
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Navigation

The website includes:
- A main landing page (index.html) with feature highlights and quick links
- Individual documentation pages with a sidebar navigation menu
- Links to navigate between all documentation pages

## Updating Documentation

### Converting Markdown to HTML

When you update the Markdown files, regenerate the HTML pages:

```bash
node convert-docs-to-html.js
```

This script:
1. Reads all `.md` files from the docs folder
2. Converts them to styled HTML using the `marked` library
3. Adds a consistent navigation sidebar to each page
4. Highlights the current page in the navigation menu

### Available Pages

- **GETTING_STARTED.html** - Comprehensive getting started guide
- **API.html** - API reference and documentation
- **POST_INSTALL_GUIDE.html** - Post-installation setup guide
- **QUICK_REFERENCE.html** - Quick reference for common tasks
- **PRICING_MODEL.html** - Pricing information
- **LAUNCH_BLOG_POST.html** - Launch announcement blog post

## Styling

All pages share a consistent dark theme styling with:
- Dark background (#0b0e14)
- Cyan accent color (#00d2ff)
- Syntax-highlighted code blocks
- Responsive sidebar navigation
- Mobile-friendly design

## Dependencies

The conversion script requires:
- Node.js 14+
- `marked` library (installed via npm)

```bash
npm install marked --save-dev
```

## Deployment

These HTML files can be:
- Hosted on GitHub Pages
- Deployed to any static hosting service (Netlify, Vercel, etc.)
- Served from a web server
- Opened directly in a browser for offline viewing
