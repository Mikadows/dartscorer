# Git Guidelines

This document outlines the Git usage directives for the Belair's Buvette project. These guidelines ensure a consistent, readable, and automated commit history that aligns with Semantic Versioning and facilitates tooling for changelogs, releases, and CI/CD processes.

## Commit Conventions

All commits **MUST** follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This is a lightweight convention on top of commit messages that provides an easy set of rules for creating an explicit commit history.

### Commit Message content

You **MUST** analyse the changes made in the codebase and determine the appropriate type of commit and commit message.
All commits **MUST** relate to the changes made in the codebase.

Commit messages **MUST** accurately describe the change being committed. They should summarize what changed, why it changed, and reference related issue numbers or files when applicable. Avoid generic messages like "misc changes" — prefer messages that make the intent and scope of the change clear to reviewers and tools.

### Commit Message Structure

The commit message **MUST** be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Elements:
1. **type**: A noun describing the type of change. Common types include:
   - `feat`: Introduces a new feature (correlates with MINOR in SemVer).
   - `fix`: Patches a bug (correlates with PATCH in SemVer).
   - `docs`: Documentation changes.
   - `style`: Code style changes (formatting, missing semicolons, etc.).
   - `refactor`: Code changes that neither fix a bug nor add a feature.
   - `perf`: Performance improvements.
   - `test`: Adding or correcting tests.
   - `chore`: Changes to the build process, auxiliary tools, libraries, etc.
   - `ci`: Changes to CI configuration files and scripts.
   - `build`: Changes that affect the build system or external dependencies.
   - Other types are allowed if they provide value.

2. **scope** (optional): A noun describing a section of the codebase, enclosed in parentheses (e.g., `feat(api):`).

3. **!** (optional): Indicates a breaking change if appended after the type/scope.

4. **description**: A short summary of the code changes, starting with a lowercase letter.

5. **body** (optional): A longer description providing additional context, separated by a blank line.

6. **footer(s)** (optional): One or more footers for metadata like breaking changes, references, etc., separated by a blank line.

### Breaking Changes

Breaking changes **MUST** be indicated by:
- Appending `!` after the type/scope (e.g., `feat(api)!:`).
- Or including a `BREAKING CHANGE:` footer.

### Examples

- Feature commit:
  ```
  feat: add user authentication
  ```

- Bug fix with scope:
  ```
  fix(auth): resolve login timeout issue
  ```

- Breaking change:
  ```
  feat!: remove deprecated API endpoints

  BREAKING CHANGE: The /v1/auth endpoint is no longer available.
  ```

- Commit with body and footer:
  ```
  fix: prevent racing of requests

  Introduce a request id and a reference to latest request. Dismiss
  incoming responses other than from latest request.

  Reviewed-by: John Doe
  Refs: #123
  ```

### Rules
- Commit messages **MUST NOT** be treated as case-sensitive except for `BREAKING CHANGE`, which **MUST** be uppercase.
- Types other than `feat` and `fix` are allowed but have no implicit SemVer effect unless they include a breaking change.
- Use `revert:` for revert commits, referencing the original commit SHAs in the footer.

### Explicit Commit Approval

- You **MUST NEVER** run `git commit`, `git push`, or otherwise create commits in the repository unless the human user explicitly instructs you to do so.
- When making changes, prepare diffs or patches and present them to the user for review; do not stage or commit automatically.
- If asked to produce a commit message, provide a suggested Conventional Commit message, but wait for the user's explicit approval before executing the commit.
- For multi-step workflows (tests, formatting, validation), show the results and ask for permission before committing any generated changes.

## Branching Strategy

- Use feature branches for new work: `feature/<feature-name>`.
- Use bugfix branches for fixes: `bugfix/<issue-number>`.
- Main branch: `main` (or `master` if legacy).
- Avoid committing directly to `main`; use pull requests for merges.

## Pull Requests

- Pull requests **MUST** have a descriptive title following the commit convention.
- Include a summary of changes and link to related issues.
- Ensure CI passes before merging.
- Squash commits into a single conventional commit upon merge.

## General Practices

- Keep commits atomic: Each commit should address one logical change.
- Write clear, concise messages in English.
- Use `git rebase` for cleaning up history before pushing.
- Avoid force-pushing to shared branches.
- Tag releases using SemVer (e.g., `v1.0.0`).

## Tooling

- Use tools like [commitlint](https://commitlint.js.org/) to enforce conventional commits.
- Integrate with CI for automated changelog generation and versioning.

For more details, refer to the full [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).