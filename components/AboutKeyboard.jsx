"use client";

import { useEffect, useState } from "react";
import {
  MdBrightnessLow,
  MdDarkMode,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
  MdLanguage,
  MdLockOutline,
  MdMicNone,
  MdPlayArrow,
  MdSearch,
  MdSend,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeDown,
  MdVolumeOff,
  MdVolumeUp,
  MdWindow,
} from "react-icons/md";
import styles from "./AboutKeyboard.module.css";

const defaultPhrase = "explore my keybord";

const phrases = {
  A: "Always exploring",
  B: "Building better products",
  C: "Clarity over clutter",
  D: "Design with purpose",
  E: "Engineering meets creativity",
  F: "Figma fuels ideas",
  G: "Growing through making",
  H: "Human-centred thinking",
  I: "Ideas into interfaces",
  J: "Just keep iterating",
  K: "Kerala-based designer",
  L: "Learning by building",
  M: "Minimal, never empty",
  N: "Notes full daily",
  O: "Observe before designing",
  P: "Products with purpose",
  Q: "Question every assumption",
  R: "Research before pixels",
  S: "Sreedev, still evolving",
  T: "Think. Test. Refine.",
  U: "Usability comes first",
  V: "Visuals with meaning",
  W: "Wireframes before polish",
  X: "Explore beyond obvious",
  Y: "Young, curious, building",
  Z: "Zero needless complexity",
};

const functionKeys = [
  { label: "esc", units: 1.48 },
  { label: "F1", icon: MdBrightnessLow },
  { label: "F2", icon: MdBrightnessLow },
  { label: "F3", icon: MdWindow },
  { label: "F4", icon: MdSearch },
  { label: "F5", icon: MdMicNone },
  { label: "F6", icon: MdDarkMode },
  { label: "F7", icon: MdSkipPrevious },
  { label: "F8", icon: MdPlayArrow },
  { label: "F9", icon: MdSkipNext },
  { label: "F10", icon: MdVolumeOff },
  { label: "F11", icon: MdVolumeDown },
  { label: "F12", icon: MdVolumeUp },
  { label: "lock", icon: MdLockOutline },
];

const numberKeys = [
  ["~", "`"],
  ["!", "1"],
  ["@", "2"],
  ["#", "3"],
  ["$", "4"],
  ["%", "5"],
  ["^", "6"],
  ["&", "7"],
  ["*", "8"],
  ["(", "9"],
  [")", "0"],
  ["_", "-"],
  ["+", "="],
];

const letterRows = [
  {
    prefix: { label: "tab", units: 1.55 },
    letters: "QWERTYUIOP".split(""),
    suffix: [
      { top: "{", bottom: "[" },
      { top: "}", bottom: "]" },
      { top: "|", bottom: "\\" },
    ],
  },
  {
    prefix: { label: "caps lock", units: 1.9, indicator: true },
    letters: "ASDFGHJKL".split(""),
    suffix: [
      { top: ":", bottom: ";" },
      { top: '"', bottom: "'" },
      { label: "return", units: 2.05 },
    ],
  },
  {
    prefix: { label: "shift", units: 2.28 },
    letters: "ZXCVBNM".split(""),
    suffix: [
      { top: "<", bottom: "," },
      { top: ">", bottom: "." },
      { top: "?", bottom: "/" },
      { label: "shift", units: 2.35, align: "end" },
    ],
  },
];

function Keycap({
  children,
  className = "",
  units = 1,
  align = "",
  indicator = false,
}) {
  return (
    <div
      className={`${styles.keycap} ${align === "end" ? styles.alignEnd : ""} ${className}`}
      style={{ "--key-units": units }}
      aria-hidden="true"
    >
      {indicator ? <i className={styles.keyIndicator} /> : null}
      {children}
    </div>
  );
}

function StackedLabel({ top, bottom }) {
  return (
    <span className={styles.stackedLabel}>
      <span>{top}</span>
      <span>{bottom}</span>
    </span>
  );
}

function LetterKey({ letter, selected, onSelect }) {
  const phrase = phrases[letter];

  return (
    <button
      type="button"
      className={`${styles.keycap} ${styles.letterKey} ${selected ? styles.selectedKey : ""}`}
      style={{ "--key-units": 1 }}
      aria-label={`${letter}: ${phrase}`}
      aria-pressed={selected}
      onMouseEnter={() => onSelect(letter)}
      onFocus={() => onSelect(letter)}
      onClick={() => onSelect(letter)}
    >
      {letter}
    </button>
  );
}

function FunctionKey({ icon: Icon, label, units }) {
  return (
    <Keycap units={units}>
      {Icon ? <Icon className={styles.functionIcon} /> : null}
      <span className={styles.functionLabel}>{label}</span>
    </Keycap>
  );
}

function ArrowCluster() {
  return (
    <div className={styles.arrowCluster} aria-hidden="true">
      <Keycap className={styles.arrowKey}>
        <MdKeyboardArrowLeft />
      </Keycap>
      <div className={styles.verticalArrows}>
        <Keycap className={styles.halfArrow}>
          <MdKeyboardArrowUp />
        </Keycap>
        <Keycap className={styles.halfArrow}>
          <MdKeyboardArrowDown />
        </Keycap>
      </div>
      <Keycap className={styles.arrowKey}>
        <MdKeyboardArrowRight />
      </Keycap>
    </div>
  );
}

function SentenceDisplay({ phrase, version }) {
  const [displayedPhrase, setDisplayedPhrase] = useState(phrase);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      setDisplayedPhrase(phrase);
      setIsTyping(false);
      return undefined;
    }

    let characterIndex = 0;
    let typingTimer;
    setDisplayedPhrase("");
    setIsTyping(true);

    const startTimer = window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        characterIndex += 1;
        setDisplayedPhrase(phrase.slice(0, characterIndex));

        if (characterIndex >= phrase.length) {
          window.clearInterval(typingTimer);
          setIsTyping(false);
        }
      }, 28);
    }, 110);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(typingTimer);
    };
  }, [phrase, version]);

  return (
    <div
      className={styles.sentenceFrame}
      id="keyboard-sentence"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={styles.sentenceViewport}>
        <span className={styles.promptText}>
          {displayedPhrase}
          <span
            className={`${styles.typingCaret} ${isTyping ? styles.isTyping : ""}`}
            aria-hidden="true"
          />
        </span>
        <span className={styles.promptAction} aria-hidden="true">
          <MdSend />
        </span>
      </div>
    </div>
  );
}

function MagicKeyboard({ selectedLetter, onSelect }) {
  return (
    <div className={styles.keyboard} aria-label="Interactive Apple-style keyboard">
      <div className={styles.keyboardRow}>
        {functionKeys.map((key) => (
          <FunctionKey key={key.label} {...key} />
        ))}
      </div>

      <div className={styles.keyboardRow}>
        {numberKeys.map(([top, bottom]) => (
          <Keycap key={bottom}>
            <StackedLabel top={top} bottom={bottom} />
          </Keycap>
        ))}
        <Keycap units={1.65} align="end">
          <span className={styles.edgeLabel}>delete</span>
        </Keycap>
      </div>

      {letterRows.map((row) => (
        <div className={styles.keyboardRow} key={row.prefix.label}>
          <Keycap units={row.prefix.units} indicator={row.prefix.indicator}>
            <span className={styles.edgeLabel}>{row.prefix.label}</span>
          </Keycap>
          {row.letters.map((letter) => (
            <LetterKey
              key={letter}
              letter={letter}
              selected={selectedLetter === letter}
              onSelect={onSelect}
            />
          ))}
          {row.suffix.map((key, index) =>
            key.top ? (
              <Keycap key={`${key.bottom}-${index}`}>
                <StackedLabel top={key.top} bottom={key.bottom} />
              </Keycap>
            ) : (
              <Keycap
                key={`${key.label}-${index}`}
                units={key.units}
                align={key.align}
              >
                <span className={styles.edgeLabel}>{key.label}</span>
              </Keycap>
            ),
          )}
        </div>
      ))}

      <div className={styles.keyboardRow}>
        <Keycap units={0.95}>
          <MdLanguage className={styles.modifierIcon} />
        </Keycap>
        <Keycap units={1.2}>
          <span className={styles.modifierLabel}>
            <small>⌃</small>control
          </span>
        </Keycap>
        <Keycap units={1.15}>
          <span className={styles.modifierLabel}>
            <small>⌥</small>option
          </span>
        </Keycap>
        <Keycap units={1.35}>
          <span className={styles.modifierLabel}>
            <small>⌘</small>command
          </span>
        </Keycap>
        <Keycap units={4.7} className={styles.spacebar} />
        <Keycap units={1.35} align="end">
          <span className={styles.modifierLabel}>
            <small>⌘</small>command
          </span>
        </Keycap>
        <Keycap units={1.15} align="end">
          <span className={styles.modifierLabel}>
            <small>⌥</small>option
          </span>
        </Keycap>
        <ArrowCluster />
      </div>
    </div>
  );
}

export default function AboutKeyboard() {
  const [sentenceState, setSentenceState] = useState({
    current: defaultPhrase,
    previous: null,
    letter: null,
    version: 0,
  });

  const selectLetter = (letter) => {
    setSentenceState((current) => {
      const nextPhrase = phrases[letter];
      if (current.letter === letter) return current;

      return {
        current: nextPhrase,
        previous: current.current,
        letter,
        version: current.version + 1,
      };
    });
  };

  return (
    <section className={styles.section} aria-labelledby="keyboard-section-title">
      <h2 className={styles.sectionTitle} id="keyboard-section-title">
        Every key reveals a little more about me.
      </h2>
      <SentenceDisplay
        phrase={sentenceState.current}
        version={sentenceState.version}
      />

      <div
        className={styles.keyboardScroller}
        role="region"
        aria-label="Horizontally scrollable interactive keyboard"
        tabIndex="0"
      >
        <MagicKeyboard
          selectedLetter={sentenceState.letter}
          onSelect={selectLetter}
        />
      </div>
    </section>
  );
}
