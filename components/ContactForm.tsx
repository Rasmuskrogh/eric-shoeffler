"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("Contact");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = (data: typeof formData) => {
    const nextErrors: typeof errors = {};
    if (!data.name.trim()) {
      nextErrors.name = "Name is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      nextErrors.email = "Invalid email format";
    }
    if (!data.message.trim()) {
      nextErrors.message = "Message is required";
    } else if (data.message.trim().length < 10) {
      nextErrors.message = "Message must be at least 10 characters";
    }
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", tel: "", message: "" });
        setErrors({});
        setStatus("success");
      } else {
        try {
          const { error } = await response.json();
          // Rudimentary mapping to field errors if recognizable
          if (typeof error === "string") {
            if (error.toLowerCase().includes("email")) {
              setErrors((prev) => ({ ...prev, email: error }));
            }
          }
        } catch {}
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label className={styles.label}>
          <span className={styles.labelText}>{t("name")}</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={styles.input}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <div
              id="name-error"
              style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}
            >
              {errors.name}
            </div>
          )}
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>{t("email")}</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={styles.input}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <div
              id="email-error"
              style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}
            >
              {errors.email}
            </div>
          )}
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>{t("tel")}</span>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            className={styles.input}
            placeholder={t("telPlaceholder")}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>{t("message")}</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={styles.textarea}
            placeholder={t("messagePlaceholder")}
          ></textarea>
          {errors.message && (
            <div
              id="message-error"
              style={{ color: "#ef4444", fontSize: 14, marginTop: 4 }}
            >
              {errors.message}
            </div>
          )}
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className={styles.submitButton}
        >
          {status === "submitting" ? t("loading") : t("submit")}
        </button>

        {status === "success" && (
          <div className={styles.successMessage}>{t("success")}</div>
        )}

        {status === "error" && (
          <div className={styles.errorMessage}>{t("error")}</div>
        )}
      </form>
    </div>
  );
}
