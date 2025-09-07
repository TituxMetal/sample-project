# {{change_type}}{{#change_scope}}({{change_scope}}){{/change_scope}}: {{description}}

{{#body}}{{body}}{{/body}}

{{#issue_reference}}{{issue_reference}}{{/issue_reference}}

<!-- Conventional Commit Template with Template Variables -->
<!--
This template is processed by the template-processor agent
Available variables:
- {{change_type}}: feat, fix, docs, style, refactor, test, chore
- {{change_scope}}: auth, api, web, ui, db, docs, ci, docker
- {{description}}: Brief description of the change
- {{body}}: Detailed explanation (optional)
- {{issue_reference}}: Closes #123, Refs #456, Fixes #789

Types:
- feat:     A new feature
- fix:      A bug fix
- docs:     Documentation only changes
- style:    Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf:     A code change that improves performance
- test:     Adding missing tests or correcting existing tests
- chore:    Changes to build process or auxiliary tools

Scopes (examples for this project):
- auth:     Authentication related changes
- api:      Backend API changes (NestJS)
- web:      Frontend changes (Astro/React)
- ui:       UI component changes
- db:       Database schema or migration changes
- docs:     Documentation changes
- ci:       Continuous integration changes
- docker:   Docker configuration changes

Breaking changes: Add BREAKING CHANGE: in the footer
Use `yarn commit` for interactive conventional commit creation
-->
