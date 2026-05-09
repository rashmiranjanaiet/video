# Contributing Guide

## Welcome to NovaLink AI! 👋

We're excited that you're interested in contributing to NovaLink AI. This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Avoid discriminatory language
- Focus on ideas, not individuals
- Report violations to conduct@novalink.ai

## Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/yourusername/novalink-ai.git
cd novalink-ai
```

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Setup Development Environment
```bash
npm install
npm run dev
```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev
# Navigate to http://localhost:3000
```

### Backend Development
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

## Coding Standards

### TypeScript
- Use strict mode
- Add type annotations
- Avoid `any` type
- Use interfaces for objects

### React/Next.js
- Use functional components
- Use hooks for state management
- Memoize expensive operations
- Write descriptive component names

### Express.js
- Use proper error handling
- Validate all inputs
- Use middleware appropriately
- Follow REST conventions

### CSS
- Use Tailwind classes
- Follow mobile-first approach
- Use consistent spacing
- Test on multiple screen sizes

## Testing

### Write Tests For:
- API endpoints
- Authentication flow
- Matching algorithm
- Chat functionality

### Run Tests
```bash
npm run test
npm run test:coverage
```

## Git Workflow

### Commit Messages
```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Example:
```
feat(video): add screen sharing capability

Implemented WebRTC screen sharing with pause/resume functionality.

Closes #123
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git pull origin main
   ```

2. **Run tests and linting**
   ```bash
   npm run test
   npm run lint
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Clear title and description
   - Link related issues
   - Include screenshots if UI changes
   - Describe testing done

5. **Code Review**
   - Address feedback promptly
   - Mark conversations as resolved
   - Re-request review after updates

## Areas for Contribution

### High Priority
- [ ] Improve test coverage
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Security enhancements
- [ ] Documentation improvements

### Medium Priority
- [ ] Bug fixes
- [ ] UX improvements
- [ ] New features (coordinated)
- [ ] Performance monitoring
- [ ] Analytics

### Low Priority
- [ ] UI/UX refinements
- [ ] Code cleanup
- [ ] Example improvements
- [ ] Documentation typos

## Setup Instructions for Specific Issues

### Working on Video Quality
- Check [Video Streaming Guide](./docs/VIDEO.md)
- Test on multiple connections
- Use Chrome DevTools WebRTC internals

### Working on AI Features
- Obtain necessary API keys
- Test with various inputs
- Document AI model choices

### Working on Database
- Use test database
- Create migration if schema changes
- Document migration steps

### Working on UI Components
- Follow design system
- Test on mobile devices
- Ensure accessibility (WCAG 2.1)

## Performance Guidelines

- Frontend bundle size < 500KB
- API response time < 500ms
- WebRTC connection < 2 seconds
- Page load time < 3 seconds

## Security Considerations

Before submitting PRs:
- No hardcoded secrets
- Validate all inputs
- Check for SQL injection risks
- Review authentication flows
- Test with OWASP guidelines

## Documentation

### When to Update Docs
- New features
- API changes
- Configuration changes
- New deployment methods

### How to Update Docs
1. Keep docs in `/docs/` folder
2. Update README if applicable
3. Add code examples
4. Include diagrams if helpful
5. Update table of contents

## Review Process

### What We Look For
- ✅ Code quality
- ✅ Testing coverage
- ✅ Documentation
- ✅ Performance impact
- ✅ Security implications
- ✅ Follows conventions

### Feedback Types
- 🎉 Praise for good work
- 💡 Suggestions for improvement
- ❓ Questions for clarification
- 🐛 Bug identification
- 📚 Documentation references

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

**Dependencies Not Installing**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables**
- Copy `.env.example` to `.env`
- Fill in actual values
- Don't commit `.env`

## Getting Help

- 📚 [Documentation](./docs/)
- 💬 [GitHub Discussions](https://github.com/yourusername/novalink-ai/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/novalink-ai/issues)
- 📧 contact@novalink.ai

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- GitHub contributors page
- Monthly newsletter

## License

By contributing, you agree your code will be licensed under MIT License.

Thank you for contributing to NovaLink AI! 🚀
