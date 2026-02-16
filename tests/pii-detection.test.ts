import { PIIDetector } from '../src/core/PIIDetector';

describe('PIIDetector', () => {
    let detector: PIIDetector;

    beforeEach(() => {
        detector = new PIIDetector();
    });

    describe('Email Detection', () => {
        test('should detect email addresses', () => {
            const text = 'Contact me at john.doe@example.com for more info';
            const result = detector.detect(text);

            expect(result.length).toBe(1);
            expect(result[0].type).toBe('email');
            expect(result[0].value).toBe('john.doe@example.com');
        });

        test('should detect multiple emails', () => {
            const text = 'Email us at support@company.com or sales@company.com';
            const result = detector.detect(text);

            expect(result.length).toBe(2);
        });
    });

    describe('Phone Detection', () => {
        test('should detect US phone numbers', () => {
            const text = 'Call me at 555-123-4567';
            const result = detector.detect(text);

            expect(result.some(r => r.type === 'phone')).toBe(true);
        });
    });

    describe('SSN Detection', () => {
        test('should detect SSN', () => {
            const text = 'My SSN is 123-45-6789';
            const result = detector.detect(text);

            expect(result.some(r => r.type === 'ssn')).toBe(true);
        });

        test('should not detect invalid SSN', () => {
            const text = 'Invalid: 000-00-0000';
            const result = detector.detect(text);

            // The regex should reject 000 prefix
            expect(result.some(r => r.type === 'ssn')).toBe(false);
        });
    });

    describe('Credit Card Detection', () => {
        test('should detect credit card numbers', () => {
            const text = 'Card number: 1234-5678-9012-3456';
            const result = detector.detect(text);

            expect(result.some(r => r.type === 'credit_card')).toBe(true);
        });
    });

    describe('Redaction', () => {
        test('should redact PII with replace mode', () => {
            const text = 'Email me at john@example.com';
            const result = detector.redact(text, 'replace');

            expect(result.detected).toBe(true);
            expect(result.redactedText).toContain('[REDACTED_EMAIL]');
            expect(result.redactedText).not.toContain('john@example.com');
        });

        test('should mask email partially', () => {
            const text = 'Contact: john.doe@example.com';
            const result = detector.redact(text, 'mask');

            expect(result.detected).toBe(true);
            expect(result.redactedText).toContain('joh***@example.com');
        });

        test('should replace with fake data', () => {
            const text = 'Email me at john@example.com';
            const result = detector.redact(text, 'fake');

            expect(result.detected).toBe(true);
            expect(result.redactedText).toContain('jane.doe@example.com');
        });

        test('should handle text with no PII', () => {
            const text = 'This is a safe text with no personal information';
            const result = detector.redact(text, 'replace');

            expect(result.detected).toBe(false);
            expect(result.redactedText).toBe(text);
        });
    });

    describe('Multiple PII Types', () => {
        test('should detect and redact multiple PII types', () => {
            const text = 'Contact John at john@example.com or call 555-123-4567. SSN: 123-45-6789';
            const result = detector.redact(text, 'replace');

            expect(result.detected).toBe(true);
            expect(result.pii.length).toBeGreaterThan(1);
            expect(result.redactedText).not.toContain('john@example.com');
            expect(result.redactedText).not.toContain('555-123-4567');
        });
    });
});
