# Image בסיס של פייתון
FROM python:3.11-slim

# תיקיית עבודה בתוך הקונטיינר
WORKDIR /app

# העתקת הקבצים לקונטיינר
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

# הרצת השרת
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
