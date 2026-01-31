# Development Workflow Instructions

This document outlines the development workflow for the Dart Scorer project, emphasizing Test-Driven Development (TDD) and best practices.

## Overview

Follow TDD: Red-Green-Refactor cycle. Plan features, write tests, implement, refactor.

## Workflow Steps

1. **Planning**: Break features into issues; formalize requirements.
2. **Branching**: Create feature branch from `main`.
3. **TDD Cycle**:
   - **Red**: Write failing test (🔴).
   - **Green**: Implement code to pass test (🟢).
   - **Refactor**: Improve code without changing behavior (⚪).
4. **Commit**: Use conventional commits.
5. **PR**: Create pull request; get review.
6. **Merge**: Squash to `main`.

## TDD Details

- **Red Phase**: Write test first; ensure it fails.
- **Green Phase**: Minimal code to pass; no over-engineering.
- **Refactor Phase**: Clean code; run tests to ensure no regression.

## Tools

- **IDE**: VS Code with TDD plugins.
- **Version Control**: Git with conventional commits.
- **CI/CD**: Automated builds, tests on PR.

## Best Practices

- Small, incremental changes.
- Pair programming for complex features.
- Daily stand-ups for progress.
- Document decisions in issues.

## Guidelines Integration

- Follow coding, testing, Git guidelines.
- Update docs as needed.

This workflow ensures quality and collaboration.