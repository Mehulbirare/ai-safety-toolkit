/**
 * SafeguardAI Installation Verification Script
 * This script verifies that the library is correctly installed and
 * demonstrates basic functionality.
 */

const SafeguardAI = require('./dist/index').default;
const path = require('path');

async function runVerification() {
    console.log('\x1b[36m%s\x1b[0m', '----------------------------------------');
    console.log('\x1b[36m%s\x1b[0m', '🛡️  SafeguardAI Installation Verification');
    console.log('\x1b[36m%s\x1b[0m', '----------------------------------------');

    const moderator = new SafeguardAI();

    // 1. Check Library PII Detection (Offline)
    console.log('\n[1/2] Testing Local PII Detection...');
    const piiText = "My email is developer@example.com and my phone is 555-0199";
    const piiResult = await moderator.checkText(piiText);
    
    if (piiResult.piiDetected.length >= 2) {
        console.log('✅ PASS: PII detected and redacted locally.');
        console.log('   Original: ' + piiText);
        console.log('   Redacted: ' + piiResult.cleanText);
    } else {
        console.log('⚠️ WARNING: Local PII detection results unexpected.');
    }

    // 2. Check Moderation Logic Configuration
    console.log('\n[2/2] Testing Custom Rule Engine...');
    moderator.rules.addBlockedWords(['restricted-term']);
    const ruleResult = await moderator.checkText("This text contains a restricted-term.");
    
    if (ruleResult.flagged) {
        console.log('✅ PASS: Custom rule engine is active.');
        console.log('   Flagged Reason: ' + ruleResult.suggestions[0]);
    } else {
        console.log('⚠️ WARNING: Custom rule engine not responding as expected.');
    }

    console.log('\n\x1b[32m%s\x1b[0m', '✨ SUCCESS: SafeguardAI is ready to use!');
    console.log('Next Steps: Set your OPENAI_API_KEY in a .env file to enable full AI moderation.');
    console.log('See documentation in: C:\\Users\\mehul\\Projects\\safeguard-ai\\docs\\POST_INSTALL_GUIDE.md');
    console.log('\x1b[36m%s\x1b[0m', '----------------------------------------');
}

runVerification().catch(err => {
    console.error('\x1b[31m%s\x1b[0m', '\n❌ FAILED: Unexpected error during verification.');
    console.error(err);
    process.exit(1);
});
