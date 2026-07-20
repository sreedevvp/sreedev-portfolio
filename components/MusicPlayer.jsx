"use client";

import { useEffect, useRef, useState } from "react";
import { PiWaveformThin } from "react-icons/pi";

const TRACK_URL = "/touch-the-sky.mp3";
const TRACK_LABEL = "Touch the sky (ye)";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const fadeFrameRef = useRef(null);
  const pointerStartRef = useRef(0);
  const draggedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    return () => {
      if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);
      audioRef.current?.pause();
    };
  }, []);

  function fadeVolume(target, duration, onComplete) {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);

    const startVolume = audio.volume;
    const startedAt = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      audio.volume = Math.max(0, Math.min(1, startVolume + (target - startVolume) * eased));

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        fadeFrameRef.current = null;
        onComplete?.();
      }
    }

    fadeFrameRef.current = requestAnimationFrame(step);
  }

  async function startTrack() {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio.volume = 0;
    setPlaying(true);

    try {
      await audio.play();
      fadeVolume(volume, 1200);
    } catch {
      setPlaying(false);
    }
  }

  function stopTrack() {
    const audio = audioRef.current;
    if (!audio) return;

    setPlaying(false);
    fadeVolume(0, 700, () => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function toggleTrack() {
    if (playing) stopTrack();
    else startTrack();
  }

  function updateVolume(clientX, target) {
    const rect = target.getBoundingClientRect();
    const nextVolume = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(nextVolume);
    if (audioRef.current) audioRef.current.volume = nextVolume;
  }

  function handlePointerDown(event) {
    pointerStartRef.current = event.clientX;
    draggedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || !playing) return;
    if (Math.abs(event.clientX - pointerStartRef.current) > 5) draggedRef.current = true;
    if (draggedRef.current) updateVolume(event.clientX, event.currentTarget);
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleClick(event) {
    if (draggedRef.current) {
      event.preventDefault();
      draggedRef.current = false;
      return;
    }
    toggleTrack();
  }

  function handleKeyDown(event) {
    if (!playing) return;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      const nextVolume = Math.min(1, volume + 0.05);
      setVolume(nextVolume);
      if (audioRef.current) audioRef.current.volume = nextVolume;
    }
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      const nextVolume = Math.max(0, volume - 0.05);
      setVolume(nextVolume);
      if (audioRef.current) audioRef.current.volume = nextVolume;
    }
  }

  return (
    <div
      className={`music-player${playing ? " is-playing" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        className="music-player-control"
        type="button"
        aria-label={
          playing
            ? `Stop ${TRACK_LABEL}. Volume ${Math.round(volume * 100)} percent. Use arrow keys or drag to change volume.`
            : `Play ${TRACK_LABEL}`
        }
        aria-pressed={playing}
        data-volume={Math.round(volume * 100)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          draggedRef.current = false;
        }}
      >
        <PiWaveformThin className="music-player-wave" aria-hidden="true" />
        <span
          className="music-player-label"
          style={{ "--music-progress": `${volume * 100}%` }}
        >
          {TRACK_LABEL}
        </span>
        <span className="music-player-volume" aria-hidden="true">
          {Math.round(volume * 100)}%
        </span>
      </button>

      <span className="music-player-hint" aria-hidden="true">
        {playing
          ? hovered
            ? "drag for volume · click to stop"
            : "click to stop"
          : "click to play"}
      </span>

      <audio
        ref={audioRef}
        src={TRACK_URL}
        preload="none"
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}
