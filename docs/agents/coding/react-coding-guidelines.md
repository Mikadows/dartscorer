---
applyTo: ['*']
description: "Comprehensive best practices for react software engineering for Copilot and LLMs."
---
# React Coding Guidelines

When working on React code, you MUST strictly adhere to the following guidelines:

## Code Style
- Use Prettier for code formatting.
- **MUST** use TSX for all React components.
- Use ES6+ syntax and features (e.g., arrow functions, destructuring, template literals).
- Use consistent indentation (2 spaces).
- Use single quotes for strings, except when using template literals.

## Component Structure
- You **MUST** organize custom components with atomic design principles.
- Organize complexe components into smaller sub-components for better readability and maintainability.
- You **MUST** organize pages and views in a clear folder structure.
- Use functional components with hooks instead of class components.
- Keep components small and focused on a single responsibility.
