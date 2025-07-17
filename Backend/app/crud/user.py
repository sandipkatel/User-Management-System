# User CRUD operations
from typing import Any, Dict, Optional, Union
import secrets
import string
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user_in: UserCreate) -> User:
    db_user = User(
        email=user_in.email,
        # username=user_in.username,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        is_superuser=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(
    db: Session, 
    db_user: User, 
    user_in: Union[UserUpdate, Dict[str, Any]]
) -> User:
    user_data = user_in.dict(exclude_unset=True) if isinstance(user_in, UserUpdate) else user_in
    
    if "password" in user_data and user_data["password"]:
        hashed_password = get_password_hash(user_data["password"])
        del user_data["password"]
        user_data["hashed_password"] = hashed_password
        
    for field, value in user_data.items():
        setattr(db_user, field, value)
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_user_details(
    db: Session,
    user_id: int,
    update_data: Dict[str, Any]
) -> Optional[User]:
    """
    Update specific user details without changing password.
    Returns updated user if successful, None if user not found.
    """
    user = get_user(db, user_id)
    if not user:
        return None
    
    # Update user fields
    for field, value in update_data.items():
        if field != "password" and hasattr(user, field):
            setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

def delete_user(db: Session, user_id: int) -> bool:
    """Delete a user from the database by ID."""
    user = get_user(db, user_id)
    if not user:
        return False
    
    db.delete(user)
    db.commit()
    return True

def generate_password_reset_token(db: Session, email: str) -> Optional[str]:
    """
    Generate a password reset token for a user and store it in the database.
    Returns the token if successful, None if user not found.
    
    Note: This assumes the User model has reset_token and reset_token_expires fields.
    If not, you'll need to add these to your User model.
    """
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    # Generate a secure token
    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for _ in range(64))
    
    # Store token and expiration time (24 hours from now)
    user.reset_token = token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
    
    db.add(user)
    db.commit()
    
    return token


def reset_password_with_token(db: Session, token: str, new_password: str) -> bool:
    """
    Reset a user's password using a valid reset token.
    Returns True if successful, False otherwise.
    """
    # Find user with the given token
    user = db.query(User).filter(User.reset_token == token).first()
    
    if not user:
        return False
    
    # Check if token is expired
    if user.reset_token_expires < datetime.utcnow():
        return False
    
    # Update password
    user.hashed_password = get_password_hash(new_password)
    
    # Clear the reset token
    user.reset_token = None
    user.reset_token_expires = None
    
    db.add(user)
    db.commit()
    
    return True


def verify_reset_token(db: Session, token: str) -> Optional[User]:
    """
    Verify if a reset token is valid and not expired.
    Returns the user if valid, None otherwise.
    """
    user = db.query(User).filter(User.reset_token == token).first()
    
    if not user:
        return None
    
    if user.reset_token_expires < datetime.utcnow():
        return None
    
    return user


def change_password(
    db: Session,
    user_id: int,
    current_password: str,
    new_password: str
) -> bool:
    """
    Change a user's password after verifying their current password.
    Returns True if successful, False otherwise.
    """
    user = get_user(db, user_id)
    if not user:
        return False
    
    # Verify current password
    if not verify_password(current_password, user.hashed_password):
        return False
    
    # Update password
    user.hashed_password = get_password_hash(new_password)
    
    db.add(user)
    db.commit()
    
    return True

def is_active(user: User) -> bool:
    return user.is_active


def is_superuser(user: User) -> bool:
    return user.is_superuser