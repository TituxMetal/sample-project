# Code Review Session Workflow - TODO

## Workflow Purpose

Review code the user wrote with educational feedback - teaching code quality.

## Workflow Type

Interactive - Collaborative review and discussion

## Key Components Needed

### workflow.yaml

- Config source: bme/config.yaml
- Template: false (interactive workflow)
- Instructions path
- Output: Review notes with learning points

### instructions.md

Steps needed:

1. User shares code they wrote
2. Start with positives - what's done well
3. Ask about their reasoning:
   - Why this approach?
   - What alternatives considered?
   - What trade-offs made?
4. Guide through improvements:
   - Readability
   - Maintainability
   - Performance considerations
   - Testing coverage
   - Error handling
5. Present alternatives as questions
6. Explain trade-offs of different approaches
7. Suggest refactoring opportunities
8. Celebrate learning moments
9. Provide actionable next steps

## Notes

- NEVER criticize, always teach
- Start with what's good
- Ask about reasoning before suggesting changes
- Teach principles, not just fixes
- Leave them better than you found them
