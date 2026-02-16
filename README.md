# 🛡️ SafeguardAI - AI Content Moderation & Safety Toolkit

[![npm version](https://badge.fury.io/js/safeguard-ai.svg)](https://www.npmjs.com/package/safeguard-ai)
[![Downloads](https://img.shields.io/npm/dm/safeguard-ai.svg)](https://www.npmjs.com/package/safeguard-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The complete AI content moderation solution for developers.** Protect your AI applications from toxic content, detect PII automatically, and ensure compliance with GDPR, COPPA, and HIPAA.

Perfect for: ChatGPT apps, Claude integrations, AI chatbots, user-generated content platforms, and LLM applications.

## ⚡ Quick Start

```bash
npm install safeguard-ai
```

```javascript
const SafeguardAI = require('safeguard-ai');

const moderator = new SafeguardAI();

// Basic usage (requires API key unless using mock)
const result = await moderator.checkText("Check this text for safety");

if (!result.safe) {
  console.log('Content flagged:', result.categories);
}
```

## 📖 Documentation

- **[🌐 View Documentation Website](docs/index.html)** - Interactive documentation with navigation
- **[📘 Getting Started Guide](docs/GETTING_STARTED.md)** - Complete setup and integration guide
- **[⚡ Quick Reference](docs/QUICK_REFERENCE.md)** - Cheat sheet for common operations
- **[📚 API Documentation](docs/API.md)** - Detailed API reference

### Viewing Documentation Locally

The documentation is available as both Markdown files and a styled HTML website:

```bash
# Open the HTML documentation in your browser
open docs/index.html

# Or serve it with a local web server
cd docs && python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 🚀 Features

✅ **Text Moderation** - Detect toxicity, hate speech, violence, sexual content  
✅ **PII Detection** - Find and redact emails, phones, SSN, credit cards  
✅ **Multi-Provider Support** - Currently supports OpenAI, with more coming soon  
✅ **Custom Rules** - Add your own blocked words and patterns  
✅ **GDPR Compliance** - Automatic PII detection for EU compliance  
✅ **TypeScript** - Full TypeScript support included  

## 🌟 The SafeguardAI Advantage

What sets SafeguardAI apart from standard moderation tools:

- **All-in-One Safety Stack**: Why use three different libraries for PII, Moderation, and Custom Rules? SafeguardAI unifies them into a single, high-performance toolkit.
- **Hybrid Processing**: Combines cutting-edge AI (for context-aware moderation) with optimized local patterns (for lightning-fast PII detection).
- **Privacy-First Design**: PII detection and redaction happen locally when possible, ensuring sensitive data never reaches external APIs unless you want it to.
- **Zero-Config Start**: Get up and running in seconds with sensible defaults, then scale to complex enterprise requirements with custom rules.
- **Future-Proof**: Built with a provider-agnostic architecture. Switch between OpenAI, Perspective, or Azure with minimal code changes.

## 💎 How It Helps You

SafeguardAI isn't just a library; it's a protector for your users and your business:

- **🛡️ Protect Your Community**: Automatically filter out toxic, hateful, or violent content in real-time, creating a safer space for your users.
- **🔒 Ensure Legal Compliance**: Effortlessly meet GDPR, HIPAA, and PCI-DSS requirements by catching sensitive personal data before it's stored or leaked.
- **📉 Reduce Operational Costs**: Minimize the need for expensive human moderation teams by automating 99% of regular content checks.
- **🤝 Build User Trust**: Show your users that you take their safety and privacy seriously by implementing transparent content safeguards.
- **🚀 Accelerate AI Development**: Focus on building your core AI features while we handle the complex logic of content safety and redaction.

### Check Text Safety

```javascript
const result = await moderator.checkText("Your text here");
/* Result:
{
  safe: false,
  flagged: true,
  categories: {
    toxicity: { detected: true, score: 0.89, severity: 'high' }
  },
  piiDetected: [
    { type: 'email', value: 'user@email.com', position: [45, 60] }
  ],
  cleanText: "Your text with [REDACTED] instead of PII",
  suggestions: ["Content flagged by OpenAI moderation.", "PII detected in text."]
}
*/
```

### Configure Provider

```javascript
const moderator = new SafeguardAI({
  apiKey: 'your-openai-api-key',
  providers: ['openai'],
  strictness: 'medium'
});
```

### Add Custom Rules

```javascript
moderator.rules.addBlockedWords(['badword1', 'badword2']);
moderator.rules.addPattern(/\d{3}-\d{2}-\d{4}/g, 'SSN');
```

## 📊 Use Cases

- **AI Chatbots** - Filter user messages before processing
- **Content Platforms** - Moderate user-generated content
- **Customer Support** - Detect PII in support tickets
- **Healthcare Apps** - HIPAA compliance for medical data
- **Financial Apps** - PCI-DSS compliance for payment info

## 🔥 Why SafeguardAI?

| Feature | SafeguardAI | Competitors |
|---------|-------------|-------------|
| Multi-provider support | ✅ | ❌ |
| PII Detection | ✅ | Limited |
| Custom rules | ✅ | ❌ |
| TypeScript | ✅ | ✅ |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
