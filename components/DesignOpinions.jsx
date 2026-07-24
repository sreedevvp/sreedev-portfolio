import { PiMoonStars } from "react-icons/pi";
import styles from "./DesignOpinions.module.css";

const opinions = [
  "Clarity beats cleverness.",
  "Research before assumptions.",
  "Accessibility is a baseline.",
  "Consistency builds trust.",
  "Every screen needs a purpose.",
  "Feedback makes the work better.",
  "Simplicity takes real effort.",
];

export default function DesignOpinions() {
  return (
    <section
      className={styles.section}
      id="design-opinions"
      aria-labelledby="design-opinions-title"
    >
      <header className={styles.header}>
        <p className={styles.label}>A few strong opinions</p>
        <h2 id="design-opinions-title">
          A Few Design Hills I’ll Gladly
          <span>Die On</span>
        </h2>
        <p className={styles.supporting}>
          Somewhere between user needs, clear thinking, and visual instinct.
        </p>
      </header>

      <div className={styles.cards}>
        <article className={`${styles.card} ${styles.opinionsCard}`}>
          <ul>
            {opinions.map((opinion) => (
              <li key={opinion}>{opinion}</li>
            ))}
          </ul>
        </article>

        <article className={`${styles.card} ${styles.darkModeCard}`}>
          <div className={styles.darkModeMark} aria-hidden="true">
            <PiMoonStars />
          </div>
          <h3>Dark mode doesn&apos;t fix a confusing experience.</h3>
        </article>

        <article className={`${styles.card} ${styles.wordsCard}`}>
          <div className={styles.wordStack}>
            <span>Buttons</span>
            <span>should</span>
            <span>say exactly</span>
            <span>what they do.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
