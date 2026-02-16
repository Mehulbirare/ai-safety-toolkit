import { TextModerator, TextModeratorConfig } from './core/TextModerator';
import { PIIDetector, PIIDetectionResult } from './core/PIIDetector';
import { RulesEngine } from './core/RulesEngine';
import { OpenAIModerator } from './providers/OpenAIModerator';
import { ModerationResult } from './providers/BaseProvider';

export interface SafeguardAIConfig {
    apiKey?: string;
    providers?: string[];
    strictness?: 'low' | 'medium' | 'high';
    categories?: string[];
    redactPII?: boolean;
}

export interface CheckCategory {
    detected: boolean;
    score: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface CheckResult {
    safe: boolean;
    flagged: boolean;
    categories: { [key: string]: CheckCategory };
    piiDetected: any[];
    cleanText: string;
    suggestions: string[];
}

export class SafeguardAI {
    private config: SafeguardAIConfig;
    private textModerator: TextModerator;
    private piiDetector: PIIDetector;
    private rulesEngine: RulesEngine;

    constructor(config: SafeguardAIConfig = {}) {
        this.config = config;

        // Default config if not provided
        const textModConfig: TextModeratorConfig = {
            apiKey: config.apiKey,
            providers: config.providers || ['openai'], // Default to OpenAI
            strictness: config.strictness || 'medium',
            categories: config.categories
        };

        this.textModerator = new TextModerator(textModConfig);
        this.piiDetector = new PIIDetector();
        this.rulesEngine = new RulesEngine();
    }

    async checkText(text: string): Promise<CheckResult> {
        // 1. Text Moderation
        let moderationResult: ModerationResult = { flagged: false, categories: {} };
        try {
            if (this.config.apiKey) {
                moderationResult = await this.textModerator.moderate(text);
            } else {
                // If no API key, we skip moderation or mock it? 
                // For now, let's just log a warning and return empty moderation result to allow PII/Rules to run.
                console.warn("SafeguardAI: No API key provided, skipping AI moderation.");
            }
        } catch (e) {
            console.error("SafeguardAI Error:", e);
        }

        // 2. PII Detection
        const piiResult: PIIDetectionResult = this.piiDetector.redact(text, 'replace');

        // 3. Custom Rules
        const rulesResult = this.rulesEngine.check(text);

        // Combine suggestions
        const suggestions: string[] = [
            ...(moderationResult.suggestions || []),
            ...(rulesResult.matches || [])
        ];
        if (piiResult.detected) {
            suggestions.push("PII detected in text.");
        }

        // Determine overall safety
        const isSafe = !moderationResult.flagged && !rulesResult.flagged;

        return {
            safe: isSafe,
            flagged: !isSafe,
            categories: moderationResult.categories,
            piiDetected: piiResult.pii,
            cleanText: this.config.redactPII ? piiResult.redactedText : text,
            suggestions
        };
    }

    // Helper getters
    get moderator() { return this.textModerator; }
    get detector() { return this.piiDetector; }
    get rules() { return this.rulesEngine; }
}

export { TextModerator, PIIDetector, RulesEngine, OpenAIModerator };
export default SafeguardAI;
