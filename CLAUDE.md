# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive learning repository containing structured roadmaps and exercises for various technical topics including design patterns, AI/ML, cybersecurity, serverless architecture, and software engineering fundamentals. All implementations are in TypeScript.

## Repository Structure

```
src/
├── designPatterns/          # Classic GoF design patterns (Refactoring.Guru based)
│   ├── 01_State/           # Numbered patterns indicate priority study order
│   ├── 02_Strategy/
│   ├── AbstractFactory/    # Standard pattern examples
│   │   ├── Conceptual/     # Shows pattern structure with detailed comments
│   │   ├── RealWorld/      # Practical usage examples
│   │   └── Book/           # Optional supplementary examples
│   └── ...
├── fundamentals/            # OOP fundamentals and SOLID principles
│   ├── fundamentals/       # Core exercises (abstraction, encapsulation, etc.)
│   │   └── exercises/
│   └── state/              # State pattern experiments
├── roadmaps/               # Comprehensive learning paths
│   ├── OppDesignPatterns/  # 63 design patterns & concepts (01-tipos to 63-memoization)
│   ├── AIML/               # AI/ML exercises from fundamentals to advanced
│   ├── Cybersecurity/      # Security fundamentals to production DevSecOps
│   ├── ServerlessSecurity/ # AWS serverless security patterns
│   ├── AwsServerless/      # Serverless architecture
│   ├── AILLMIntegration/   # LLM integration patterns
│   ├── StakeholderManagement/ # Soft skills and communication
│   ├── InfrastructureAsCode/
│   ├── SQLDataModeling/
│   └── ...
```

**Key Characteristics:**
- Each roadmap contains progressive exercises from beginner to advanced
- Most exercises are in `index.ts` files within numbered directories
- Design patterns may have `Conceptual`, `RealWorld`, and `Book` variants
- Roadmaps include comprehensive README.md files with learning paths

## Development Commands

### Running Examples
```bash
# Run any TypeScript example
ts-node src/{path}/index.ts

# Examples:
ts-node src/designPatterns/01_State/Conceptual/index.ts
ts-node src/roadmaps/OppDesignPatterns/38-state/index.ts
ts-node src/fundamentals/fundamentals/exercises/01-abstraction/abstraction.ts

# Run with watch mode for development
npm run watch:ts -- src/{path}/index.ts
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Tests use Jest with ts-jest
# Test files: *.test.ts or *.spec.ts
```

### Linting and Formatting

**ESLint (Modern, Recommended)**
```bash
# Lint specific directories with strict enforcement (0 warnings)
npm run lint                 # Lints only src/_andyPOC (if it exists)

# Lint entire codebase
npm run lint:all             # Informational, may show warnings

# Auto-fix issues
npm run lint:fix             # Fix _andyPOC only
npm run lint:all:fix         # Fix all source files
```

**Prettier (Code Formatting)**
```bash
# Check formatting
npm run format

# Apply formatting
npm run format:fix
```

**TSLint (Legacy)**
```bash
# Legacy linter kept for compatibility
npm run codestyle:check
npm run codestyle:fix
```

## Coding Standards

- Follow [Unofficial TypeScript StyleGuide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Hard wrap code at 80 characters (Prettier configured to 100 but 80 preferred for readability)
- ESLint configuration:
  - Single quotes
  - Semicolons required
  - Trailing commas in multi-line structures
  - Unused variables with `_` prefix are ignored
  - `console` statements allowed (educational repository)
  - Import order: alphabetical with newlines between groups

## Architecture & Organization

### Design Patterns (`src/designPatterns/`)
- **Conceptual examples**: Pattern structure with detailed explanatory comments
- **RealWorld examples**: Practical applications with realistic scenarios
- **Book examples**: Optional supplementary examples
- **Numbered patterns** (01-06): Indicate priority for in-depth study
- Each example is self-contained in a single `index.ts` file for educational clarity
- Comments may include multi-language tags (EN/RU) - modify only English portions

### Roadmaps (`src/roadmaps/`)
- **OppDesignPatterns**: 63 exercises covering TypeScript basics through advanced patterns
  - 01-09: TypeScript fundamentals
  - 10-14: SOLID principles
  - 15-19: OOP fundamentals
  - 20-42: Classic GoF patterns
  - 43-51: Architectural patterns
  - 52-63: Advanced TypeScript and performance patterns

- **AIML**: Progressive AI/ML learning from data preprocessing to transformers
  - Includes test files (*.test.ts) for algorithm validation

- **Cybersecurity**: 6 modules from fundamentals to production DevSecOps

- **Other roadmaps**: Specialized topics with progressive difficulty

Each roadmap contains:
- Comprehensive README.md with learning objectives
- Numbered exercises following a curriculum
- Often includes PROGRESS.md for tracking completion

### Fundamentals (`src/fundamentals/`)
- Core OOP concepts with hands-on exercises
- 15 exercises covering abstraction through immutability
- Focuses on SOLID principles and design fundamentals

## TypeScript Configuration

- **Target**: ES2015
- **Module**: CommonJS
- **Module Resolution**: Node
- **Strict mode**: Enabled
- **ESModule Interop**: Enabled
- Test environment: Node with Jest + ts-jest preset

## File Naming Conventions

- Examples: `src/{category}/{topic}/index.ts`
- Tests: `*.test.ts` or `*.spec.ts`
- Pattern directories use PascalCase: `AbstractFactory`, `FactoryMethod`
- Roadmap directories use numbered prefixes: `01-fundamentos`, `38-state`
- Spanish naming in some roadmaps (AIML, Cybersecurity, StakeholderManagement)

## Working with this Repository

When adding new content:
1. Follow the existing structure of the roadmap/category
2. Include README.md for new roadmaps
3. Prefer single-file examples for educational clarity
4. Add tests for algorithms and complex logic
5. Run linting before committing: `npm run lint:all:fix && npm run format:fix`
6. Hard wrap code at 80 characters for readability

When exploring:
- Check README.md files in roadmap directories for learning paths
- Look for PROGRESS.md to understand completion status
- Numbered directories indicate suggested learning order
- Each roadmap is self-contained and can be studied independently
