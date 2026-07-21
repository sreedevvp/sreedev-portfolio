"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PiDesktop,
  PiDeviceMobile,
  PiEnvelopeSimple,
  PiHouseSimple,
  PiSquaresFour,
  PiUserCircle,
  PiX,
} from "react-icons/pi";
import MusicPlayer from "./MusicPlayer";

const links = [
  { href: "/", label: "Home", Icon: PiHouseSimple },
  { href: "/about", label: "About", Icon: PiUserCircle },
  { href: "/works", label: "Works", Icon: PiSquaresFour },
  { href: "/contact", label: "Contact", Icon: PiEnvelopeSimple },
];

const VIEW_MODE_KEY = "sreedev-view-mode";
const DESKTOP_VIEW_WIDTH = 1280;

function applyDesktopViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  const landscape = window.matchMedia("(orientation: landscape)").matches;
  const screenWidth = landscape
    ? Math.max(window.screen.width, window.screen.height)
    : Math.min(window.screen.width, window.screen.height);
  const desktopScale = Math.min(1, screenWidth / DESKTOP_VIEW_WIDTH);
  const interfaceScale = DESKTOP_VIEW_WIDTH / screenWidth;

  viewport.setAttribute(
    "content",
    `width=${DESKTOP_VIEW_WIDTH}, initial-scale=${desktopScale}`,
  );
  document.documentElement.dataset.desktopView = "true";
  document.documentElement.style.setProperty(
    "--desktop-interface-scale",
    interfaceScale.toString(),
  );
}

function restoreMobileViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) return;

  viewport.setAttribute("content", "width=device-width, initial-scale=1");
  delete document.documentElement.dataset.desktopView;
  document.documentElement.style.removeProperty("--desktop-interface-scale");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const routeIndex = pathname.startsWith("/about")
    ? 1
    : pathname.startsWith("/works")
      ? 2
      : pathname.startsWith("/contact")
        ? 3
        : 0;
  const [activeIndex, setActiveIndex] = useState(routeIndex);
  const [isMobileViewer, setIsMobileViewer] = useState(false);
  const [desktopView, setDesktopView] = useState(false);
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [mobileDialog, setMobileDialog] = useState(null);
  const recommendationShown = useRef(false);

  useEffect(() => {
    const syncActiveItem = () => {
      setActiveIndex(routeIndex);
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);
    return () => window.removeEventListener("hashchange", syncActiveItem);
  }, [routeIndex]);

  useEffect(() => {
    const compactScreen =
      Math.min(window.screen.width, window.screen.height) <= 900;
    const touchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    setIsMobileViewer(compactScreen && touchDevice);

    if (sessionStorage.getItem(VIEW_MODE_KEY) === "desktop") {
      applyDesktopViewport();
      setDesktopView(true);
    }
  }, []);

  useEffect(() => {
    const handleLoaded = () => setSiteLoaded(true);

    if (document.documentElement.dataset.portfolioLoaded === "true") {
      handleLoaded();
    }

    window.addEventListener("portfolio:loaded", handleLoaded);
    return () => window.removeEventListener("portfolio:loaded", handleLoaded);
  }, []);

  useEffect(() => {
    if (
      !siteLoaded ||
      !isMobileViewer ||
      desktopView ||
      recommendationShown.current
    ) {
      return;
    }

    recommendationShown.current = true;
    setMobileDialog("recommendation");
  }, [desktopView, isMobileViewer, siteLoaded]);

  useEffect(() => {
    if (!desktopView) return undefined;

    const frame = window.requestAnimationFrame(applyDesktopViewport);
    const routeTimer = window.setTimeout(applyDesktopViewport, 180);
    const viewportObserver = new MutationObserver(() => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport?.content.includes(`width=${DESKTOP_VIEW_WIDTH}`)) {
        applyDesktopViewport();
      }
    });

    viewportObserver.observe(document.head, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(routeTimer);
      viewportObserver.disconnect();
    };
  }, [desktopView, pathname]);

  useEffect(() => {
    if (mobileDialog !== "rotate") return undefined;

    const dismissWhenLandscape = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setMobileDialog(null);
      }
    };

    dismissWhenLandscape();
    window.addEventListener("orientationchange", dismissWhenLandscape);
    return () => window.removeEventListener("orientationchange", dismissWhenLandscape);
  }, [mobileDialog]);

  const toggleDesktopView = async () => {
    const nextDesktopView = !desktopView;

    if (nextDesktopView) {
      try {
        await window.screen.orientation?.lock?.("landscape");
      } catch (_) {
        // Orientation locking is restricted by some mobile browsers.
      }

      applyDesktopViewport();
      sessionStorage.setItem(VIEW_MODE_KEY, "desktop");
      setMobileDialog("rotate");
    } else {
      restoreMobileViewport();
      sessionStorage.removeItem(VIEW_MODE_KEY);
      setMobileDialog(null);

      try {
        window.screen.orientation?.unlock?.();
      } catch (_) {
        // Some browsers expose orientation information without unlock support.
      }
    }

    setDesktopView(nextDesktopView);
    window.dispatchEvent(new Event("resize"));
  };

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Go to home">
          DEV.DESIGNS
        </Link>

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
          style={{ "--active-index": activeIndex }}
        >
          <span className="nav-indicator" aria-hidden="true"></span>
          {links.map((link, index) => (
            <Link
              className={activeIndex === index ? "active" : ""}
              href={link.href}
              key={link.label}
              aria-current={activeIndex === index ? "page" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {isMobileViewer && (
            <button
              className={`desktop-view-toggle${desktopView ? " is-active" : ""}`}
              type="button"
              aria-label={desktopView ? "Return to mobile view" : "Switch to desktop view"}
              aria-pressed={desktopView}
              title={desktopView ? "Mobile view" : "Desktop view"}
              onClick={toggleDesktopView}
            >
              {desktopView ? <PiDeviceMobile /> : <PiDesktop />}
            </button>
          )}
          <MusicPlayer />
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {links.map((link, index) => {
          const Icon = link.Icon;
          return (
          <Link
            className={activeIndex === index ? "active" : ""}
            href={link.href}
            key={link.label}
            aria-current={activeIndex === index ? "page" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              <Icon />
            </span>
            <b>{link.label}</b>
          </Link>
          );
        })}
      </nav>

      {mobileDialog && (
        <div className="mobile-experience-backdrop" role="presentation">
          <section
            className={`mobile-experience-dialog${
              mobileDialog === "rotate" ? " is-rotate" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-experience-title"
          >
            <button
              className="mobile-experience-close"
              type="button"
              aria-label="Close message"
              onClick={() => setMobileDialog(null)}
            >
              <PiX />
            </button>

            <p className="mobile-experience-kicker">
              {mobileDialog === "rotate" ? "One last move" : "Full experience"}
            </p>
            <h2 id="mobile-experience-title">
              {mobileDialog === "rotate"
                ? "Rotate your screen."
                : "This portfolio looks more dope in desktop mode."}
            </h2>
            <p className="mobile-experience-copy">
              {mobileDialog === "rotate"
                ? "Turn your phone sideways to see the work with more space and detail."
                : "Switch to the wider layout for the full visual experience, or keep exploring in mobile view."}
            </p>

            <div className="mobile-experience-actions">
              {mobileDialog === "recommendation" ? (
                <>
                  <button
                    className="mobile-experience-primary"
                    type="button"
                    onClick={toggleDesktopView}
                  >
                    Switch to desktop
                  </button>
                  <button
                    className="mobile-experience-secondary"
                    type="button"
                    onClick={() => setMobileDialog(null)}
                  >
                    Continue mobile
                  </button>
                </>
              ) : (
                <button
                  className="mobile-experience-primary"
                  type="button"
                  onClick={() => setMobileDialog(null)}
                >
                  Got it
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
