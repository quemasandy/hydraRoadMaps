# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains TypeScript implementations of all classic Gang of Four (GoF) design patterns. It's part of the Refactoring.Guru project and serves as an educational resource for learning design patterns.

## Repository Structure

Each design pattern is organized in its own directory under `src/` with the following structure:

```
src/
├── {PatternName}/
│   ├── Conceptual/     # Shows internal structure with detailed comments
│   │   └── index.ts
│   ├── RealWorld/      # Demonstrates real-world usage
│   │   └── index.ts
│   └── Book/           # Optional: Additional examples (some patterns only)
│       └── index.ts
```

**Important conventions:**
- Each example is self-contained in a single `index.ts` file (intentional for educational clarity)
- Comments include multi-language tags (EN/RU) - when editing, modify only the English portions
- Code should be wrapped at 80 characters
- Some directories have numbered prefixes (e.g., `01_State`, `02_Strategy`) indicating study priority
- The `_andyPOC` directory contains proof-of-concept experiments

## Development Commands

### Running Examples
```bash
# Run any specific example
ts-node src/{PatternName}/{ExampleName}/index.ts

# Example:
ts-node src/01_State/Conceptual/index.ts
ts-node src/AbstractFactory/RealWorld/index.ts
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Style
```bash
# Check code style
npm run codestyle:check

# Auto-fix code style issues
npm run codestyle:fix
```

## Coding Standards

- Follow [Unofficial TypeScript StyleGuide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Hard wrap code at 80 characters for website readability
- All code for each example should be in a single file
- When editing multi-language comments, maintain the existing format but only modify English (EN) sections

## Architecture Notes

### Pattern Implementation Philosophy
- **Conceptual examples**: Focus on demonstrating the pattern's structure with detailed explanatory comments
- **RealWorld examples**: Show practical applications with more complex, realistic scenarios (e.g., VendingMachineContext for State pattern)
- **Book examples**: Optional supplementary examples for certain patterns

### TypeScript Configuration
- Target: ES2015
- Module: CommonJS
- Strict mode enabled
- Tests use Jest with ts-jest preset

## File Naming and Location

When adding new examples:
- Location: `src/{PatternName}/{ExampleName}/index.ts`
- Pattern names use PascalCase (e.g., `AbstractFactory`, `FactoryMethod`)
- Example types: `Conceptual`, `RealWorld`, `Book`
