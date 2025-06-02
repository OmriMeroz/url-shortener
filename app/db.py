from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.collection import Collection
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.url_shortener
collection: Collection = db.links
