from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List, Tuple
import json

from app.models.candidate import Candidate
from app.models.user import User
from app.schemas.candidate import CandidateUpdate

def get_candidate_by_user_id(db: Session, user_id: int) -> Optional[Candidate]:
    return db.query(Candidate).filter(Candidate.user_id == user_id).first()

def get_candidate_by_id(db: Session, candidate_id: int) -> Optional[Candidate]:
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

def get_candidates(
    db: Session,
    institute_id: Optional[int] = None,
    search: Optional[str] = None,
    skill: Optional[str] = None,
    location: Optional[str] = None,
    skip: int = 0,
    limit: int = 15,
) -> Tuple[List[Candidate], int]:
    query = db.query(Candidate).join(User, Candidate.user_id == User.id)

    if institute_id is not None:
        query = query.filter(Candidate.institute_id == institute_id)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(search_term),
                User.email.ilike(search_term),
            )
        )

    if skill:
        skill_term = f"%{skill.strip()}%"
        query = query.filter(Candidate.skills.ilike(skill_term))

    if location:
        loc_term = f"%{location.strip()}%"
        query = query.filter(Candidate.preferred_location.ilike(loc_term))

    total = query.count()
    items = query.order_by(Candidate.id.asc()).offset(skip).limit(limit).all()
    return items, total

def create_candidate(db: Session, user_id: int) -> Candidate:
    existing = get_candidate_by_user_id(db, user_id)
    if existing:
        return existing
    db_candidate = Candidate(user_id=user_id)
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate

def update_candidate(db: Session, user_id: int, candidate_in: CandidateUpdate) -> Optional[Candidate]:
    db_candidate = get_candidate_by_user_id(db, user_id)
    if not db_candidate:
        return None
    update_data = candidate_in.model_dump(exclude_unset=True)
    if "skills" in update_data:
        if update_data["skills"] is not None:
            json_skills = json.dumps(update_data["skills"])
            if len(json_skills) > 255:
                raise ValueError("Serialized skills exceed database column limit of 255 characters. Please reduce the number or length of skills.")
            update_data["skills"] = json_skills
        else:
            update_data["skills"] = None
    for field, value in update_data.items():
        setattr(db_candidate, field, value)
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    return db_candidate
