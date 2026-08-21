"use client";

import React from "react";

export default function GlobalError({
  error,
  retry,
  reset,
}: {
  error?: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  const handleRetry = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: "2rem",
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#FFFAEB",
          color: "#1B1C15",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "420px", width: "100%" }}>
          <div
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              fontFamily: "monospace",
              color: "#00674F",
              backgroundColor: "#E6F4EF",
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              marginBottom: "1rem",
            }}
          >
            System Error
          </div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 600, margin: "0 0 0.5rem 0" }}>
            Something went wrong!
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#5E6156", margin: "0 0 1.5rem 0" }}>
            An unexpected error occurred. You can retry to reload the page.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            style={{
              padding: "0.625rem 1.25rem",
              backgroundColor: "#1B1C15",
              color: "#FFFAEB",
              border: "none",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
