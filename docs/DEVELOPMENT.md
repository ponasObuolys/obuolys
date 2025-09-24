# Obuolys.ai - Developer Guide

Comprehensive development environment setup, workflows, and best practices for the Obuolys.ai project.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd obuolys

# Set up development environment (automated)
npm run dev-setup

# Start development
npm run dev
```

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Development Workflow](#development-workflow)
4. [Quality Assurance](#quality-assurance)
5. [Testing Strategy](#testing-strategy)
6. [Build & Deployment](#build--deployment)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Git**: Latest version
- **Operating System**: Windows, macOS, or Linux

### Recommended Tools

- **VS Code**: With recommended extensions
- **Git**: For version control
- **Supabase CLI**: For database management (optional)
- **GitHub CLI**: For PR/issue management (optional)

### VS Code Extensions

Install these extensions for optimal development experience:

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.eslint",
    "bradlc.vscode-tailwindcss",
    "ms-playwright.playwright",
    "rangav.vscode-thunder-client"
  ]
}
```

## Initial Setup

### 1. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# Required variables:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
```

### 2. Dependencies Installation

```bash
# Install all dependencies
npm install

# Verify installation
npm run dev:validate
```

### 3. Git Hooks Setup

Pre-commit hooks are automatically configured with Husky:

```bash
# Hooks are installed automatically during npm install
# To reinstall hooks manually:
npx husky init
```

## Development Workflow

### Daily Development

```bash
# Start development server
npm run dev

# Start with browser auto-open
npm run dev:open

# Start with network access
npm run dev:host
```

### Code Quality Workflow

```bash
# Run all quality checks
npm run quality-check

# Fix auto-fixable issues
npm run quality-fix

# Comprehensive quality analysis
npm run quality:comprehensive
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"
# Pre-commit hooks will run automatically

# Push and create PR
git push origin feature/your-feature-name
```

## Quality Assurance

### Code Quality Standards

1. **TypeScript**: Strict mode enabled, no `any` types
2. **ESLint**: Comprehensive rules for React and TypeScript
3. **Prettier**: Consistent code formatting
4. **Pre-commit Hooks**: Automatic quality checks before commits

### Quality Commands

```bash
# Linting
npm run lint              # Check for linting errors
npm run lint:fix          # Fix auto-fixable linting issues

# Formatting
npm run format            # Format all code with Prettier
npm run format:check      # Check if code is properly formatted

# Type Checking
npm run type-check        # TypeScript type validation

# Comprehensive Quality Check
npm run quality:comprehensive  # Detailed quality report
```

### Pre-commit Process

Every commit automatically runs:

1. **ESLint**: Fix auto-fixable issues
2. **Prettier**: Format staged files
3. **Type Check**: Validate TypeScript types
4. **Lint-staged**: Process only staged files for efficiency

## Testing Strategy

### Test Types

1. **Unit Tests**: Component and utility testing
2. **Integration Tests**: Feature workflow testing
3. **E2E Tests**: Full application testing
4. **Visual Tests**: UI regression testing
5. **Accessibility Tests**: A11y compliance testing

### Test Commands

```bash
# Unit Tests
npm run test              # Interactive test runner
npm run test:run          # Run all tests once
npm run test:watch        # Watch mode
npm run test:ui           # Visual test interface
npm run test:coverage     # Generate coverage report

# Integration Tests
npm run test:integration

# End-to-End Tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # E2E with visual interface
npm run test:e2e:debug    # Debug mode

# Visual & Accessibility Tests
npm run test:visual       # Visual regression tests
npm run test:a11y         # Accessibility tests

# Run All Tests
npm run test:all          # Complete test suite
```

### Writing Tests

#### Unit Test Example

```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

#### Integration Test Example

```typescript
// src/test/integration/auth.test.tsx
import { renderWithProviders } from "../utils/test-utils";
import { AuthContext } from "../../context/AuthContext";

describe("Authentication Flow", () => {
  it("handles login process", async () => {
    // Test implementation
  });
});
```

## Build & Deployment

### Build Commands

```bash
# Development build
npm run build:dev

# Production build
npm run build:prod        # With quality checks

# Analyze bundle size
npm run build:analyze
```

### Build Optimization

The build process includes:

1. **Code Splitting**: Automatic route-based splitting
2. **Tree Shaking**: Dead code elimination
3. **Asset Optimization**: Image and CSS optimization
4. **Bundle Analysis**: Size monitoring and recommendations

### Deployment Workflow

```bash
# Pre-deployment checks
npm run quality:comprehensive
npm run test:all
npm run build:prod

# Deploy to Vercel (automatic via GitHub)
git push origin main
```

## Project Structure

```
obuolys/
├── .husky/                 # Git hooks
├── docs/                   # Documentation
├── public/                 # Static assets
├── scripts/                # Development scripts
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── admin/         # Admin dashboard
│   │   ├── home/          # Homepage components
│   │   ├── layout/        # Layout components
│   │   ├── tools/         # AI tools components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React contexts
│   ├── hooks/             # Custom hooks
│   ├── integrations/      # External services
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   ├── providers/         # Context providers
│   └── utils/             # Helper functions
├── supabase/              # Supabase configuration
└── test/                  # Test utilities
```

## Key Technologies

### Frontend Stack

- **React 18**: UI framework with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: High-quality component library

### Backend & Services

- **Supabase**: PostgreSQL database with real-time features
- **Vercel**: Hosting and deployment platform
- **Supabase Auth**: Authentication system
- **Supabase Storage**: File storage system

### Development Tools

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks management
- **Lint-staged**: Efficient pre-commit processing
- **Vitest**: Fast unit testing
- **Playwright**: E2E testing framework

## Configuration Files

### TypeScript Configuration

- `tsconfig.json`: Base TypeScript configuration
- `tsconfig.app.json`: Application-specific settings
- `tsconfig.node.json`: Node.js specific settings

### Build Configuration

- `vite.config.ts`: Vite build configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `postcss.config.cjs`: PostCSS configuration

### Quality Tools

- `eslint.config.js`: ESLint rules and configuration
- `.prettierrc`: Prettier formatting rules
- `.prettierignore`: Files to ignore during formatting

### Testing Configuration

- `vitest.config.ts`: Unit test configuration
- `playwright.config.ts`: E2E test configuration
- `jest.config.js`: Jest configuration (if needed)

## Environment Variables

### Required Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
VITE_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Development vs Production

- **Development**: Use `.env` file for local development
- **Production**: Configure in Vercel dashboard

## Performance Optimization

### Build Performance

1. **Vite**: Fast HMR and optimized builds
2. **SWC**: Fast TypeScript/JavaScript compilation
3. **Code Splitting**: Automatic route-based splitting
4. **Tree Shaking**: Unused code elimination

### Runtime Performance

1. **React 18**: Concurrent features and optimizations
2. **Lazy Loading**: Images and components
3. **Service Worker**: Caching strategies (if implemented)
4. **Bundle Analysis**: Regular size monitoring

### Performance Monitoring

```bash
# Bundle size analysis
npm run bundle-size:check

# Build analysis
npm run build:analyze

# Performance testing
npm run test:performance  # If implemented
```

## Troubleshooting

### Common Issues

#### Dependencies Issues

```bash
# Clear cache and reinstall
npm run clean:all

# Check for conflicts
npm ls

# Audit for vulnerabilities
npm audit
```

#### TypeScript Errors

```bash
# Run type checking
npm run type-check

# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### ESLint/Prettier Conflicts

```bash
# Check for conflicts
npm run lint
npm run format:check

# Fix automatically
npm run quality-fix
```

#### Build Failures

```bash
# Clean build directory
npm run clean

# Validate environment
npm run dev:validate

# Check build with verbose output
npm run build:dev
```

### Development Environment Validation

```bash
# Comprehensive environment check
npm run dev:validate

# Setup development environment
npm run dev-setup

# Quality analysis
npm run quality:comprehensive
```

### Getting Help

1. **Check Documentation**: Review relevant documentation files
2. **Run Validation**: Use `npm run dev:validate` to diagnose issues
3. **Check Logs**: Review console output and error messages
4. **Ask Questions**: Contact team members or create GitHub issues

## Contributing

### Development Process

1. **Create Issue**: Describe the feature/bug
2. **Create Branch**: Use feature/fix naming convention
3. **Develop**: Follow coding standards and test requirements
4. **Quality Check**: Run comprehensive quality checks
5. **Test**: Ensure all tests pass
6. **Submit PR**: Create detailed pull request
7. **Review**: Address feedback and make changes
8. **Merge**: After approval and CI passes

### Code Standards

- **Lithuanian Language**: All UI and content must be in Lithuanian
- **TypeScript**: Strict typing, no `any` types
- **Components**: Use shadcn/ui patterns
- **Testing**: Comprehensive test coverage
- **Documentation**: Update docs for significant changes

### Pull Request Checklist

- [ ] Code follows project standards
- [ ] All tests pass (`npm run test:all`)
- [ ] Quality checks pass (`npm run quality:comprehensive`)
- [ ] Documentation updated (if needed)
- [ ] Lithuanian language compliance
- [ ] No breaking changes (or properly documented)

## Advanced Developer Tools

### 🤖 Development Assistant

Interactive helper for common development tasks:

```bash
# Interactive mode
npm run dev:assistant

# Specific commands
npm run dev:assistant health    # Project health check
npm run dev:assistant setup     # Smart environment setup
npm run dev:assistant commands  # Show all available commands
npm run dev:assistant quickstart # Quick start guide
```

### 📊 Development Insights

Comprehensive analytics and recommendations:

```bash
# Full insights report
npm run dev:insights

# Features:
# • Codebase structure analysis
# • Dependency health assessment
# • Build performance metrics
# • Code quality evaluation
# • Actionable recommendations
```

### 🏥 Health Monitor

Continuous project health tracking:

```bash
# Single health check
npm run health:monitor

# Continuous monitoring (every 30 minutes)
npm run health:continuous

# Alert-only mode (for CI/CD)
npm run health:alerts
```

Health monitoring tracks:

- Environment setup
- Dependency security
- Code quality metrics
- Test suite health
- Build performance
- Git repository status
- Historical trends and alerts

### 🎯 Quick Start Commands

New developer onboarding:

```bash
# Complete setup and analysis
npm run dev:onboard

# Comprehensive health check
npm run dev:doctor

# Reset and restart environment
npm run dev:reset
```

### 📈 Health Data Persistence

The health monitor stores historical data in `.dev-health.json` for:

- Trend analysis over time
- Performance regression detection
- Automated alert generation
- Development insights

Add `.dev-health.json` to your `.gitignore` if you prefer not to commit health data.

## Developer Experience Features

### Smart Pre-commit Hooks

Enhanced pre-commit process with:

- Efficient lint-staged processing
- Sensitive data detection
- Package dependency validation
- Automated quality gates

### Intelligent Quality Checks

Comprehensive quality analysis with:

- TypeScript type checking
- ESLint rule enforcement
- Prettier formatting
- Test suite validation
- Bundle size monitoring
- Dependency security audit
- Code complexity analysis

### Performance Monitoring

Built-in performance tracking:

- Build time analysis
- Bundle size optimization
- Dependency weight analysis
- Performance regression detection

## Additional Resources

- [Project README](../README.md) - Project overview and content management
- [Database Documentation](../DB.md) - Complete database schema
- [Technical Documentation](../TECHNICAL_DOCUMENTATION.md) - Detailed technical overview
- [Testing Strategy](../TESTING_STRATEGY.md) - Comprehensive testing guide
- [CLAUDE.md](../CLAUDE.md) - AI assistant development guidance

## Pro Tips

### Daily Development Workflow

```bash
# Start your day
npm run health:monitor          # Check project health
npm run dev:assistant          # Get personalized recommendations

# During development
npm run dev                    # Development server
npm run test:watch             # Test driven development

# Before committing
npm run quality-fix            # Auto-fix issues
npm run health:alerts          # Check for blockers
git add . && git commit -m "..." # Pre-commit hooks run automatically
```

### Weekly Maintenance

```bash
npm run dev:insights           # Generate insights report
npm run dev:doctor             # Comprehensive health check
npm audit fix                  # Security updates
npm update                     # Dependency updates
```

### Troubleshooting

```bash
npm run dev:assistant health   # Diagnose issues
npm run dev:validate           # Environment validation
npm run clean:all             # Nuclear option - reset everything
```

---

🚀 **The Obuolys.ai development environment is now enhanced with intelligent tooling for maximum productivity!**

For questions or support, please:

1. Run `npm run dev:assistant` for interactive help
2. Check the documentation
3. Create a GitHub issue
4. Contact the development team
