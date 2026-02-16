export interface ModerationResult {
    flagged: boolean;
    categories: {
        [category: string]: {
            detected: boolean;
            score: number;
            severity?: 'low' | 'medium' | 'high' | 'critical';
        };
    };
    suggestions?: string[];
}

export interface ModeratorProvider {
    checkText(text: string): Promise<ModerationResult>;
    checkImage?(imagePath: string): Promise<ModerationResult>;
    name: string;
}
