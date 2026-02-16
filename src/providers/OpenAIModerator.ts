import axios from 'axios';
import { ModeratorProvider, ModerationResult } from './BaseProvider';

export class OpenAIModerator implements ModeratorProvider {
    name = 'openai';
    private apiKey: string;
    private endpoint = 'https://api.openai.com/v1/moderations';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async checkText(text: string): Promise<ModerationResult> {
        try {
            const response = await axios.post(
                this.endpoint,
                { input: text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.apiKey}`,
                    },
                }
            );

            const result = response.data.results[0];
            const categories: any = {};

            // Map OpenAI categories to our schema
            for (const [category, flagged] of Object.entries(result.categories)) {
                const score = result.category_scores[category] as number;
                let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

                if (score > 0.9) severity = 'critical';
                else if (score > 0.7) severity = 'high';
                else if (score > 0.4) severity = 'medium';

                categories[category] = {
                    detected: flagged as boolean,
                    score: score,
                    severity
                };
            }

            return {
                flagged: result.flagged,
                categories,
                suggestions: result.flagged ? ["Content flagged by OpenAI moderation."] : []
            };
        } catch (error) {
            console.error("OpenAI Moderation Error:", error);
            throw new Error("Failed to moderate text with OpenAI.");
        }
    }
}
