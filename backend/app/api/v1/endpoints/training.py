from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, Optional, List

from app.db.session import SessionLocal
from app.schemas.training import (
    TrainingProgrammeRead,
    TrainingProgrammeCreate,
    TrainingProgrammeUpdate,
    TrainingProgrammeListItem,
    PaginatedTrainingProgrammesResponse,
)
from app.crud import training as training_crud
from app.core.security import get_current_active_user
from app.models.user import User, UserRole
from app.models.training import TrainingProgramme, TrainingStatus

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _filter_programmes_by_user_role(db: Session, query, current_user: User):
    """Apply role-based filtering to exclude draft programmes for non-admin users."""
    if current_user.role == UserRole.gov_admin:
        # Gov admin can see all programmes
        return query
    elif current_user.role == UserRole.institute_officer:
        if not current_user.institute_id:
            # Officer without institute - no access
            return query.filter(False)  # No results
        # Officer can see all statuses within their institute
        return query.filter(TrainingProgramme.institute_id == current_user.institute_id)
    else:
        # Trainee and employer - only see active, completed, cancelled programmes
        return query.filter(
            TrainingProgramme.status.in_([
                TrainingStatus.active,
                TrainingStatus.completed,
                TrainingStatus.cancelled
            ])
        )


@router.get("", response_model=PaginatedTrainingProgrammesResponse)
def list_training_programmes(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=50, description="Page size (max 50)"),
    search: Optional[str] = Query(None, max_length=100, description="Search programme name or provider"),
    skill: Optional[str] = Query(None, max_length=100, description="Filter by course/skill area"),
    institute_id: Optional[int] = Query(None, description="Institute filter (gov_admin only)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    List training programmes with pagination and filtering.
    - gov_admin: can list across institutes or filter by institute_id.
    - institute_officer: can list only programmes from their assigned institute (all statuses).
    - trainee and employer: can list only active, completed, cancelled programmes.
    """
    if current_user.role == UserRole.gov_admin:
        scoped_institute_id = institute_id
    elif current_user.role == UserRole.institute_officer:
        if not current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Institute officer is not assigned to any institute",
            )
        scoped_institute_id = current_user.institute_id
    else:
        # trainee and employer can view all programmes (but will be filtered by status below)
        scoped_institute_id = None

    query = db.query(TrainingProgramme)

    if institute_id is not None and current_user.role == UserRole.gov_admin:
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

    # Apply role-based filtering (excludes drafts for trainees/employers)
    query = _filter_programmes_by_user_role(db, query, current_user)

    total = query.count()
    items = query.order_by(TrainingProgramme.id.asc()).offset((page - 1) * page_size).limit(page_size).all()
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedTrainingProgrammesResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/{programme_id}", response_model=TrainingProgrammeRead)
def get_training_programme(
    programme_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve training programme detail.
    - gov_admin: may view programmes across institutes.
    - institute_officer: may view only programmes belonging to their assigned institute.
    - trainee and employer: may view published programmes only (active, completed, cancelled).
    """
    programme = db.query(TrainingProgramme).filter(TrainingProgramme.id == programme_id).first()
    if not programme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training programme not found",
        )

    # Authorization checks
    if current_user.role == UserRole.gov_admin:
        # Gov admin can view any programme
        pass
    elif current_user.role == UserRole.institute_officer:
        if not current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Institute officer is not assigned to any institute",
            )
        if programme.institute_id != current_user.institute_id:
            # Use 404 to avoid disclosing existence of cross-institute programmes
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Training programme not found",
            )
    else:
        # Trainee and employer - can only view active, completed, cancelled programmes
        if programme.status == TrainingStatus.draft:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Training programme not found",
            )

    return programme


@router.post("", response_model=TrainingProgrammeRead, status_code=status.HTTP_201_CREATED)
def create_training_programme(
    training_in: TrainingProgrammeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Create a new training programme.
    - gov_admin: can create programmes for any institute or without institute.
    - institute_officer: can create programmes only for their assigned institute.
    - trainee and employer: not authorized (403).
    """
    if current_user.role == UserRole.employer or current_user.role == UserRole.trainee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrative roles can create training programmes",
        )

    # Prepare the training data
    training_data = training_in.model_dump()
    
    # For institute officers, enforce that the programme belongs to their institute
    if current_user.role == UserRole.institute_officer:
        if not current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Institute officer is not assigned to any institute",
            )
        training_data["institute_id"] = current_user.institute_id
    # gov_admin can optionally specify institute_id or leave it None (already in training_data)

    # Remove institute_id if it's None to use model default
    if training_data.get("institute_id") is None:
        training_data.pop("institute_id", None)
    
    training_create = TrainingProgrammeCreate(**training_data)
    return training_crud.create_training_programme(db, training_create)


@router.patch("/{programme_id}", response_model=TrainingProgrammeRead)
def update_training_programme(
    programme_id: int,
    training_in: TrainingProgrammeUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update a training programme.
    - gov_admin: can update any programme.
    - institute_officer: can update only programmes from their assigned institute.
    - trainee and employer: not authorized (403).
    """
    if current_user.role == UserRole.employer or current_user.role == UserRole.trainee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrative roles can update training programmes",
        )

    programme = db.query(TrainingProgramme).filter(TrainingProgramme.id == programme_id).first()
    if not programme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Training programme not found",
        )

    # Authorization checks similar to GET endpoint
    if current_user.role == UserRole.gov_admin:
        # Gov admin can update any programme
        pass
    elif current_user.role == UserRole.institute_officer:
        if not current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Institute officer is not assigned to any institute",
            )
        if programme.institute_id != current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this training programme",
            )
    else:
        # Trainee and employer - not authorized to update
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrative roles can update training programmes",
        )

    # Apply updates and validate date combination
    update_data = training_in.model_dump(exclude_unset=True)
    
    # Create a temporary object to validate date combination
    temp_start_date = update_data.get("start_date", programme.start_date)
    temp_end_date = update_data.get("end_date", programme.end_date)
    
    # Validate that end_date is not before start_date
    if temp_end_date < temp_start_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="end_date must be after start_date"
        )

    # Apply the updates
    for field, value in update_data.items():
        setattr(programme, field, value)
    
    db.add(programme)
    db.commit()
    db.refresh(programme)
    return programme
