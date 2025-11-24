"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2 style={{ color: "#c53030", marginBottom: "1rem" }}>Error</h2>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        {error.message || "An error occurred"}
      </p>
      {error.digest && (
        <p style={{ fontSize: "0.875rem", color: "#999", marginBottom: "1rem" }}>
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3182ce",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}

