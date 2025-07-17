# Token blacklist model
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.session import Base


class TokenBlacklist(Base):
    __tablename__ = "blacklist_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Add expiry date if clean up old entries is required
    expires_at = Column(DateTime(timezone=True))