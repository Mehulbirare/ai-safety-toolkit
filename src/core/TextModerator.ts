import { ModeratorProvider, ModerationResult } from '../providers/BaseProvider';
import { OpenAIModerator } from '../providers/OpenAIModerator';

export interface TextModeratorConfig {
    apiKey?: string;
    providers?: string[];
    strictness?: 'low' | 'medium' | 'high';
    categories?: string[];
}

export class TextModerator {
    private providers: ModeratorProvider[] = [];
    private config: TextModeratorConfig;

    constructor(config: TextModeratorConfig) {
        this.config = config;

        // Setup providers
        // Currently only OpenAI supported
        if (config.apiKey) {
            this.providers.push(new OpenAIModerator(config.apiKey));
        } else {
            // Handle no API key (mock or fail)
            // User requested "uses our free tier" but we are just building the package.
            // We can throw or implement a mock provider.
        }
    }

    async moderate(text: string): Promise<ModerationResult> {
        if (this.providers.length === 0) {
            throw new Error("No moderation provider configured. Please provide an API key.");
        }

        // For now, just use the first provider (simpler than fallback logic for MVP)
        const provider = this.providers[0];
        return provider.checkText(text);
    }
}
