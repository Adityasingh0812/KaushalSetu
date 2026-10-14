# KaushalSetu Project Guidelines for Claude Code

## Project Overview
KaushalSetu is an AI-powered Employment Outcome Tracking System for institute-level hackathon. Focus on implementing the core workflow: Training → Certification → Employment → Follow-ups → Outcome Verification → Risk Analysis → Intervention → Measured Results.

## Key Files to Consult
- PROJECT_SPEC.md: Detailed feature scope and success criteria
- ARCHITECTURE.md: Technical architecture and design decisions
- FEATURES.md: Complete feature list
- DECISIONS.md: Log of architectural and design choices
- TESTING.md: Testing strategy and guidelines
- PLAN.md: Implementation roadmap (current phase)

## Development Principles
1. **Role-Based Access**: Every API endpoint must enforce appropriate role permissions
2. **Data Integrity**: Unverified data must never be presented as verified employment
3. **Explainability**: ML outputs must be interpretable by end-users
4. **Audit Trail**: Significant actions must create audit log entries
5. **Privacy by Design**: Collect minimum necessary data, respect consent
6. **Error Handling**: Return consistent error formats, never leak stack traces
7. **Testing First**: Write tests before or alongside implementation
8. **Commit Convention**: Use conventional commits (feat, fix, docs, refactor, test, chore)
9. **Documentation**: Update relevant markdown files when changing specifications

## Stack-Specific Guidelines
### Backend (FastAPI)
- Use Pydantic v2 for validation
- Leverage FastAPI's dependency injection for DB sessions and auth
- Keep business logic in CRUD modules, not in route handlers
- Use SQLAlchemy 2.0 style with select() statements
- All async route handlers must use await properly
- Initialize ML models once at startup (singleton pattern)
- **Public registration never permits self-assigned government-admin or institute-officer privileges**
- **Privileged demo accounts explicitly seeded**
- **Demo authentication clearly identified as demo-only if any shortcuts are used**
- **Enforce role permissions and institute-level data isolation on the backend**
- **ML models clearly labeled as synthetic-data demonstration only**
- **Use held-out evaluation data and report only metrics actually calculated**
- **Never claim validated real-world unemployment prediction accuracy**
- **Policy simulator: transparent scenario calculator with adjustable assumptions, estimated costs, ranges where appropriate, and baseline comparison**
- **Do not present hypothetical calculations as causal evidence or validated forecasts**

### Frontend (React/Vite/TS)
- Use functional components with hooks
- Follow Tailwind CSS utility-first approach
- Maintain strict typing; avoid any
- Use React Router v6 for routing
- Implement proper loading and error states
- Use environment variables via import.meta.env
- Component library: build reusable components early

## Database Guidelines
- All tables must have UUID primary keys (except join tables if needed)
- Use timestamps with timezone (timestamptz)
- Foreign keys must be indexed
- Enumerated roles and statuses should use CHECK constraints or ENUM types
- Migrations must be reversible where possible
- Seed data scripts must be deterministic

## ML Guidelines
- Models must be explainable (coefficients or feature importance)
- Input validation for ML endpoints same as other API endpoints
- Model files stored in backend/ml/ directory
- Retraining scripts should be versioned with data
- Never expose raw model weights in API responses

## API Guidelines
- Version all endpoints under /api/v1/
- Use standard HTTP status codes
- Return consistent JSON format: {data: ..., meta: ...} for success
- Error format: {detail: "...", error_code?: string, timestamp: string}
- Use plural resource names (e.g., /courses, not /course)
- Implement pagination with limit/offset for list endpoints
- Use HTTP verbs correctly (GET for safe, POST for create, etc.)
- Secure endpoints with appropriate role dependencies

## Security Guidelines
- Passwords must be hashed using bcrypt (work factor 12)
- JWT tokens: access token 15 min, refresh token 7 days
- Implement rate limiting on auth endpoints (10/minute)
- Validate and sanitize all inputs
- Use parameterized queries to prevent SQL injection
- Set secure HTTP headers (helmet-like via middleware)
- Never log passwords or tokens
- File uploads: validate type, size, scan for malware (simulated for hackathon)

## Testing Guidelines
- Write unit tests for backend CRUD functions and ML inference
- Write integration tests for API endpoints with database
- Write E2E tests for critical user journeys
- Maintain >70% test coverage for backend
- Use synthetic data with fixed seeds for reproducibility
- Tests must run in isolation (clean database state)
- Update tests when changing specifications

## Git Guidelines
- Branch naming: feature/, fix/, refactor/, docs/
- Pull requests must include description linking to issue
- Squash and merge policy for clean history
- Never commit .env, node_modules, venv, build artifacts
- Commit messages must follow conventional commits
- Tag releases for demo milestones

## Demo Preparation
- Use seed 42 for synthetic data generation
- Ensure all core workflows are demonstrable
- Prepare preset scenarios for each role
- Have backup of working state before demo day
- Document any known limitations clearly

## Communication
- Update PROJECT_SPEC.md when scope changes
- Log significant decisions in DECISIONS.md
- Keep CHANGELOG.md for user-facing changes
- Notify team of breaking changes via PR description