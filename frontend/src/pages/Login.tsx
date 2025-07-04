import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setMessage("Logged in successfully! Redirecting...");
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "0 auto", 
      padding: "2rem",
      textAlign: "center"
    }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            marginBottom: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem"
          }}
        />
        <button 
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: isLoading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: isLoading ? "not-allowed" : "pointer"
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && (
        <p style={{ 
          color: message.includes("successfully") ? "green" : "red",
          marginBottom: "1rem"
        }}>
          {message}
        </p>
      )}
      <p>
        Don't have an account? <Link to="/signup" style={{ color: "#007bff" }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
