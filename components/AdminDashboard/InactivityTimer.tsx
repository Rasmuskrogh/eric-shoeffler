"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";

interface InactivityTimerProps {
  timeoutMinutes?: number; // Timeout i minuter (default: 15)
  warningMinutes?: number; // Visa varning X minuter innan timeout (default: 1)
}

export default function InactivityTimer({
  timeoutMinutes = 15,
  warningMinutes = 1,
}: InactivityTimerProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Konvertera minuter till millisekunder
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningTimeMs = warningMinutes * 60 * 1000;
  const warningThreshold = timeoutMs - warningTimeMs;

  // Funktion för att starta om timern
  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    setShowWarning(false);
    setTimeRemaining(null);

    // Rensa befintliga timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Sätt varningstimer
    warningTimeoutRef.current = setTimeout(() => {
      const remaining = Math.ceil(
        (timeoutMs - (Date.now() - lastActivityRef.current)) / 1000 / 60
      );
      setTimeRemaining(remaining);
      setShowWarning(true);
    }, warningThreshold);

    // Sätt logout-timer
    timeoutRef.current = setTimeout(() => {
      signOut({ callbackUrl: "/admin/login" });
    }, timeoutMs);
  };

  // Funktion för att hantera användaraktivitet
  const handleActivity = () => {
    resetTimer();
  };

  // Funktion för att förlänga sessionen
  const handleExtendSession = () => {
    resetTimer();
  };

  // Funktion för att logga ut direkt
  const handleLogoutNow = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  useEffect(() => {
    // Starta timern när komponenten mountas
    resetTimer();

    // Lägg till event listeners för användaraktivitet
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, true);
    });

    // Rensa timers och listeners när komponenten unmountas
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  // Om ingen varning ska visas, returnera ingenting
  if (!showWarning) {
    return null;
  }

  // Visa varningsmodal
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "0.5rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
          Session Timeout Warning
        </h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Du har varit inaktiv i {timeoutMinutes - (timeRemaining || 0)} minuter.
          Din session kommer att loggas ut om{" "}
          <strong>{timeRemaining || 0} minut(er)</strong>.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button
            onClick={handleLogoutNow}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Logout Now
          </button>
          <button
            onClick={handleExtendSession}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

