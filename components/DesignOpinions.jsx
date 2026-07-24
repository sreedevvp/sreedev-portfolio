"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

const wordTags = [
  { id: "buttons", label: "Buttons" },
  { id: "should", label: "should" },
  { id: "say-exactly", label: "say exactly" },
  { id: "what-they-do", label: "what they do." },
];

export default function DesignOpinions() {
  const wordStackRef = useRef(null);
  const dragRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [topLayer, setTopLayer] = useState(10);
  const [layers, setLayers] = useState({});

  useEffect(() => () => dragRef.current?.cleanup?.(), []);

  function beginDrag(event, id) {
    if (event.button !== 0) return;

    const container = wordStackRef.current;
    if (!container) return;

    const tag = event.currentTarget;
    dragRef.current?.cleanup?.();
    const nextLayer = topLayer + 1;
    const pointerId = event.pointerId;
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startX = tag.offsetLeft;
    const startY = tag.offsetTop;

    function movePointer(moveEvent) {
      if (moveEvent.pointerId !== pointerId) return;

      const x = Math.min(
        Math.max(0, startX + moveEvent.clientX - startClientX),
        container.clientWidth - tag.offsetWidth,
      );
      const y = Math.min(
        Math.max(0, startY + moveEvent.clientY - startClientY),
        container.clientHeight - tag.offsetHeight,
      );

      setPositions((current) => ({ ...current, [id]: { x, y } }));
      moveEvent.preventDefault();
    }

    function cleanup() {
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerup", endPointer);
      window.removeEventListener("pointercancel", endPointer);
    }

    function endPointer(endEvent) {
      if (endEvent.pointerId !== pointerId) return;

      cleanup();
      dragRef.current = null;
      setActiveTag(null);
    }

    dragRef.current = {
      id,
      pointerId,
      cleanup,
    };

    setPositions((current) => ({
      ...current,
      [id]: {
        x: startX,
        y: startY,
      },
    }));
    setLayers((current) => ({ ...current, [id]: nextLayer }));
    setTopLayer(nextLayer);
    setActiveTag(id);
    window.addEventListener("pointermove", movePointer, { passive: false });
    window.addEventListener("pointerup", endPointer);
    window.addEventListener("pointercancel", endPointer);
    event.preventDefault();
  }

  return (
    <section
      className={styles.section}
      id="design-opinions"
      aria-labelledby="design-opinions-title"
    >
      <header className={styles.header}>
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
          <Image
            className={styles.darkModeMark}
            src="/design-opinions-dark-mode-dots.png"
            alt=""
            width={202}
            height={143}
            loading="eager"
            unoptimized
          />
          <h3>Dark mode doesn&apos;t fix a confusing experience.</h3>
        </article>

        <article
          className={`${styles.card} ${styles.wordsCard}`}
          aria-label="Drag and stack the button words"
        >
          <div className={styles.wordStack} ref={wordStackRef}>
            {wordTags.map((tag) => {
              const position = positions[tag.id];

              return (
                <button
                  className={`${styles.wordTag} ${styles[tag.id.replaceAll("-", "")]} ${
                    activeTag === tag.id ? styles.dragging : ""
                  }`}
                  key={tag.id}
                  type="button"
                  onPointerDown={(event) => beginDrag(event, tag.id)}
                  style={{
                    ...(position ? { left: position.x, top: position.y } : null),
                    zIndex: layers[tag.id],
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}
