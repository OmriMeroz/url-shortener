import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/signup", {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div style={{ 
      maxWidth: "400px", 
      margin: "0 auto", 
      padding: "2rem",
      textAlign: "center"
    }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Sign Up
        </button>
      </form>
      {message && (
        <p style={{ 
          color: message.includes("successfully") || message.includes("created") ? "green" : "red",
          marginBottom: "1rem"
        }}>
          {message}
        </p>
      )}
      <p>
        Already have an account? <Link to="/login" style={{ color: "#007bff" }}>Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
