"use client";

import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import styles from "../app/contact/Contact.module.css";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const projectType = data.get("projectType");
    const timeline = data.get("timeline") || "Not specified";
    const message = data.get("message");
    const subject = `Portfolio enquiry — ${projectType} from ${name}`;
    const body = [
      `Hi Sreedev,`,
      "",
      message,
      "",
      `Project type: ${projectType}`,
      `Preferred timeline: ${timeline}`,
      `Name: ${name}`,
      `Reply to: ${email}`,
    ].join("\n");
    const gmailUrl = new URL("https://mail.google.com/mail/");
    gmailUrl.searchParams.set("view", "cm");
    gmailUrl.searchParams.set("fs", "1");
    gmailUrl.searchParams.set("to", "vpsreedev24@gmail.com");
    gmailUrl.searchParams.set("su", subject);
    gmailUrl.searchParams.set("body", body);

    setSubmitted(true);
    window.setTimeout(() => {
      window.open(gmailUrl.toString(), "_blank", "noopener,noreferrer");
    }, 120);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formIntro}>
        <h2>Tell me what&apos;s on your mind.</h2>
      </div>

      <div className={styles.twoColumns}>
        <label>
          <span>Your name</span>
          <input name="name" type="text" placeholder="How should I address you?" required />
        </label>
        <label>
          <span>Email address</span>
          <input name="email" type="email" placeholder="you@company.com" required />
        </label>
      </div>

      <div className={styles.twoColumns}>
        <label>
          <span>What are we designing?</span>
          <select name="projectType" defaultValue="" required>
            <option value="" disabled>Select a project type</option>
            <option>Product design</option>
            <option>Landing page</option>
            <option>Brand identity</option>
            <option>Visual / campaign design</option>
            <option>Something else</option>
          </select>
        </label>
        <label>
          <span>Preferred timeline</span>
          <input name="timeline" type="text" placeholder="For example, 4–6 weeks" />
        </label>
      </div>

      <label>
        <span>Project details</span>
        <textarea
          name="message"
          rows="6"
          placeholder="What are you building, who is it for, and what would a successful outcome look like?"
          required
        />
      </label>

      <div className={styles.formFooter}>
        <p aria-live="polite">
          {submitted
            ? "Opening Gmail with the project details..."
            : "Submitting opens a prepared Gmail draft to my inbox."}
        </p>
        <button type="submit">
          Send project brief
          <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
