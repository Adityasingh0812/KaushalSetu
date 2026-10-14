from datetime import datetime, timedelta
from typing import Any, Union, Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.core.config import settings

# Password hashing using bcrypt directly
def get_password_hash(password: str) -> str:
    # bcrypt.gensalt() returns bytes, bcrypt.hashpw expects bytes
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# JWT token handling
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependency to get current user from token
security = HTTPBearer()

async def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Role-based dependencies
def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_gov_admin(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != "gov_admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_institute_officer(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != "institute_officer":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_trainee(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != "trainee":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

def get_current_employer(current_user: User = Depends(get_current_active_user)) -> User:
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

# Function to create demo accounts (called separately)
def create_demo_accounts(db: Session):
    from app.models.user import User as UserModel
    for account in settings.DEMO_ACCOUNTS:
        existing = db.query(UserModel).filter(UserModel.email == account["email"]).first()
        if not existing:
            hashed_password = get_password_hash(account["password"])
            user = UserModel(
                email=account["email"],
                hashed_password=hashed_password,
                full_name=account["full_name"],
                role=account["role"],
                is_active=True,
            )
            db.add(user)
    db.commit()
