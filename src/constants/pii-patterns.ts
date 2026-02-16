export const PII_PATTERNS = {
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    PHONE_US: /(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g,
    PHONE_GENERIC: /(?:(?:\+|00)([1-9]\d{0,2}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})/g, // Simple generic phone
    SSN: /\b(?!000|666|9\d{2})\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}\b/g,
    CREDIT_CARD: /\b(?:\d{4}[- ]?){3}\d{4}\b/g,
    IP_ADDRESS: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    // Basic date pattern (MM/DD/YYYY or DD/MM/YYYY)
    DATE: /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}\b/g,
};

export const REDACTION_MASKS = {
    EMAIL: '[REDACTED_EMAIL]',
    PHONE: '[REDACTED_PHONE]',
    SSN: '[REDACTED_SSN]',
    CREDIT_CARD: '[REDACTED_CREDIT_CARD]',
    IP: '[REDACTED_IP]',
    DATE: '[REDACTED_DATE]',
    DEFAULT: '[REDACTED]'
};
