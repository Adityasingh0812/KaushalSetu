from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict
from typing import Optional, List, Any
from datetime import date, datetime
import json

def parse_skills_helper(v: Any) -> Optional[List[str]]:
    if v is None:
        return None
    if isinstance(v, list):
        result = []
        for item in v:
            if isinstance(item, str):
                trimmed = item.strip()
                if trimmed:
                    result.append(trimmed)
            elif item is not None:
                result.append(str(item).strip())
        return result
    if isinstance(v, str):
        trimmed_str = v.strip()
        if not trimmed_str:
            return []
        try:
            parsed = json.loads(trimmed_str)
            if isinstance(parsed, list):
                result = []
                for item in parsed:
                    if isinstance(item, str):
                        t = item.strip()
                        if t:
                            result.append(t)
                    elif item is not None:
                        result.append(str(item).strip())
                return result
            elif isinstance(parsed, str):
                return [parsed.strip()] if parsed.strip() else []
        except (json.JSONDecodeError, ValueError):
            parts = [s.strip() for s in trimmed_str.split(",") if s.strip()]
            return parts if parts else [trimmed_str]
    return []

class CandidateBase(BaseModel):
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, max_length=50)
    education_background: Optional[str] = Field(None, max_length=255)
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = Field(None, max_length=255)

    @field_validator("skills", mode="before")
    @classmethod
    def validate_skills(cls, v: Any) -> Optional[List[str]]:
        return parse_skills_helper(v)

class CandidateRead(CandidateBase):
    id: int
    user_id: int
    institute_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class CandidateUpdate(CandidateBase):
    pass

class CandidateListItem(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    education_background: Optional[str] = None
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = None
    institute_id: Optional[int] = None
    institute_name: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_from_orm(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return data
        user = getattr(data, "user", None)
        inst = getattr(data, "institute", None)
        return {
            "id": getattr(data, "id", None),
            "user_id": getattr(data, "user_id", None),
            "full_name": getattr(user, "full_name", "") if user else "",
            "email": getattr(user, "email", "") if user else "",
            "phone": getattr(user, "phone", None) if user else None,
            "education_background": getattr(data, "education_background", None),
            "skills": parse_skills_helper(getattr(data, "skills", None)),
            "preferred_location": getattr(data, "preferred_location", None),
            "institute_id": getattr(data, "institute_id", None),
            "institute_name": getattr(inst, "name", None) if inst else None,
            "created_at": getattr(data, "created_at", None),
        }

class PaginatedCandidatesResponse(BaseModel):
    items: List[CandidateListItem]
    total: int
    page: int
    page_size: int
    total_pages: int

class CandidateDetail(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    education_background: Optional[str] = None
    skills: Optional[List[str]] = None
    preferred_location: Optional[str] = None
    institute_id: Optional[int] = None
    institute_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_from_orm(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return data
        user = getattr(data, "user", None)
        inst = getattr(data, "institute", None)
        return {
            "id": getattr(data, "id", None),
            "user_id": getattr(data, "user_id", None),
            "full_name": getattr(user, "full_name", "") if user else "",
            "email": getattr(user, "email", "") if user else "",
            "phone": getattr(user, "phone", None) if user else None,
            "date_of_birth": getattr(data, "date_of_birth", None),
            "gender": getattr(data, "gender", None),
            "education_background": getattr(data, "education_background", None),
            "skills": parse_skills_helper(getattr(data, "skills", None)),
            "preferred_location": getattr(data, "preferred_location", None),
            "institute_id": getattr(data, "institute_id", None),
            "institute_name": getattr(inst, "name", None) if inst else None,
            "created_at": getattr(data, "created_at", None),
            "updated_at": getattr(data, "updated_at", None),
        }
