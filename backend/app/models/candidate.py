from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date
from app.db.session import Base
from app.models.user import User

if TYPE_CHECKING:
    from app.models.institute import Institute

class Candidate(Base):
    __tablename__ = "candidates"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    institute_id: Mapped[Optional[int]] = mapped_column(ForeignKey("institutes.id"), nullable=True)

    # Optional fields
    date_of_birth: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    education_background: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    # For skills, we'll store as a JSON string. Since we are using SQLite for simplicity? 
    # But the project uses PostgreSQL? We don't know. We'll use a text field to store a JSON array.
    # We'll validate in the schema.
    skills: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # JSON array as string
    preferred_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user: Mapped[User] = relationship("User", lazy="joined")
    institute: Mapped[Optional["Institute"]] = relationship("Institute", back_populates="candidates")

    def __repr__(self):
        return f"<Candidate {self.user_id}>"

