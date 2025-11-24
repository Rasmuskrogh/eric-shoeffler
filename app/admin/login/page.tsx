"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: true,
        username: credentials.username,
        password: credentials.password,
        callbackUrl: "/admin",
      });

      if (!response?.ok) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage your content</p>

        {error && (
          <div className={styles.errorMessage}>
            Invalid credentials. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((previous) => ({
                  ...previous,
                  username: event.target.value,
                }))
              }
              required
              className={styles.input}
              placeholder="Enter your username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((previous) => ({
                  ...previous,
                  password: event.target.value,
                }))
              }
              required
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
