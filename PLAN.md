# KaushalSetu: AI-powered Employment Outcome Tracking System

## 1. Project Overview
KaushalSetu is an institute-level system designed to track and improve employment outcomes for trainees through an integrated workflow: Training → Certification → Employment → Follow-ups → Outcome Verification → Risk Analysis → Intervention → Measured Results.

## 2. Architecture
- **Frontend**: React + Vite + TypeScript + Tailwind CSS (SPA)
- **Backend**: FastAPI (Python) with SQLAlchemy ORM and Alembic for migrations
- **Database**: PostgreSQL
- **ML Integration**: scikit-learn embedded in FastAPI backend (synthetic-data demonstration only, no separate microservice)
- **Authentication**: JWT-based role-based access control with explicit privilege restrictions

## 3. Folder Structure
```
kaushalsetu/
├── frontend/                 # React + Vite + TypeScript + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── services/         # API service layer
│   │   ├── store/            # State management (if using Redux/Zustand, otherwise context)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── candidates.py
│   │   │       ├── training.py
│   │   │       ├── employment.py
│   │   │       ├── followups.py
│   │   │       ├── interventions.py
│   │   │       ├── ml.py
│   │   │       └── dashboard.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── candidate.py
│   │   │   ├── training_provider.py
│   │   │   ├── course.py
│   │   │   ├── enrollment.py
│   │   │   ├── certification.py
│   │   │   ├── employment_record.py
│   │   │   ├── followup.py
│   │   │   ├── intervention.py
│   │   │   ├── job_listing.py
│   │   │   ├── application.py
│   │   │   └── audit_event.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── candidate.py
│   │   │   ├── training.py
│   │   │   ├── employment.py
│   │   │   ├── followup.py
│   │   │   ├── intervention.py
│   │   │   ├── job.py
│   │   │   └── common.py
│   │   ├── crud/
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── candidate.py
│   │   │   ├── training.py
│   │   │   ├── employment.py
│   │   │   ├── followup.py
│   │   │   ├── intervention.py
│   │   │   ├── job.py
│   │   │   └── audit.py
│   │   ├── ml/
│   │   │   ├── __init__.py
│   │   │   ├── risk_model.py      # Explainable employment-risk ML
│   │   │   ├── job_matching.py    # Industry job matching
│   │   │   └── policy_simulator.py # Policy impact simulator (placeholder)
│   │   └── main.py
│   ├── requirements.txt
│   └── alembic/              # Database migrations
│       ├── env.py
│       └── versions/
├── PROJECT_SPEC.md
├── ARCHITECTURE.md
├── FEATURES.md
├── DECISIONS.md
├── TESTING.md
├── AGENTS.md
├── CLAUDE.md
├── README.md
└── .gitignore
```

## 4. Database Entities (Normalized Schema)

### 4.1 Users (Supports all four roles via role column)
- id (UUID, PK)
- email (String, unique)
- hashed_password (String)
- full_name (String)
- role (Enum: gov_admin, institute_officer, trainee, employer)
- phone (String, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)
- is_active (Boolean, default True)

### 4.2 Government Administrators (Extension of Users for role-specific fields)
- user_id (UUID, PK, FK to Users)
- department (String)
- designation (String)
- Created via role='gov_admin' in Users; this table may be optional if no extra fields needed.

### 4.3 Institute / Placement Officers
- user_id (UUID, PK, FK to Users)
- institute_name (String)
- institute_type (String: govt, private, etc.)
- address (Text)
- Created via role='institute_officer'

### 4.4 Trainees / Candidates
- user_id (UUID, PK, FK to Users)
- date_of_birth (Date)
- gender (String, optional)
- education_background (String)
- skills (JSONArray of strings)
- preferred_location (String, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.5 Employers / Industry Partners
- user_id (UUID, PK, FK to Users)
- company_name (String)
- industry_sector (String)
- company_size (String)
- address (Text)
- website (String, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.6 Training Providers (Can be institutes or external)
- id (UUID, PK)
- name (String)
- type (Enum: institute, private_ngov, ngo)
- contact_person_id (UUID, FK to Users, nullable)  # Institute officer if applicable
- address (Text)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.7 Courses
- id (UUID, PK)
- training_provider_id (UUID, FK to TrainingProviders)
- title (String)
- description (Text)
- duration_weeks (Integer)
- certification_offered (String)
- curriculum (Text, nullable)
- fees (Float, nullable)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.8 Enrollments (Trainee -> Course)
- id (UUID, PK)
- candidate_id (UUID, FK to Trainees)
- course_id (UUID, FK to Courses)
- enrollment_date (Timestamp)
- expected_completion_date (Timestamp)
- status (Enum: enrolled, completed, dropped, paused)
- completion_date (Timestamp, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.9 Certifications
- id (UUID, PK)
- enrollment_id (UUID, FK to Enrollments)
- certification_name (String)
- issuing_authority (String)
- issue_date (Timestamp)
- expiry_date (Timestamp, nullable)
- certificate_url (String, nullable)  # Link to verified certificate
- verification_status (Enum: pending, verified, rejected)
- verified_by (UUID, FK to Users, nullable)  # Gov admin or institute officer
- verified_at (Timestamp, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.10 Employment Records
- id (UUID, PK)
- candidate_id (UUID, FK to Trainees)
- employer_id (UUID, FK to Employers)
- job_title (String)
- start_date (Timestamp)
- end_date (Timestamp, nullable)  # Null for current employment
- salary_monthly (Float, nullable)
- salary_currency (String, default 'INR')
- employment_type (Enum: full_time, part_time, contract, internship, apprenticeship)
- is_verified (Boolean, default False)
- verification_method (Enum: self_reported, employer_confirmation, payslip, pf_records, nullable)
- verified_by (UUID, FK to Users, nullable)
- verified_at (Timestamp, nullable)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.11 Salary History (Optional, for tracking changes)
- id (UUID, PK)
- employment_record_id (UUID, FK to EmploymentRecords)
- effective_date (Timestamp)
- salary_monthly (Float)
- salary_currency (String)
- created_at (Timestamp)

### 4.12 Follow-ups
- id (UUID, PK)
- candidate_id (UUID, FK to Trainees)
- followup_date (Timestamp)
- conducted_by (UUID, FK to Users)  # Institute officer or gov admin
- method (Enum: phone, email, in_person, sms)
- employment_status (Enum: employed, unemployed, self_employed, pursuing_education, other)
- notes (Text)
- consent_given (Boolean)  # For data usage
- created_at (Timestamp)

### 4.13 Outcome Evidence & Verification
- id (UUID, PK)
- followup_id (UUID, FK to Followups, nullable)
- employment_record_id (UUID, FK to EmploymentRecords, nullable)
- evidence_type (Enum: payslip, employer_letter, pf_statement, contract, self_declaration)
- evidence_url (String)  # Link to uploaded document
- verified_by (UUID, FK to Users)
- verified_at (Timestamp)
- verification_status (Enum: pending, verified, rejected)
- created_at (Timestamp)

### 4.14 Interventions
- id (UUID, PK)
- candidate_id (UUID, FK to Trainees)
- intervention_type (Enum: reskilling, counseling, job_fair, mentorship, internship_arrangement)
- description (Text)
- started_at (Timestamp)
- ended_at (Timestamp, nullable)
- outcome_impact (String, nullable)  # Descriptive outcome
- created_by (UUID, FK to Users)  # Institute officer or gov admin
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.15 Job Listings (From Employers)
- id (UUID, PK)
- employer_id (UUID, FK to Employers)
- title (String)
- description (Text)
- location (String)
- employment_type (Enum: full_time, part_time, contract, internship, apprenticeship)
- salary_range_min (Float, nullable)
- salary_range_max (Float, nullable)
- required_skills (JSONArray of strings)
- posted_at (Timestamp)
- expires_at (Timestamp)
- is_active (Boolean)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.16 Applications (Trainee -> Job)
- id (UUID, PK)
- candidate_id (UUID, FK to Trainees)
- job_listing_id (UUID, FK to JobListings)
- application_date (Timestamp)
- status (Enum: applied, shortlisted, interviewed, offered, accepted, rejected)
- notes (Text)
- created_at (Timestamp)
- updated_at (Timestamp)

### 4.17 Audit Events (For transparency and compliance)
- id (UUID, PK)
- user_id (UUID, FK to Users, nullable)  # Who performed action
- action_type (String)  # e.g., 'CREATE_EMPLOYMENT_RECORD', 'VERIFY_CERTIFICATION'
- entity_type (String)  # Table name
- entity_id (UUID, nullable)
- changes (JSON)  # Store diff or before/after
- ip_address (String, nullable)
- user_agent (String, nullable)
- timestamp (Timestamp)

## 5. Four User Roles & Permissions

### 5.1 Government Administrator
- View all data (candidates, institutes, employers, outcomes)
- Manage institutes (activate/deactivate)
- Manage employers (verify legitimacy)
- Verify certifications and employment evidence
- Run risk analysis and policy simulations
- View aggregated dashboards and reports
- Export data (anonymized)
- Cannot modify core trainee/employment data directly (only through verification)
- **Note**: Privileges must be explicitly assigned; public registration never grants gov_admin or institute_officer roles

### 5.2 Institute / Placement Officer
- Manage their institute's candidate data
- Enroll candidates in courses
- Upload/view certifications
- Conduct follow-ups and record employment status
- Record interventions
- View candidates from their institute only
- Upload outcome evidence for verification
- Cannot view other institutes' data without permission
- Cannot verify evidence (only gov admin can finalize verification)
- **Note**: Privileges must be explicitly assigned; public registration never grants gov_admin or institute_officer roles

### 5.3 Trainee / Candidate
- View and update own profile
- View available courses and enroll
- View own certifications and employment records
- View and apply to job listings
- Give consent for follow-ups and data usage
- View own risk score and recommended interventions
- Cannot view other candidates' data
- Cannot modify verification status

### 5.4 Employer / Industry Partner
- Register and manage company profile
- Post job listings
- View applications to their job listings
- Update application status (shortlist, interview, offer, etc.)
- Verify employment of candidates (for verification system)
- Cannot view candidate profiles beyond what's in application
- Cannot access analytics or other employers' data

## 6. API Groups

### 6.1 Authentication
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- POST /api/v1/auth/logout
- POST /api/v1/auth/refresh-token

### 6.2 Users (Profile Management)
- GET /api/v1/users/me
- PUT /api/v1/users/me
- GET /api/v1/users/{id} (role-based: gov/admin can view any, institute own officers, etc.)

### 6.3 Candidates
- GET /api/v1/candidates/me (trainee view own)
- PUT /api/v1/candidates/me
- GET /api/v1/candidates (institute officer: filter by institute; gov/admin: all)
- GET /api/v1/candidates/{id} (permission-based)

### 6.4 Training & Courses
- GET /api/v1/courses (public/listing)
- GET /api/v1/courses/{id}
- POST /api/v1/enrollments (candidate enroll)
- PUT /api/v1/enrollments/{id}/complete (institute officer)
- GET /api/v1/enrollments/me (candidate view own enrollments)

### 6.5 Certifications
- GET /api/v1/certifications/me (candidate)
- POST /api/v1/certifications (institute officer upload)
- PUT /api/v1/certifications/{id}/verify (gov/admin)
- GET /api/v1/certifications/{id}/evidence

### 6.6 Employment Records
- GET /api/v1/employment/me (candidate)
- POST /api/v1/employment (candidate self-report)
- PUT /api/v1/employment/{id} (candidate update)
- GET /api/v1/employment (institute officer: filter by institute; gov/admin: all)
- PUT /api/v1/employment/{id}/verify (gov/admin or employer confirmation)
- GET /api/v1/employment/{id}/evidence

### 6.7 Follow-ups
- POST /api/v1/followups (institute officer/gov admin record)
- GET /api/v1/followups (filter by candidate/institute/date)
- PUT /api/v1/followups/{id} (add notes, etc.)

### 6.8 Interventions
- POST /api/v1/interventions (institute officer/gov admin)
- GET /api/v1/interventions (filter by candidate/institute)
- PUT /api/v1/interventions/{id} (update outcome)

### 6.9 Job Listings & Applications
- GET /api/v1/job-listings (public/search)
- POST /api/v1/job-listings (employer create)
- PUT /api/v1/job-listings/{id} (employer update)
- GET /api/v1/applications/me (candidate view own)
- POST /api/v1/applications (candidate apply)
- PUT /api/v1/applications/{id}/status (employer update)

### 6.10 ML & Analytics
- GET /api/v1/ml/risk-score/{candidate_id} (returns explainable risk score)
- GET /api/v1/ml/job-recommendations/{candidate_id}
- GET /api/v1/ml/outcome-prediction/{candidate_id} (placeholder for policy sim)
- GET /api/v1/dashboard/gov (gov/admin aggregated stats)
- GET /api/v1/dashboard/institute (institute officer stats)
- GET /api/v1/dashboard/employer (employer stats)

### 6.12 Consent & Audit
- POST /api/v1/consent (candidate give/revoke consent)
- GET /api/v1/audit/events (gov/admin only, with filters)

## 7. Employment Metrics Definition
- **Employment**: Only counts when `is_verified = True` in EmploymentRecords and evidence status is verified.
- **Unemployment**: Not automatically inferred from missing data. A candidate is considered unemployed only if:
  - They have completed training/certification
  - Have a recent follow-up (within last 3 months) indicating unemployed status
  - And that follow-up has `consent_given = True` and employment status is 'unemployed'
- **Self-reported vs Verified**: Self-reported employment (`is_verified = False`) is stored but not included in official employment metrics until verified.
- **Salary Data**: Only included in aggregates when verified via payslip, PF records, or employer confirmation.
- **Underemployment**: Can be derived from salary thresholds vs qualification (future enhancement).

## 8. Synthetic Dataset & Repeatable Seed Process
- **Purpose**: For hackathon demo and testing without real personal data.
- **Seed Process**:
  1. Use a fixed random seed (e.g., 42) for reproducibility.
  2. Generate synthetic but realistic data for:
     - 5 institutes
     - 50 trainees per institute (250 total)
     - 20 employers
     - 10 courses
  3. Generate enrollments, certifications (70% completion rate)
  4. Generate employment records for 40% of certified trainees (with varying verification levels)
  5. Generate follow-ups at 1-month, 3-month, 6-month intervals post-completion
  6. Generate interventions for 20% of unemployed or at-risk candidates
  7. Generate job listings and applications
- **Script Location**: `backend/scripts/generate_synthetic_data.py` (to be created)
- **Execution**: `python -m backend.scripts.generate_synthetic_data --seed 42`
- **Output**: Inserts data into PostgreSQL; can be reset with Alembic downgrade/upgrade or separate reset script.

## 9. Phase-by-Phase Implementation Plan (2-3 Day Hackathon Trial)

### Phase 0 (Day 0 Morning): Setup & Foundations
- Initialize git repo, create project structure
- Set up FastAPI with SQLAlchemy, PostgreSQL connection
- Set up React Vite + TypeScript + Tailwind
- Create basic authentication (register/login) with JWT
- Create User model and role-based dependency
- **Goal**: Working auth API and login page

### Phase 1 (Day 0 Afternoon - Day 1 Morning): Core Candidate Lifecycle
- Candidate profile CRUD
- Institute officer can view/manage candidates from their institute
- Course listing and enrollment
- Enrollment completion tracking
- **Goal**: Candidate can register, view courses, enroll; institute officer can see enrolled candidates

### Phase 2 (Day 1 Afternoon): Certification & Employment Tracking
- Certification upload by institute officer
- Employment self-reporting by candidate
- Basic verification workflow (gov/admin can mark as verified)
- Follow-up recording by institute officer
- **Goal**: Candidate can report employment; institute officer can upload certifications and record follow-ups

### Phase 3 (Day 2 Morning): Outcome Integrity & Intervention Workflow
- Outcome evidence upload (payslip, etc.)
- Gov/admin verification of evidence
- Intervention recording and tracking
- Simple risk flag: if no employment after 6 months post-certification -> flag for intervention
- **Goal**: System can verify employment and record interventions

### Phase 4 (Day 2 Afternoon): ML Foundations & Dashboard
- Integrate scikit-learn for:
  - Risk model: Logistic regression on features (course type, demographics, skills, etc.) to predict unemployment risk (explainable via coefficients) - **Clearly labeled as synthetic-data demonstration**
  - Job matching: Cosine similarity between candidate skills and job requirements
- Gov/admin dashboard showing:
  - Overall employment rate (verified)
  - Institute-wise performance
  - Risk distribution
- **Goal**: Working risk scores and job recommendations; dashboard visible
- **Note**: Use held-out evaluation data and report only metrics actually calculated; never claim validated real-world unemployment prediction accuracy

### Phase 5 (Optional, if time): Policy Impact Simulator & Multilingual
- Transparent scenario calculator with adjustable assumptions, estimated costs, ranges where appropriate, and baseline comparison
- **Do not present hypothetical calculations as causal evidence or validated forecasts**
- Basic multilingual support: English/Hindi toggle in frontend (static translations for demo)
- **Goal**: Demonstrate extensibility concepts

## 10. Outstanding Decisions
1. **State Management**: Use React Context or Zustand/Zustand for frontend state? (Decide during implementation)
2. **ML Model Explainability**: Use SHAP or just linear model coefficients? (Linear model for simplicity in hackathon)
3. **File Storage**: Store evidence uploads locally or use cloud? (Local storage for hackathon; note for production)
4. **Real-time Updates**: Use WebSockets for follow-up notifications? (Polling acceptable for hackathon)
5. **Deployment**: Docker compose for local dev? (Include in repo but not required for hackathon demo)

## 11. Files Created/Updated
- BACKED UP: PLAN.md.backup
- UPDATED: PLAN.md (this file)
- CREATED: PROJECT_SPEC.md, ARCHITECTURE.md, FEATURES.md, DECISIONS.md, TESTING.md, AGENTS.md, CLAUDE.md

All supporting documentation is now complete.

Please review this final corrected plan. Once approved, we will proceed with Phase 0 implementation.