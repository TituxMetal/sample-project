# Create Learning Plan Workflow - TODO

## Workflow Purpose

Generate personalized learning roadmap - structured learning path.

## Workflow Type

Document - Creates learning plan document

## Key Components Needed

### workflow.yaml

- Config source: bme/config.yaml
- Template: path to template.md
- Instructions path
- Output: learning-plan-{date}.md to learning_output_path

### instructions.md

Steps needed:

1. Review current skill level (from memories)
2. Understand learning goals
3. Identify skill gaps
4. Create phased learning path:
   - Phase 1: Foundation (must-know)
   - Phase 2: Intermediate (should-know)
   - Phase 3: Advanced (nice-to-know)
5. For each phase:
   - Core concepts to learn
   - Hands-on projects to practice
   - Resources (books, courses, docs)
   - Success criteria
6. Estimate timeframes (realistic)
7. Build in review milestones
8. Add practice exercises
9. Make it actionable and motivating

### template.md

Document structure:

- Current State Assessment
- Learning Goals
- Phase 1: Foundation Skills
- Phase 2: Intermediate Skills
- Phase 3: Advanced Skills
- Practice Projects
- Resources by Topic
- Progress Checkpoints
- Next Steps

## Notes

- Make it personalized, not generic
- Focus on hands-on practice
- Include milestone celebrations
- Keep it actionable
- Review and update regularly
