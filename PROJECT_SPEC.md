# KaushalSetu Project Specification

## 1. Purpose
KaushalSetu is an AI-powered Employment Outcome Tracking System designed for institute-level hackathon to improve transparency, accountability, and effectiveness of skill training programs by tracking the full lifecycle from training to employment outcomes.

## 2. Scope
### In Scope
- User management for four roles: Government Administrator, Institute/Placement Officer, Trainee/Candidate, Employer/Industry Partner
- Training provider and course management
- Enrollment and tracking
- Certification management and verification
- Employment recording, verification, and tracking
- Follow-up scheduling and recording
- Intervention tracking
- Job listing and application management
- Outcome integrity engine (verification of employment evidence)
- Intervention-to-outcome loop tracking
- Explainable employment-risk machine learning model
- Industry job matching (skills-based)
- Policy impact simulator (configurable parameters)
- Multilingual support (English/Hindi) for follow-ups and UI
- Role-based access control
- Audit trail for compliance
- Dashboards for each role showing key metrics

### Out of Scope (for hackathon MVP)
- Full-scale production deployment with cloud storage
- Advanced AI explanations (SHAP, LIME) - using interpretable models
- Real-time notifications via WebSockets
- Integration with external government databases (e.g., PF, NSDC)
- Mobile application (responsive web only)
- Complex workflow automation (e.g., auto-triggered interventions)
- Multi-institute consortium management (single institute focus for demo)

## 3. Success Criteria
- System allows a candidate to complete the lifecycle: profile -> course enrollment -> certification -> employment reporting -> verification -> follow-up
- Government administrator can view verified employment rates across institutes
- Institute officer can record interventions and see impact on employment outcomes
- ML model provides explainable risk scores for candidates
- Job matching suggests relevant opportunities based on skills
- System supports English/Hindi language for follow-up communications
- All personal data access is role-restricted and audited

## 4. Assumptions
- Institutes have designated officers who can upload certifications and record follow-ups
- Candidates have access to smartphones/internet for self-reporting and follow-ups
- Employers are willing to verify employment when requested (for demo, simulated)
- Synthetic data will be used for demonstration to avoid privacy concerns
- Hackathon demo will use a local PostgreSQL instance

## 5. Constraints
- Development time: 2-3 days for hackathon trial
- Technology stack: React/Vite/TypeScript/Tailwind, FastAPI, PostgreSQL, SQLAlchemy, scikit-learn
- Must respect data privacy principles (consent, minimization, purpose limitation)
- Must be deployable on a single machine for demonstration

## 6. Acceptance Criteria
### Functional
1. User can register and login with appropriate role
2. Institute officer can create/update training providers and courses
3. Candidate can browse courses and enroll
4. Institute officer can mark enrollment as completed and upload certification
5. Candidate can self-report employment details
6. Government administrator can verify employment using evidence
7. Institute officer can schedule and record follow-ups with language preference
8. System flags candidates at risk of unemployment based on ML model
9. Employer can post job listings and manage applications
10. Candidate can apply to jobs and see recommendations
11. Role-based dashboards show relevant metrics
12. Audit log records all significant actions

### Non-functional
1. Page load time < 3 seconds for main views
2. API response time < 500ms for 95% of requests
3. System handles 100 concurrent users during demo
4. All role-based access controls enforce restrictions
5. Passwords are hashed using bcrypt
6. No PII is exposed without proper authorization