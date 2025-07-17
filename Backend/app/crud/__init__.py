from app.crud.user import (
    get_user,
    get_user_by_email,
    # get_user_by_username,
    get_users,
    create_user,
    update_user,
    authenticate_user,
    is_active,
    is_superuser
)

# Create a user module for easier imports
from app.crud import user

# Add any other crud modules here