from typing import Literal
from pydantic import (
    BaseModel, 
    ConfigDict, 
    EmailStr, 
    Field, 
    PositiveFloat, 
    model_validator,
)
from datetime import datetime, timedelta
from uuid import UUID
from pydantic import PositiveInt
from src.schemas import EvaluationFlag, SessionEnrollmentMethod, SessionInitializationStage
from src.sandbox.schemas import LanguageImagePublicShcema
from typing_extensions import Self


# Session creation schemas
class SessionInitializationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    description: str
    language_image_id: UUID
    session_duration: PositiveInt | None = None
    session_start_time: datetime
    session_end_time: datetime | None = None

    @model_validator(mode="after")
    def validate_session_duration(self) -> Self:
        """Ensure either session duration or session end time is provided."""
        if self.session_duration is None and self.session_end_time is None:
            raise ValueError("Either session duration or session end time must be provided.")
        if self.session_duration is not None and self.session_end_time is not None:
            raise ValueError("Only one of session duration or session end time must be provided.")
        if self.session_duration is not None:
            self.session_end_time = self.session_start_time + timedelta(hours=self.session_duration)

        return self


class SessionCollaborationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    collaboration_enabled: bool
    collaboration_group_size: PositiveInt
    collaboration_group_open: bool


class SessionEnrollmentSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    enrollment_method: SessionEnrollmentMethod
    enrollment_link_ttl: PositiveInt = Field(
        default=30,
        description="The time to live of the enrollment link in minutes.",
    )
    invitation_list: list[str] | None = Field(
        default=None,
        description="The matriculation number of the students to invite to the session.",
    )

    @model_validator(mode="after")
    def validate_enrollment_method(self) -> Self:
        """Ensure that the enrollment method is valid."""

        if self.enrollment_method == SessionEnrollmentMethod.manual_invite:
            if self.invitation_list is None:
                raise ValueError("invitation_list must be provided when enrollment method is manual invite.")

        return self


class SessionResourceConfigurationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    max_queue_size: PositiveInt = Field(
        default=15,
        description="The maximum number of tasks allowed for a students to submit at a time.",
    )
    max_number_of_runs: PositiveInt = Field(
        default=10,
        description="The maximum number of tasks allowed for a students to run in a session.",
    )
    wall_time_limit: PositiveInt = Field(
        default=10,
        description="The maximum number of seconds allowed for a student to run a program.",
    )
    cpu_time_limit: PositiveInt = Field(
        default=10,
        description="The maximum number of CPU seconds allowed for a student to run a program.",
    )
    memory_limit: PositiveInt = Field(
        default=1024 * 1024 * 10,
        description="The maximum number of KB allowed for a student to use for their program.",
    )
    max_processes_and_or_threads: PositiveInt = Field(
        default=10,
        description="The maximum number of processes or threads allowed for a student program to create.",
    )
    enable_network: bool = Field(
        default=False,
        description="Whether to allow network access for a student program.",
    )


class SessionCreationDetailSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str | None = None
    description: str | None = None
    language_image: LanguageImagePublicShcema | None = None
    duration: PositiveInt | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    collaboration_enabled: bool | None = None
    collaboration_group_size: PositiveInt | None = None
    collaboration_group_open: bool | None = None
    enrollment_method: SessionEnrollmentMethod | None = None
    enrollment_link_ttl: PositiveInt | None = None
    exercises: list['ExercisePublicSchema'] | None = None
    configuration: SessionResourceConfigurationSchema | None = None


class SessionCreationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    stage: SessionInitializationStage
    session_details: SessionCreationDetailSchema | None = None


class SessionContentConfigurationSchema(BaseModel):

    model_config = ConfigDict(from_attributes=True)
    exercises: list['ExerciseCreationSchema'] = Field(min_items=1)

    @model_validator(mode="after")
    def validate_score_percentage(self) -> Self:
        """Ensure that the score percentage distribution is valid."""
        total_score_percentage = sum(
            exercise.score_percentage for exercise in self.exercises
        )
        if int(total_score_percentage) != 100:
            raise ValueError(
                "Score percentage distribution for all exercises must sum to 100%."
                "Please check the score percentages of the exercises."
            )

        return self


class EvaluationFlagCreationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    flag: EvaluationFlag | str
    visible: bool
    score_percentage: PositiveFloat = Field(ge=0, le=100, default=100)


class TestCaseCreationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    title: str
    visible: bool
    test_input: str | None
    expected_output: str
    score_percentage: PositiveFloat = Field(ge=0, le=100, default=100)


class ExerciseCreationSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    question: str 
    instructions: str
    score_percentage: PositiveFloat = Field(ge=0, le=100, default=100)
    test_cases: list[TestCaseCreationSchema]
    evaluation_flags: list[EvaluationFlagCreationSchema]

    @model_validator(mode="after")
    def validate_evaluation_flags(self) -> Self:
        """Ensure that at least one evaluation flag or test case is provided."""

        if not self.evaluation_flags and not self.test_cases:
            raise ValueError(
                "At least one evaluation flag or test case must be provided."
            )

        return self

    @model_validator(mode="after")
    def validate_score_percentage(self) -> Self:
        """Ensure that the score percentage distribution is valid."""
        total_score_percentage = (
            sum(flag.score_percentage for flag in self.evaluation_flags) 
            + sum(test_case.score_percentage for test_case in self.test_cases)
        )

        if int(total_score_percentage) != 100:
            raise ValueError(
                "Score percentage distribution for an exercise must sum to 100%. "
                "Please check the score percentages of the evaluation flags and test cases."
            )

        return self


class ExercisePublicSchema(ExerciseCreationSchema):
    model_config = ConfigDict(from_attributes=True)
    id: UUID


class TestCasePublicSchema(TestCaseCreationSchema):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    exercise_id: UUID


class EvaluationFlagPublicSchema(EvaluationFlagCreationSchema):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    exercise_id: UUID

