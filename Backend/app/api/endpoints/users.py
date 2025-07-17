# User management endpoints
from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update current user.
    """
    user = crud.user.update_user(db, db_user=current_user, user_in=user_in)
    return user


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    # Only superusers can access other users' information
    if user.id != current_user.id and not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, 
            detail="Not enough permissions"
        )
        
    return user

@router.put("/{user_id}", response_model=schemas.User)
def update_user_by_id(
    *,
    user_id: int,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Update a specific user by id.
    Only superusers can update other users' information.
    """
    if user_id != current_user.id and not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update this user"
        )
    
    # Convert Pydantic model to dict for update_user_details
    update_data = user_in.dict(exclude_unset=True)
    
    user = crud.user.update_user_details(db, user_id=user_id, update_data=update_data)
    
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return user

@router.get("/", response_model=List[schemas.User])
def read_all_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve all users.
    Only accessible by superusers.
    """
    # Explicitly check if the user is a superuser
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Only superusers can access this endpoint."
        )
    
    users = crud.user.get_users(db, skip=skip, limit=limit)
    print(users)
    return users

@router.delete("/{user_id}")
def delete_user_by_id(
    *,
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Delete a specific user by id.
    Only superusers can delete users, and users cannot delete themselves.
    """
    # Check if user exists
    user = crud.user.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Check permissions - only superusers can delete users
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to delete users"
        )
    
    # Prevent superusers from deleting themselves
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Users cannot delete their own account"
        )
    
    # Delete the user
    success = crud.user.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(
            status_code=500,
            detail="Failed to delete user"
        )
    
    return {"message": f"User {user_id} deleted successfully"}