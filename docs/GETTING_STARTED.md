# 🚀 Getting Started with SafeguardAI

A comprehensive guide for implementing SafeguardAI in your projects after installation.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Initial Setup](#initial-setup)
4. [Quick Start Guide](#quick-start-guide)
5. [Common Use Cases](#common-use-cases)
6. [Configuration Options](#configuration-options)
7. [Integration Patterns](#integration-patterns)
8. [Testing Your Implementation](#testing-your-implementation)
9. [Production Checklist](#production-checklist)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before using SafeguardAI, ensure you have:

- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (or yarn/pnpm)
- **OpenAI API Key**: Required for content moderation features
  - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

---

## Installation

```bash
npm install safeguard-ai
```

Or with yarn:
```bash
yarn add safeguard-ai
```

Or with pnpm:
```bash
pnpm add safeguard-ai
```

---

## Initial Setup

### Step 1: Create Environment File

Create a `.env` file in your project root to store your API key securely:

```bash
# .env
OPENAI_API_KEY=your-openai-api-key-here
```

**Important**: Add `.env` to your `.gitignore` to avoid committing sensitive credentials:

```bash
# .gitignore
.env
node_modules/
```

### Step 2: Install dotenv (if not already installed)

To load environment variables, install `dotenv`:

```bash
npm install dotenv
```

### Step 3: Create Your First SafeguardAI Instance

Create a new file (e.g., `safeguard.js` or `safeguard.ts`):

**JavaScript:**
```javascript
// safeguard.js
const SafeguardAI = require('safeguard-ai');
require('dotenv').config();

const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    providers: ['openai'],
    strictness: 'medium',
    redactPII: true
});

module.exports = moderator;
```

**TypeScript:**
```typescript
// safeguard.ts
import SafeguardAI from 'safeguard-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    providers: ['openai'],
    strictness: 'medium',
    redactPII: true
});

export default moderator;
```

---

## Quick Start Guide

### Example 1: Basic Text Moderation

```javascript
const moderator = require('./safeguard');

async function checkMessage(userMessage) {
    try {
        const result = await moderator.checkText(userMessage);
        
        if (!result.safe) {
            console.log('⚠️ Content flagged!');
            console.log('Categories:', result.categories);
            console.log('Suggestions:', result.suggestions);
            return { allowed: false, reason: 'Content policy violation' };
        }
        
        console.log('✅ Content is safe');
        return { allowed: true, cleanText: result.cleanText };
        
    } catch (error) {
        console.error('Moderation error:', error);
        return { allowed: false, reason: 'Moderation service unavailable' };
    }
}

// Test it
checkMessage("Hello! This is a friendly message.");
```

### Example 2: Detecting and Redacting PII

```javascript
const moderator = require('./safeguard');

async function processSupportTicket(ticketContent) {
    const result = await moderator.checkText(ticketContent);
    
    if (result.piiDetected.length > 0) {
        console.log('🔒 PII Detected:');
        result.piiDetected.forEach(pii => {
            console.log(`- ${pii.type}: ${pii.value}`);
        });
        
        // Use the cleaned text without PII
        return result.cleanText;
    }
    
    return ticketContent;
}

// Test with PII
processSupportTicket("Contact me at john.doe@example.com or call 555-123-4567");
// Output: "Contact me at [REDACTED_EMAIL] or call [REDACTED_PHONE]"
```

### Example 3: Adding Custom Blocked Words

```javascript
const moderator = require('./safeguard');

// Add industry-specific blocked words
moderator.rules.addBlockedWords([
    'competitor-name',
    'internal-project',
    'confidential'
]);

async function checkComment(comment) {
    const result = await moderator.checkText(comment);
    
    if (result.flagged) {
        console.log('⛔ Comment blocked');
        console.log('Reasons:', result.suggestions);
    }
}

checkComment("Don't share our internal-project details!");
```

---

## Common Use Cases

### Use Case 1: AI Chatbot Integration

```javascript
const moderator = require('./safeguard');

async function chatbot(userMessage) {
    // Step 1: Check user input
    const inputCheck = await moderator.checkText(userMessage);
    
    if (!inputCheck.safe) {
        return {
            reply: "I cannot process messages containing inappropriate content.",
            flagged: true
        };
    }
    
    // Step 2: Process with your AI (OpenAI, Claude, etc.)
    const aiResponse = await yourAIProvider.generateResponse(inputCheck.cleanText);
    
    // Step 3: Check AI output (optional but recommended)
    const outputCheck = await moderator.checkText(aiResponse);
    
    return {
        reply: outputCheck.cleanText,
        flagged: false
    };
}
```

### Use Case 2: Express.js API Endpoint

```javascript
const express = require('express');
const moderator = require('./safeguard');

const app = express();
app.use(express.json());

// Middleware for content moderation
async function moderationMiddleware(req, res, next) {
    if (!req.body.content) return next();
    
    try {
        const result = await moderator.checkText(req.body.content);
        
        if (!result.safe) {
            return res.status(400).json({
                error: 'Content violates our policies',
                categories: result.categories,
                suggestions: result.suggestions
            });
        }
        
        // Attach cleaned content
        req.body.cleanContent = result.cleanText;
        req.moderationResult = result;
        next();
        
    } catch (error) {
        console.error('Moderation error:', error);
        // Decide: fail closed (reject) or fail open (allow)
        next(); // or return res.status(500).json({ error: 'Moderation unavailable' });
    }
}

// Apply to specific routes
app.post('/api/comments', moderationMiddleware, (req, res) => {
    // Save the cleaned content
    res.json({
        message: 'Comment posted successfully',
        content: req.body.cleanContent
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Use Case 3: User-Generated Content Platform

```javascript
const moderator = require('./safeguard');

// Configure for strict moderation
const strictModerator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    strictness: 'high',
    redactPII: true
});

async function submitPost(postData) {
    // Check title
    const titleCheck = await strictModerator.checkText(postData.title);
    
    // Check content
    const contentCheck = await strictModerator.checkText(postData.content);
    
    if (!titleCheck.safe || !contentCheck.safe) {
        return {
            success: false,
            errors: {
                title: titleCheck.safe ? null : titleCheck.suggestions,
                content: contentCheck.safe ? null : contentCheck.suggestions
            }
        };
    }
    
    // Save post with cleaned content
    return {
        success: true,
        post: {
            title: titleCheck.cleanText,
            content: contentCheck.cleanText
        }
    };
}
```

### Use Case 4: Healthcare/HIPAA Compliance

```javascript
const moderator = require('./safeguard');

// Add custom patterns for medical IDs
moderator.rules.addPattern(/MRN-\d{8}/g, 'MEDICAL_RECORD_NUMBER');
moderator.rules.addPattern(/\b\d{3}-\d{2}-\d{4}\b/g, 'SSN');

async function sanitizeHealthcareData(patientNote) {
    const result = await moderator.checkText(patientNote);
    
    // Log detected PII types (for compliance reporting)
    if (result.piiDetected.length > 0) {
        console.log('PII Redaction Report:');
        result.piiDetected.forEach(pii => {
            console.log(`- Redacted ${pii.type} at position ${pii.position}`);
        });
    }
    
    // Return fully sanitized text
    return result.cleanText;
}
```

---

## Configuration Options

### Strictness Levels

```javascript
// Low strictness - Only blocks highly problematic content
const lowModerator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    strictness: 'low'
});

// Medium strictness - Balanced approach (default)
const mediumModerator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    strictness: 'medium'
});

// High strictness - Very strict filtering
const highModerator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    strictness: 'high'
});
```

### Specific Categories

Monitor only specific content categories:

```javascript
const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    categories: ['hate', 'violence', 'sexual']
    // Skips checking for: self-harm, harassment, etc.
});
```

### PII Redaction Options

```javascript
// Enable automatic PII redaction
const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    redactPII: true
});

// Use the PII detector directly for more control
const text = "Email: john@example.com, Phone: 555-1234";

// Just detect (don't redact)
const piiItems = moderator.detector.detect(text);
console.log(piiItems);

// Redact with different modes
const masked = moderator.detector.redact(text, 'mask');
const replaced = moderator.detector.redact(text, 'replace');
```

---

## Integration Patterns

### Pattern 1: Singleton Instance (Recommended)

Create a single shared instance across your application:

```javascript
// utils/safeguard.js
const SafeguardAI = require('safeguard-ai');
require('dotenv').config();

let moderatorInstance = null;

function getModerator() {
    if (!moderatorInstance) {
        moderatorInstance = new SafeguardAI({
            apiKey: process.env.OPENAI_API_KEY,
            strictness: 'medium',
            redactPII: true
        });
    }
    return moderatorInstance;
}

module.exports = getModerator;
```

Usage:
```javascript
const getModerator = require('./utils/safeguard');

async function myFunction() {
    const moderator = getModerator();
    const result = await moderator.checkText("some text");
}
```

### Pattern 2: Dependency Injection

```javascript
// services/contentService.js
class ContentService {
    constructor(moderator) {
        this.moderator = moderator;
    }
    
    async createPost(content) {
        const result = await this.moderator.checkText(content);
        if (!result.safe) {
            throw new Error('Content policy violation');
        }
        // Save post...
    }
}

// app.js
const moderator = new SafeguardAI({ /* config */ });
const contentService = new ContentService(moderator);
```

### Pattern 3: Async Wrapper

For non-blocking moderation:

```javascript
const Queue = require('bull'); // or any job queue
const moderationQueue = new Queue('moderation');

// Add to queue
async function queueModeration(content, callback) {
    const job = await moderationQueue.add({ content, callback });
    return job.id;
}

// Process queue
moderationQueue.process(async (job) => {
    const { content } = job.data;
    const result = await moderator.checkText(content);
    // Handle result...
    return result;
});
```

---

## Testing Your Implementation

### Test Script

Create a test file to verify your setup:

```javascript
// test-safeguard.js
const moderator = require('./safeguard');

async function runTests() {
    console.log('🧪 Running SafeguardAI Tests...\n');
    
    // Test 1: Safe content
    console.log('Test 1: Safe content');
    const test1 = await moderator.checkText("Hello, this is a friendly message!");
    console.log('Result:', test1.safe ? '✅ PASS' : '❌ FAIL');
    console.log();
    
    // Test 2: PII detection
    console.log('Test 2: PII detection');
    const test2 = await moderator.checkText("Contact: john@example.com");
    console.log('PII found:', test2.piiDetected.length > 0 ? '✅ PASS' : '❌ FAIL');
    console.log('Redacted:', test2.cleanText);
    console.log();
    
    // Test 3: Custom blocked words
    console.log('Test 3: Custom blocked words');
    moderator.rules.addBlockedWords(['testword']);
    const test3 = await moderator.checkText("Contains testword here");
    console.log('Flagged:', test3.flagged ? '✅ PASS' : '❌ FAIL');
    console.log();
    
    console.log('✅ All tests completed!');
}

runTests().catch(console.error);
```

Run it:
```bash
node test-safeguard.js
```

---

## Production Checklist

Before deploying to production:

- [ ] **API Key Security**
  - [ ] API key is in environment variables, not hardcoded
  - [ ] `.env` file is in `.gitignore`
  - [ ] Environment variables are set on production server

- [ ] **Error Handling**
  - [ ] All API calls are wrapped in try-catch blocks
  - [ ] Graceful degradation strategy defined (fail open vs fail closed)
  - [ ] Error logging implemented

- [ ] **Performance**
  - [ ] Consider caching moderation results for identical content
  - [ ] Implement rate limiting to avoid API quota issues
  - [ ] Set appropriate timeouts

- [ ] **Monitoring**
  - [ ] Log moderation failures
  - [ ] Track flagged content metrics
  - [ ] Monitor API usage and costs

- [ ] **Privacy & Compliance**
  - [ ] Never log actual PII values
  - [ ] Document PII handling in privacy policy
  - [ ] Ensure GDPR/CCPA compliance

- [ ] **Testing**
  - [ ] Unit tests for moderation logic
  - [ ] Integration tests with API
  - [ ] Test with various content types

---

## Troubleshooting

### Issue: "API key is required"

**Solution:**
```javascript
// Make sure .env file exists and contains:
OPENAI_API_KEY=sk-your-actual-key

// Make sure dotenv is loaded
require('dotenv').config();

// Verify the key is loaded
console.log('API Key:', process.env.OPENAI_API_KEY ? 'Loaded ✅' : 'Missing ❌');
```

### Issue: "Module not found: safeguard-ai"

**Solution:**
```bash
# Reinstall the package
npm install safeguard-ai

# Clear npm cache if needed
npm cache clean --force
npm install
```

### Issue: API rate limit errors

**Solution:**
```javascript
// Implement exponential backoff
async function checkTextWithRetry(text, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await moderator.checkText(text);
        } catch (error) {
            if (error.response?.status === 429 && i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
                continue;
            }
            throw error;
        }
    }
}
```

### Issue: Slow response times

**Solutions:**
1. **Cache results:**
```javascript
const cache = new Map();

async function checkTextCached(text) {
    if (cache.has(text)) {
        return cache.get(text);
    }
    const result = await moderator.checkText(text);
    cache.set(text, result);
    return result;
}
```

2. **Process in background:**
```javascript
// Queue moderation checks asynchronously
// Allow content temporarily, moderate in background
```

### Issue: TypeScript type definitions not found

**Solution:**
```bash
# Types are included in the package
# If you have issues, try:
npm install --save-dev @types/node
```

---

## Next Steps

Now that you have SafeguardAI set up:

1. **Explore the [API Documentation](./API.md)** for detailed API reference
2. **Check [Examples](../examples/)** for more implementation patterns
3. **Review [Pricing Model](./PRICING_MODEL.md)** to understand costs
4. **Join our community** for support and updates

---

## Additional Resources

- **GitHub Repository**: [https://github.com/Mehulbirare/ai-safety-toolkit](https://github.com/Mehulbirare/ai-safety-toolkit)
- **NPM Package**: [https://www.npmjs.com/package/safeguard-ai](https://www.npmjs.com/package/safeguard-ai)
- **OpenAI Moderation API**: [https://platform.openai.com/docs/guides/moderation](https://platform.openai.com/docs/guides/moderation)
- **Report Issues**: [https://github.com/Mehulbirare/ai-safety-toolkit/issues](https://github.com/Mehulbirare/ai-safety-toolkit/issues)

---

## Need Help?

- **Documentation**: Check the `/docs` folder
- **Examples**: See `/examples` folder for working code
- **Issues**: Open an issue on GitHub
- **Questions**: Start a discussion on GitHub Discussions

---

**Happy coding! 🛡️**
