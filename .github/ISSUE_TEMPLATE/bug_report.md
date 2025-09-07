---
name: 🐛 Bug Report
about: Report a bug or unexpected behavior
title: '[BUG]: {{issue_title}}'
labels: bug, triage
assignees: TituxMetal
---

## Affected Area

<!-- Select the area where the bug occurs -->

**Area:** {{affected_area}}

- [ ] 🔐 Authentication (Login/Register/JWT)
- [ ] 🏗️ Backend API (NestJS)
- [ ] 🌐 Frontend Web (Astro/React)
- [ ] 🎨 UI Components
- [ ] 📊 Database (Prisma/SQLite)
- [ ] 🐳 Docker/Deployment
- [ ] 📖 Documentation
- [ ] 🔧 Build/Development Tools

## Environment

**Environment:** {{environment}}

- [ ] 🖥️ Local Development
- [ ] 🐳 Docker Container
- [ ] 🌐 Production Deployment
- [ ] 🧪 Testing Environment

## Bug Description

{{bug_description}}

A clear and concise description of what the bug is.

## Steps to Reproduce

{{reproduction_steps}}

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

{{expected_behavior}}

A clear and concise description of what you expected to happen.

## Actual Behavior

{{actual_behavior}}

A clear and concise description of what actually happened.

## Screenshots/Error Messages

{{screenshots_errors}}

If applicable, add screenshots or copy/paste error messages:

```text
Paste error messages here
```

## System Information

{{system_info}}

- OS: [e.g., macOS 14.0, Windows 11, Ubuntu 22.04]
- Node.js Version: [e.g., v22.17.0]
- Yarn Version: [e.g., 4.9.1]
- Browser: [e.g., Chrome 120, Firefox 119, Safari 17] (if web-related)
- Docker Version: [e.g., 24.0.0] (if Docker-related)

## Relevant Logs

{{relevant_logs}}

Any relevant log output (API logs, browser console, etc.):

```bash
Paste relevant logs here
```

## Additional Context

{{additional_context}}

Add any other context about the problem here.

## Pre-submission Checklist

- [ ] I have searched existing issues to avoid duplicates
- [ ] I have provided all the requested information
- [ ] I can reproduce this bug consistently
- [ ] I have checked the documentation and README
