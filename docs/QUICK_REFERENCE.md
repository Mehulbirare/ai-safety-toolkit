# 📘 SafeguardAI Quick Reference

A quick reference guide for common SafeguardAI operations.

---

## Installation

```bash
npm install safeguard-ai
```

---

## Basic Setup

```javascript
const SafeguardAI = require('safeguard-ai');
require('dotenv').config();

const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY,
    strictness: 'medium',  // 'low' | 'medium' | 'high'
    redactPII: true
});
```

---

## Core Methods

### Check Text

```javascript
const result = await moderator.checkText("Your text here");

// Result object:
{
    safe: boolean,           // Is content safe?
    flagged: boolean,        // Was content flagged?
    categories: {...},       // Violation categories
    piiDetected: [...],      // PII found
    cleanText: string,       // Redacted text
    suggestions: [...]       // Recommendations
}
```

---

## PII Detection

### Detect PII

```javascript
const piiItems = moderator.detector.detect("Email: john@example.com");
// Returns array of PII objects
```

### Redact PII

```javascript
// Mode: 'replace' | 'mask' | 'fake'
const result = moderator.detector.redact("john@example.com", 'mask');
console.log(result.redactedText); // joh***@example.com
```

---

## Custom Rules

### Add Blocked Words

```javascript
moderator.rules.addBlockedWords(['spam', 'scam', 'phishing']);
```

### Add Custom Patterns

```javascript
// Detect API keys
moderator.rules.addPattern(/API-KEY-\w{20}/g, 'API_KEY');

// Detect employee IDs
moderator.rules.addPattern(/EMP-\d{6}/g, 'EMPLOYEE_ID');

// Detect SSN
moderator.rules.addPattern(/\d{3}-\d{2}-\d{4}/g, 'SSN');
```

---

## Configuration Options

```javascript
new SafeguardAI({
    apiKey: string,              // Required: OpenAI API key
    providers: ['openai'],       // Providers to use
    strictness: 'medium',        // 'low' | 'medium' | 'high'
    categories: string[],        // Specific categories to check
    redactPII: boolean           // Auto-redact PII
})
```

---

## Common Patterns

### Basic Validation

```javascript
async function validateContent(text) {
    const result = await moderator.checkText(text);
    return result.safe;
}
```

### Express Middleware

```javascript
async function moderationMiddleware(req, res, next) {
    const result = await moderator.checkText(req.body.content);
    
    if (!result.safe) {
        return res.status(400).json({ error: 'Content flagged' });
    }
    
    req.body.cleanContent = result.cleanText;
    next();
}
```

### Chatbot Filter

```javascript
async function filterMessage(message) {
    const result = await moderator.checkText(message);
    
    if (!result.safe) {
        return "I cannot process inappropriate content.";
    }
    
    return result.cleanText;
}
```

---

## Error Handling

```javascript
try {
    const result = await moderator.checkText(text);
} catch (error) {
    if (error.response?.status === 429) {
        // Rate limit error
    } else if (error.response?.status === 401) {
        // Invalid API key
    } else {
        // Other error
    }
}
```

---

## Environment Setup

Create `.env` file:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

Load in your app:

```javascript
require('dotenv').config();
```

---

## PII Types Detected

| Type | Example | Redacted As |
|------|---------|-------------|
| Email | john@example.com | [REDACTED_EMAIL] |
| Phone | 555-123-4567 | [REDACTED_PHONE] |
| SSN | 123-45-6789 | [REDACTED_SSN] |
| Credit Card | 1234-5678-9012-3456 | [REDACTED_CREDIT_CARD] |
| IP Address | 192.168.1.1 | [REDACTED_IP] |
| Date | 01/15/2024 | [REDACTED_DATE] |

---

## Strictness Levels

| Level | Description | Use Case |
|-------|-------------|----------|
| **low** | Only highly problematic content | General chat |
| **medium** | Balanced filtering (default) | Most applications |
| **high** | Very strict filtering | Kids apps, strict platforms |

---

## Response Categories

Moderation categories checked:

- `toxicity` - Toxic/offensive content
- `hate` - Hate speech
- `violence` - Violent content
- `sexual` - Sexual content
- `self-harm` - Self-harm content
- `harassment` - Harassment
- `custom` - Custom rules violations

---

## Testing

```javascript
// Quick test script
async function test() {
    console.log('Testing SafeguardAI...');
    
    const tests = [
        { text: "Hello world", expected: true },
        { text: "Email: test@test.com", expected: true }
    ];
    
    for (const test of tests) {
        const result = await moderator.checkText(test.text);
        console.log(`${test.text}: ${result.safe ? '✅' : '❌'}`);
    }
}
```

---

## Performance Tips

### 1. Cache Results

```javascript
const cache = new Map();

async function checkWithCache(text) {
    if (cache.has(text)) return cache.get(text);
    const result = await moderator.checkText(text);
    cache.set(text, result);
    return result;
}
```

### 2. Batch Processing

```javascript
const results = await Promise.all(
    texts.map(text => moderator.checkText(text))
);
```

### 3. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Common Issues

### "API key required"
```javascript
// Make sure .env is loaded
require('dotenv').config();
```

### "Module not found"
```bash
npm install safeguard-ai
```

### Rate limit errors
```javascript
// Add retry logic with exponential backoff
```

### Slow responses
```javascript
// Implement caching or async processing
```

---

## Links

- **Full Documentation**: [GETTING_STARTED.md](./GETTING_STARTED.md)
- **API Reference**: [API.md](./API.md)
- **Examples**: [../examples/](../examples/)
- **GitHub**: [ai-safety-toolkit](https://github.com/Mehulbirare/ai-safety-toolkit)
- **NPM**: [safeguard-ai](https://www.npmjs.com/package/safeguard-ai)

---

## Need Help?

1. Check [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed guide
2. Review [examples/](../examples/) for code samples
3. Open an issue on [GitHub](https://github.com/Mehulbirare/ai-safety-toolkit/issues)

---

**Print this page for quick reference! 📄**
