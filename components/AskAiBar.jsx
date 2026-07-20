"use client";

import { SiClaude, SiOpenai } from "react-icons/si";
import styles from "../app/contact/Contact.module.css";

function GeminiMark(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id="gemini-mark" x1="2" y1="20" x2="22" y2="3">
          <stop offset="0%" stopColor="#4b90ff" />
          <stop offset="48%" stopColor="#9b72cb" />
          <stop offset="100%" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.4c.7 5.4 5 9.7 10.4 10.4-5.4.7-9.7 5-10.4 10.4-.7-5.4-5-9.7-10.4-10.4C7 11.1 11.3 6.8 12 1.4Z"
        fill="url(#gemini-mark)"
      />
    </svg>
  );
}

const services = [
  {
    name: "ChatGPT",
    baseUrl: "https://chatgpt.com/?q=",
    icon: SiOpenai,
    tone: "chatgpt",
  },
  {
    name: "Claude",
    baseUrl: "https://claude.ai/new?q=",
    icon: SiClaude,
    tone: "claude",
  },
  {
    name: "Gemini",
    baseUrl: "https://www.google.com/search?udm=50&aep=11&q=",
    icon: GeminiMark,
    tone: "gemini",
  },
];

function createPrompt(portfolioUrl) {
  return `I am evaluating Sreedev VP (${portfolioUrl}) for a {add role here} position at {add company name here}. Please review his portfolio and give me a direct assessment: what is his actual design range, what kind of company or team would he be most effective in, and what specific value would he bring to this role. Reference his projects and past work in your answer.`;
}

export default function AskAiBar() {
  function handleAsk(event, baseUrl) {
    event.preventDefault();
    const portfolioUrl = `${window.location.origin}/`;
    const destination = `${baseUrl}${encodeURIComponent(createPrompt(portfolioUrl))}`;
    window.open(destination, "_blank", "noopener,noreferrer");
  }

  return (
    <aside
      className={styles.askAiBar}
      aria-label="Ask an AI assistant about Sreedev"
    >
      <div className={styles.askAiCopy}>
        <p>
          <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
            <defs>
              <linearGradient id="ask-ai-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path
              d="M8 0C8 4.5 11.5 8 16 8c-4.5 0-8 3.5-8 8 0-4.5-3.5-8-8-8 4.5 0 8-3.5 8-8Z"
              fill="url(#ask-ai-sparkle)"
            />
          </svg>
          <strong>Ask AI</strong>
        </p>
        <span>About Sreedev</span>
      </div>

      <span className={styles.askAiDivider} aria-hidden="true" />

      <div className={styles.askAiServices}>
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <a
              className={`${styles.askAiService} ${styles[service.tone]}`}
              href={service.baseUrl}
              key={service.name}
              aria-label={`Ask ${service.name} about Sreedev`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => handleAsk(event, service.baseUrl)}
            >
              <Icon aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
