from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Any, Optional

from app.db.session import SessionLocal
from app.schemas.candidate import (
    CandidateRead,
    CandidateUpdate,
    CandidateListItem,
    PaginatedCandidatesResponse,
    CandidateDetail,
)
from app.crud import candidate as candidate_crud
from app.core.security import get_current_active_user
from app.models.user import User, UserRole

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/me", response_model=CandidateRead)
def read_candidate_me(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Get the candidate profile for the authenticated trainee.
    Only trainees can access this endpoint.
    """
    if current_user.role != UserRole.trainee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only trainees can access candidate profile",
        )
    candidate = candidate_crud.get_candidate_by_user_id(db, current_user.id)
    if not candidate:
        candidate = candidate_crud.create_candidate(db, current_user.id)
    return candidate

@router.put("/me", response_model=CandidateRead)
def update_candidate_me(
    candidate_in: CandidateUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Update the candidate profile for the authenticated trainee.
    Only trainees can access this endpoint.
    """
    if current_user.role != UserRole.trainee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only trainees can access candidate profile",
        )
    candidate = candidate_crud.get_candidate_by_user_id(db, current_user.id)
    if not candidate:
        candidate = candidate_crud.create_candidate(db, current_user.id)
    try:
        updated_candidate = candidate_crud.update_candidate(db, current_user.id, candidate_in)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    return updated_candidate

@router.get("", response_model=PaginatedCandidatesResponse)
def list_candidates(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(15, ge=1, le=50, description="Page size (max 50)"),
    search: Optional[str] = Query(None, max_length=100, description="Search candidate name or email"),
    skills: Optional[str] = Query(None, max_length=100, description="Filter by skill"),
    location: Optional[str] = Query(None, max_length=100, description="Filter by location"),
    institute_id: Optional[int] = Query(None, description="Institute filter (gov_admin only)"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    List candidates with pagination and filtering.
    - gov_admin: can list across institutes or filter by institute_id.
    - institute_officer: can list only candidates from their assigned institute.
    - trainee and employer: denied directory access (403).
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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access candidate directory",
        )

    skip = (page - 1) * page_size
    items, total = candidate_crud.get_candidates(
        db,
        institute_id=scoped_institute_id,
        search=search,
        skill=skills,
        location=location,
        skip=skip,
        limit=page_size,
    )
    total_pages = (total + page_size - 1) // page_size if total > 0 else 1

    return PaginatedCandidatesResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )

@router.get("/{candidate_id}", response_model=CandidateDetail)
def get_candidate(
    candidate_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> Any:
    """
    Retrieve candidate detail.
    - gov_admin: can access any candidate.
    - institute_officer: can access only candidates from their assigned institute.
    - trainee: can access only their own candidate record.
    - employer: denied by default (403).
    - Returns 404 for nonexistent or cross-institute IDs to prevent information disclosure.
    """
    if current_user.role == UserRole.employer:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employers are not authorized to view this candidate",
        )

    if current_user.role == UserRole.institute_officer and not current_user.institute_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Institute officer is not assigned to any institute",
        )

    candidate = candidate_crud.get_candidate_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    if current_user.role == UserRole.gov_admin:
        pass
    elif current_user.role == UserRole.institute_officer:
        if candidate.institute_id != current_user.institute_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )
    elif current_user.role == UserRole.trainee:
        if candidate.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Candidate not found",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access candidate",
        )

    return candidate
