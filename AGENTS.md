# Claude Code Agent Configuration for KaushalSetu

## Agent Settings
- **Model**: claude-opus-5 (preferred for complex reasoning)
- **Temperature**: 0.2 (for consistent code generation)
- **Max Tokets**: 4000

## Permission Preferences
- Allow: npm commands, pip commands, git commands, file read/write in project directory
- Require permission for: network calls outside localhost, sudo commands, global installs

## Common Command Aliases (for rtk)
- `rtk gain`: Show token savings
- `rtk discover`: Analyze usage for optimization

## Agent Behavior Guidelines
1. Always read relevant files before making changes
2. Use Edit tool for precise changes when file already read
3. Use Write for new files or complete replacements
4. Run tests after significant changes
5. Keep commits atomic with conventional messages
6. Never commit .env or secret files
7. Respect the established architecture and patterns
8. When in doubt, consult PROJECT_SPEC.md and ARCHITECTURE.md