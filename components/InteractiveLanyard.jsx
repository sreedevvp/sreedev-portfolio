"use client";

import { useEffect, useId, useRef } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function InteractiveLanyard() {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const strapRef = useRef(null);
  const shadowRef = useRef(null);
  const pathId = useId().replaceAll(":", "");

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const strap = strapRef.current;
    const shadow = shadowRef.current;
    if (!stage || !card || !strap || !shadow) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const physics = {
      width: 0,
      height: 0,
      cardWidth: 0,
      anchorX: 0,
      anchorY: -18,
      restLength: 210,
      x: 0,
      y: 210,
      vx: 26,
      vy: 0,
      rotation: 0,
      rotationVelocity: 0,
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
      dragX: 0,
      dragY: 0,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastPointerTime: 0,
      pointerVelocityX: 0,
      pointerVelocityY: 0,
      glareX: 50,
      glareY: 24,
      dragging: false,
      initialized: false,
    };

    function resize() {
      const rect = stage.getBoundingClientRect();
      const previousAnchorX = physics.anchorX;
      physics.width = rect.width;
      physics.height = rect.height;
      physics.cardWidth = card.getBoundingClientRect().width;
      physics.anchorX =
        rect.width > 900 ? rect.width * 0.74 : rect.width / 2;
      physics.restLength = clamp(rect.height * 0.3, 148, 215);

      if (!physics.initialized) {
        physics.x = physics.anchorX + Math.min(28, rect.width * 0.06);
        physics.y = physics.anchorY + physics.restLength;
        physics.initialized = true;
      } else {
        physics.x += physics.anchorX - previousAnchorX;
      }
    }

    function pointerPosition(event) {
      const rect = stage.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    function updatePointerVelocity(position, time) {
      const elapsed = Math.max(8, time - physics.lastPointerTime) / 1000;
      const nextVelocityX = (position.x - physics.lastPointerX) / elapsed;
      const nextVelocityY = (position.y - physics.lastPointerY) / elapsed;
      physics.pointerVelocityX =
        physics.pointerVelocityX * 0.64 + nextVelocityX * 0.36;
      physics.pointerVelocityY =
        physics.pointerVelocityY * 0.64 + nextVelocityY * 0.36;
      physics.lastPointerX = position.x;
      physics.lastPointerY = position.y;
      physics.lastPointerTime = time;
    }

    function onPointerDown(event) {
      if (event.button !== 0 && event.pointerType !== "touch") return;
      const position = pointerPosition(event);
      physics.dragging = true;
      physics.dragOffsetX = position.x - physics.x;
      physics.dragOffsetY = position.y - physics.y;
      physics.dragX = physics.x;
      physics.dragY = physics.y;
      physics.lastPointerX = position.x;
      physics.lastPointerY = position.y;
      physics.lastPointerTime = event.timeStamp;
      physics.pointerVelocityX = 0;
      physics.pointerVelocityY = 0;
      card.setPointerCapture?.(event.pointerId);
      stage.classList.add("is-dragging");
    }

    function onPointerMove(event) {
      const position = pointerPosition(event);
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const localX = event.clientX - cardCenterX;
      const localY = event.clientY - cardCenterY;
      const proximityWidth = cardRect.width * 0.92;
      const proximityHeight = cardRect.height * 0.68;
      const distance = Math.hypot(
        localX / Math.max(1, proximityWidth),
        localY / Math.max(1, proximityHeight),
      );
      const proximity = clamp(1 - distance, 0, 1);
      const smoothProximity =
        proximity * proximity * (3 - 2 * proximity);
      const normalizedX = clamp(
        localX / Math.max(1, cardRect.width / 2),
        -1,
        1,
      );
      const normalizedY = clamp(
        localY / Math.max(1, cardRect.height / 2),
        -1,
        1,
      );

      physics.targetTiltY =
        normalizedX * 17 * smoothProximity;
      physics.targetTiltX =
        normalizedY * -12 * smoothProximity;
      physics.glareX = clamp(50 - normalizedX * 42, 8, 92);
      physics.glareY = clamp(45 - normalizedY * 38, 8, 88);

      if (!physics.dragging) return;
      updatePointerVelocity(position, event.timeStamp);
      const horizontalInset = Math.max(42, physics.cardWidth * 0.42);
      physics.dragX = clamp(
        position.x - physics.dragOffsetX,
        horizontalInset,
        physics.width - horizontalInset,
      );
      physics.dragY = clamp(
        position.y - physics.dragOffsetY,
        48,
        physics.height - 110,
      );
    }

    function release(event) {
      if (!physics.dragging) return;
      physics.dragging = false;
      physics.vx = clamp(
        physics.vx * 0.28 + physics.pointerVelocityX * 0.72,
        -1650,
        1650,
      );
      physics.vy = clamp(
        physics.vy * 0.28 + physics.pointerVelocityY * 0.72,
        -1350,
        1450,
      );
      if (event?.pointerId != null && card.hasPointerCapture?.(event.pointerId)) {
        card.releasePointerCapture(event.pointerId);
      }
      stage.classList.remove("is-dragging");
    }

    function onPointerLeave() {
      if (!physics.dragging) {
        physics.targetTiltX = 0;
        physics.targetTiltY = 0;
        physics.glareX = 50;
        physics.glareY = 24;
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    resize();

    card.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    let previousTime = performance.now();
    let accumulator = 0;
    const fixedStep = 1 / 120;

    function simulate(dt, time) {
      if (physics.dragging) {
        const stiffness = 72;
        const damping = 16;
        const ax =
          (physics.dragX - physics.x) * stiffness - physics.vx * damping;
        const ay =
          (physics.dragY - physics.y) * stiffness - physics.vy * damping;
        physics.vx += ax * dt;
        physics.vy += ay * dt;
      } else if (!reducedMotion.matches) {
        const offsetX = physics.x - physics.anchorX;
        const homeY =
          physics.anchorY +
          physics.restLength -
          Math.min(Math.abs(offsetX) * 0.12, physics.restLength * 0.28);
        const horizontalSpring =
          -10.5 * offsetX -
          0.000012 * offsetX * offsetX * offsetX -
          3.55 * physics.vx;
        const verticalSpring =
          -16.5 * (physics.y - homeY) - 4.9 * physics.vy;

        physics.vx += horizontalSpring * dt;
        physics.vy += verticalSpring * dt;
        physics.vx += Math.sin(time * 0.00065) * 0.8 * dt;
      } else {
        physics.x += (physics.anchorX - physics.x) * Math.min(1, dt * 8);
        physics.y +=
          (physics.anchorY + physics.restLength - physics.y) *
          Math.min(1, dt * 8);
        physics.vx = 0;
        physics.vy = 0;
      }

      physics.x += physics.vx * dt;
      physics.y += physics.vy * dt;
    }

    function render(time) {
      const elapsed = Math.min(
        0.05,
        Math.max(0.001, (time - previousTime) / 1000),
      );
      previousTime = time;
      accumulator += elapsed;

      while (accumulator >= fixedStep) {
        simulate(fixedStep, time);
        accumulator -= fixedStep;
      }

      const angle = Math.atan2(
        physics.x - physics.anchorX,
        physics.y - physics.anchorY,
      );
      const targetRotation =
        angle * 0.78 + clamp(physics.vx * 0.00052, -0.38, 0.38);
      physics.rotationVelocity +=
        (targetRotation - physics.rotation) * 0.075;
      physics.rotationVelocity *= 0.86;
      physics.rotation += physics.rotationVelocity;

      physics.tiltX +=
        (physics.targetTiltX - physics.tiltX) * 0.105;
      physics.tiltY +=
        (physics.targetTiltY - physics.tiltY) * 0.105;

      const velocityTiltX = physics.dragging
        ? clamp(-physics.pointerVelocityY * 0.006, -8, 8)
        : 0;
      const velocityTiltY = physics.dragging
        ? clamp(physics.pointerVelocityX * 0.008, -11, 11)
        : 0;

      const connectorY = physics.y - 45;
      const curveX =
        (physics.anchorX + physics.x) / 2 +
        clamp((physics.x - physics.anchorX) * -0.12, -24, 24);
      const curveY = (physics.anchorY + connectorY) / 2;
      strap.setAttribute(
        "d",
        `M ${physics.anchorX} ${physics.anchorY - 45} C ${physics.anchorX} ${curveY}, ${curveX} ${curveY}, ${physics.x} ${connectorY}`,
      );

      card.style.left = `${physics.x}px`;
      card.style.top = `${physics.y}px`;
      card.style.transform =
        `translate3d(-50%, 0, 0) rotateZ(${physics.rotation}rad) ` +
        `rotateX(${physics.tiltX + velocityTiltX}deg) ` +
        `rotateY(${physics.tiltY + velocityTiltY}deg) translateZ(0)`;
      card.style.setProperty("--glare-x", `${physics.glareX}%`);
      card.style.setProperty("--glare-y", `${physics.glareY}%`);
      card.style.setProperty(
        "--glare-opacity",
        `${clamp(0.2 + Math.abs(physics.tiltX + physics.tiltY) * 0.018, 0.2, 0.52)}`,
      );

      const swing = Math.abs(angle);
      shadow.style.left = `${physics.x}px`;
      shadow.style.top = `${Math.min(physics.height - 22, physics.y + 430)}px`;
      shadow.style.opacity = `${clamp(0.14 - swing * 0.06, 0.045, 0.14)}`;
      shadow.style.transform =
        `translateX(-50%) scale(${clamp(1 - swing * 0.28, 0.62, 1)}, 1)`;

      frame = requestAnimationFrame(render);
    }

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      card.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
    };
  }, []);

  return (
    <div
      className="lanyard-stage"
      ref={stageRef}
      aria-label="Interactive draggable Sreedev VP identity card"
    >
      <svg
        className="lanyard-strap"
        aria-hidden="true"
      >
        <path
          ref={strapRef}
          id={pathId}
          className="lanyard-strap-line"
          d="M 300 -40 C 300 80, 300 100, 300 160"
        />
        <text className="lanyard-strap-label">
          <textPath href={`#${pathId}`} startOffset="15%">
            SREEDEV VP · PRODUCT DESIGN ·
          </textPath>
        </text>
      </svg>

      <div className="lanyard-shadow" ref={shadowRef} aria-hidden="true" />

      <div className="lanyard-card" ref={cardRef}>
        <div className="lanyard-hardware" aria-hidden="true">
          <span className="hardware-ring" />
          <span className="hardware-neck" />
        </div>
        <div className="badge-shell">
          <img
            src="/card-design.png"
            alt="Sreedev VP, Product Designer identity card"
            draggable="false"
          />
          <span className="badge-glare" aria-hidden="true" />
        </div>
      </div>

      <p className="lanyard-hint">Drag the card</p>
    </div>
  );
}
