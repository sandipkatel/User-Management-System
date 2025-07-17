# Authentication endpoints
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Response, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app import crud, schemas, models
from app.api import deps
from app.core.security import create_access_token
from app.core.settings import settings
from app.models.token_blacklist import TokenBlacklist

router = APIRouter()


@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate_user(
        db, email=form_data.username, password=form_data.password
    )
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not crud.user.is_active(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    return {
        "access_token": create_access_token(
            subject=user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    token: str = Depends(deps.oauth2_scheme)
) -> dict:
    """
    Logout user by invalidating their token
    """
    token_parts = token.split(".")
    if len(token_parts) == 3:  # Valid JWT format
        blacklisted_token = TokenBlacklist(
            token=token, 
            user_id=current_user.id,
            expires_at=datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        db.add(blacklisted_token)
        db.commit()
    
    return {"message": "Successfully logged out"}

@router.post("/signup", response_model=schemas.User)
def signup(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in
    """
    user = crud.user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )
        
    user = crud.user.create_user(db, user_in=user_in)
    return user