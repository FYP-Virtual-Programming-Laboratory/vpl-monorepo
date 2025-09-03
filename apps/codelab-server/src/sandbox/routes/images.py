from typing import Annotated, Any

from fastapi import APIRouter, Depends, status

from src.models import LanguageImage
from src.sandbox.schemas import LanguageImagePublicShcema
from src.core.schemas import ErrorResponseSchema, APIErrorCodes
from src.sandbox.services import (
    cancel_language_image_delation_service,
    create_new_langauge_image_service,
    delete_language_image_service,
    get_language_image_by_id_service,
    list_language_image_services,
    prune_all_language_images_service,
    prune_langauge_image_service,
    retry_language_image_build_service,
    update_language_image_service,
)

router = APIRouter()


@router.get("/", response_model=list[LanguageImagePublicShcema])
def list_language_images(
    langauge_images: Annotated[
        list[LanguageImage], Depends(list_language_image_services)
    ],
) -> Any:
    """List all language images."""
    return langauge_images


@router.post(
    "/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Build in progress",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.LANGUAGE_IMAGE_BUILD_IN_PROGRESS,
                        "message": "Unable to trigger language build as a build is in progress."
                    }
                }
            }
        }
    }
)
def create_language_image(
    language_image: Annotated[
        LanguageImage, Depends(create_new_langauge_image_service)
    ],
) -> Any:
    """Create a new language image."""
    return language_image


@router.get(
    "/{image_id}/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_404_NOT_FOUND: {
            "description": "Language image not found",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.NOT_FOUND,
                        "message": "Language image not found."
                    }
                }
            }
        }
    }
)
def get_language_image_by_id(
    language_image: Annotated[LanguageImage, Depends(get_language_image_by_id_service)],
) -> Any:
    """Get a language image by its ID."""
    return language_image


@router.patch(
    "/{image_id}/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Forbidden action",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not allowed to update a custom language image you did not create."
                    }
                }
            }
        }
    }
)
def update_language_image(
    language_image: Annotated[LanguageImage, Depends(update_language_image_service)],
) -> Any:
    """Update a language image.."""
    return language_image


@router.delete(
    "/{image_id}/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Forbidden action",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not allowed to delete a custom language image you did not create."
                    }
                }
            }
        }
    }
)
def delete_language_image(
    language_image: Annotated[LanguageImage, Depends(delete_language_image_service)],
) -> Any:
    """Delete a language image."""
    return language_image


@router.post(
    "/{image_id}/cancel-deletion/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_403_FORBIDDEN: {
            "description": "Forbidden action",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not allowed to cancel the deletion of a custom language image you did not create."
                    }
                }
            }
        }
    }
)
async def cancel_langauge_image_deletion(
    language_image: Annotated[
        LanguageImage, Depends(cancel_language_image_delation_service)
    ],
) -> Any:
    """Cancel the deletion of a language image."""
    return language_image


@router.post(
    "/{image_id}/rebuild/",
    response_model=LanguageImagePublicShcema,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "description": "Build in progress",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.LANGUAGE_IMAGE_BUILD_IN_PROGRESS,
                        "message": "Unable to trigger language build as a build is in progress"
                    }
                }
            }
        },
        status.HTTP_403_FORBIDDEN: {
            "description": "Forbidden action",
            "model": ErrorResponseSchema,
            "content": {
                "application/json": {
                    "example": {
                        "error_code": APIErrorCodes.FORBIDDEN,
                        "message": "You are not allowed to retry building a custom language image you did not create."
                    }
                }
            }
        }
    }
)
def retry_language_build(
    language_image: Annotated[
        LanguageImage, Depends(retry_language_image_build_service)
    ],
) -> Any:
    """Retry building a language image."""
    return language_image


@router.post("/{image_id}/prune/", response_model=LanguageImagePublicShcema)
def prune_langauge_image(
    language_image: Annotated[LanguageImage, Depends(prune_langauge_image_service)],
) -> Any:
    """Prune a language image."""
    return language_image


@router.delete("/")
def prune_all_language_images(
    _: Annotated[None, Depends(prune_all_language_images_service)],
) -> Any:
    """Prune all language images."""
    return {"message": "Scheduled all language images for pruning."}
