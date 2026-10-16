from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict
from typing import Optional, List, Any
from datetime import date, datetime
from app.models.training import TrainingStatus


class TrainingProgrammeBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    course_or_skill_area: str = Field(..., max_length=255)
    training_provider: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    start_date: date
    end_date: date
    status: Optional[TrainingStatus] = None

    @field_validator("end_date")
    @classmethod
    def end_date_after_start_date(cls, v, info):
        if hasattr(info, 'data') and 'start_date' in info.data:
            start_date = info.data['start_date']
            if v < start_date:
                raise ValueError("end_date must be after start_date")
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be after start_date")
        return self


class TrainingProgrammeCreate(TrainingProgrammeBase):
    pass


class TrainingProgrammeUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    course_or_skill_area: Optional[str] = Field(None, max_length=255)
    training_provider: Optional[str] = Field(None, max_length=255)
    location: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[TrainingStatus] = None

    @model_validator(mode="after")
    def validate_dates_if_both_present(self):
        # Only validate if both dates are provided in the update
        if self.start_date is not None and self.end_date is not None:
            if self.end_date < self.start_date:
                raise ValueError("end_date must be after start_date")
        return self


class TrainingProgrammeRead(TrainingProgrammeBase):
    id: int
    institute_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrainingProgrammeListItem(BaseModel):
    id: int
    name: str
    course_or_skill_area: str
    training_provider: Optional[str] = None
    location: Optional[str] = None
    start_date: date
    end_date: date
    status: TrainingStatus
    institute_id: Optional[int] = None
    institute_name: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_from_orm(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return data
        institute = getattr(data, "institute", None)
        return {
            "id": getattr(data, "id", None),
            "name": getattr(data, "name", ""),
            "course_or_skill_area": getattr(data, "course_or_skill_area", ""),
            "training_provider": getattr(data, "training_provider", None),
            "location": getattr(data, "location", None),
            "start_date": getattr(data, "start_date", None),
            "end_date": getattr(data, "end_date", None),
            "status": getattr(data, "status", None),
            "institute_id": getattr(data, "institute_id", None),
            "institute_name": getattr(institute, "name", None) if institute else None,
            "created_at": getattr(data, "created_at", None),
        }


class PaginatedTrainingProgrammesResponse(BaseModel):
    items: List[TrainingProgrammeListItem]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = ConfigDict(from_attributes=True)
