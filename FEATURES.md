# KaushalSetu Features

## 1. Core Features

### 1.1 User Management
- Role-based registration and authentication (Government Admin, Institute Officer, Trainee, Employer)
- **Public registration never permits self-assigned government-admin or institute-officer privileges**
- **Privileged demo accounts explicitly seeded for demonstration**
- Profile management (view/update own profile)
- Password reset via email (simulated for hackathon)
- Session management with JWT tokens
- Role-based access control enforced at API level
- Demo authentication clearly identified as demo-only if any shortcuts are used
- Enforce role permissions and institute-level data isolation on the backend

### 1.2 Training & Course Management
- Institute officers can create and manage training providers
- Course catalog with details (title, description, duration, certification offered)
- Public course browsing and search
- Course enrollment system for trainees
- Enrollment tracking (enrolled, completed, dropped)

### 1.3 Certification Management
- Institute officers can upload certification documents for completed trainees
- Certification metadata (name, issuing authority, issue/expiry dates)
- Certification verification workflow by government administrators
- Evidence linking (certificates can reference employment records)
- Certificate status: pending, verified, rejected

### 1.4 Employment Tracking
- Trainee self-reporting of employment details (job title, employer, start date, salary, type)
- Employment verification system requiring evidence (payslip, employer letter, etc.)
- Government administrator verification of employment claims
- Employment status tracking over time
- Salary history recording (optional)
- Verification methods: self-reported, employer confirmation, payslip, PF records

### 1.5 Follow-up System
- Scheduled follow-ups at configurable intervals (1, 3, 6 months post-completion)
- Multiple contact methods: phone, email, in-person, SMS
- Consent tracking for data usage and contact
- Employment status collection during follow-ups
- Notes field for qualitative information
- Language preference tracking (English/Hindi) for follow-up communications

### 1.6 Outcome Integrity Engine
- Evidence-based verification of employment claims
- Document upload and storage for verification purposes
- Verification workflow with approver tracking
- Audit trail of verification attempts and outcomes
- Distinction between verified and unverified employment in reporting
- Rejection workflow with feedback to reporting party

### 1.7 Intervention-to-Outcome Loop
- Intervention recording (type, description, dates)
- Linking interventions to specific candidates
- Outcome tracking post-intervention (employment status changes)
- Intervention effectiveness reporting
- Ability to record multiple interventions per candidate
- Intervention types: reskilling, counseling, job fairs, mentorship, internship arrangements

### 1.8 Explainable Employment-Risk ML
- Risk score prediction for each candidate (probability of unemployment) - **Synthetic-data demonstration only**
- Model explains top factors contributing to risk (feature coefficients)
- Features include: course attributes, demographics, skills, enrollment details
- Model retrainable with new data
- Risk categories: low, medium, high based on score thresholds
- Visualization of risk factors in dashboard
- **Note**: Clearly labeled as synthetic-data demonstration; use held-out evaluation data and report only metrics actually calculated; never claim validated real-world unemployment prediction accuracy

### 1.9 Industry Job Matching
- Skills-based matching between candidate profiles and job listings
- TF-IDF vectorization of skills for semantic matching
- Ranked list of job recommendations for candidates
- Employer view of matched candidates for their job postings
- Match score transparency
- Application integration: one-click apply from recommendations

### 1.10 Policy Impact Simulator
- Transparent scenario calculator with adjustable assumptions, estimated costs, ranges where appropriate, and a baseline comparison
- **Do not present hypothetical calculations as causal evidence or validated forecasts**
- Configurable parameters representing policy levers:
  - Stipend amount during training
  - Training duration
  - Industry alignment score
  - Soft skills training hours
  - Interview preparation quality
  - Post-placement support duration
- Simulation outputs:
  - Predicted change in employment rate
  - Predicted change in average salary
  - Predicted change in retention at 6/12 months
- What-if analysis for government officials
- Based on simplified empirical relationships (to be enhanced with real data)

### 1.11 Multilingual Support
- English/Hindi toggle in user interface
- Language preference stored in user profile
- Follow-up language selection (for SMS/email templates)
- Static content translation (buttons, labels, messages)
- Date/number formatting remains invariant
- RTL support not required for Hindi in this implementation

### 1.12 Role-Based Dashboards
#### Government Administrator Dashboard
- Overall verified employment rate across all institutes
- Institute-wise performance comparison
- Risk distribution of candidates (low/medium/high)
- Recent verification activities
- Policy simulation controls
- Audit summary

#### Institute Officer Dashboard
- Institute-specific enrollment and completion rates
- Verified employment rate for institute's candidates
- Follow-up completion status
- Pending interventions and their outcomes
- Risk scores of institute's candidates
- Certification verification status

#### Trainee Dashboard
- Profile and course enrollment status
- Certification status and verification
- Employment status and verification
- Personal risk score and explanation
- Recommended job listings
- Applied jobs and their status
- Upcoming follow-ups

#### Employer Dashboard
- Posted job listings and their status
- Applications received and their status
- Matched candidates for each job
- Interview scheduling (simplified)
- Offer extension tracking

## 2. User Experience Features
- Responsive design for mobile and tablet access
- Intuitive navigation with role-specific menus
- Form validation with real-time feedback
- Loading states and skeleton screens
- Success/error notifications
- Confirmation dialogs for destructive actions
- Help tooltips for complex fields
- Print-friendly views for reports
- Dark/light mode preference (via Tailwind)

## 3. Technical Features
- RESTful API with comprehensive OpenAPI documentation
- Automatic API validation via Pydantic models
- Database migrations with Alembic
- Password security using bcrypt hashing
- JWT authentication with refresh token rotation
- CORS configuration for frontend-backend communication
- Environment-based configuration management
- Structured logging for debugging and audit
- Input sanitization to prevent injection attacks
- Rate limiting on authentication endpoints (basic)
- Health check endpoint for monitoring
- Test coverage for critical backend functions
- Frontend linting and formatting (ESLint, Prettier)
- Type safety throughout frontend and backend

## 4. Features Deferred for Future Versions
- Real-time notifications via WebSockets
- Mobile application (React Native)
- Advanced ML explanations (SHAP values, individual conditional expectation)
- Integration with external identity providers (OAuth, SSO)
- Biometric verification for high-security scenarios
- Workflow automation engine for conditional triggers
- Multi-language support beyond English/Hindi
- Advanced analytics with predictive forecasting
- Role delegation and proxy access
- Data export in multiple formats (CSV, Excel, PDF)
- Scheduled automated reports
- Consent management granularity (purpose-specific)
- Blockchain-based credential anchoring
- AI chatbot for user assistance