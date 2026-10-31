"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/url"
).replace(/\/$/, "");

type ShortenResponse = {
  message?: string;
  shortUrl?: string;
};

type LookupResponse = {
  message?: string;
  originalUrl?: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [shortenError, setShortenError] = useState("");
  const [isShortening, setIsShortening] = useState(false);

  const [shortUrlInput, setShortUrlInput] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const handleShorten = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsShortening(true);
    setShortenError("");
    setShortUrl("");

    try {
      const response = await fetch(`${API_BASE_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: longUrl.trim() }),
      });
      const data: ShortenResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not shorten that URL.");
      }
      if (!data.shortUrl) {
        throw new Error("The server did not return a shortened URL.");
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      setShortenError(getErrorMessage(error));
    } finally {
      setIsShortening(false);
    }
  };

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLookingUp(true);
    setLookupError("");
    setOriginalUrl("");

    try {
      const enteredUrl = shortUrlInput.trim();
      const shortId = enteredUrl
        .split(/[/?#]/)
        .filter(Boolean)
        .at(-1);

      if (!shortId) {
        throw new Error("Enter a short URL or its code.");
      }

      const response = await fetch(
        `${API_BASE_URL}/lookup/${encodeURIComponent(shortId)}`
      );
      const data: LookupResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Could not find the original URL.");
      }
      if (!data.originalUrl) {
        throw new Error("The server did not return the original URL.");
      }

      setOriginalUrl(data.originalUrl);
    } catch (error) {
      setLookupError(getErrorMessage(error));
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="page-content">
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Linkdrop home">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>linkdrop</span>
          </Link>
          <span className="header-note">Simple links. Ready to share.</span>
        </header>

        <section className="hero" aria-labelledby="page-title">
          <p className="eyebrow">YOUR LINKS, MADE LIGHTER</p>
          <h1 id="page-title">Long story? Make it <span>short.</span></h1>
          <p className="hero-copy">
            Create a clean link to share, or look up where a short link leads.
          </p>
        </section>

        <section className="tools-grid" aria-label="URL tools">
          <article className="tool-card">
            <div className="card-heading">
              <span className="card-icon" aria-hidden="true">↗</span>
              <div>
                <p className="card-kicker">CREATE A LINK</p>
                <h2>Shorten a URL</h2>
              </div>
            </div>
            <p className="card-copy">
              Paste a long web address and get a shorter link you can share anywhere.
            </p>

            <form className="url-form" onSubmit={handleShorten}>
              <label htmlFor="long-url">Long URL</label>
              <input
                id="long-url"
                type="url"
                placeholder="https://example.com/a/very/long/link"
                value={longUrl}
                onChange={(event) => setLongUrl(event.target.value)}
                autoComplete="url"
                required
              />
              <button type="submit" disabled={isShortening}>
                {isShortening ? "Creating your link..." : "Shorten URL"}
                {!isShortening && <span aria-hidden="true">→</span>}
              </button>
            </form>

            {shortenError && <p className="form-message error" role="alert">{shortenError}</p>}
            {shortUrl && (
              <div className="result-box" role="status">
                <p>Your short link is ready</p>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
              </div>
            )}
          </article>

          <article className="tool-card">
            <div className="card-heading">
              <span className="card-icon lookup-icon" aria-hidden="true">⌕</span>
              <div>
                <p className="card-kicker">CHECK A LINK</p>
                <h2>Find the original URL</h2>
              </div>
            </div>
            <p className="card-copy">
              Paste a short link or enter its code to see the destination before you visit.
            </p>

            <form className="url-form" onSubmit={handleLookup}>
              <label htmlFor="short-url">Short URL or code</label>
              <input
                id="short-url"
                type="text"
                placeholder="http://localhost:5000/abc123 or abc123"
                value={shortUrlInput}
                onChange={(event) => setShortUrlInput(event.target.value)}
                autoComplete="url"
                required
              />
              <button type="submit" disabled={isLookingUp}>
                {isLookingUp ? "Looking it up..." : "Find original URL"}
                {!isLookingUp && <span aria-hidden="true">→</span>}
              </button>
            </form>

            {lookupError && <p className="form-message error" role="alert">{lookupError}</p>}
            {originalUrl && (
              <div className="result-box" role="status">
                <p>This short link points to</p>
                <a href={originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a>
              </div>
            )}
          </article>
        </section>

        <footer className="page-footer">
          <span>Make every character count.</span>
        </footer>
      </div>
    </main>
  );
}
