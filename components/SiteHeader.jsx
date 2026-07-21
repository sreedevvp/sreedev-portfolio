"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PiDesktop,
  PiDeviceMobile,
  PiEnvelopeSimple,
  PiHouseSimple,
  PiSquaresFour,
  PiUserCircle,
} from "react-icons/pi";
import MusicPlayer from "./MusicPlayer";

const links = [
  { href: "/", label: "Home", Icon: PiHouseSimple },
  { href: "/about", label: "About", Icon: PiUserCircle },
  { href: "/works", label: "Works", Icon: PiSquaresFour },
  { href: "/contact", label: "Contact", Icon: PiEnvelopeSimple },
];

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

  useEffect(() => {
    const syncActiveItem = () => {
      setActiveIndex(routeIndex);
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);
    return () => window.removeEventListener("hashchange", syncActiveItem);
  }, [routeIndex]);

  useEffect(() => {
    const compactScreen = window.matchMedia("(max-width: 900px)");
    const touchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;

    setIsMobileViewer(compactScreen.matches && touchDevice);
  }, []);

  const toggleDesktopView = async () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    const nextDesktopView = !desktopView;

    if (nextDesktopView) {
      try {
        await window.screen.orientation?.lock?.("landscape");
      } catch (_) {
        // Orientation locking is restricted by some mobile browsers.
      }

      const desktopWidth = 1280;
      const landscape = window.matchMedia("(orientation: landscape)").matches;
      const screenWidth = landscape
        ? Math.max(window.screen.width, window.screen.height)
        : Math.min(window.screen.width, window.screen.height);
      const desktopScale = Math.min(1, screenWidth / desktopWidth);

      viewport.setAttribute(
        "content",
        `width=${desktopWidth}, initial-scale=${desktopScale}`,
      );
      document.documentElement.dataset.desktopView = "true";
    } else {
      viewport.setAttribute("content", "width=device-width, initial-scale=1");
      delete document.documentElement.dataset.desktopView;

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
    </>
  );
}
