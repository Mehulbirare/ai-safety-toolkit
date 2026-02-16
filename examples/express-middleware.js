const express = require('express');
const { SafeguardAI } = require('../dist/index'); // Importing from built valid files

const app = express();
app.use(express.json());

const moderator = new SafeguardAI({
    apiKey: process.env.OPENAI_API_KEY, // Make sure to set this env variable
    providers: ['openai'],
    strictness: 'medium',
    redactPII: true
});

// Middleware function
async function safeguardMiddleware(req, res, next) {
    if (req.method !== 'POST' && req.method !== 'PUT') return next();

    // Check body content if it exists
    if (!req.body || !req.body.content) return next();

    try {
        const result = await moderator.checkText(req.body.content);

        if (!result.safe) {
            return res.status(400).json({
                error: "Content flagged for safety violations",
                details: result.categories,
                suggestions: result.suggestions
            });
        }

        // Optionally attach cleaned text
        req.body.cleanContent = result.cleanText;
        next();
    } catch (err) {
        console.error("Safeguard error:", err);
        next(); // Proceed or fail depending on strictness
    }
}

app.post('/api/comment', safeguardMiddleware, (req, res) => {
    // If we reach here, content is safe
    res.json({ message: "Comment posted successfully", content: req.body.cleanContent });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
