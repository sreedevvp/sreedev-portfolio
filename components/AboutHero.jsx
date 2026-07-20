"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MdNearMe } from "react-icons/md";
import { TbBrandAdobeIllustrator } from "react-icons/tb";
import {
  SiClaude,
  SiFigma,
  SiFramer,
  SiNotion,
  SiOpenai,
  SiWebflow,
} from "react-icons/si";
import styles from "./AboutHero.module.css";

const greetings = [
  "Hello",
  "Namaste",
  "Namaskaram",
  "Bonjour",
  "Hola",
  "Ciao",
  "Hallo",
  "Konnichiwa",
  "Marhaba",
  "Annyeong",
];

const stack = [
  { label: "Figma", icon: SiFigma, color: "#f24e1e" },
  { label: "Framer", icon: SiFramer, color: "#0055ff" },
  { label: "Webflow", icon: SiWebflow, color: "#4353ff" },
  { label: "Notion", icon: SiNotion, color: "#111111" },
  { label: "Illustrator", icon: TbBrandAdobeIllustrator, color: "#ff9a00" },
  { label: "Claude", icon: SiClaude, color: "#d97757" },
  { label: "Codex", icon: SiOpenai, color: "#10a37f" },
];

function RotatingGreeting() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer;

    const syncMotion = () => {
      window.clearInterval(timer);
      if (!media.matches) {
        timer = window.setInterval(
          () => setIndex((current) => (current + 1) % greetings.length),
          1900,
        );
      }
    };

    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => {
      window.clearInterval(timer);
      media.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <span className={styles.greetingViewport} aria-live="polite">
      <span className={styles.greeting} key={greetings[index]}>
        {greetings[index]}
      </span>
    </span>
  );
}

function LiveIstClock() {
  const [time, setTime] = useState("--:-- IST");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const update = () => setTime(`${formatter.format(new Date())} IST`);

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return <time className={styles.clock}>{time}</time>;
}

function ToolStack() {
  return (
    <div className={styles.stackBlock}>
      <p className={styles.handwritten}>my stack</p>
      <ul className={styles.stackList} aria-label="Tools I use">
        {stack.map(({ label, icon: Icon, color }) => (
          <li key={label}>
            <span className={styles.toolIcon} title={label} style={{ color }}>
              <Icon aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </span>
          </li>
        ))}
        <li className={styles.more}>+ more</li>
      </ul>
    </div>
  );
}

function PhotoFrame() {
  return (
    <div className={styles.photoStage}>
      <div className={styles.polaroid}>
        <div className={styles.photo}>
          <Image
            src="/about-portrait.png"
            alt="Portrait of Sreedev VP"
            fill
            priority
            sizes="(max-width: 700px) 250px, 340px"
          />
        </div>
        <span className={styles.photoCaption}>sree.jpeg</span>
      </div>
    </div>
  );
}

function Cursor({ label, tone, className }) {
  return (
    <div
      className={`${styles.cursor} ${className}`}
      style={{ "--cursor-tone": tone }}
      aria-hidden="true"
    >
      <MdNearMe />
      <span>{label}</span>
    </div>
  );
}

function AnimatedCursors() {
  return (
    <div className={styles.cursorLayer} aria-hidden="true">
      <Cursor
        label="You"
        tone="#e23744"
        className={styles.cursorYou}
      />
      <Cursor
        label="Sreedev"
        tone="#00b8e6"
        className={styles.cursorSreedev}
      />
    </div>
  );
}

export default function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-hero-title">
      <AnimatedCursors />

      <div className={styles.content}>
        <p className={styles.availability}>
          <span className={styles.statusDot} aria-hidden="true" />
          <RotatingGreeting />
        </p>

        <div className={styles.nameRow}>
          <h1 id="about-hero-title">I&rsquo;m Sreedev</h1>
          <span className={styles.nameNote}>
            <i aria-hidden="true" />
            or just sree
          </span>
        </div>

        <p className={styles.introduction}>
          Product designer with an engineering background. I turn complex ideas
          into clear, thoughtful digital experiences—from early concepts to
          polished, launch-ready products.
        </p>

        <p className={styles.location}>
          <span>Kerala, India</span>
          <span aria-hidden="true">·</span>
          <LiveIstClock />
        </p>

        <div className={styles.actions}>
          <a
            className={styles.callButton}
            href="mailto:vpsreedev24@gmail.com?subject=Portfolio%20call"
          >
            Contact
          </a>
          <a className={styles.email} href="mailto:vpsreedev24@gmail.com">
            vpsreedev24@gmail.com
          </a>
          <span className={styles.replyNote}>
            I actually reply
            <i aria-hidden="true" />
          </span>
        </div>

        <ToolStack />
      </div>

      <PhotoFrame />
    </section>
  );
}
