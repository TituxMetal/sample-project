# BME Developer Coaching

Enable learning-by-doing at ANY skill level through AI pair programming coaching. Morgan guides, explains, and reviews - but never replaces the developer.

## Overview

BME (BMAD Educational) is a developer coaching module that transforms how you learn and grow as a developer. Instead of having AI write code for you, Morgan acts as your pair programming coach who:

- **Guides** you through implementation step-by-step
- **Explains** concepts and the "why" behind the "how"
- **Reviews** your code with educational feedback
- **Celebrates** your progress and builds confidence
- **Adapts** to your skill level and learning style

## Philosophy

### Problems BME Solves

1. **Passive Learning** - Traditional dev-story writes all code automatically; you can't learn or maintain your style
2. **Lost Control** - AI-generated code often ignores your existing best practices and patterns
3. **No Growth** - Watching AI code doesn't build your skills or understanding
4. **Style Mismatch** - You know what you want AND what you don't want - you need a coach, not a coder

### The BME Approach

**Coach, Don't Code** - Morgan guides your thinking, not your typing
**Explain, Don't Execute** - Understanding over automation
**Guide, Don't Generate** - Questions over answers
**Review, Don't Replace** - Your code, elevated with expert feedback

## Installation

```bash
bmad install bme
```

During installation, you'll configure:

- **Coaching Style** - How detailed explanations should be (concise/balanced/detailed)
- **Skill Level** - Your current level for adaptive coaching (beginner/intermediate/advanced)
- **Theory Inclusion** - How much theoretical background (minimal/standard/comprehensive)
- **Auto Resources** - Whether Morgan suggests learning materials proactively
- **Output Path** - Where to save learning plans and session notes

## Components

### Agents (1)

**Morgan** 🧑‍🏫 - Senior Developer & Pair Programming Coach

- Expert agent with sidecar resources
- The Energized Mentor personality (supportive, collaborative, wise, enthusiastic)
- Adapts coaching to your skill level and learning preferences
- Maintains memory of your progress and preferences
- 14 coaching commands across implementation, review, and learning management

### Workflows (8)

**Core Coaching Workflows:**

1. **guided-story** - Step-by-step implementation coaching (replaces dev-story)
2. **architecture-session** - Collaborative architecture design before coding
3. **tdd-session** - Test-driven development guidance

**Review & Improvement:** 4. **code-review-session** - Educational feedback on your code 5. **refactoring-guide** - Guide through refactoring existing code 6. **debug-session** - Learn debugging techniques while solving issues

**Learning Management:** 7. **assess-skill-level** - Determine appropriate coaching depth 8. **create-learning-plan** - Generate personalized learning roadmap

### Tasks (3)

- **explain-concept** - Quick explanations of programming concepts
- **suggest-resources** - Recommend learning materials
- **check-understanding** - Quick comprehension checks

## Quick Start

### 1. Load Morgan

```
agent morgan
```

Morgan will greet you and show the command menu.

### 2. Assess Your Skill Level

```
*assess-level
```

This helps Morgan understand your experience and adapt coaching appropriately.

### 3. Set Learning Goals

```
*set-goals
```

Define what you want to achieve and what skills you want to develop.

### 4. Start Coaching

**For Implementation:**

```
*guided-story
```

Step-by-step guidance through implementing a feature or story.

**For Architecture:**

```
*architecture-session
```

Think through design decisions before writing code.

**For Code Review:**

```
*code-review
```

Get educational feedback on code you've written.

### 5. View All Commands

```
*help
```

See the complete menu of coaching commands available.

## Module Structure

```
bme/
├── agents/
│   ├── morgan.agent.yaml           # Morgan agent definition
│   ├── morgan.md                   # Compiled agent (generated at install)
│   └── morgan-sidecar/             # Morgan's workspace
│       ├── memories.md             # User preferences & progress
│       ├── instructions.md         # Coaching directives
│       ├── knowledge/              # Teaching resources
│       └── sessions/               # Session notes
├── workflows/
│   ├── guided-story/               # Primary coaching workflow
│   ├── architecture-session/       # Design thinking guidance
│   ├── tdd-session/                # TDD coaching
│   ├── code-review-session/        # Educational review
│   ├── refactoring-guide/          # Refactoring techniques
│   ├── debug-session/              # Debugging guidance
│   ├── assess-skill-level/         # Skill assessment
│   └── create-learning-plan/       # Learning roadmap
├── config.yaml                     # Module configuration
└── README.md                       # This file
```

## Configuration

The module can be configured in `.bmad/bme/config.yaml`

### Key Settings

**coaching_style** - Explanation depth

- `concise` - Brief, action-focused
- `balanced` - Mix of explanation and action (recommended)
- `detailed` - Comprehensive with context

**default_skill_level** - Coaching adaptation

- `beginner` - More foundational explanations, smaller steps
- `intermediate` - Balance theory with practice
- `advanced` - Deep dives, subtle trade-offs

**include_theory** - Theoretical background

- `minimal` - Focus on "how", light on "why"
- `standard` - Balance "how" with "why" (recommended)
- `comprehensive` - Deep theoretical foundations

**auto_suggest_resources** - Learning materials

- `yes` - Proactively suggests articles, docs, tutorials
- `no` - Only suggests when asked

**learning_output_path** - Where session notes and learning plans are saved

## Examples

### Example 1: Guided Implementation

```
agent morgan
*guided-story
```

Morgan will:

1. Load your story context (epic, tech-spec, acceptance criteria)
2. Assess your understanding of requirements
3. Guide architectural thinking before coding
4. Break implementation into learnable chunks
5. For each chunk:
   - Explain the concept/pattern needed
   - Ask guiding questions about approach
   - Let you write the code
   - Review what you wrote
   - Celebrate progress
6. Guide testing approach
7. Help you reflect on what you learned

### Example 2: Code Review Session

```
agent morgan
*code-review
```

Share code you wrote, and Morgan will:

1. Start with what you did well
2. Ask about your reasoning
3. Present alternatives as questions
4. Explain trade-offs
5. Suggest refactoring opportunities
6. Leave you with actionable insights

### Example 3: Learning Plan

```
agent morgan
*learning-plan
```

Morgan will collaborate with you to create:

- Phased learning path (foundation → intermediate → advanced)
- Core concepts to learn in each phase
- Hands-on projects to practice
- Resources (books, courses, docs)
- Success criteria and milestones

## Who Should Use BME

### Perfect For

- **Intermediate developers** who want guidance without losing control
- **Experienced developers** exploring new domains/technologies
- **Learners** who learn better by doing than reviewing
- **Style-conscious developers** with strong opinions about their code
- **Teams** that value understanding over speed

### Ideal Scenarios

- Learning a new language, framework, or technology
- Building skills in areas like architecture, testing, or refactoring
- Maintaining your coding style while getting expert guidance
- Understanding the "why" behind patterns and practices
- Growing from intermediate to advanced skill level

## Development Roadmap

### Phase 1: Core Foundation ✅

- [x] Morgan agent created
- [x] Module structure established
- [x] Configuration defined
- [ ] guided-story workflow
- [ ] assess-skill-level workflow

### Phase 2: Essential Workflows

- [ ] architecture-session workflow
- [ ] code-review-session workflow
- [ ] tdd-session workflow
- [ ] create-learning-plan workflow

### Phase 3: Advanced Features

- [ ] refactoring-guide workflow
- [ ] debug-session workflow
- [ ] Progress tracking visualization
- [ ] Learning analytics
- [ ] Additional coaching agents (Architecture Coach, Test Coach, Code Reviewer)

### Phase 4: Community & Expansion

- [ ] Community-contributed coaching patterns
- [ ] Domain-specific coaching modules
- [ ] Integration with BMM workflows
- [ ] Coaching session recordings/playback

## Quick Commands

**Create new workflow:**

```
workflow create-workflow
```

**Add another agent:**

```
workflow create-agent
```

## Contributing

To extend this module:

1. Add new workflows using `create-workflow` workflow
2. Add new agents using `create-agent` workflow
3. Add teaching resources to `morgan-sidecar/knowledge/`
4. Update Morgan's customization file for personal tweaks

## Philosophy in Action

### Traditional Approach (What BME Avoids)

```
User: "Build a user authentication system"
AI: *writes 500 lines of code*
User: *copies code* ❌ No learning happened
```

### BME Approach (Learning by Doing)

```
User: "Build a user authentication system"
Morgan: "Great! Let's think through this together. What are the
         key security concerns we need to address?"
User: *thinks* "Password hashing, session management, CSRF..."
Morgan: "Excellent thinking! Let's start with password hashing.
         What hashing algorithms have you heard of?"
User: *explores* "bcrypt?"
Morgan: "Perfect choice! Now, why don't you write the code to
         hash a password? I'll guide you if you get stuck."
User: *writes code*
Morgan: "Nice work! I see you're using 10 rounds. Let's talk
         about why that number matters..."
```

## Author

Created with care on 2025-11-11

---

**BME: Where Learning Meets Doing** 🎓💻

_Empower your growth. Own your code. Master your craft._
