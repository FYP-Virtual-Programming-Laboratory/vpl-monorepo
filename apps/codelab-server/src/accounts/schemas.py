from typing import Self
from uuid import UUID
from pydantic import EmailStr, BaseModel, model_validator, ConfigDict
from datetime import datetime


class CreateAdminSchema(BaseModel):
    first_name: str
    last_name: str
    password: str
    email: EmailStr


class UpdateAdminSchema(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    old_password: str | None = None
    new_password: str | None = None

    @model_validator(mode="after")
    def validate_password_update(self) -> Self:
        """Ensure that either the old password and the new password are provided or neither."""
        if self.old_password and not self.new_password:
            raise ValueError("New password is required when old password is provided.")

        if not self.old_password and self.new_password:
            raise ValueError("Old password is required when new password is provided.")

        return self


class AdminProfileSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    last_login: datetime | None



class AdminPublicSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    is_active: bool
    created_at: datetime
    updated_at: datetime | None


class AdminDashboardSchema(BaseModel):
    total_sessions: int
    total_active_sessions: int
    total_students: int
    submitted_assignments: int


class AdminLoginSchema(BaseModel):
    email: EmailStr
    password: str


class AdminLoginResponseSchema(BaseModel):
    token: str
    profile: AdminProfileSchema


class StudentProfileSchema(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    matric_number: str
    last_login: datetime | None


class StudentLoginSchema(BaseModel):
    matric_no: str
    password: str


class StudentLoginResponseSchema(BaseModel):
    token: str
    profile: StudentProfileSchema

