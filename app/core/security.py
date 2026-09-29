from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# Global instance of PasswordHasher to be used throughout the application
ph = PasswordHasher()


def hash_password(password: str) -> str:
    """Takes a plain text password and returns the secure hash."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies if the entered password matches the stored hash."""
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False


