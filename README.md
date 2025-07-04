# 🔗 URL Shortener

A modern, full-stack URL shortening application built with **FastAPI** (backend) and **React** (frontend), featuring user authentication, secure URL shortening, and analytics tracking.

## ✨ Features

### 🔐 Authentication System
- **User Registration** - Secure signup with email validation
- **User Login** - JWT-based authentication
- **Session Management** - Automatic token storage and validation
- **Password Security** - Bcrypt hashing for secure password storage

### 🔗 URL Shortening
- **Unique Short URLs** - 6-character alphanumeric codes
- **User-specific URLs** - Each user can manage their own shortened URLs
- **Click Tracking** - Analytics for URL usage
- **Automatic Redirects** - Seamless redirection to original URLs

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop and mobile
- **React Router** - Smooth navigation between pages
- **Real-time Feedback** - Loading states and error handling
- **Clean Interface** - Modern, intuitive user interface

### 🚀 Technology Stack

#### Backend
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database for data storage
- **Motor** - Async MongoDB driver
- **JWT** - JSON Web Tokens for authentication
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server

#### Frontend
- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

#### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **CORS** - Cross-origin resource sharing

## 🛠️ Installation & Setup

### Prerequisites
- **Docker & Docker Compose**
- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url_shortener
   ```

2. **Start the backend services**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - FastAPI server on port 8000
   - MongoDB database on port 27017

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the frontend development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure

```
url_shortener/
├── app/                    # Backend (FastAPI)
│   ├── main.py            # Main application file
│   ├── models.py          # Pydantic models
│   ├── db.py              # Database configuration
│   ├── jwt.py             # JWT authentication
│   ├── utils.py           # Utility functions
│   ├── auth.py            # Authentication logic
│   ├── user.py            # User management
│   ├── templates/         # HTML templates
│   └── static/            # Static files
├── frontend/              # Frontend (React)
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── pages/         # Page components
│   │   │   ├── Login.tsx  # Login page
│   │   │   └── SignUp.tsx # Registration page
│   │   └── api/           # API utilities
│   ├── package.json       # Dependencies
│   └── vite.config.ts     # Vite configuration
├── docker-compose.yml     # Docker services
├── Dockerfile            # Backend container
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User authentication

### URL Management
- `POST /shorten` - Create shortened URL (requires authentication)
- `GET /{short_id}` - Redirect to original URL

### Request Examples

#### Register a new user
```bash
curl -X POST "http://localhost:8000/signup" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Login
```bash
curl -X POST "http://localhost:8000/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Shorten a URL
```bash
curl -X POST "http://localhost:8000/shorten" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"original_url": "https://example.com/very-long-url"}'
```

## 🎯 Usage Guide

### For Users

1. **Create an Account**
   - Navigate to the Sign Up page
   - Enter your email and password
   - Click "Sign Up"

2. **Login**
   - Go to the Login page
   - Enter your credentials
   - You'll be redirected to the main page

3. **Shorten URLs**
   - Enter a long URL in the input field
   - Click "Shorten"
   - Copy the generated short URL

4. **Use Shortened URLs**
   - Share the short URL with others
   - When accessed, it will redirect to the original URL

### For Developers

#### Environment Variables
```bash
# Backend
MONGO_URL=mongodb://mongo:27017
JWT_SECRET=your-secret-key

# Frontend
VITE_API_URL=http://localhost:8000
```

#### Development Commands
```bash
# Backend
docker-compose up -d          # Start backend services
docker-compose logs app       # View backend logs
docker-compose down           # Stop backend services

# Frontend
npm run dev                   # Start development server
npm run build                 # Build for production
npm run lint                  # Run linter
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for passwords
- **CORS Protection** - Configured for secure cross-origin requests
- **Input Validation** - Pydantic models ensure data integrity
- **Error Handling** - Comprehensive error management

## 📊 Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "hashed_password"
}
```

### Links Collection
```json
{
  "_id": "ObjectId",
  "original_url": "https://example.com/long-url",
  "short_id": "abc123",
  "created_at": "2024-01-01T00:00:00Z",
  "owner": "user@example.com",
  "clicks": 0,
  "last_used_at": "2024-01-01T00:00:00Z"
}
```

## 🚀 Deployment

### Production Setup

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update environment variables**
   ```bash
   # Set production values
   JWT_SECRET=your-production-secret
   MONGO_URL=your-production-mongo-url
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework
- **React** for the powerful frontend library
- **MongoDB** for the flexible database
- **Docker** for containerization

---

**Made with ❤️ using modern web technologies** 