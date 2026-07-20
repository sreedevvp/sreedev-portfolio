"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function PageEffects() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 420 : 2200;
    const holdDuration = reduceMotion ? 80 : 300;
    const startedAt = performance.now();
    const previousOverflow = document.body.style.overflow;
    let frame;
    let finishTimer;

    document.body.style.overflow = "hidden";

    const updateProgress = (time) => {
      const nextProgress = Math.min(100, Math.round(((time - startedAt) / duration) * 100));
      setLoadProgress(nextProgress);

      if (nextProgress < 100) {
        frame = window.requestAnimationFrame(updateProgress);
        return;
      }

      finishTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        setLoaded(true);
      }, holdDuration);
    };

    frame = window.requestAnimationFrame(updateProgress);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleInternalNavigation = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const destination = new URL(anchor.href, window.location.href);
      const isNewPage =
        destination.origin === window.location.origin &&
        destination.pathname !== window.location.pathname;

      if (isNewPage) setNavigating(true);
    };

    document.addEventListener("click", handleInternalNavigation, true);
    return () => document.removeEventListener("click", handleInternalNavigation, true);
  }, []);

  useEffect(() => {
    setNavigating(false);

    const main = document.querySelector("body > main");
    let routeTimer;
    let routeFrame;
    if (main) {
      main.classList.remove("route-enter");
      routeFrame = window.requestAnimationFrame(() => {
        main.classList.add("route-enter");
        routeTimer = window.setTimeout(() => main.classList.remove("route-enter"), 680);
      });
    }

    const revealItems = [...document.querySelectorAll(".reveal:not(.is-visible)")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visibleEntries.length) return;

        window.requestAnimationFrame(() => {
          visibleEntries.forEach((entry) => {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px 8% 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(routeFrame);
      window.clearTimeout(routeTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!navigating) return undefined;
    const safetyTimer = window.setTimeout(() => setNavigating(false), 4000);
    return () => window.clearTimeout(safetyTimer);
  }, [navigating]);

  return (
    <>
      <div className={`quote-loader ${loaded ? "hidden" : ""}`} aria-hidden="true">
        <div className="quote-loader-inner">
          <div className="quote-loader-copy">
            <p className="quote-loader-quote">
              “You lose your grip, and then you slip into the Masterpiece.”
            </p>
            <p className="quote-loader-attribution">— Leonard Cohen</p>
          </div>
          <div className="quote-loader-progress">
            <div className="quote-loader-track">
              <span
                className="quote-loader-fill"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <div className="quote-loader-meta">
              <span>Loading</span>
              <span>{loadProgress}%</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`route-progress ${navigating ? "is-active" : ""}`}
        aria-hidden="true"
      />
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>
    </>
  );
}
