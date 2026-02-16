#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, 'docs');

const htmlFiles = [
    'index.html',
    'GETTING_STARTED.html',
    'API.html',
    'POST_INSTALL_GUIDE.html',
    'QUICK_REFERENCE.html',
    'PRICING_MODEL.html',
    'LAUNCH_BLOG_POST.html'
];

console.log('🧪 Testing Documentation Website...\n');

let allTestsPassed = true;

// Test 1: Check all HTML files exist
console.log('Test 1: Checking all HTML files exist...');
htmlFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✅ ${file} exists`);
    } else {
        console.log(`  ❌ ${file} NOT FOUND`);
        allTestsPassed = false;
    }
});
console.log();

// Test 2: Check HTML structure
console.log('Test 2: Checking HTML structure...');
htmlFiles.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for DOCTYPE
        if (content.includes('<!DOCTYPE html>')) {
            console.log(`  ✅ ${file} has DOCTYPE`);
        } else {
            console.log(`  ❌ ${file} missing DOCTYPE`);
            allTestsPassed = false;
        }
        
        // Check for title
        if (content.includes('<title>')) {
            console.log(`  ✅ ${file} has title tag`);
        } else {
            console.log(`  ❌ ${file} missing title tag`);
            allTestsPassed = false;
        }
    }
});
console.log();

// Test 3: Check navigation links in converted pages
console.log('Test 3: Checking navigation links...');
const convertedPages = htmlFiles.filter(f => f !== 'index.html');
convertedPages.forEach(file => {
    const filePath = path.join(DOCS_DIR, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for sidebar navigation
        if (content.includes('class="sidebar"')) {
            console.log(`  ✅ ${file} has sidebar navigation`);
        } else {
            console.log(`  ❌ ${file} missing sidebar navigation`);
            allTestsPassed = false;
        }
        
        // Check for home link
        if (content.includes('href="index.html"')) {
            console.log(`  ✅ ${file} has link to home`);
        } else {
            console.log(`  ❌ ${file} missing link to home`);
            allTestsPassed = false;
        }
    }
});
console.log();

// Test 4: Check index.html links to other pages
console.log('Test 4: Checking index.html links...');
const indexPath = path.join(DOCS_DIR, 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

const expectedLinks = [
    'GETTING_STARTED.html',
    'POST_INSTALL_GUIDE.html',
    'QUICK_REFERENCE.html',
    'API.html',
    'PRICING_MODEL.html',
    'LAUNCH_BLOG_POST.html'
];

expectedLinks.forEach(link => {
    if (indexContent.includes(`href="${link}"`)) {
        console.log(`  ✅ index.html links to ${link}`);
    } else {
        console.log(`  ❌ index.html missing link to ${link}`);
        allTestsPassed = false;
    }
});
console.log();

// Summary
if (allTestsPassed) {
    console.log('✅ All tests passed! The documentation website is ready.\n');
    console.log('To view the documentation:');
    console.log('  - Open docs/index.html in your browser');
    console.log('  - Or run: cd docs && python3 -m http.server 8000');
    console.log('    Then visit: http://localhost:8000\n');
} else {
    console.log('❌ Some tests failed. Please review the errors above.\n');
    process.exit(1);
}
