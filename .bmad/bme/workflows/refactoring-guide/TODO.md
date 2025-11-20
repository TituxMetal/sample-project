# Refactoring Guide Workflow - TODO

## Workflow Purpose

Guide through refactoring existing code - teaching refactoring techniques.

## Workflow Type

Interactive - Highly collaborative, step-by-step

## Key Components Needed

### workflow.yaml

- Config source: bme/config.yaml
- Template: false (interactive workflow)
- Instructions path
- Output: Refactoring plan and session notes

### instructions.md

Steps needed:

1. Examine existing code together
2. Identify "code smells":
   - What feels awkward?
   - What's hard to understand?
   - What's duplicated?
3. Prioritize improvements
4. For each refactoring:
   - Explain the pattern/technique
   - Ensure tests exist first
   - Guide small, safe steps
   - Run tests after each change
   - Review improved code
5. Teach refactoring patterns:
   - Extract method
   - Rename for clarity
   - Remove duplication
   - Simplify conditionals
6. Emphasize: refactor in small steps
7. Celebrate improved code quality

## Notes

- Safety first: tests before refactoring
- Small steps, frequent testing
- Teach WHEN to refactor, not just HOW
- Show before/after comparisons
- Make it a habit, not a project
