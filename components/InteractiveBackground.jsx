"use client";

import { useEffect, useRef } from "react";

const PERMUTATION = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7,
  225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6,
  148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35,
  11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,
  168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231,
  83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245,
  40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132,
  187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164,
  100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
  38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58,
  17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154,
  163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19,
  98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
  228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81,
  51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106,
  157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138,
  236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66,
  215, 61, 156, 180,
];

const GRADIENTS = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0, 1],
  [0, -1],
];

class PerlinNoise {
  constructor(seed = Math.random()) {
    this.permutation = new Array(512);
    this.gradients = new Array(512);
    this.seed(seed);
  }

  seed(value) {
    let seed = value;
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;

    for (let index = 0; index < 256; index += 1) {
      const mixed =
        index & 1
          ? PERMUTATION[index] ^ (seed & 255)
          : PERMUTATION[index] ^ ((seed >> 8) & 255);
      this.permutation[index] = this.permutation[index + 256] = mixed;
      this.gradients[index] = this.gradients[index + 256] =
        GRADIENTS[mixed % 12];
    }
  }

  fade(value) {
    return value * value * value * (value * (value * 6 - 15) + 10);
  }

  lerp(start, end, amount) {
    return (1 - amount) * start + amount * end;
  }

  dot(gradient, x, y) {
    return gradient[0] * x + gradient[1] * y;
  }

  perlin2(xValue, yValue) {
    let cellX = Math.floor(xValue);
    let cellY = Math.floor(yValue);
    const x = xValue - cellX;
    const y = yValue - cellY;
    cellX &= 255;
    cellY &= 255;

    const topLeft = this.dot(
      this.gradients[cellX + this.permutation[cellY]],
      x,
      y,
    );
    const bottomLeft = this.dot(
      this.gradients[cellX + this.permutation[cellY + 1]],
      x,
      y - 1,
    );
    const topRight = this.dot(
      this.gradients[cellX + 1 + this.permutation[cellY]],
      x - 1,
      y,
    );
    const bottomRight = this.dot(
      this.gradients[cellX + 1 + this.permutation[cellY + 1]],
      x - 1,
      y - 1,
    );
    const fadeX = this.fade(x);

    return this.lerp(
      this.lerp(topLeft, topRight, fadeX),
      this.lerp(bottomLeft, bottomRight, fadeX),
      this.fade(y),
    );
  }
}

const SETTINGS = {
  waveSpeedX: 0.02,
  waveSpeedY: 0.01,
  waveAmpX: 40,
  waveAmpY: 20,
  xGap: 12,
  yGap: 36,
  friction: 0.9,
  tension: 0.01,
  maxCursorMove: 120,
};

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!context) return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const noise = new PerlinNoise();
    const bounds = { width: 0, height: 0, left: 0, top: 0 };
    const pointer = {
      x: -10,
      y: 0,
      lastX: 0,
      lastY: 0,
      smoothX: 0,
      smoothY: 0,
      speed: 0,
      smoothSpeed: 0,
      angle: 0,
      set: false,
    };
    let lines = [];
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastFrameTime = 0;
    let isRunning = false;
    let lineColor = "rgba(0, 0, 0, 0.05)";
    const frameInterval = navigator.hardwareConcurrency <= 4 ? 1000 / 40 : 0;

    const syncTheme = () => {
      const themedLine = window
        .getComputedStyle(document.documentElement)
        .getPropertyValue("--background-line")
        .trim();
      lineColor = themedLine || "rgba(0, 0, 0, 0.05)";
    };

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      bounds.width = rect.width;
      bounds.height = rect.height;
      bounds.left = rect.left;
      bounds.top = rect.top;
      canvas.width = rect.width;
      canvas.height = rect.height;

      const fieldWidth = rect.width + 200;
      const fieldHeight = rect.height + 30;
      const columns = Math.ceil(fieldWidth / SETTINGS.xGap);
      const rows = Math.ceil(fieldHeight / SETTINGS.yGap);
      const offsetX = (rect.width - SETTINGS.xGap * columns) / 2;
      const offsetY = (rect.height - SETTINGS.yGap * rows) / 2;

      lines = [];
      for (let column = 0; column <= columns; column += 1) {
        const line = [];
        for (let row = 0; row <= rows; row += 1) {
          line.push({
            x: offsetX + SETTINGS.xGap * column,
            y: offsetY + SETTINGS.yGap * row,
            wave: { x: 0, y: 0 },
            cursor: { x: 0, y: 0, velocityX: 0, velocityY: 0 },
          });
        }
        lines.push(line);
      }
    };

    const queueResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeCanvas();
        if (reducedMotion.matches) {
          updateField(0);
          drawField();
        }
      });
    };

    const setPointer = (clientX, clientY) => {
      pointer.x = clientX - bounds.left;
      pointer.y = clientY - bounds.top;
      if (!pointer.set) {
        pointer.smoothX = pointer.x;
        pointer.smoothY = pointer.y;
        pointer.lastX = pointer.x;
        pointer.lastY = pointer.y;
        pointer.set = true;
      }
    };

    const handlePointerMove = (event) => setPointer(event.clientX, event.clientY);

    const updateField = (time) => {
      for (const line of lines) {
        for (const point of line) {
          const phase =
            12 *
            noise.perlin2(
              0.002 * (point.x + time * SETTINGS.waveSpeedX),
              0.0015 * (point.y + time * SETTINGS.waveSpeedY),
            );
          point.wave.x = Math.cos(phase) * SETTINGS.waveAmpX;
          point.wave.y = Math.sin(phase) * SETTINGS.waveAmpY;

          const deltaX = point.x - pointer.smoothX;
          const deltaY = point.y - pointer.smoothY;
          const distance = Math.hypot(deltaX, deltaY);
          const radius = Math.max(175, pointer.smoothSpeed);

          if (distance < radius) {
            const falloff = 1 - distance / radius;
            const force = Math.cos(0.001 * distance) * falloff;
            point.cursor.velocityX +=
              Math.cos(pointer.angle) *
              force *
              radius *
              pointer.smoothSpeed *
              0.00065;
            point.cursor.velocityY +=
              Math.sin(pointer.angle) *
              force *
              radius *
              pointer.smoothSpeed *
              0.00065;
          }

          point.cursor.velocityX +=
            (0 - point.cursor.x) * SETTINGS.tension;
          point.cursor.velocityY +=
            (0 - point.cursor.y) * SETTINGS.tension;
          point.cursor.velocityX *= SETTINGS.friction;
          point.cursor.velocityY *= SETTINGS.friction;
          point.cursor.x += 2 * point.cursor.velocityX;
          point.cursor.y += 2 * point.cursor.velocityY;
          point.cursor.x = Math.min(
            SETTINGS.maxCursorMove,
            Math.max(-SETTINGS.maxCursorMove, point.cursor.x),
          );
          point.cursor.y = Math.min(
            SETTINGS.maxCursorMove,
            Math.max(-SETTINGS.maxCursorMove, point.cursor.y),
          );
        }
      }
    };

    const pointPosition = (point, includeCursor = true) => ({
      x: Math.round(
        10 *
          (point.x +
            point.wave.x +
            (includeCursor ? point.cursor.x : 0)),
      ) / 10,
      y: Math.round(
        10 *
          (point.y +
            point.wave.y +
            (includeCursor ? point.cursor.y : 0)),
      ) / 10,
    });

    const drawField = () => {
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.beginPath();
      context.strokeStyle = lineColor;
      context.lineWidth = 1;

      for (const line of lines) {
        let position = pointPosition(line[0], false);
        context.moveTo(position.x, position.y);

        line.forEach((point, index) => {
          const last = index === line.length - 1;
          position = pointPosition(point, !last);
          const next = pointPosition(line[index + 1] || line.at(-1), !last);
          context.lineTo(position.x, position.y);
          if (last) context.moveTo(next.x, next.y);
        });
      }

      context.stroke();
    };

    const render = (time) => {
      if (!isRunning) return;

      if (frameInterval && time - lastFrameTime < frameInterval) {
        animationFrame = window.requestAnimationFrame(render);
        return;
      }
      lastFrameTime = time;

      pointer.smoothX += 0.1 * (pointer.x - pointer.smoothX);
      pointer.smoothY += 0.1 * (pointer.y - pointer.smoothY);

      const velocityX = pointer.x - pointer.lastX;
      const velocityY = pointer.y - pointer.lastY;
      pointer.speed = Math.hypot(velocityX, velocityY);
      pointer.smoothSpeed += 0.1 * (pointer.speed - pointer.smoothSpeed);
      pointer.smoothSpeed = Math.min(100, pointer.smoothSpeed);
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;
      pointer.angle = Math.atan2(velocityY, velocityX);

      container.style.setProperty("--x", `${pointer.smoothX}px`);
      container.style.setProperty("--y", `${pointer.smoothY}px`);
      updateField(reducedMotion.matches ? 0 : time);
      drawField();

      if (!reducedMotion.matches && isRunning) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const stopRendering = () => {
      isRunning = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const startRendering = () => {
      stopRendering();
      if (document.hidden) return;
      isRunning = true;
      lastFrameTime = 0;
      animationFrame = window.requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopRendering();
      else startRendering();
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        stopRendering();
        updateField(0);
        drawField();
      } else {
        startRendering();
      }
    };

    const themeObserver = new MutationObserver(syncTheme);

    syncTheme();
    resizeCanvas();
    startRendering();
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    window.addEventListener("resize", queueResize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreference);

    return () => {
      stopRendering();
      window.cancelAnimationFrame(resizeFrame);
      themeObserver.disconnect();
      window.removeEventListener("resize", queueResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-background"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
