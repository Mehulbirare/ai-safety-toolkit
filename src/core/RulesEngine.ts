export class RulesEngine {
    private blockedWords: Set<string>;
    private patterns: Map<string, RegExp>;

    constructor() {
        this.blockedWords = new Set();
        this.patterns = new Map();
    }

    addBlockedWords(words: string[]) {
        words.forEach(word => this.blockedWords.add(word.toLowerCase()));
    }

    addPattern(pattern: RegExp, name: string) {
        this.patterns.set(name, pattern);
    }

    check(text: string): { flagged: boolean; matches: string[] } {
        const findings: string[] = [];

        // Check blocked words
        const lowerText = text.toLowerCase();
        this.blockedWords.forEach(word => {
            if (lowerText.includes(word)) { // Simple inclusion check, could make regex for word boundary
                findings.push(`Blocked word: ${word}`);
            }
        });

        // Check patterns
        this.patterns.forEach((regex, name) => {
            if (regex.test(text)) {
                findings.push(`Pattern match: ${name}`);
            }
        });

        return {
            flagged: findings.length > 0,
            matches: findings
        };
    }
}
