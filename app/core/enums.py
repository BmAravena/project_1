from enum import Enum

class RoleEnum(str, Enum):
    ADMIN = "admin"
    STAFF = "staff"
    USER = "user"