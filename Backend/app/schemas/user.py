# Pydentic user schemas
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    full_name: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=8)


# Properties to return via API
class User(UserBase):
    id: int
    is_superuser: bool
    created_at: datetime
    
    class Config:
        orm_mode = True


# Token schema
class Token(BaseModel):
    access_token: str
    token_type: str


# Token payload
class TokenPayload(BaseModel):
    sub: Optional[int] = None


# Login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str