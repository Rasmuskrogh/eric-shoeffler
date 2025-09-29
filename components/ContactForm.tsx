"use client";
import { useState } from "react";
import styles from "./ContactForm.module.css";
//import { sendEmail } from "@/lib/email";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      // await sendEmail(formData);
      console.log("Form data:", formData);
      setFormData({ name: "", email: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    /*  <section id="contact" className={styles.contactSection} data-color="dark">
      <div className={styles.container}>
        <h2 className={styles.title}>Kontakta Eric</h2> */
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>
          <span className={styles.labelText}>Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Your name"
          />
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Your email"
          />
        </label>

        <label className={styles.label}>
          <span className={styles.labelText}>Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className={styles.textarea}
            placeholder="Your message"
          ></textarea>
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className={styles.submitButton}
        >
          {status === "submitting" ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
    /*   </div>
    </section> */
  );
}
