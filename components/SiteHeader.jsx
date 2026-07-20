"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
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

  useEffect(() => {
    const syncActiveItem = () => {
      setActiveIndex(routeIndex);
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);
    return () => window.removeEventListener("hashchange", syncActiveItem);
  }, [routeIndex]);

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
