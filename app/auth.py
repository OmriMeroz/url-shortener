from passlib.context import CryptContext
from fastapi import HTTPException
from app.db import db  # או collection, תלוי איך בנית את הגישה שלך
from pymongo.errors import DuplicateKeyError
from models.user import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users_collection = db["users"]

async def create_user(user: UserCreate):
    hashed_password = pwd_context.hash(user.password)
    user_data = {"email": user.email, "password": hashed_password}

    try:
        await users_collection.insert_one(user_data)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User already exists")

async def verify_user(email: str, password: str):
    user = await users_collection.find_one({"email": email})
    if not user or not pwd_context.verify(password, user["password"]):
        return None
    return user
