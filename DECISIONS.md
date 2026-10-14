# KaushalSetu Design Decisions Log

## 1. Architecture Decisions

### 1.1 Stack Selection (2026-10-14)
**Decision**: Use React + Vite + TypeScript + Tailwind CSS for frontend, FastAPI + PostgreSQL + SQLAlchemy for backend, scikit-learn for ML.
**Alternatives Considered**:
- Django REST Framework: Rejected due to heavier weight and less automatic OpenAPI generation
- Vue.js: Rejected due to team familiarity with React
- MongoDB: Rejected because relational model fits the domain better (clear relationships between entities)
- TensorFlow: Rejected for overkill; scikit-learn provides sufficient ML with better explainability
**Consequences**: 
- Frontend development will be fast with Vite's HMR
- Backend will have excellent API documentation
- Need to handle SQLAlchemy 2.0 migration patterns
- ML models will be interpretable but may have lower precision than deep learning

### 1.2 Authentication Approach (2026-10-14)
**Decision**: JWT-based authentication with access tokens (15 min) and refresh tokens (7 days). Public registration never permits self-assigned government-admin or institute-officer privileges. Privileged demo accounts explicitly seeded.
**Alternatives Considered**:
- Session-based authentication: Rejected for API statelessness and mobile readiness
- OAuth 2.0: Rejected for overkill in single-system context
- API keys: Rejected for lack of fine-grained expiration and refresh
**Consequences**:
- Need to implement token refresh logic on frontend
- Must protect against XSS by storing tokens in memory (not localStorage) or use httpOnly cookies in production
- Refresh token rotation required to prevent replay attacks
- Enforce role permissions and institute-level data isolation on the backend
- Demo authentication clearly identified as demo-only if any shortcuts are used

### 1.3 ML Integration Strategy (2026-10-14)
**Decision**: Embed scikit-learn models directly in FastAPI backend as singletons loaded at startup (synthetic-data demonstration only).
**Alternatives Considered**:
- Separate ML microservice: Rejected for hackathon simplicity; adds deployment complexity
- ML APIs (AWS SageMaker, etc.): Rejected for lack of control and need for internet
- ONNX/TensorRT: Rejected for unnecessary optimization at this stage
**Consequences**:
- Backend startup time increases slightly due to model loading
- Models must be thread-safe for concurrent requests
- Model updates require backend restart (acceptable for hackathon)
- Memory usage increases but manageable for demo scale
- **Note**: Clearly labeled as synthetic-data demonstration; use held-out evaluation data and report only metrics actually calculated; never claim validated real-world unemployment prediction accuracy

### 1.4 File Storage Decision (2026-10-14)
**Decision**: Store uploaded evidence files locally in ./uploads/ directory with secure filenames.
**Alternatives Considered**:
- Cloud storage (AWS S3): Rejected for hackathon simplicity and lack of credentials
- Database blobs: Rejected for bloating database and poor scalability for large files
- IPFS: Rejected for overkill and immaturity for this use case
**Consequences**:
- Filesystem must be backed up with database
- Need to implement file cleanup policies
- Size limits and virus scanning required for production
- Not suitable for multi-instance deployment without shared storage

### 1.5 State Management Approach (2026-10-14)
**Decision**: Use React Context API for global state (auth, user) and custom hooks for data fetching.
**Alternatives Considered**:
- Redux Toolkit: Rejected for added boilerplate not justified by hackathon scope
- Zustand: Rejected for similar reasons; Context sufficient
- SWR: Considered but decided to build custom hooks for learning
**Consequences**:
- State updates will trigger re-renders via Context
- No built-in caching like SWR/query; will implement simple caching in hooks if needed
- Developer must be careful about context granularity to avoid excessive re-renders

## 2. Data Model Decisions

### 2.1 User Role Modeling (2026-10-14)
**Decision**: Single Users table with role column, plus optional extension tables for role-specific attributes.
**Alternatives Considered**:
- Separate tables per role (inheritance model): Rejected for complexity in queries and joins
- Role-based columns in Users table with nullable fields: Rejected for sparse table and schema alteration per role
- Entity-Attribute-Value model: Rejected for poor queryability and lack of constraints
**Consequences**:
- Simple joins to get role-specific data
- Need to handle missing extension tables gracefully (left joins)
- Role-based views may be helpful for reporting

### 2.2 Employment Verification Flow (2026-10-14)
**Decision**: Employment records start as unverified; verification is a separate process that updates verification status and links evidence.
**Alternatives Considered**:
- Verify at time of entry: Rejected because evidence may not be available immediately
- Separate verification entity: Rejected for overkill; verification status fields sufficient
- Three-state system (pending, verified, rejected): Adopted
**Consequences**:
- Clear distinction between self-reported and verified employment in reporting
- Need to ensure unverified data is not counted in official metrics
- Audit trail important for verification changes

### 2.3 Follow-up Consent Modeling (2026-10-14)
**Decision**: Consent stored as boolean on Follow-up table, with option to add consent version/timestamp for GDPR-like compliance.
**Alternatives Considered**:
- Separate consent management entity: Rejected for simplicity; consent tied to each follow-up sufficient for hackathon
- Granular consent purposes (employment tracking, research, etc.): Rejected for scope creep
**Consequences**:
- Each follow-up records whether consent was given for that interaction
- For longitudinal consent, need to check most recent follow-up consent
- Simpler to implement but less flexible than dedicated consent management

## 3. API Design Decisions

### 3.1 API Versioning (2026-10-14)
**Decision**: Version in URL path (/api/v1/) with plans to increment for breaking changes.
**Alternatives Considered**:
- Header-based versioning: Rejected for less visibility and harder to test/query
- No versioning (assume backward compatibility): Rejected for inflexibility
- Media type versioning: Rejected for complexity
**Consequences**:
- Clients must specify version
- Documentation must note version
- Backward compatibility must be maintained within v1

### 3.2 Error Handling (2026-10-14)
**Decision**: Standard JSON error format: { "detail": "Error message", "error_code": "OPTIONAL_CODE", "timestamp": "ISO8601" }
**Alternatives Considered**:
- HTTP status codes only: Rejected for need of machine-readable error types
- Detailed validation errors in non-standard format: Rejected for inconsistency
- Problem Details for HTTP APIs (RFC 7807): Considered but kept simple for hackathon
**Consequences**:
- Frontend can parse consistent error structure
- Need to log detailed errors server-side while returning generic messages to clients when appropriate
- Validation errors from Pydantic will be formatted accordingly

### 3.3 Pagination (2026-10-14)
**Decision**: Limit-offset pagination with parameters ?limit=10&offset=0 for list endpoints.
**Alternatives Considered**:
- Cursor-based pagination: Rejected for simplicity; offset sufficient for demo scale
- Page number-based: Rejected for less flexibility
- No pagination: Rejected for scalability concerns
**Consequences**:
- Offset pagination can have performance issues on large tables; acceptable for demo
- Need to ensure consistent ordering with ORDER BY
- Maximum limit enforced to prevent resource exhaustion

### 3.4 Policy Simulator Approach (2026-10-14)
**Decision**: Implement transparent scenario calculator with adjustable assumptions, estimated costs, ranges where appropriate, and baseline comparison.
**Alternatives Considered**:
- Black-box predictive model: Rejected for lack of transparency
- Complex econometric modeling: Rejected for overkill in hackathon scope
**Consequences**:
- Clearly show assumptions and calculations to users
- Do not present hypothetical calculations as causal evidence or validated forecasts
- Focus on interpretability over predictive accuracy for demonstration

## 4. UI/UX Decisions

### 4.1 Language Toggle Implementation (2026-10-14)
**Decision**: Context-based language preference with English/Hindi options; UI strings stored in JSON files.
**Alternatives Considered**:
- i18next library: Rejected for bundle size; simple solution sufficient
- Server-side language detection: Rejected for wanting explicit user control
- HTML lang attribute only: Rejected for insufficient for dynamic content
**Consequences**:
- Need to maintain translation files
- Language preference persisted in user profile or localStorage
- Date/time/number formatting uses browser locale, not translation (acceptable)
- Right-to-left layout not implemented for Hindi (deemed acceptable for demo)

### 4.2 Form Validation Library (2026-10-14)
**Decision**: React Hook Form with Yup validation schema.
**Alternatives Considered**:
- Formik: Rejected for slightly larger bundle and more boilerplate
- Custom validation: Rejected for reinventing the wheel
- HTML5 validation only: Rejected for insufficient UX and custom error messages
**Consequences**:
- Good performance and minimal re-renders
- Yup schema can be shared with backend validation if needed
- Learning curve acceptable for team

## 5. Security Decisions

### 5.1 Password Hashing (2026-10-14)
**Decision**: bcrypt via passlib with cost factor 12.
**Alternatives Considered**:
- Argon2: Rejected for slightly higher complexity; bcrypt well-understood
- PBKDF2: Rejected for lower memory hardness than bcrypt
- scrypt: Rejected for similar reasons to Argon2
**Consequences**:
- Industry standard for password hashing
- Need to handle password reset securely
- Cost factor may need tuning for hardware

### 5.2 Audit Logging (2026-10-14)
**Decision**: AuditEvent table capturing user action, entity type, entity ID, changes (JSON), and metadata.
**Alternatives Considered**:
- Database triggers: Rejected for less flexibility and harder to test
- Application-level logging to files: Rejected for poor queryability and log management
- Third-party audit tools: Rejected for cost and complexity
**Consequences**:
- Audit data queryable alongside business data
- Need to be careful about what constitutes a "change" to log
- Performance impact minimal for hackathon scale
- Must avoid logging sensitive data (passwords, etc.) in changes field

## 6. Open Issues
- [ ] Exact ML feature set for risk model (to be finalized during implementation)
- [ ] Policy simulator mathematical relationships (to be defined with domain experts)
- [ ] Evidence file size limits and allowed types
- [ ] Password complexity requirements
- [ ] Session timeout values
- [ ] Maximum follow-up attempts before considering candidate unreachable
- [ ] Intervention outcome measurement methodology