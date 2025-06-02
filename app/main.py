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

@app.post("/shorten")
async def shorten_url(url: URLRequest):
    try:
        short_id = await generate_unique_short_id()
        doc = {
            "original_url": str(url.original_url),
            "short_id": short_id,
            "created_at": datetime.utcnow(),
            "last_used_at": None,
            "clicks": 0
        }

        await collection.insert_one(doc)
        return {"short_url": f"http://localhost:8000/{short_id}"}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unhandled error: {str(e)}")

from fastapi.responses import RedirectResponse # type: ignore

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
