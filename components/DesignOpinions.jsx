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
  const physicsRef = useRef(null);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const container = wordStackRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let resizeFrame = 0;
    let animationFrame = 0;
    let resizeObserver;

    async function startPhysics() {
      const module = await import("matter-js");
      if (cancelled) return;

      const Matter = module.default ?? module;
      const { Bodies, Body, Composite, Engine, Events, World } = Matter;

      function destroyPhysics() {
        cancelAnimationFrame(animationFrame);
        dragRef.current?.cleanup?.();
        dragRef.current = null;

        if (physicsRef.current?.engine) {
          Events.off(physicsRef.current.engine);
          World.clear(physicsRef.current.engine.world, false);
          Engine.clear(physicsRef.current.engine);
        }
      }

      function renderBodies() {
        const physics = physicsRef.current;
        if (!physics) return;

        Object.entries(physics.bodies).forEach(([id, body]) => {
          const tag = tagRefs.current[id];
          if (!tag) return;

          tag.style.transform = `translate3d(${
            body.position.x - body.boundsWidth / 2
          }px, ${body.position.y - body.boundsHeight / 2}px, 0) rotate(${
            body.angle
          }rad)`;
        });
      }

      function buildPhysics() {
        destroyPhysics();

        const width = container.clientWidth;
        const height = container.clientHeight;
        if (!width || !height) return;

        const engine = Engine.create({
          gravity: { x: 0, y: 1.15, scale: 0.001 },
          positionIterations: 10,
          velocityIterations: 8,
          constraintIterations: 4,
          enableSleeping: true,
        });

        const bodies = {};
        const bodyOptions = {
          chamfer: { radius: 32 },
          density: 0.002,
          friction: 0.72,
          frictionAir: 0.025,
          restitution: 0.08,
          sleepThreshold: 50,
        };

        wordTags.forEach(({ id }) => {
          const tag = tagRefs.current[id];
          const bodyWidth = tag.offsetWidth;
          const bodyHeight = tag.offsetHeight;
          const body = Bodies.rectangle(0, 0, bodyWidth, bodyHeight, {
            ...bodyOptions,
            label: id,
          });

          body.boundsWidth = bodyWidth;
          body.boundsHeight = bodyHeight;
          bodies[id] = body;
        });

        const wallThickness = 80;
        const walls = [
          Bodies.rectangle(
            width / 2,
            height + wallThickness / 2,
            width + wallThickness * 2,
            wallThickness,
            { isStatic: true, label: "floor", friction: 0.9 },
          ),
          Bodies.rectangle(
            -wallThickness / 2,
            height / 2,
            wallThickness,
            height * 2,
            { isStatic: true, label: "left-wall" },
          ),
          Bodies.rectangle(
            width + wallThickness / 2,
            height / 2,
            wallThickness,
            height * 2,
            { isStatic: true, label: "right-wall" },
          ),
        ];

        const stackOrder = [
          { id: "should", angle: -0.03, x: 0.58 },
          { id: "say-exactly", angle: 0.04, x: 0.56 },
          { id: "buttons", angle: -0.18, x: 0.48 },
          { id: "what-they-do", angle: -0.08, x: 0.53 },
        ];
        let nextBottom = height - 2;

        stackOrder.forEach(({ id, angle, x }) => {
          const body = bodies[id];
          const y = nextBottom - body.boundsHeight / 2;
          Body.setPosition(body, { x: width * x, y });
          Body.setAngle(body, angle);
          nextBottom = y - body.boundsHeight / 2 + 5;
        });

        Composite.add(engine.world, [...walls, ...Object.values(bodies)]);

        // Start with the same already-settled pile seen on the reference card.
        for (let step = 0; step < 150; step += 1) {
          Engine.update(engine, 1000 / 60);
        }

        physicsRef.current = { Matter, engine, bodies, width, height };
        renderBodies();

        let previousTime = performance.now();
        function tick(time) {
          const delta = Math.min(time - previousTime, 1000 / 30);
          previousTime = time;
          Engine.update(engine, delta);
          renderBodies();
          animationFrame = requestAnimationFrame(tick);
        }

        animationFrame = requestAnimationFrame(tick);
      }

      physicsRef.current = { Matter };
      buildPhysics();

      resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(buildPhysics);
      });
      resizeObserver.observe(container);
    }

    startPhysics();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      cancelAnimationFrame(resizeFrame);
      cancelAnimationFrame(animationFrame);
      dragRef.current?.cleanup?.();

      const physics = physicsRef.current;
      if (physics?.engine) {
        physics.Matter.Events.off(physics.engine);
        physics.Matter.World.clear(physics.engine.world, false);
        physics.Matter.Engine.clear(physics.engine);
      }
      physicsRef.current = null;
    };
  }, []);

  function beginDrag(event, id) {
    if (event.button !== 0) return;

    const container = wordStackRef.current;
    const physics = physicsRef.current;
    const body = physics?.bodies?.[id];
    if (!container || !body) return;

    const tag = event.currentTarget;
    dragRef.current?.cleanup?.();
    const { Body, Sleeping } = physics.Matter;
    const pointerId = event.pointerId;
    const containerBounds = container.getBoundingClientRect();
    const startPointer = {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    };
    const pointerOffset = {
      x: startPointer.x - body.position.x,
      y: startPointer.y - body.position.y,
    };
    let previousPoint = startPointer;
    let previousTime = performance.now();
    let releaseVelocity = { x: 0, y: 0 };

    Object.values(physics.bodies).forEach((physicsBody) => {
      Sleeping.set(physicsBody, false);
    });
    Sleeping.set(body, false);
    Body.setStatic(body, true);
    tag.style.zIndex = "20";

    function movePointer(moveEvent) {
      if (moveEvent.pointerId !== pointerId) return;

      const now = performance.now();
      const point = {
        x: moveEvent.clientX - containerBounds.left,
        y: moveEvent.clientY - containerBounds.top,
      };
      const x = Math.min(
        Math.max(body.boundsWidth / 2, point.x - pointerOffset.x),
        container.clientWidth - body.boundsWidth / 2,
      );
      const y = Math.min(
        Math.max(body.boundsHeight / 2, point.y - pointerOffset.y),
        container.clientHeight - body.boundsHeight / 2,
      );
      const elapsed = Math.max(8, now - previousTime);

      releaseVelocity = {
        x: ((point.x - previousPoint.x) / elapsed) * 5,
        y: ((point.y - previousPoint.y) / elapsed) * 5,
      };
      previousPoint = point;
      previousTime = now;
      Body.setPosition(body, { x, y });
      Object.values(physics.bodies).forEach((physicsBody) => {
        if (physicsBody !== body) Sleeping.set(physicsBody, false);
      });
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
      tag.style.zIndex = "";
      Body.setStatic(body, false);
      Sleeping.set(body, false);
      Body.setVelocity(body, releaseVelocity);
      Object.values(physics.bodies).forEach((physicsBody) => {
        Sleeping.set(physicsBody, false);
      });
    }

    dragRef.current = {
      id,
      pointerId,
      cleanup,
    };

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
