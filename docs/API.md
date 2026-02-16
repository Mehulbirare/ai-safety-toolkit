# SafeguardAI API Documentation

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [Core API](#core-api)
- [PII Detection](#pii-detection)
- [Custom Rules](#custom-rules)
- [Examples](#examples)

## Installation

```bash
npm install safeguard-ai
```

## Configuration

### SafeguardAI Constructor

```typescript
new SafeguardAI(config?: SafeguardAIConfig)
```

**Config Options:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiKey` | `string` | `undefined` | OpenAI API key for moderation |
| `providers` | `string[]` | `['openai']` | List of provider names to use |
| `strictness` | `'low' \| 'medium' \| 'high'` | `'medium'` | Moderation strictness level |
| `categories` | `string[]` | `undefined` | Specific categories to check |
| `redactPII` | `boolean` | `false` | Automatically redact PII in results |

**Example:**

```javascript
const moderator = new SafeguardAI({
  apiKey: 'sk-...',
  providers: ['openai'],
  strictness: 'high',
  redactPII: true
});
```

## Core API

### checkText()

Check text for safety violations, PII, and custom rules.

```typescript
async checkText(text: string): Promise<CheckResult>
```

**Returns:**

```typescript
interface CheckResult {
  safe: boolean;                    // Overall safety status
  flagged: boolean;                 // Whether content was flagged
  categories: {                     // Moderation categories
    [key: string]: {
      detected: boolean;
      score: number;                // 0-1 confidence score
      severity?: 'low' | 'medium' | 'high' | 'critical';
    };
  };
  piiDetected: PIIDetected[];       // Detected PII items
  cleanText: string;                // Text with PII redacted
  suggestions: string[];            // Recommendations
}
```

**Example:**

```javascript
const result = await moderator.checkText("Your text here");

if (!result.safe) {
  console.log('Content flagged:', result.categories);
  console.log('Suggestions:', result.suggestions);
}
```

## PII Detection

### Supported PII Types

- **email**: Email addresses
- **phone**: Phone numbers (US and generic formats)
- **ssn**: Social Security Numbers
- **credit_card**: Credit card numbers
- **ip_address**: IP addresses
- **date**: Date patterns

### Redaction Modes

```typescript
type RedactionMode = 'replace' | 'mask' | 'fake';
```

- **replace**: Replace with `[REDACTED_TYPE]`
- **mask**: Partially mask (e.g., `joh***@email.com`)
- **fake**: Replace with fake data

### Direct PII Detection

```javascript
const detector = moderator.detector;

// Detect PII
const piiItems = detector.detect("Email: john@example.com");

// Redact with mode
const result = detector.redact("Email: john@example.com", 'mask');
console.log(result.redactedText); // "Email: joh***@example.com"
```

## Custom Rules

### Add Blocked Words

```javascript
moderator.rules.addBlockedWords(['spam', 'scam', 'phishing']);
```

### Add Custom Patterns

```javascript
// Detect internal IDs
moderator.rules.addPattern(/EMP-\d{6}/g, 'EmployeeID');

// Detect API keys
moderator.rules.addPattern(/API-KEY-[A-Z0-9]{20}/g, 'API_KEY');
```

## Examples

### Basic Chatbot Filter

```javascript
async function processChatMessage(userMessage) {
  const result = await moderator.checkText(userMessage);
  
  if (!result.safe) {
    return {
      error: 'Message violates content policy',
      categories: result.categories
    };
  }
  
  return { message: result.cleanText };
}
```

### Express.js Middleware

```javascript
async function safeguardMiddleware(req, res, next) {
  if (!req.body.content) return next();
  
  const result = await moderator.checkText(req.body.content);
  
  if (!result.safe) {
    return res.status(400).json({
      error: 'Content flagged',
      details: result.categories
    });
  }
  
  req.body.cleanContent = result.cleanText;
  next();
}
```

### Batch Processing

```javascript
async function checkMultipleTexts(texts) {
  const results = await Promise.all(
    texts.map(text => moderator.checkText(text))
  );
  
  return results.filter(r => !r.safe);
}
```

## Error Handling

```javascript
try {
  const result = await moderator.checkText(text);
} catch (error) {
  console.error('Moderation failed:', error);
  // Handle error (retry, fallback, etc.)
}
```

## Best Practices

1. **Cache Results**: Cache moderation results for identical content
2. **Rate Limiting**: Implement rate limiting to avoid API quota issues
3. **Graceful Degradation**: Handle API failures gracefully
4. **User Feedback**: Provide clear feedback when content is flagged
5. **Privacy**: Never log sensitive PII data

## Coming Soon

- Image moderation
- Multi-provider fallback
- Response caching
- Batch processing optimizations
- Additional providers (Perspective API, Azure, AWS)
