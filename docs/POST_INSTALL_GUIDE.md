# 🏁 Post-Installation Guide: Next Steps

So you've just run `npm install safeguard-ai`. What now? This guide walks you through the first 10 minutes of using the library to ensure your implementation is robust and safe.

---

## 🏎️ The 1-Minute Verification

The quickest way to verify everything is working is to run a small test script.

1. Create a file named `safeguard-test.js`.
2. Paste this code:

```javascript
const SafeguardAI = require('safeguard-ai');

async function verify() {
  console.log('🔍 Initializing SafeguardAI...');
  const moderator = new SafeguardAI();
  
  // Test 1: PII Detection (Doesn't require API key)
  console.log('Test 1: Local PII Detection');
  const result = await moderator.checkText("Email me at test@example.com");
  if (result.piiDetected.length > 0) {
    console.log('✅ PII Detection working: Found', result.piiDetected[0].type);
  }

  console.log('\n🚀 Installation verified! Next: Add your OpenAI API key to test full moderation.');
}

verify().catch(err => console.error('❌ Error:', err.message));
```

3. Run it: `node safeguard-test.js`

---

## 🛠️ Essential Setup Phase

### 1. Secure Your API Key
SafeguardAI uses OpenAI's high-performance moderation models by default. You MUST secure your key.

**Don't do this:**
```javascript
const moderator = new SafeguardAI({ apiKey: 'sk-12345...' }); // ❌ UNSAFE
```

**Do this:**
1. Install `dotenv`: `npm install dotenv`
2. Create a `.env` file: `OPENAI_API_KEY=your_key_here`
3. Load it:
```javascript
require('dotenv').config();
const moderator = new SafeguardAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ SAFE
```

---

## 🏗️ Choose Your Implementation Pattern

Depending on your application type, follow one of these patterns:

### A. The "Gatekeeper" (Input Validation)
Use this if you want to block messages BEFORE they hit your database or LLM.

```javascript
async function handleUserInput(input) {
  const check = await moderator.checkText(input);
  if (!check.safe) {
    throw new Error("Sorry, your message contains restricted content.");
  }
  return processMessage(check.cleanText); // Processes redacted version
}
```

### B. The "Sanitizer" (Output Cleaning)
Use this to ensure your AI's responses don't leak sensitive info or generate toxic content.

```javascript
const rawResponse = await openai.createChatCompletion(...);
const safeResponse = await moderator.checkText(rawResponse.choices[0].message.content);

displayToUser(safeResponse.cleanText); // Shows redacted/cleaned output
```

### C. The "Compliance Officer" (Automated Audit)
Use this to scan batch data for GDPR/HIPAA compliance.

```javascript
const logs = await db.getLogs();
for (const log of logs) {
  const audit = await moderator.checkText(log.content);
  if (audit.piiDetected.length > 0) {
      await db.markForRedaction(log.id, audit.cleanText);
  }
}
```

---

## 🛡️ Best Practices for Production

1.  **Fail-Safe Strategy**: Decide what happens if the API fails.
    - *Restrictive*: Block the user if the safety check fails to run.
    - *Permissive*: Allow the user but log the failure for manual review.
2.  **Strictness Tuning**: Start with `medium`. Switch to `high` if you're building a kid-friendly app or a corporate bot.
3.  **Custom Blocklists**: The AI might miss your specific company's "no-no" words. Use `moderator.rules.addBlockedWords(['competitor_x', 'secret_project_y'])`.

---

## ❓ Troubleshooting Common Errors

| Error | Cause | Solution |
| :--- | :--- | :--- |
| `API key is required` | Environment variable not loaded | Ensure `require('dotenv').config()` is at the top of your main entry file. |
| `Rate limit exceeded` | Too many requests to OpenAI | Implement a queue (like BullMQ) or simple throttling. |
| `PII not detected` | Pattern mismatch | The default detector handles standard formats. Use `addPattern()` for custom IDs. |

---

## 🔗 Deep Dives
- [Full API Reference](./API.md)
- [Configuration Guide](./GETTING_STARTED.md#configuration-options)
- [Example: Express.js Integration](../examples/express-middleware.js)

**Need help?** Open an issue on [GitHub Issues](https://github.com/Mehulbirare/ai-safety-toolkit/issues).
