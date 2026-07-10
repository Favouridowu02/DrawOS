# Contributing to DrawOS

First of all, thank you for taking the time to contribute! DrawOS is an open-source community effort, and we welcome improvements of all sizes.

## How Can I Contribute?

### Reporting Bugs
- Search existing issues to verify the problem hasn't been reported yet.
- Open a new issue using our **Bug Report Template** describing steps to reproduce, actual vs expected results, and environment details.

### Suggesting Enhancements
- Create an issue explaining the proposed feature, user benefits, and optional technical designs.

### Pull Requests
1. **Fork** the repository and create your branch from `main`.
2. Follow our **Coding Standards** (strict TypeScript typing, clean Tailwind CSS classes, modular packages).
3. Verify your changes build successfully with `npm run build` and have no lint/type errors.
4. Issue a PR against the `main` branch with our **PR Template** filled out.

## Code Style Guidelines

- **TypeScript**: Always use strict typing. Avoid using `any` or loose typings.
- **Components**: Functional React components with descriptive prop interfaces.
- **Styling**: Stick to the Tailwind utility color system (`primary`, `surface-bright`, `outline`). Never hardcode hex values in JSX style properties.
- **Imports**: Place named imports at the very top of files, using absolute mapped aliases (`@drawos/*`) when referencing core monorepo packages.
