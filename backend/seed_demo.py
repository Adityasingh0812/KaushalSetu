from app.db.session import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.core.security import get_password_hash

# Create tables (if not exist)
Base.metadata.create_all(bind=engine)

db = SessionLocal()
try:
    # Demo accounts data
    demo_accounts = [
        {
            "email": "govadmin@example.com",
            "password": "GovAdmin123!",
            "full_name": "Government Administrator",
            "role": UserRole.gov_admin,
        },
        {
            "email": "institute@example.com",
            "password": "Institute123!",
            "full_name": "Institute Officer",
            "role": UserRole.institute_officer,
        },
        {
            "email": "trainee@example.com",
            "password": "Trainee123!",
            "full_name": "Demo Trainee",
            "role": UserRole.trainee,
        },
        {
            "email": "employer@example.com",
            "password": "Employer123!",
            "full_name": "Demo Employer",
            "role": UserRole.employer,
        },
    ]

    for account in demo_accounts:
        existing = db.query(User).filter(User.email == account["email"]).first()
        if not existing:
            hashed_password = get_password_hash(account["password"])
            user = User(
                email=account["email"],
                hashed_password=hashed_password,
                full_name=account["full_name"],
                role=account["role"],
                is_active=True,
            )
            db.add(user)
    db.commit()
    print("Demo accounts seeded successfully.")
finally:
    db.close()
