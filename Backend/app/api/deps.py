# Dependencies
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.settings import settings
from app.db.session import get_db
from app.models.token_blacklist import TokenBlacklist

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> models.User:
    """
    Validate access token and return current user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # First check if token is blacklisted
        blacklisted = db.query(TokenBlacklist).filter(
            TokenBlacklist.token == token,
            TokenBlacklist.expires_at > datetime.utcnow()
        ).first()
        
        if blacklisted:
            raise credentials_exception
        
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
        
        if token_data.sub is None:
            raise credentials_exception
            
    except (JWTError, ValidationError):
        raise credentials_exception
        
    user = crud.user.get_user(db, user_id=token_data.sub)
    
    if not user:
        raise credentials_exception
        
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """
    Get current active user
    """
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """
    Get current active superuser
    """
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=403, detail="The user doesn't have enough privileges"
        )
    return current_user