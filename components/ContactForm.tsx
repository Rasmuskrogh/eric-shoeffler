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
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>{t("name")}</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder={t("namePlaceholder")}
          />
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>{t("email")}</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder={t("emailPlaceholder")}
          />
        </label>
        <label className={styles.label}>
          <span className={styles.labelText}>{t("tel")}</span>
          <input
            type="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            required
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
            className={styles.textarea}
            placeholder={t("messagePlaceholder")}
          ></textarea>
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
