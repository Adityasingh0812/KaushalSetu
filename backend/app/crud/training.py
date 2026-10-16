from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List, Tuple

from app.models.training import TrainingProgramme
from app.schemas.training import TrainingProgrammeCreate, TrainingProgrammeUpdate


def get_training_programme_by_id(db: Session, programme_id: int) -> Optional[TrainingProgramme]:
    return db.query(TrainingProgramme).filter(TrainingProgramme.id == programme_id).first()


def get_training_programmes(
    db: Session,
    institute_id: Optional[int] = None,
    search: Optional[str] = None,
    skill: Optional[str] = None,
    status: Optional[List[str]] = None,
    skip: int = 0,
    limit: int = 15,
) -> Tuple[List[TrainingProgramme], int]:
    query = db.query(TrainingProgramme)

    if institute_id is not None:
        query = query.filter(TrainingProgramme.institute_id == institute_id)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                TrainingProgramme.name.ilike(search_term),
                TrainingProgramme.course_or_skill_area.ilike(search_term),
                TrainingProgramme.training_provider.ilike(search_term),
            )
        )

    if skill:
        skill_term = f"%{skill.strip()}%"
        query = query.filter(TrainingProgramme.course_or_skill_area.ilike(skill_term))

    if status:
        query = query.filter(TrainingProgramme.status.in_(status))

    total = query.count()
    items = query.order_by(TrainingProgramme.id.asc()).offset(skip).limit(limit).all()
    return items, total


def create_training_programme(db: Session, training_in: TrainingProgrammeCreate) -> TrainingProgramme:
    db_training = TrainingProgramme(**training_in.model_dump())
    db.add(db_training)
    db.commit()
    db.refresh(db_training)
    return db_training


def update_training_programme(
    db: Session, programme_id: int, training_in: TrainingProgrammeUpdate
) -> Optional[TrainingProgramme]:
    db_training = get_training_programme_by_id(db, programme_id)
    if not db_training:
        return None
    update_data = training_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_training, field, value)
    db.add(db_training)
    db.commit()
    db.refresh(db_training)
    return db_training
