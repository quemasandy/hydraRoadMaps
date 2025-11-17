# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains TypeScript implementations of all classic Gang of Four (GoF) design patterns. It's part of the Refactoring.Guru project and serves as an educational resource for learning design patterns.

**Context:** This directory (`design-patterns-typescript`) is the active working directory within a larger design patterns learning repository that includes implementations in multiple languages (Go, C++, Java, PHP, Python, Ruby, Rust, Swift, C#).

## Repository Structure

Each design pattern is organized in its own directory under `src/` with the following structure:

```
src/
├── {PatternName}/           # Standard pattern examples (from Refactoring.Guru)
│   ├── Conceptual/          # Shows internal structure with detailed comments
│   │   └── index.ts
│   ├── RealWorld/           # Demonstrates real-world usage
│   │   └── index.ts
│   └── Book/                # Optional: Additional examples (some patterns only)
│       └── index.ts
├── 01_{PatternName}/        # Numbered variants for prioritized study
│   └── ...
└── _andyPOC/                # Proof-of-concept experiments and learning exercises
    ├── fundamentals/
    └── state/
```

**Important conventions:**
- Each example is self-contained in a single `index.ts` file (intentional for educational clarity)
- Comments include multi-language tags (EN/RU) - when editing, modify only the English portions
- Code should be wrapped at 80 characters
- **Duplicate directories:** Some patterns exist in both unnumbered (e.g., `AbstractFactory`) and numbered (e.g., `05_AbstractFactory`) versions. The numbered ones indicate prioritized study order.
- The `_andyPOC` directory contains personal proof-of-concept experiments and is the primary focus for strict linting (`npm run lint`)

## Development Commands

### Running Examples
```bash
# Run any specific example
ts-node src/{PatternName}/{ExampleName}/index.ts

# Example:
ts-node src/01_State/Conceptual/index.ts
ts-node src/AbstractFactory/RealWorld/index.ts

# Run with Node's watch mode for development
npm run watch:ts -- src/{PatternName}/{ExampleName}/index.ts
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

**ESLint (Modern, Recommended)**
```bash
# Lint only _andyPOC directory (scoped, enforces 0 warnings)
npm run lint

# Auto-fix _andyPOC linting issues
npm run lint:fix

# Lint all source files (informational)
npm run lint:all

# Auto-fix all source files
npm run lint:all:fix
```

**Prettier (Code Formatting)**
```bash
# Check formatting
npm run format

# Apply formatting
npm run format:fix
```

**TSLint (Legacy, for compatibility)**
```bash
# Check code style with TSLint
npm run codestyle:check

# Auto-fix code style issues
npm run codestyle:fix
```

**Note:** The default `npm run lint` only lints the `_andyPOC` directory with strict enforcement. Use `lint:all` variants to check the entire codebase.

## Coding Standards

- Follow [Unofficial TypeScript StyleGuide](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md)
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Hard wrap code at 80 characters for website readability (Prettier is configured to 100 chars but manual wrapping at 80 preferred)
- All code for each example should be in a single file
- When editing multi-language comments, maintain the existing format but only modify English (EN) sections
- ESLint + Prettier configured with:
  - Single quotes
  - Semicolons required
  - Trailing commas in multi-line structures
  - Unused variables with `_` prefix are ignored

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

## Available Design Patterns

**Creational Patterns:** AbstractFactory, Builder, FactoryMethod, Prototype, Singleton

**Structural Patterns:** Adapter (03_Adapter), Bridge (06_Bridge), Composite, Decorator, Facade, Flyweight, Proxy

**Behavioral Patterns:** Command, Iterator, Mediator, Memento, Observer, State (01_State), Strategy (02_Strategy), Visitor

Note: Numbers 01-06 indicate patterns prioritized for in-depth study.
