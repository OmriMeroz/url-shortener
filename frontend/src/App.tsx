import { useState } from "react";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ original_url: originalUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      setShortUrl(data.short_url);
    } catch (err) {
      console.error(err);
      setShortUrl("Error: Could not shorten URL");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          style={{ padding: "0.5rem", width: "300px", fontSize: "1rem" }}
        />
        <button
          type="submit"
          style={{ padding: "0.5rem 1rem", marginLeft: "1rem", fontSize: "1rem" }}
        >
          Shorten
        </button>
      </form>

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

export default App;
