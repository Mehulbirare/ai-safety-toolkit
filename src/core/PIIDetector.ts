import { PII_PATTERNS, REDACTION_MASKS } from '../constants/pii-patterns';

export type PIIType = 'email' | 'phone' | 'ssn' | 'credit_card' | 'ip_address' | 'date';

export type RedactionMode = 'replace' | 'mask' | 'fake';

export interface PIIDetected {
    type: PIIType;
    value: string;
    position: [number, number];
}

export interface PIIDetectionResult {
    detected: boolean;
    pii: PIIDetected[];
    redactedText: string;
}

export class PIIDetector {
    private patterns: Record<PIIType, RegExp>;

    constructor() {
        this.patterns = {
            email: PII_PATTERNS.EMAIL,
            phone: PII_PATTERNS.PHONE_GENERIC,
            ssn: PII_PATTERNS.SSN,
            credit_card: PII_PATTERNS.CREDIT_CARD,
            ip_address: PII_PATTERNS.IP_ADDRESS,
            date: PII_PATTERNS.DATE
        };
    }

    /**
     * Detects PII in the given text and returns the positions and types.
     */
    public detect(text: string): PIIDetected[] {
        const results: PIIDetected[] = [];

        // Check each pattern
        for (const [type, pattern] of Object.entries(this.patterns)) {
            // Reset lastIndex for global regex
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(text)) !== null) {
                results.push({
                    type: type as PIIType,
                    value: match[0],
                    position: [match.index, match.index + match[0].length]
                });
            }
        }

        // Sort by position
        return results.sort((a, b) => a.position[0] - b.position[0]);
    }

    /**
     * Detects and redacts PII based on the specified mode.
     */
    public redact(text: string, mode: RedactionMode = 'replace'): PIIDetectionResult {
        const detected = this.detect(text);
        if (detected.length === 0) {
            return { detected: false, pii: [], redactedText: text };
        }

        let redactedText = text;
        // Process in reverse so indices don't shift for simple replacements?
        // Actually, replacement changes string length, so relying on indices from original string only works if we rebuild the string carefully.
        // Better strategy: sort by start index, then build the new string piece by piece.

        // Handle overlapping matches? For now assume no overlaps for simplicity or take the first one.
        // The regexes might overlap (e.g. phone number inside a larger string).
        // Let's filter overlaps. If a match is fully contained in another, discard the smaller one.

        const validMatches = this.filterOverlaps(detected);

        let lastIndex = 0;
        let newString = '';

        for (const match of validMatches) {
            // Append text before match
            newString += text.substring(lastIndex, match.position[0]);

            // Append replacement
            newString += this.getReplacement(match, mode);

            lastIndex = match.position[1];
        }
        newString += text.substring(lastIndex);

        return {
            detected: true,
            pii: validMatches,
            redactedText: newString
        };
    }

    private filterOverlaps(matches: PIIDetected[]): PIIDetected[] {
        // Simple overlap filtering: if a match starts before the previous one ends, skip it if it's smaller or something?
        // Or just take the longest match if they overlap.
        // Since they are sorted by start position:
        const result: PIIDetected[] = [];
        let lastEnd = -1;

        for (const m of matches) {
            if (m.position[0] >= lastEnd) {
                result.push(m);
                lastEnd = m.position[1];
            } else {
                // Overlap. If this match ends later than the previous one, maybe it's "better"?
                // But we already added the previous one. Let's just skip for now to avoid complexity.
                // A more robust solution would be needed for production.
            }
        }
        return result;
    }

    private getReplacement(match: PIIDetected, mode: RedactionMode): string {
        switch (mode) {
            case 'mask':
                return this.maskString(match.value, match.type);
            case 'fake':
                return this.generateFakeData(match.type);
            case 'replace':
            default:
                return this.getPlaceholder(match.type);
        }
    }

    private getPlaceholder(type: PIIType): string {
        switch (type) {
            case 'email': return REDACTION_MASKS.EMAIL;
            case 'phone': return REDACTION_MASKS.PHONE;
            case 'ssn': return REDACTION_MASKS.SSN;
            case 'credit_card': return REDACTION_MASKS.CREDIT_CARD;
            case 'ip_address': return REDACTION_MASKS.IP;
            case 'date': return REDACTION_MASKS.DATE;
            default: return REDACTION_MASKS.DEFAULT;
        }
    }

    private maskString(value: string, type: PIIType): string {
        // E.g. j***@gmail.com
        if (type === 'email') {
            const parts = value.split('@');
            if (parts.length === 2) {
                const name = parts[0];
                const domain = parts[1];
                const visible = name.substring(0, Math.min(3, name.length));
                return `${visible}***@${domain}`;
            }
        }
        // Default: show first 2 chars, mask the rest, maybe show last 2
        if (value.length <= 4) return '*'.repeat(value.length);
        return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
    }

    private generateFakeData(type: PIIType): string {
        // Simple placeholders for now
        switch (type) {
            case 'email': return 'jane.doe@example.com';
            case 'phone': return '555-0123';
            case 'ssn': return '000-00-0000';
            case 'credit_card': return '0000-0000-0000-0000';
            case 'ip_address': return '127.0.0.1';
            case 'date': return '01/01/2000';
            default: return '[FAKE_DATA]';
        }
    }
}
