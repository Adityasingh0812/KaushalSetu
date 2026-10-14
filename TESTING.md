# KaushalSetu Testing Strategy

## 1. Testing Philosophy
- Test early, test often, test at multiple levels
- Focus on critical paths and role-based workflows
- Automate regression testing where feasible
- Balance between unit, integration, and end-to-end tests
- Prioritize testing of security-critical and data integrity paths
- Use realistic synthetic data for testing

## 2. Test Levels

### 2.1 Unit Testing
- **Backend**: Test individual functions in CRUD modules, ML inference functions, validation helpers
- **Frontend**: Test utility functions, custom hooks, form validation schemas
- **Tools**: pytest for backend, Jest/Vitest for frontend
- **Coverage Target**: 80% for critical backend modules (auth, employment, verification)
- **Mocking**: External services (email, file storage) mocked; database tested with transactions

### 2.2 Integration Testing
- **API Endpoints**: Test endpoint behavior with database interactions
- **Database Migrations**: Test upgrade/downgrade paths
- **ML Model Inference**: Test with known inputs/outputs
- **Authentication Flows**: Test login, token refresh, protected route access
- **Role-Based Access Control**: Test that users cannot access forbidden resources
- **Tools**: pytest with TestClient (FastAPI), React Testing Library for frontend components
- **Database**: Use transaction rollback or temporary test database

### 2.3 End-to-End (E2E) Testing
- **Critical User Journeys**:
  1. Candidate registration → course enrollment → certification → employment reporting → verification
  2. Institute officer workflow: view candidates → record follow-up → record intervention
  3. Gov admin dashboard: view metrics → verify employment → run risk analysis → policy simulation
  4. Employer workflow: post job → view applications → update status
  5. Multilingual: English/Hindi toggle affects UI strings
- **Tools**: Cypress or Playwright (chosen for hackathon: Cypress for simplicity)
- **Environment**: Tests run against deployed test instance with synthetic data
- **Frequency**: Run on each commit in CI pipeline

### 2.4 Acceptance Testing
- **Definition**: Tests that verify features meet product specification from user perspective
- **Scenarios**:
  - Verified employment counts only include evidence-verified records
  - Unemployment not inferred from missing data
  - Risk scores are explainable (top factors shown)
  - Job matching returns relevant results based on skills
  - Follow-up language preference respected
  - Intervention records link to candidate and show dates
- **Responsibility**: QA lead with input from domain experts
- **Frequency**: At end of each phase and before demo

### 2.5 Performance Testing
- **Load Testing**: Simulate 50 concurrent users during peak usage (follow-up recording)
- **Stress Testing**: Determine breaking point for API endpoints
- **Soak Test**: Run for 1 hour to check for memory leaks
- **Tools**: k6 or Locust for backend; Lighthouse for frontend performance
- **Metrics**: 
  - API response time < 500ms for 95% of requests
  - Page load time < 3s on 3G simulated
  - Error rate < 1% under load
- **Frequency**: Before major milestones and before demo

### 2.6 Security Testing
- **Authentication**: Test token expiration, refresh, brute force protection (rate limiting)
- **Authorization**: Test role boundaries (e.g., trainee cannot access admin endpoints)
- **Input Validation**: Test SQL injection, XSS, file upload vulnerabilities
- **Data Protection**: Verify password hashing, PII exposure in errors
- **Tools**: OWASP ZAP for manual testing; custom scripts for auth tests
- **Frequency**: Before demo and after security-related changes

## 3. Test Data Strategy

### 3.1 Synthetic Data Generator
- **Script**: `backend/scripts/generate_test_data.py`
- **Features**:
  - Deterministic seed for reproducibility
  - Generates realistic but fake PII
  - Creates interconnected data across all entities
  - Configurable scales (small for unit tests, large for load tests)
  - Includes edge cases (null values, boundary conditions)
- **Usage**:
  - Unit tests: fresh small dataset per test function
  - Integration tests: medium dataset per test suite
  - E2E/acceptance: large dataset resembling demo dataset
  - Performance: scalable dataset

### 3.2 Fixtures and Factories
- **Backend**: Use factory_boy or equivalent for creating test instances
- **Frontend**: Use cypress-fixture or similar for mocking API responses
- **Standardization**: Define common fixture sets for roles (admin_trainee, institute_officer, etc.)

## 4. Testing Environments

### 4.1 Development
- Local PostgreSQL instance
- Hot reloading for frontend/backend
- Tests run on watch mode during development
- Debugging tools enabled

### 4.2 Continuous Integration
- GitHub Actions workflow:
  1. Checkout code
  2. Setup Python, Node.js
  3. Install dependencies
  4. Start PostgreSQL service
  5. Run database migrations
  6. Run backend unit and integration tests
  7. Run frontend unit tests
  8. Build production bundles
  9. Run E2E tests against test deployment
  10. Generate coverage reports
  11. Deploy to preview environment on success
- **Triggers**: On push to main, pull requests
- **Artifacts**: Test reports, coverage, build artifacts

### 4.3 Staging/Demo
- Isolated environment resembling production
- Deployed from main branch after CI success
- Used for final acceptance testing and demo preparation
- Reset with synthetic data before each demo
- Monitoring: Basic health checks and error tracking

## 5. Specific Test Cases by Module

### 5.1 Authentication
- [ ] Valid login returns tokens
- [ ] Invalid login returns 401
- [ ] Token expiration handled correctly
- [ ] Refresh token flow works
- [ ] Protected routes require valid token
- [ ] Role-based endpoint access controls
- [ ] Password reset flow (simulated)
- [ ] Brute force protection via rate limiting

### 5.2 User Management
- [ ] CRUD operations respect role permissions
- [ ] Profile updates work correctly
- [ ] Email uniqueness enforced
- [ ] Role cannot be changed via self-update
- [ ] Inactive users cannot login

### 5.3 Training & Courses
- [ ] Course creation requires institute officer role
- [ ] Course listing shows active courses only
- [ ] Enrollment prevents duplicate enrollment
- [ ] Enrollment completion updates status
- [ ] Dropped enrollment handled correctly

### 5.4 Certification
- [ ] Only institute officer can upload for their candidates
- [ ] Gov/admin can verify/reject certification
- [ ] Verification status affects display
- [ ] Evidence linking works
- [ ] Expired certifications flagged

### 5.5 Employment Tracking
- [ ] Candidates can self-report employment
- [ ] Only self or institute officer can edit own reports
- [ ] Verification requires gov/admin or employer confirmation
- [ ] Salary history tracks changes
- [ ] Unverified employment not counted in metrics
- [ ] Verification evidence upload/download

### 5.6 Follow-ups
- [ ] Follow-ups can be scheduled/recorded
- [ ] Consent flag stored correctly
- [ ] Language preference recorded
- [ ] Multiple follow-ups per candidate allowed
- [ ] Follow-up employment status options
- [ ] Notes field handles large text

### 5.7 Employment Verification
- [ ] Evidence upload accepts PDF, images
- [ ] Verification updates employment record
- [ ] Rejection provides feedback to reporter
- [ ] Audit log entries created for verification
- [ ] Verified vs unverified distinction in queries

### 5.8 Interventions
- [ ] Intervention types constrained to enum
- [ ] Dates validation (start before end)
- [ ] Linking to candidate works
- [ ] Outcome impact field captured
- [ ] Multiple interventions timeline viewable

### 5.9 ML Risk Model (Synthetic-data demonstration only)
- [ ] Model loads at startup without error
- [ ] Prediction returns probability 0-1
- [ ] Explanation returns top features
- [ ] Feature importance sums to approximately 1
- [ ] Handles missing feature values gracefully
- [ ] Model retraining script works
- [ ] Risk thresholds (low/medium/high) configurable
- [ ] Clearly labeled as synthetic-data demonstration
- [ ] Use held-out evaluation data and report only metrics actually calculated
- [ ] Never claim validated real-world unemployment prediction accuracy

### 5.10 Job Matching
- [ ] Vectorizer fits on job skills and candidate skills
- [ ] Similarity scores between 0-1
- [ ] Top matches are semantically relevant
- [ ] Empty skills handled gracefully
- [ ] Performance acceptable for demo scale

### 5.11 Policy Simulator
- [ ] Parameters have sensible ranges
- [ ] Output changes when inputs change
- [ ] Base case (zero change) returns current metrics
- [ ] Directionality correct (e.g., more stipend → higher employment)
- [ ] Simple linear relationships used for demo

### 5.12 Multilingual
- [ ] UI toggles between English and Hindi
- [ ] All static text translates
- [ ] Language preference persisted
- [ ] Date/pickup unaffected by language (uses browser locale)
- [ ] Right-to-left not attempted (deferred)

### 5.13 Role-Based Dashboards
- [ ] Gov admin sees aggregate data
- [ ] Institute officer sees only institute data
- [ ] Trainee sees only own data
- [ ] Employer sees only own jobs/applications
- [ ] Key metrics calculations correct
- [ ] Charts render correctly (if implemented)
- [ ] Refresh/update mechanisms work

### 5.14 Audit Trail
- [ ] Significant actions create audit entries
- [ ] Audit entries include user, timestamp, action
- [ ] Changes field captures before/after when relevant
- [ ] Sensitive data not logged in changes
- [ ] Admin can query audit logs with filters
- [ ] Audit log itself append-only (no edit/delete)

## 6. Test Data Management

### 6.1 Synthetic Data Seeds
- **Unit Test Seed**: 999 (small, fast)
- **Integration Test Seed**: 1000 (medium)
- **E2E Test Seed**: 1001 (large, resembles demo)
- **Performance Test Seed**: 1002 (scalable)
- **Demo Seed**: 42 (the canonical demonstration seed)

### 6.2 Data Reset Procedures
- **Between Tests**: Transaction rollback or truncate tables
- **Between Test Suites**: Drop and recreate schema via migrations
- **Before Demo**: Run `reset_demo.sh` which:
  1. Drops and recreates database
  2. Runs migrations
  3. Seeds with demo data (seed 42)
  4. Starts application services

## 7. Test Reporting and Metrics

### 7.1 Coverage Reporting
- **Backend**: Coverage.py with HTML report
- **Frontend**: Jest/Vitest coverage report
- **Threshold**: Fail build if total coverage < 70% (warning at 80%)
- **Exclusions**: Generated code, test files, config

### 7.2 Test Results
- **Format**: JUnit XML for CI integration
- **Retention**: Keep test artifacts for 30 days
- **Notifications**: Failure alerts to Slack/email (configured in CI)

### 7.3 Quality Gates
- **Must Pass**: All unit and integration tests
- **Should Pass**: 80% of E2E tests (flaky UI tests allowed)
- **Performance**: 95th percentile API response < 500ms
- **Security**: No high/severe vulnerabilities in scan
- **Coverage**: Overall > 70%

## 8. Testing Tools Versions (as of 2026-10-14)
- **Backend**: Python 3.11, pytest 8.0, factory_boy 3.3, TestClient (FastAPI)
- **Frontend**: Node 20, Vitest 2.0, React Testing Library, Cypress 13.0
- **Performance**: k6 0.55, Locust 3.0
- **Security**: OWASP ZAP 2.14, Bandit 1.8, Safety 3.0
- **Code Quality**: ESLint 9.0, Prettier 3.0, mypy 1.10, Ruff 0.6
- **CI**: GitHub Actions (ubuntu-latest)

## 9. Testability Design Notes
- **Dependency Injection**: Backend uses dependency injection for DB sessions, allowing test overrides
- **Configuration**: Environment-specific config allows test database URLs
- **Idempotency**: API endpoints designed to be idempotent where possible (PUT/PATCH)
- **Deterministic ML**: Models loaded with fixed weights; no randomness in inference for testing
- **Time Control**: Use of fake clock libraries for time-sensitive tests (follow-up scheduling)
- **File System**: Mock filesystem for file upload tests in backend
- **Frontend Mocking**: Mock Service Worker or Jest mocks for API calls in unit tests
- **Test IDs**: Data-testid attributes added to key frontend elements for E2E targeting

## 10. Open Testing Issues
- [ ] Determine exact E2E tool (Cypress vs Playwright)
- [ ] Define synthetic data schema versioning
- [ ] Establish performance baseline numbers
- [ ] Set up security scanning in CI
- [ ] Configure test reporting dashboard (e.g., Testomat.io, Allure)
- [ ] Decide on visual regression testing strategy
- [ ] Plan for testing multilingual layout (pseudo-localization)