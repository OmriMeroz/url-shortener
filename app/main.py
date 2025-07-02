from fastapi import FastAPI, HTTPException, Request # type: ignore
from fastapi.templating import Jinja2Templates # type: ignore
from fastapi.staticfiles import StaticFiles # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from app.db import collection
from pymongo.errors import PyMongoError
from fastapi.responses import RedirectResponse # type: ignore
from pydantic import BaseModel, HttpUrl # type: ignore
import random, string, traceback
from datetime import datetime
from app.models import UserSignup, UserLogin
from app.jwt import create_access_token
from app.utils import hash_password, verify_password
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
import os



app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class URLRequest(BaseModel):
    original_url: HttpUrl

    def dict(self, *args, **kwargs):
        d = super().dict(*args, **kwargs)
        d['original_url'] = str(d['original_url'])
        return d
    
async def generate_unique_short_id(length: int = 6) -> str:
    while True:
        short_id = generate_short_id(length)
        if not await collection.find_one({"short_id": short_id}):
            return short_id

def generate_short_id(length: int = 6) -> str:
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return {"email": email}
    except (JWTError, ValidationError):
        raise credentials_exception
    
@app.post("/shorten")
async def shorten_url(
    url: URLRequest,
    current_user: dict = Depends(get_current_user)
):
    short_id = await generate_unique_short_id()
    doc = {
        "original_url": str(url.original_url),
        "short_id": short_id,
        "created_at": datetime.utcnow(),
        "owner": current_user["email"]
    }
    await collection.insert_one(doc)
    return {"short_url": f"http://localhost:8000/{short_id}"}


@app.get("/{short_id}")
async def redirect_url(short_id: str):
    try:
        doc = await collection.find_one({"short_id": short_id})
        if not doc:
            raise HTTPException(status_code=404, detail="URL not found")
        
        # עדכון שימוש
        await collection.update_one(
            {"short_id": short_id},
            {
                "$set": {"last_used_at": datetime.utcnow()},
                "$inc": {"clicks": 1}
            }
        )

        return RedirectResponse(url=doc["original_url"])
    
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unhandled error: {str(e)}")

@app.post("/signup")
async def signup(user: UserSignup):
    if await collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed = hash_password(user.password)
    await collection.insert_one({"email": user.email, "password": hashed})
    return {"message": "User created successfully"}

@app.post("/login")
async def login(user: UserLogin):
    db_user = await collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

