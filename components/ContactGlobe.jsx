"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";
import {
  FaChevronRight,
  FaCircle,
  FaLocationDot,
  FaWhatsapp,
} from "react-icons/fa6";
import {
  EMAIL_CONTACT_URL,
  WHATSAPP_CONTACT_URL,
} from "../lib/contactLinks";

const HOME = {
  city: "Kozhikode",
  region: "Kerala",
  latitude: 11.2588,
  longitude: 75.7804,
};

const GLOBE_THETA = 0.25;
const INITIAL_GLOBE_PHI = 3.6;
const DRAG_SENSITIVITY = 200;

const LOCATION_CACHE_KEY = "srdv-globe-location-v1";
const CACHE_LIFETIME = 30 * 60 * 1000;
const VISITOR_SESSION_KEY = "srdv-visitor-number-v1";

async function getTemperature(latitude, longitude, signal) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", latitude);
  url.searchParams.set("longitude", longitude);
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("forecast_days", "1");

  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Weather lookup failed");
  const data = await response.json();
  return Math.round(data.current.temperature_2m);
}

function formatPlace(location) {
  if (!location) return "your part of the world";
  if (location.city && location.region && location.city !== location.region) {
    return `${location.city}, ${location.region}`;
  }
  return location.city || location.region || location.country || "your part of the world";
}

function formatOrdinal(value) {
  const number = Math.max(1, Number(value) || 1);
  const mod100 = number % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${number}th`;
  if (number % 10 === 1) return `${number}st`;
  if (number % 10 === 2) return `${number}nd`;
  if (number % 10 === 3) return `${number}rd`;
  return `${number}th`;
}

function projectLocation([latitude, longitude], phi) {
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180 - Math.PI;
  const latitudeCosine = Math.cos(latitudeRadians);
  const radius = 0.85;

  const x = -latitudeCosine * Math.cos(longitudeRadians) * radius;
  const y = Math.sin(latitudeRadians) * radius;
  const z = latitudeCosine * Math.sin(longitudeRadians) * radius;
  const phiCosine = Math.cos(phi);
  const phiSine = Math.sin(phi);
  const thetaCosine = Math.cos(GLOBE_THETA);
  const thetaSine = Math.sin(GLOBE_THETA);

  return {
    x: (phiCosine * x + phiSine * z + 1) / 2,
    y:
      (-(
        thetaSine * phiSine * x +
        thetaCosine * y -
        thetaSine * phiCosine * z
      ) +
        1) /
      2,
    front:
      -thetaCosine * phiSine * x +
        thetaSine * y +
        thetaCosine * phiCosine * z >=
      0,
  };
}

function GlobePin({ id, label, tone }) {
  return (
    <button
      className={`globe-pin globe-pin--${id} globe-pin--${tone}`}
      type="button"
      aria-label={`Show ${label}`}
    >
      <span className="globe-pin-mark" aria-hidden="true">
        <FaLocationDot />
        <FaCircle />
      </span>
      <span className="globe-pin-label">
        <FaCircle aria-hidden="true" />
        <span>{label}</span>
        <i aria-hidden="true">
          <FaChevronRight />
        </i>
      </span>
    </button>
  );
}

function LocationGlobe({ visitor }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const pinLayerRef = useRef(null);
  const globeRef = useRef(null);
  const renderRef = useRef(() => {});
  const phiRef = useRef(INITIAL_GLOBE_PHI);
  const dragRef = useRef({ active: false, pointerId: null, startX: 0, startPhi: 0 });

  const markers = useMemo(() => {
    const dots = [
      {
        id: "home",
        location: [HOME.latitude, HOME.longitude],
        size: 0.055,
        color: [0.08, 0.79, 0.42],
      },
    ];
    if (Number.isFinite(visitor?.latitude) && Number.isFinite(visitor?.longitude)) {
      dots.push({
        id: "visitor",
        location: [visitor.latitude, visitor.longitude],
        size: 0.045,
        color: [1, 0.34, 0.08],
      });
    }
    return dots;
  }, [visitor]);
  const markersRef = useRef(markers);

  useEffect(() => {
    markersRef.current = markers;
    renderRef.current();
  }, [markers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let width = 0;
    const startDrag = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startPhi: phiRef.current,
      };
      stage.dataset.dragging = "true";
      if (event.target === canvas) canvas.focus({ preventScroll: true });
      stage.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };

    const moveDrag = (event) => {
      if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
      phiRef.current =
        dragRef.current.startPhi +
        (event.clientX - dragRef.current.startX) / DRAG_SENSITIVITY;
      renderRef.current();
      event.preventDefault();
    };

    const endDrag = (event) => {
      if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
      dragRef.current.active = false;
      dragRef.current.pointerId = null;
      delete stage.dataset.dragging;
      if (stage.hasPointerCapture?.(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    };

    stage.addEventListener("pointerdown", startDrag);
    stage.addEventListener("pointermove", moveDrag);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);

    const syncPinPositions = () => {
      if (!pinLayerRef.current) return;
      const projectedMarkers = markersRef.current.map((marker) => ({
        ...marker,
        projected: projectLocation(marker.location, phiRef.current),
      }));

      projectedMarkers.forEach((marker) => {
        const { id } = marker;
        const pin = pinLayerRef.current.querySelector(`.globe-pin--${id}`);
        if (!pin) return;
        const { projected } = marker;
        pin.style.left = `${projected.x * 100}%`;
        pin.style.top = `${projected.y * 100}%`;
        pin.style.setProperty("--pin-visible", projected.front ? "1" : "0");
        pin.style.pointerEvents = projected.front ? "auto" : "none";
      });
    };

    let globe;
    const resize = () => {
      const nextWidth = canvas.offsetWidth;
      if (!nextWidth || nextWidth === width) return;
      width = nextWidth;
      globe?.update({ width, height: width });
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const startsDark = document.documentElement.dataset.theme === "dark";

    globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width,
      height: width,
      phi: phiRef.current,
      theta: GLOBE_THETA,
      dark: startsDark ? 1 : 0,
      diffuse: 1.15,
      mapSamples: 16000,
      mapBrightness: 5.8,
      baseColor: startsDark ? [0.12, 0.14, 0.17] : [1, 1, 1],
      markerColor: [0.1, 0.79, 0.43],
      glowColor: startsDark ? [0.72, 0.78, 0.9] : [1, 1, 1],
      markers: [],
    });
    globeRef.current = globe;

    const render = () => {
      globe.update({ phi: phiRef.current });
      canvas.dataset.globePhi = phiRef.current.toFixed(4);
      syncPinPositions();
    };
    renderRef.current = render;
    render();

    requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    return () => {
      globeRef.current = null;
      renderRef.current = () => {};
      globe.destroy();
      window.removeEventListener("resize", resize);
      stage.removeEventListener("pointerdown", startDrag);
      stage.removeEventListener("pointermove", moveDrag);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncGlobeTheme = () => {
      const isDark = root.dataset.theme === "dark";
      globeRef.current?.update({
        dark: isDark ? 1 : 0,
        baseColor: isDark ? [0.12, 0.14, 0.17] : [1, 1, 1],
        mapBrightness: isDark ? 7.2 : 5.8,
        glowColor: isDark ? [0.72, 0.78, 0.9] : [0.96, 0.96, 0.95],
      });
    };

    syncGlobeTheme();
    const observer = new MutationObserver(syncGlobeTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={stageRef} className="location-globe-stage reveal delay-1">
      <canvas
        ref={canvasRef}
        className="location-globe-canvas"
        aria-label="Interactive globe showing Sreedev in Kozhikode and the visitor's approximate location"
        aria-describedby="globe-instructions"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          phiRef.current += event.key === "ArrowLeft" ? -0.18 : 0.18;
          renderRef.current();
        }}
      />
      <figcaption id="globe-instructions" className="sr-only">
        Drag the globe or use the left and right arrow keys to rotate it. Hover or
        focus either pin to reveal its location.
      </figcaption>
      <div ref={pinLayerRef} className="globe-pin-layer">
        <GlobePin id="home" label="Kozhikode, Kerala" tone="home" />
        {visitor ? (
          <GlobePin id="visitor" label={formatPlace(visitor)} tone="visitor" />
        ) : null}
      </div>
    </figure>
  );
}

export default function ContactGlobe() {
  const [visitor, setVisitor] = useState(null);
  const [visitorTemperature, setVisitorTemperature] = useState(null);
  const [homeTemperature, setHomeTemperature] = useState(null);
  const [visitorNumber, setVisitorNumber] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLocationStory() {
      try {
        const cached = JSON.parse(sessionStorage.getItem(LOCATION_CACHE_KEY) || "null");
        if (cached && Date.now() - cached.savedAt < CACHE_LIFETIME) {
          setVisitor(cached.visitor);
          setVisitorTemperature(cached.visitorTemperature);
          setHomeTemperature(cached.homeTemperature);
          return;
        }

        const [homeTemp, geoResponse] = await Promise.all([
          getTemperature(HOME.latitude, HOME.longitude, controller.signal),
          fetch("https://get.geojs.io/v1/ip/geo.json", { signal: controller.signal }),
        ]);
        if (!geoResponse.ok) throw new Error("Location lookup failed");
        const geo = await geoResponse.json();

        const nextVisitor = {
          city: geo.city,
          region: geo.region,
          country: geo.country || geo.country_code,
          latitude: Number(geo.latitude),
          longitude: Number(geo.longitude),
        };
        const visitorTemp = await getTemperature(
          nextVisitor.latitude,
          nextVisitor.longitude,
          controller.signal,
        );

        setVisitor(nextVisitor);
        setVisitorTemperature(visitorTemp);
        setHomeTemperature(homeTemp);
        sessionStorage.setItem(
          LOCATION_CACHE_KEY,
          JSON.stringify({
            savedAt: Date.now(),
            visitor: nextVisitor,
            visitorTemperature: visitorTemp,
            homeTemperature: homeTemp,
          }),
        );
      } catch (error) {
        if (error.name === "AbortError") return;
        try {
          const homeTemp = await getTemperature(
            HOME.latitude,
            HOME.longitude,
            controller.signal,
          );
          setHomeTemperature(homeTemp);
        } catch {
          setHomeTemperature(null);
        }
      }
    }

    loadLocationStory();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const cachedNumber = sessionStorage.getItem(VISITOR_SESSION_KEY);
    if (cachedNumber) {
      setVisitorNumber(Number(cachedNumber));
      return undefined;
    }

    const controller = new AbortController();
    fetch("/api/visitor", { signal: controller.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Visitor count failed");
        return response.json();
      })
      .then(({ count }) => {
        const nextCount = Math.max(1, Number(count) || 1);
        sessionStorage.setItem(VISITOR_SESSION_KEY, String(nextCount));
        setVisitorNumber(nextCount);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setVisitorNumber(1);
      });

    return () => controller.abort();
  }, []);

  const visitorPlace = formatPlace(visitor);
  const visitorTempText = visitorTemperature === null ? "a changing temperature" : `${visitorTemperature}°C`;
  const homeTempText = homeTemperature === null ? "live weather outside" : `${homeTemperature}°C`;

  return (
    <section className="contact contact--globe section-space" id="contact">
      <div className="contact-copy">
        <div className="hero-discipline reveal">
          <span className="blinking-status-dot" aria-hidden="true" />
          <span>Let&apos;s work together</span>
          <i aria-hidden="true">&times;</i>
          <span>Kozhikode</span>
        </div>
        <h2 className="reveal delay-1">Let&apos;s Connect.</h2>
        <div className="location-story reveal delay-2" aria-live="polite">
          <p>
            you are reading this from somewhere near <strong>{visitorPlace}</strong>,
            where it is <strong>{visitorTempText}</strong> right now.
          </p>
          <p>
            I am in <strong>Kozhikode, Kerala</strong>, where it is{" "}
            <strong>{homeTempText}</strong>. small world.
          </p>
          <p className="location-permission-note">
            If this feels off, allow location access in your browser.
          </p>
        </div>
        <div className="contact-actions reveal delay-3">
          <a className="primary-btn compact" href={EMAIL_CONTACT_URL}>
            Email me
          </a>
          <a
            className="whatsapp"
            href={WHATSAPP_CONTACT_URL}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </div>
        <p className="visitor-counter" aria-live="polite">
          {visitorNumber === null
            ? "Counting your visit..."
            : `You’re my ${formatOrdinal(visitorNumber)} visitor.`}
        </p>
      </div>
      <LocationGlobe visitor={visitor} />
    </section>
  );
}
