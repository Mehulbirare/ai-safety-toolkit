const SafeguardAI = require('../dist/index').default;
require('dotenv').config();

async function main() {
    // Initialize SafeguardAI
    const moderator = new SafeguardAI({
        apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key
        providers: ['openai'],
        strictness: 'medium',
        redactPII: true
    });

    // Example 1: Basic text moderation
    console.log('=== Example 1: Basic Moderation ===');
    const text1 = 'This is a friendly message!';
    const result1 = await moderator.checkText(text1);
    console.log('Safe:', result1.safe);
    console.log('Flagged:', result1.flagged);
    console.log('Categories:', result1.categories);
    console.log();

    // Example 2: PII Detection
    console.log('=== Example 2: PII Detection ===');
    const text2 = 'Contact me at john.doe@example.com or call 555-123-4567';
    const result2 = await moderator.checkText(text2);
    console.log('PII Detected:', result2.piiDetected);
    console.log('Clean Text:', result2.cleanText);
    console.log();

    // Example 3: Custom Blocked Words
    console.log('=== Example 3: Custom Rules ===');
    moderator.rules.addBlockedWords(['forbidden', 'blocked']);
    const text3 = 'This contains a forbidden word';
    const result3 = await moderator.checkText(text3);
    console.log('Flagged:', result3.flagged);
    console.log('Suggestions:', result3.suggestions);
    console.log();

    // Example 4: Custom Patterns
    console.log('=== Example 4: Custom Patterns ===');
    moderator.rules.addPattern(/API-KEY-\w+/g, 'API_KEY');
    const text4 = 'Using API-KEY-abc123 for authentication';
    const result4 = await moderator.checkText(text4);
    console.log('Flagged:', result4.flagged);
    console.log('Matches:', result4.suggestions);
    console.log();

    // Example 5: Multiple PII types
    console.log('=== Example 5: Multiple PII Types ===');
    const text5 = 'Email: test@email.com, SSN: 123-45-6789, Card: 1234-5678-9012-3456';
    const result5 = await moderator.checkText(text5);
    console.log('PII Found:', result5.piiDetected.length, 'items');
    console.log('Redacted Text:', result5.cleanText);
}

main().catch(console.error);
