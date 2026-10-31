"use client";
import { useState } from "react";
export default function Home() {
  const [longUrl, setlongUrl] = useState("");
  const [shortUrl, setshortUrl] = useState("");

  const handlesubmit = async( e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(
      "http://localhost:5000/api/url/shorten",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ longUrl }),
      }
    );
    const data = await response.json();
    setshortUrl(data.shortUrl);   
  };
  return (
    <main>
      <h1>URL Shortener</h1>
      <form onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setlongUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <div>
          <p>Shortened URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}  
    </main>
  )
}