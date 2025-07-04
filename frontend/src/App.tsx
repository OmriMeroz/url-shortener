import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function HomePage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first to shorten URLs");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Please login again. Your session may have expired.");
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        } else {
          throw new Error("Failed to shorten URL");
        }
        return;
      }

      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (err) {
      console.error(err);
      setError("Error: Could not shorten URL");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShortUrl("");
    setError("");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>URL Shortener</h1>
      
      {!isLoggedIn ? (
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#6c757d", marginBottom: "1rem" }}>
            Please login to shorten URLs
          </p>
          <Link 
            to="/login" 
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "0.75rem 1.5rem",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block"
            }}
          >
            Login
          </Link>
        </div>
      ) : (
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ color: "#28a745", marginBottom: "1rem" }}>
            ✅ You are logged in
          </p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          style={{ 
            padding: "0.5rem", 
            width: "300px", 
            fontSize: "1rem",
            marginBottom: "1rem"
          }}
          disabled={!isLoggedIn}
        />
        <br />
        <button
          type="submit"
          disabled={!isLoggedIn}
          style={{ 
            padding: "0.5rem 1rem", 
            fontSize: "1rem",
            backgroundColor: isLoggedIn ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoggedIn ? "pointer" : "not-allowed"
          }}
        >
          Shorten
        </button>
      </form>

      {error && (
        <div style={{ marginTop: "1.5rem", color: "red" }}>
          <p>{error}</p>
        </div>
      )}

      {shortUrl && (
        <div style={{ marginTop: "1.5rem" }}>
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav style={{ 
      backgroundColor: "#f8f9fa", 
      padding: "1rem", 
      borderBottom: "1px solid #dee2e6",
      marginBottom: "2rem"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <Link to="/" style={{ 
          textDecoration: "none", 
          color: "#007bff", 
          fontSize: "1.5rem", 
          fontWeight: "bold" 
        }}>
          URL Shortener
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link to="/" style={{ 
            textDecoration: "none", 
            color: "#6c757d",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            transition: "background-color 0.2s"
          }}>
            Home
          </Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login" style={{ 
                textDecoration: "none", 
                color: "#6c757d",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                transition: "background-color 0.2s"
              }}>
                Login
              </Link>
              <Link to="/signup" style={{ 
                textDecoration: "none", 
                color: "#6c757d",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                transition: "background-color 0.2s"
              }}>
                Sign Up
              </Link>
            </>
          ) : (
            <span style={{ color: "#28a745", fontSize: "0.9rem" }}>
              ✅ Logged In
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
