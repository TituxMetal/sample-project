# BME Development Roadmap

## Current Status

### ✅ Completed

- [x] Module structure created
- [x] Morgan agent (Expert) created with sidecar
- [x] Module configuration defined
- [x] Installation infrastructure ready
- [x] Documentation (README.md)
- [x] Workflow placeholder folders (8 workflows)

### 🚧 In Progress

- [ ] Core workflows implementation

## Phase 1: Core Components (Priority: HIGH)

### Essential Workflows

**1. guided-story Workflow** ⭐ PRIMARY

- **Purpose**: Step-by-step implementation coaching
- **Type**: Interactive, highly collaborative
- **Priority**: Must-have for MVP
- **Complexity**: Complex (10-15 steps)
- **Dependencies**: None
- **Notes**: This is the core coaching experience - replaces dev-story

**2. assess-skill-level Workflow**

- **Purpose**: Determine coaching depth
- **Type**: Action, interactive assessment
- **Priority**: High (enables adaptive coaching)
- **Complexity**: Medium (5-8 steps)
- **Dependencies**: Updates morgan-sidecar/memories.md
- **Notes**: Should be run first by new users

**3. create-learning-plan Workflow**

- **Purpose**: Generate personalized roadmap
- **Type**: Document, collaborative planning
- **Priority**: High (provides structure)
- **Complexity**: Medium (8-10 steps)
- **Dependencies**: Reads memories.md for context
- **Notes**: Outputs to learning_output_path

## Phase 2: Enhanced Features (Priority: MEDIUM)

### Review & Improvement Workflows

**4. code-review-session Workflow**

- **Purpose**: Educational code review
- **Type**: Interactive, review-focused
- **Priority**: Medium
- **Complexity**: Medium (6-8 steps)
- **Notes**: Emphasize teaching over criticism

**5. architecture-session Workflow**

- **Purpose**: Collaborative design thinking
- **Type**: Interactive, design-focused
- **Priority**: Medium
- **Complexity**: Medium (8-10 steps)
- **Notes**: Teaches architectural thinking, not just patterns

**6. tdd-session Workflow**

- **Purpose**: TDD guidance and practice
- **Type**: Interactive, iterative
- **Priority**: Medium
- **Complexity**: Medium (red-green-refactor cycles)
- **Notes**: Emphasize rhythm of TDD

## Phase 3: Advanced Coaching (Priority: LOW)

### Specialized Workflows

**7. refactoring-guide Workflow**

- **Purpose**: Safe refactoring techniques
- **Type**: Interactive, step-by-step
- **Priority**: Low
- **Complexity**: Medium
- **Notes**: Tests-first approach

**8. debug-session Workflow**

- **Purpose**: Systematic debugging education
- **Type**: Interactive, problem-solving
- **Priority**: Low
- **Complexity**: Medium
- **Notes**: Teach methodology, not just fixes

## Phase 4: Additional Agents (Future)

### Specialist Coaching Agents

**Architecture Coach** (Expert Agent)

- Focus: System design and architectural decisions
- When: Architectural questions need deep expertise
- Commands: design-review, pattern-selection, trade-off-analysis

**Test Coach** (Expert Agent)

- Focus: Testing strategies and TDD mastery
- When: Testing-specific coaching needed
- Commands: test-strategy, coverage-analysis, test-refactor

**Code Reviewer** (Expert Agent)

- Focus: Code quality and best practices
- When: Detailed code review sessions
- Commands: detailed-review, pattern-detection, quality-metrics

## Phase 5: Polish and Integration (Future)

### Module Enhancements

- **Progress Visualization**: Track learning journey over time
- **Learning Analytics**: Insights into growth patterns
- **Session Recordings**: Review past coaching sessions
- **Resource Library**: Curated teaching materials in knowledge/
- **Practice Exercises**: Hands-on challenges with guidance
- **Integration with BMM**: Use coached approach in BMM workflows

## Quick Commands Reference

### Create Next Workflow

```bash
workflow create-workflow
```

### Create Additional Agent

```bash
workflow create-agent
```

### Test Morgan

```bash
agent morgan
```

## Implementation Strategy

### Recommended Build Order

1. **Start with assess-skill-level** (Quick win, enables adaptation)
2. **Build guided-story** (Core value proposition)
3. **Add create-learning-plan** (Provides structure)
4. **Implement code-review-session** (High impact)
5. **Add architecture-session** (Pre-coding guidance)
6. **Build tdd-session** (Practice methodology)
7. **Add refactoring-guide** (Code improvement)
8. **Complete debug-session** (Problem-solving skills)

### Testing Approach

For each workflow:

1. Create workflow structure (workflow.yaml + instructions.md + template if needed)
2. Test with Morgan in different skill levels
3. Verify coaching style adaptation
4. Ensure session notes are created properly
5. Get feedback from actual users
6. Iterate based on learning outcomes

## Resource Additions

### Morgan's Knowledge Base

Add to `morgan-sidecar/knowledge/`:

**patterns/**

- design-patterns.md - Common patterns with examples
- architecture-patterns.md - System design patterns
- anti-patterns.md - What to avoid and why

**resources/**

- books.md - Recommended reading by topic
- courses.md - Online courses worth taking
- articles.md - Must-read articles

**examples/**

- clean-code-examples/ - Before/after code samples
- refactoring-examples/ - Real refactoring scenarios
- testing-examples/ - Well-tested code examples

**teaching/**

- analogies.md - Effective teaching analogies
- common-mistakes.md - Frequent pitfalls
- learning-paths.md - Structured learning journeys

## Success Metrics

### Module Success Indicators

- [ ] Users complete features using guided-story
- [ ] Developers report learning while coding
- [ ] Code quality improves over sessions
- [ ] Users prefer BME over traditional dev-story
- [ ] Session notes show skill progression
- [ ] Users can explain their code decisions
- [ ] Learning plans are followed and updated

### Morgan's Effectiveness

- [ ] Adapts coaching to skill level appropriately
- [ ] Asks insightful guiding questions
- [ ] Celebrates progress genuinely
- [ ] Explanations are clear and helpful
- [ ] Users feel supported, not judged
- [ ] "Aha!" moments happen regularly

## Notes

### Design Principles

1. **Always Guide, Never Replace**: Morgan asks questions, doesn't write code
2. **Socratic Method**: Lead through questions, not lectures
3. **Celebrate Progress**: Every step forward deserves recognition
4. **Adapt Constantly**: Match energy, depth, and style to user needs
5. **Build Understanding**: Focus on "why" as much as "how"
6. **Stay Positive**: Criticism should always be constructive and kind

### Module Philosophy

BME exists because:

- Developers learn best by doing, not watching
- Your coding style and preferences matter
- Understanding beats automation
- Growth requires guided practice, not passive consumption
- The best coach asks the right questions at the right time

### Future Vision

BME becomes the standard for learning-focused development:

- Every framework has a BME coaching module
- Learning paths are personalized and dynamic
- Progress tracking spans projects and time
- Community shares coaching patterns and techniques
- Coaching adapts to emerging technologies automatically

---

**Next Action**: Build `assess-skill-level` workflow to enable adaptive coaching!

**Command**: `workflow create-workflow`
