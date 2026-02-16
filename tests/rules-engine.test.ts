import { RulesEngine } from '../src/core/RulesEngine';

describe('RulesEngine', () => {
    let engine: RulesEngine;

    beforeEach(() => {
        engine = new RulesEngine();
    });

    describe('Blocked Words', () => {
        test('should detect blocked words', () => {
            engine.addBlockedWords(['badword', 'offensive']);

            const result = engine.check('This contains a badword');

            expect(result.flagged).toBe(true);
            expect(result.matches.length).toBeGreaterThan(0);
        });

        test('should be case-insensitive', () => {
            engine.addBlockedWords(['badword']);

            const result = engine.check('This contains BADWORD');

            expect(result.flagged).toBe(true);
        });

        test('should not flag safe content', () => {
            engine.addBlockedWords(['badword']);

            const result = engine.check('This is completely safe text');

            expect(result.flagged).toBe(false);
            expect(result.matches.length).toBe(0);
        });
    });

    describe('Custom Patterns', () => {
        test('should detect custom regex patterns', () => {
            // Detect custom ID format
            engine.addPattern(/ID-\d{6}/g, 'CustomID');

            const result = engine.check('User ID-123456 made a request');

            expect(result.flagged).toBe(true);
            expect(result.matches.some(m => m.includes('CustomID'))).toBe(true);
        });

        test('should detect multiple patterns', () => {
            engine.addPattern(/SECRET-\w+/g, 'Secret');
            engine.addPattern(/CLASSIFIED/g, 'Classified');

            const result = engine.check('SECRET-KEY and CLASSIFIED info');

            expect(result.flagged).toBe(true);
            expect(result.matches.length).toBe(2);
        });
    });

    describe('Combined Rules', () => {
        test('should detect both blocked words and patterns', () => {
            engine.addBlockedWords(['spam']);
            engine.addPattern(/\d{10}/g, 'TenDigitNumber');

            const result = engine.check('This is spam with number 1234567890');

            expect(result.flagged).toBe(true);
            expect(result.matches.length).toBe(2);
        });
    });
});
