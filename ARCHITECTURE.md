# KaushalSetu Architecture

## 1. High-Level Architecture
```
+------------------+      +------------------+      +------------------+
|   Frontend SPA   |<---->|   API Gateway    |<---->|   Backend Services|
| (React/Vite/TS)  | HTTPS|  (FastAPI)       | HTTPS|  (Python)        |
+------------------+      +------------------+      +------------------+
                               |                         |
                               |                         |
                    +------------------+        +------------------+
                    |  PostgreSQL DB   |        |  ML Models       |
                    |  (SQLAlchemy)    |        |  (scikit-learn)  |
                    +------------------+        +------------------+
```

## 2. Technology Stack Choices

### Frontend
- **React 18**: Component-based UI library with hooks
- **Vite**: Fast development server and bundler
- **TypeScript**: Static typing for improved developer experience and safety
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.8+
- **SQLAlchemy 2.0**: ORM for database interactions
- **Alembic**: Database migration tool
- **Pydantic**: Data validation and settings management
- **python-jose**: JWT implementation
- **passlib**: Password hashing
- **scikit-learn**: Machine learning library for risk prediction and job matching

### Infrastructure
- **PostgreSQL**: Relational database for structured data
- **Local filesystem**: For storing uploaded evidence files (in hackathon demo)
- **Environment variables**: For configuration (via python-dotenv)

## 3. System Components

### 3.1 API Layer (FastAPI)
- RESTful API design with versioning (/api/v1/)
- Automatic OpenAPI documentation (Swagger UI)
- Dependency injection for database sessions, authentication
- Middleware for CORS, request logging, authentication
- Exception handling for consistent error responses

### 3.2 Data Layer
- SQLAlchemy models representing database entities
- Migration scripts via Alembic for schema evolution
- Repository pattern via CRUD modules separating data access from business logic
- Connection pooling and transaction management

### 3.3 Business Logic Layer
- Service functions in CRUD modules implementing core operations
- Validation logic in Pydantic schemas
- ML inference functions in dedicated ml module
- Audit logging integrated in CRUD operations

### 3.4 ML Components
- **Risk Model**: Logistic regression model predicting probability of unemployment (synthetic-data demonstration only)
  - Features: course type, duration, grades, skills count, demographic features
  - Explainability: Model coefficients show feature impact
  - **Note**: Clearly labeled as synthetic-data demonstration; use held-out evaluation data and report only metrics actually calculated; never claim validated real-world unemployment prediction accuracy
- **Job Matching Model**: TF-IDF vectorizer + cosine similarity
  - Vectorizes skills from candidate profile and job requirements
  - Returns ranked list of job matches
- **Policy Simulator**: Transparent scenario calculator with adjustable assumptions, estimated costs, ranges where appropriate, and baseline comparison
  - **Do not present hypothetical calculations as causal evidence or validated forecasts**
  - Adjust variables like stipend amount, training duration, interview prep
  - Output: predicted change in employment rate

### 3.5 Security
- JWT-based authentication with access and refresh tokens
- Role-based access control via dependencies
- **Public registration never permits self-assigned government-admin or institute-officer privileges**
- Privileged demo accounts explicitly seeded
- Demo authentication clearly identified as demo-only if any shortcuts are used
- Password hashing using bcrypt (via passlib)
- Input validation and sanitization via Pydantic
- Audit trail for sensitive operations
- Environment-based configuration (secrets not in code)
- Enforce role permissions and institute-level data isolation on the backend

### 3.6 Frontend Architecture
- Component-based structure with separation of concerns
- Custom hooks for data fetching and mutations
- Service layer encapsulating API calls
- Protected routes based on user role
- Form validation with React Hook Form or similar
- Responsive design using Tailwind CSS
- Internationalization: English/Hindi toggle (using context or i18next-lite)

## 4. Data Flow Examples

### 4.1 Candidate Enrollment Flow
1. Frontend: Candidate views courses, clicks enroll
2. Frontend: POST /api/v1/enrollments with course_id
3. Backend: Validate enrollment (course exists, candidate not already enrolled)
4. Backend: Create enrollment record, return enrollment ID
5. Frontend: Show success message, update course list

### 4.2 Employment Verification Flow
1. Frontend: Gov/admin views unverified employment records
2. Frontend: Click verify, upload evidence (or select existing)
3. Frontend: PUT /api/v1/employment/{id}/verify with evidence_id and notes
4. Backend: Validate evidence, update employment record verification status
5. Backend: Create audit log entry
6. Frontend: Show verification success

### 4.3 Risk Score Calculation
1. Frontend: Institute officer views candidate dashboard
2. Frontend: GET /api/v1/ml/risk-score/{candidate_id}
3. Backend: Fetch candidate features from DB
4. Backend: Preprocess features (handle missing values, encode)
5. Backend: Run logistic regression model, get probability
6. Backend: Generate explanation (top contributing features)
7. Frontend: Display risk score as percentage and explanation

## 5. Integration Points

### 5.1 Authentication Flow
- Login: POST /auth/login returns access_token and refresh_token
- Frontend stores tokens in memory (or secure httpOnly cookie in prod)
- Each API request includes Authorization: Bearer <access_token>
- Access token expired? Use refresh token to get new pair
- Role checking: Backend verifies user role against required permissions

### 5.2 File Upload Handling
- Evidence uploads: POST to /upload endpoint (to be implemented)
- Files stored in ./uploads/ directory with secure filenames
- File references stored in database (employment_record, certification)
- Virus scanning and size limits in production (omitted for hackathon)

### 5.3 ML Model Serving
- Models loaded at startup (singleton pattern)
- Risk model: pickle file or retrained on startup (for demo, train on synthetic data)
- Job matching: vectorizer fitted on job descriptions and candidate skills
- Inference functions called directly from API endpoints

## 6. Scalability and Performance Considerations
- Database indexing on frequently queried columns (foreign keys, dates)
- Pagination for list endpoints
- Caching of frequently accessed reference data (course list, etc.)
- Asynchronous processing for heavy ML tasks (future: Celery/RabbitMQ)
- Horizontal scaling: Stateless backend allows multiple instances behind load balancer
- Frontend: Code splitting, lazy loading of routes, efficient rendering

## 7. Deployment Diagram (Hackathon Demo)
```
+--------------------------------------------------+
|                Developer Laptop                  |
|                                                  |
|  +------------------+    +------------------+    |
|  |  PostgreSQL DB   |    |  Redis (optional) |    |
|  +------------------+    +------------------+    |
|          ^                       ^               |
|          |                       |               |
|  +------------------+    +------------------+    |
|  |   FastAPI Server |    |  Vite Dev Server |    |
|  +------------------+    +------------------+    |
|          |                       |               |
|  +------------------+    +------------------+    |
|  |  Terminal (API)  |    |  Browser (UI)    |    |
|  +------------------+    +------------------+    |
+--------------------------------------------------+
```

## 8. Design Decisions Rationale
- **FastAPI over Django/Flask**: Automatic OpenAPI, async support, performance
- **PostgreSQL over MongoDB**: Relational data fits schema, strong consistency
- **SQLAlchemy over raw SQL**: ORM productivity, migration support, type safety
- **Scikit-learn over TensorFlow/PyTorch**: Simplicity, interpretability, sufficient for demo
- **React over Vue/Angular**: Team familiarity, ecosystem, flexibility
- **Vite over Create React App**: Faster dev server, native ES modules
- **Tailwind over Bootstrap/CSS-in-JS**: Utility-first speed, consistent styling, no JS overhead
- **JWT over Sessions**: Stateless API suitability, mobile-friendly, simple implementation

## 9. Future Enhancement Pathways
- Microservices architecture separating ML services
- Event-driven architecture using Kafka/RabbitMQ for follow-up triggers
- Advanced ML: Neural networks with attention for explainability
- Biometric verification for high-assurance scenarios
- Blockchain-based credential verification
- Multi-tenant architecture for statewide rollout
- Integration with government employment exchanges