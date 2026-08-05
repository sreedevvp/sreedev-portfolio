"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function PageEffects() {
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [soundPrompt, setSoundPrompt] = useState(false);
  const [soundPromptClosing, setSoundPromptClosing] = useState(false);
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
        document.documentElement.dataset.portfolioLoaded = "true";
        setLoaded(true);
        window.dispatchEvent(new CustomEvent("portfolio:loaded"));
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
    const root = document.documentElement;
    const desktopViewport = window.matchMedia("(min-width: 901px)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let sectionObserver;
    let sectionFrame;
    let sections = [];

    const clearSectionMotion = () => {
      sectionObserver?.disconnect();
      window.cancelAnimationFrame(sectionFrame);
      sections.forEach((section) => {
        section.classList.remove(
          "section-scroll-reveal",
          "is-section-visible",
        );
      });
    };

    const configureSectionMotion = () => {
      clearSectionMotion();
      sections = [
        ...document.querySelectorAll("body > main section"),
      ].filter(
        (section) =>
          !section.hidden &&
          section.getAttribute("aria-hidden") !== "true" &&
          section.getBoundingClientRect().height > 80,
      );

      const isTouchDevice =
        coarsePointer.matches || navigator.maxTouchPoints > 0;
      const isScaledMobileDesktop = root.dataset.desktopView === "true";
      const shouldAnimate =
        desktopViewport.matches &&
        !isTouchDevice &&
        !isScaledMobileDesktop &&
        !reduceMotion.matches;

      if (!shouldAnimate) return;

      sections.forEach((section) =>
        section.classList.add("section-scroll-reveal"),
      );

      sectionObserver = new IntersectionObserver(
        (entries) => {
          const visibleSections = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (first, second) =>
                first.boundingClientRect.top -
                second.boundingClientRect.top,
            );

          if (!visibleSections.length) return;

          window.requestAnimationFrame(() => {
            visibleSections.forEach((entry) => {
              entry.target.classList.add("is-section-visible");
              sectionObserver?.unobserve(entry.target);
            });
          });
        },
        {
          threshold: 0.08,
          rootMargin: "0px 0px -6% 0px",
        },
      );

      sectionFrame = window.requestAnimationFrame(() => {
        sections.forEach((section) => sectionObserver?.observe(section));
      });
    };

    configureSectionMotion();

    desktopViewport.addEventListener("change", configureSectionMotion);
    coarsePointer.addEventListener("change", configureSectionMotion);
    reduceMotion.addEventListener("change", configureSectionMotion);

    const desktopModeObserver = new MutationObserver(
      configureSectionMotion,
    );
    desktopModeObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-desktop-view"],
    });

    return () => {
      clearSectionMotion();
      desktopViewport.removeEventListener("change", configureSectionMotion);
      coarsePointer.removeEventListener("change", configureSectionMotion);
      reduceMotion.removeEventListener("change", configureSectionMotion);
      desktopModeObserver.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!navigating) return undefined;
    const safetyTimer = window.setTimeout(() => setNavigating(false), 4000);
    return () => window.clearTimeout(safetyTimer);
  }, [navigating]);

  useEffect(() => {
    if (!loaded) return undefined;

    const desktopViewport = window.matchMedia("(min-width: 901px)").matches;
    const touchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    const scaledMobileDesktop =
      document.documentElement.dataset.desktopView === "true";

    if (!desktopViewport || touchDevice || scaledMobileDesktop) return undefined;

    const showFrame = window.requestAnimationFrame(() => setSoundPrompt(true));
    return () => window.cancelAnimationFrame(showFrame);
  }, [loaded]);

  useEffect(() => {
    if (!soundPrompt) return undefined;

    const root = document.documentElement;
    root.dataset.soundPrompt = "true";

    const autoDismiss = window.setTimeout(() => {
      setSoundPromptClosing(true);
    }, 3000);
    const removePrompt = window.setTimeout(() => {
      setSoundPrompt(false);
      setSoundPromptClosing(false);
    }, 3400);

    return () => {
      window.clearTimeout(autoDismiss);
      window.clearTimeout(removePrompt);
      delete root.dataset.soundPrompt;
    };
  }, [soundPrompt]);

  const dismissSoundPrompt = () => {
    setSoundPromptClosing(true);
    window.setTimeout(() => {
      setSoundPrompt(false);
      setSoundPromptClosing(false);
    }, 400);
  };

  const enableSound = () => {
    window.dispatchEvent(new CustomEvent("portfolio:audio-enable"));
    dismissSoundPrompt();
  };

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
      {soundPrompt && (
        <div
          className={`mobile-experience-backdrop sound-experience-backdrop${
            soundPromptClosing ? " is-leaving" : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sound-experience-title"
        >
          <section className="mobile-experience-dialog sound-experience-dialog">
            <h2 id="sound-experience-title">
              This portfolio sounds better
              <br />
              with music.
            </h2>
            <div className="mobile-experience-actions">
              <button
                className="mobile-experience-primary"
                type="button"
                onClick={enableSound}
              >
                Sound on
              </button>
              <button
                className="mobile-experience-secondary"
                type="button"
                onClick={dismissSoundPrompt}
              >
                No sound
              </button>
            </div>
          </section>
        </div>
      )}
      <div className="floating-theme-toggle">
        <ThemeToggle />
      </div>
    </>
  );
}
