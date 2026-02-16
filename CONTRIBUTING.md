# Contributing to SafeguardAI

Thank you for your interest in contributing to SafeguardAI! We welcome contributions from the community.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/Mehulbirare/ai-safety-toolkit.git
   cd ai-safety-toolkit
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development

### Project Structure

```
safeguard-ai/
├── src/
│   ├── core/           # Core classes (TextModerator, PIIDetector, etc.)
│   ├── providers/      # AI provider integrations
│   ├── utils/          # Utility functions
│   └── constants/      # Constants and patterns
├── tests/              # Unit tests
├── examples/           # Example implementations
└── docs/               # Documentation
```

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

### Testing Your Changes

1. Build the project: `npm run build`
2. Link locally: `npm link`
3. Test in another project: `npm link safeguard-ai`

## Contributing Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Adding New Features

1. **Providers**: Add new AI moderation providers
   - Create a new file in `src/providers/`
   - Implement the `ModeratorProvider` interface
   - Add tests

2. **PII Patterns**: Add new PII detection patterns
   - Update `src/constants/pii-patterns.ts`
   - Add corresponding tests

3. **Features**: New moderation features
   - Update core classes as needed
   - Document in API.md
   - Add examples

### Testing

- Write tests for all new features
- Maintain 80%+ code coverage
- Test edge cases
- Mock external API calls

### Documentation

- Update README.md if needed
- Document new APIs in docs/API.md
- Add examples for new features
- Update CHANGELOG.md

## Pull Request Process

1. **Ensure tests pass**: `npm test`
2. **Update documentation** as needed
3. **Commit with clear messages**:
   ```
   feat: Add Azure Content Safety provider
   fix: Handle empty text in PIIDetector
   docs: Update API documentation
   ```
4. **Push to your fork**
5. **Create a Pull Request** with:
   - Clear description of changes
   - Links to related issues
   - Screenshots if UI-related

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the project

## Questions?

- Open an issue for bugs or feature requests
- Discuss major changes before implementing
- Ask questions in issues or discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
