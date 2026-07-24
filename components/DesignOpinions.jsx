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
  const tagRefs = useRef({});
  const animationRefs = useRef({});
  const settleTimerRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [activeTag, setActiveTag] = useState(null);
  const [topLayer, setTopLayer] = useState(10);
  const [layers, setLayers] = useState({});

  useEffect(
    () => () => {
      dragRef.current?.cleanup?.();
      Object.values(animationRefs.current).forEach(cancelAnimationFrame);
      window.clearTimeout(settleTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const container = wordStackRef.current;
    if (!container) return undefined;

    const dropOrder = ["what-they-do", "buttons", "should", "say-exactly"];
    const initialPositions = {};

    dropOrder.forEach((id) => {
      const tag = tagRefs.current[id];
      if (tag) initialPositions[id] = { x: tag.offsetLeft, y: tag.offsetTop };
    });

    setPositions(initialPositions);

    const frame = requestAnimationFrame(() => queueLoosePills(0));

    return () => cancelAnimationFrame(frame);
  }, []);

  function stopFalling(id) {
    const frame = animationRefs.current[id];
    if (frame) cancelAnimationFrame(frame);
    delete animationRefs.current[id];
  }

  function isSupported(id, tag, container) {
    const containerBounds = container.getBoundingClientRect();
    const tagBounds = tag.getBoundingClientRect();
    const onGround = Math.abs(tagBounds.bottom - containerBounds.bottom) <= 3;

    if (onGround) return true;

    return Object.entries(tagRefs.current).some(([otherId, other]) => {
      if (otherId === id || !other) return false;

      const otherBounds = other.getBoundingClientRect();
      const overlap =
        Math.min(tagBounds.right, otherBounds.right) -
        Math.max(tagBounds.left, otherBounds.left);
      const enoughOverlap =
        overlap > Math.min(tagBounds.width, otherBounds.width) * 0.22;
      const touchingTop = Math.abs(tagBounds.bottom - otherBounds.top) <= 3;

      return enoughOverlap && touchingTop;
    });
  }

  function queueLoosePills(delay = 50) {
    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      const container = wordStackRef.current;
      if (!container || dragRef.current) return;

      const nextLoosePill = Object.entries(tagRefs.current)
        .filter(
          ([id, tag]) =>
            tag &&
            !animationRefs.current[id] &&
            !isSupported(id, tag, container),
        )
        .sort(
          ([, first], [, second]) =>
            second.getBoundingClientRect().bottom -
            first.getBoundingClientRect().bottom,
        )[0];

      if (!nextLoosePill) return;

      const [id, tag] = nextLoosePill;
      dropTag(id, tag, container, tag.offsetLeft, tag.offsetTop);
    }, delay);
  }

  function findLandingY(id, x, y, tag, container) {
    const containerBounds = container.getBoundingClientRect();
    const tagBounds = tag.getBoundingClientRect();
    const tagVisualLeftOffset = tagBounds.left - containerBounds.left - tag.offsetLeft;
    const tagVisualTopOffset = tagBounds.top - containerBounds.top - tag.offsetTop;
    const tagVisualLeft = x + tagVisualLeftOffset;
    const tagVisualRight = tagVisualLeft + tagBounds.width;
    const tagVisualBottomOffset = tagVisualTopOffset + tagBounds.height;
    let landingY = container.clientHeight - tagVisualBottomOffset;

    Object.entries(tagRefs.current).forEach(([otherId, other]) => {
      if (otherId === id || !other) return;

      const otherBounds = other.getBoundingClientRect();
      const otherLeft = otherBounds.left - containerBounds.left;
      const otherTop = otherBounds.top - containerBounds.top;
      const overlap =
        Math.min(tagVisualRight, otherLeft + otherBounds.width) -
        Math.max(tagVisualLeft, otherLeft);
      const enoughOverlap =
        overlap > Math.min(tagBounds.width, otherBounds.width) * 0.22;
      const surfaceIsBelow =
        otherTop >= y + tagVisualTopOffset + tagBounds.height * 0.45;

      if (enoughOverlap && surfaceIsBelow) {
        landingY = Math.min(landingY, otherTop - tagVisualBottomOffset);
      }
    });

    return Math.max(0, landingY);
  }

  function dropTag(id, tag, container, startX, startY) {
    stopFalling(id);

    let x = startX;
    let y = startY;
    let velocity = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fall() {
      const landingY = findLandingY(id, x, y, tag, container);

      if (reduceMotion) {
        y = landingY;
      } else {
        velocity = Math.min(velocity + 0.9, 16);
        y = Math.min(y + velocity, landingY);
      }

      setPositions((current) => ({ ...current, [id]: { x, y } }));

      if (y >= landingY - 0.5) {
        delete animationRefs.current[id];
        queueLoosePills();
        return;
      }

      animationRefs.current[id] = requestAnimationFrame(fall);
    }

    animationRefs.current[id] = requestAnimationFrame(fall);
  }

  function beginDrag(event, id) {
    if (event.button !== 0) return;

    const container = wordStackRef.current;
    if (!container) return;

    const tag = event.currentTarget;
    stopFalling(id);
    dragRef.current?.cleanup?.();
    const nextLayer = topLayer + 1;
    const pointerId = event.pointerId;
    const startClientX = event.clientX;
    const startClientY = event.clientY;
    const startX = tag.offsetLeft;
    const startY = tag.offsetTop;
    let currentX = startX;
    let currentY = startY;

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

      currentX = x;
      currentY = y;
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
      dropTag(id, tag, container, currentX, currentY);
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
                  ref={(node) => {
                    tagRefs.current[tag.id] = node;
                  }}
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
