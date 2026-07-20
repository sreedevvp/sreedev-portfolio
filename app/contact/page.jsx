import {
  FaBehance,
  FaDribbble,
  FaInstagram,
  FaLinkedinIn,
  FaMedium,
  FaWhatsapp,
} from "react-icons/fa6";
import { FiArrowUpRight, FiClock, FiMail, FiMapPin } from "react-icons/fi";
import ContactForm from "../../components/ContactForm";
import AskAiBar from "../../components/AskAiBar";
import styles from "./Contact.module.css";

export const metadata = {
  title: "Contact",
  description:
    "Start a product design, visual design, branding, or creative collaboration with Sreedev VP.",
};

const socialLinks = [
  {
    label: "WhatsApp",
    handle: "+91 86064 25698",
    href: "https://wa.me/918606425698?text=Hi%20Sreedev%2C%20I%27d%20like%20to%20discuss%20a%20project.",
    icon: FaWhatsapp,
    tone: "whatsapp",
  },
  {
    label: "LinkedIn",
    handle: "/in/sreedevvp",
    href: "https://www.linkedin.com/in/sreedevvp/",
    icon: FaLinkedinIn,
    tone: "linkedin",
  },
  {
    label: "Instagram",
    handle: "@sreedev.vp",
    href: "https://www.instagram.com/sreedev.vp?igsh=cGUzY2Fqbm8zc3ox&utm_source=qr",
    icon: FaInstagram,
    tone: "instagram",
  },
  {
    label: "Behance",
    handle: "sreedevvp",
    href: "https://www.behance.net/sreedevvp",
    icon: FaBehance,
    tone: "behance",
  },
  {
    label: "Dribbble",
    handle: "sreedev-vp",
    href: "https://dribbble.com/sreedev-vp",
    icon: FaDribbble,
    tone: "dribbble",
  },
  {
    label: "Medium",
    handle: "@sreedevvp",
    href: "https://medium.com/@sreedevvp",
    icon: FaMedium,
    tone: "medium",
  },
];

export default function ContactPage() {
  return (
    <main className="standalone-main">
      <section className={styles.page} aria-labelledby="contact-title">
        <header className={styles.hero}>
          <p className={styles.eyebrow}>
            <span className="blinking-status-dot" aria-hidden="true" />
            Available for thoughtful collaborations
          </p>
          <h1 id="contact-title">
            Let&apos;s turn a good idea into something people remember.
          </h1>
          <p className={styles.heroCopy}>
            Product design, landing pages, brand systems, or visual campaigns—
            tell me what you&apos;re building and where you need a design partner.
          </p>
        </header>

        <AskAiBar />

        <div className={styles.workspace}>
          <aside className={styles.contactCard}>
            <h2>Open to ideas at every stage.</h2>
            <p>
              A rough brief is enough. I can help shape the problem, clarify the
              experience, and turn it into a focused visual direction.
            </p>

            <div className={styles.details}>
              <a href="mailto:vpsreedev24@gmail.com">
                <FiMail aria-hidden="true" />
                <span>
                  <small>Email</small>
                  vpsreedev24@gmail.com
                </span>
              </a>
              <div>
                <FiMapPin aria-hidden="true" />
                <span>
                  <small>Based in</small>
                  Kerala, India · Working worldwide
                </span>
              </div>
              <div>
                <FiClock aria-hidden="true" />
                <span>
                  <small>Response time</small>
                  Usually within 24–48 hours
                </span>
              </div>
            </div>

            <a
              className={styles.whatsappCta}
              href="https://wa.me/918606425698?text=Hi%20Sreedev%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              Chat on WhatsApp
              <FiArrowUpRight aria-hidden="true" />
            </a>
          </aside>

          <ContactForm />
        </div>

        <section className={styles.socialSection} aria-labelledby="social-title">
          <div className={styles.socialHeading}>
            <h2 id="social-title">Find me around the internet.</h2>
          </div>
          <div className={styles.socialGrid}>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  className={`${styles.socialCard} ${styles[social.tone]}`}
                  href={social.href}
                  key={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.socialIcon}>
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{social.label}</strong>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
