"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import styles from "./ExperienceShowcase.module.css";

const experiences = [
  {
    organisation: "Freelance",
    role: "Freelance Product & Visual Designer",
    date: "2022 \u2014 Ongoing",
    start: "2022-01-01",
    end: null,
    initials: "SV",
    accent: "coral",
    description:
      "Designing web and mobile interfaces, visual identities, campaign graphics and print systems for clients with different needs and audiences.",
    points: [
      "Create user flows, wireframes, prototypes and polished digital interfaces.",
      "Develop visual identities, campaign graphics and print-ready design systems.",
      "Adapt each project to different business goals, users and audiences.",
    ],
  },
  {
    organisation: "KARMA \u201926 \u2014 KMCTCE",
    timelineName: "KARMA \u201926",
    role: "Media Committee Head",
    date: "2026",
    start: "2026-01-01",
    end: "2026-12-31",
    initials: "K26",
    logo: "/logo-karma-26.png",
    accent: "violet",
    timeline: false,
    description:
      "Led the media and visual communication for KARMA \u201926 across digital and on-campus touchpoints.",
    points: [
      "Directed event branding, campaign visuals and promotional content.",
      "Coordinated the media team to maintain consistent and timely communication.",
    ],
  },
  {
    organisation: "IEDC KMCTCE",
    role: "Creative & Innovation Lead",
    date: "2024 \u2014 2025",
    start: "2024-01-01",
    end: "2025-12-31",
    initials: "IEDC",
    logo: "/logo-iedc-kmct.png",
    accent: "lime",
    description:
      "Led creative and innovation initiatives across student programmes, branding and community communication.",
    points: [
      "Created visual direction and design assets for innovation-led initiatives.",
      "Collaborated with teams to plan campaigns, events and community communication.",
    ],
  },
  {
    organisation: "GTech \u00b5Learn",
    timelineName: "GTech \u00b5Learn",
    role: "UI/UX Designer Intern \u2014 HQ Operations Team",
    date: "2024 \u2014 2025",
    start: "2024-01-01",
    end: "2025-12-31",
    initials: "\u00b5",
    logo: "/logo-gtech-mulearn.png",
    accent: "blue",
    description:
      "Contributed to UI/UX design tasks for the HQ Operations Team while working within deadlines and collaborating through a professional product workflow.",
    points: [
      "Worked on interface and user-experience design tasks for internal initiatives.",
      "Delivered assigned work on time while demonstrating strong ownership and attention to detail.",
    ],
  },
  {
    organisation: "FunForest.co",
    role: "UI/UX Design Intern",
    date: "2023 \u2014 2024",
    start: "2023-01-01",
    end: "2024-12-31",
    initials: "FF",
    logo: "/logo-funforest.png",
    accent: "amber",
    description:
      "Designed ANO.APP interfaces, responsive layouts and a consistent design system while collaborating with developers through a real product workflow.",
    points: [
      "Designed mobile interfaces and user flows for ANO.APP.",
      "Created responsive layouts and reusable components.",
      "Worked with developers to maintain consistency during implementation.",
    ],
  },
];

const START_YEAR = 2022;
const END_YEAR = 2027;
const YEARS = Array.from({ length: 5 }, (_, index) => 2022 + index);

function getTimelineItems() {
  const nowOffset = getNowOffset();
  const sorted = experiences
    .filter((item) => item.timeline !== false)
    .map((item) => ({
      ...item,
      startOffset: yearOffset(item.start),
      endOffset: item.end ? yearOffset(item.end, true) : nowOffset,
    }))
    .sort((a, b) => a.startOffset - b.startOffset || b.endOffset - a.endOffset);
  const laneEnds = [];

  return sorted.map((item) => {
    let lane = laneEnds.findIndex((end) => item.startOffset >= end);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = item.endOffset;
    return { ...item, lane };
  });
}

function yearOffset(date, inclusiveEnd = false) {
  const year = Number(date.slice(0, 4));
  const offset = year - START_YEAR + (inclusiveEnd ? 1 : 0);
  return Math.max(0, Math.min(END_YEAR - START_YEAR, offset));
}

function getNowOffset() {
  const now = new Date();
  const year = Math.max(START_YEAR, Math.min(END_YEAR - 1, now.getFullYear()));
  const start = new Date(year, 0, 1).getTime();
  const end = new Date(year + 1, 0, 1).getTime();
  const progress = Math.max(0, Math.min(1, (now.getTime() - start) / (end - start)));
  return year - START_YEAR + progress;
}

function canvasPosition(offset) {
  return `calc(var(--year-width) * ${offset})`;
}

function LogoTile({ item }) {
  return (
    <span
      className={`${styles.logo} ${styles[item.accent]} ${item.logo ? styles.logoImage : ""}`}
      aria-hidden="true"
    >
      {item.logo ? (
        <img src={item.logo} alt="" loading="lazy" decoding="async" />
      ) : (
        item.initials
      )}
    </span>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className={styles.toggleWrap}>
      <div className={styles.toggle} role="group" aria-label="Experience view">
        <span className={`${styles.activePill} ${view === "timeline" ? styles.activeRight : ""}`} />
        <button type="button" aria-pressed={view === "list"} onClick={() => onChange("list")}>
          list
        </button>
        <button type="button" aria-pressed={view === "timeline"} onClick={() => onChange("timeline")}>
          timeline
        </button>
      </div>
    </div>
  );
}

function ExperienceList({ openIndex, setOpenIndex, idBase }) {
  return (
    <ol className={styles.list}>
      {experiences.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${idBase}-panel-${index}`;

        return (
          <li className={`${styles.listItem} ${isOpen ? styles.open : ""}`} key={item.organisation}>
            <button
              className={styles.rowButton}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <LogoTile item={item} />
              <span className={styles.identity}>
                <strong>{item.organisation}</strong>
                <span>{item.role}</span>
              </span>
              <time>{item.date}</time>
              <span className={styles.chevron} aria-hidden="true" />
            </button>
            <div className={styles.panelGrid} id={panelId} aria-hidden={!isOpen}>
              <div className={styles.panelInner}>
                <p>{item.description}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ExperienceTimeline() {
  const scrollerRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const items = useMemo(getTimelineItems, []);
  const laneCount = Math.max(...items.map((item) => item.lane), 0) + 1;
  const nowOffset = getNowOffset();

  useEffect(() => {
    const scroller = scrollerRef.current;
    const canvas = scroller?.querySelector(`.${styles.timelineCanvas}`);
    if (!scroller || !canvas) return;

    const yearWidth = canvas.getBoundingClientRect().width / YEARS.length;
    scroller.scrollLeft = Math.max(0, nowOffset * yearWidth - scroller.clientWidth * 0.78);
  }, [nowOffset]);

  function onPointerDown(event) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragRef.current = { active: true, startX: event.clientX, startScroll: scroller.scrollLeft };
    scroller.dataset.dragging = "true";
    scroller.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    const scroller = scrollerRef.current;
    if (!scroller || !dragRef.current.active) return;
    scroller.scrollLeft = dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
  }

  function endDrag(event) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragRef.current.active = false;
    delete scroller.dataset.dragging;
    if (scroller.hasPointerCapture?.(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
  }

  function onKeyDown(event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollerRef.current?.scrollBy({
      left: event.key === "ArrowRight" ? 140 : -140,
      behavior: "smooth",
    });
  }

  return (
    <div
      className={styles.timelineScroller}
      data-timeline-scroller
      ref={scrollerRef}
      tabIndex={0}
      role="region"
      aria-label="Draggable experience timeline from 2022 to 2026"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div className={styles.timelineCanvas} style={{ "--lane-count": laneCount }}>
        <div className={styles.gridLines} aria-hidden="true">
          {[...YEARS, END_YEAR].map((year) => (
            <span key={year} style={{ left: canvasPosition(year - START_YEAR) }} />
          ))}
        </div>
        <div className={styles.nowMarker} style={{ left: canvasPosition(nowOffset) }} aria-hidden="true">
          <span>now</span>
        </div>
        <div className={styles.timelineBars}>
          {items.map((item) => {
            const width = Math.max(item.endOffset - item.startOffset, 0.38);

            return (
              <article
                className={`${styles.timelineBar} ${!item.end ? styles.ongoing : ""}`}
                key={item.organisation}
                style={{
                  left: canvasPosition(item.startOffset),
                  width: canvasPosition(width),
                  top: `calc(${item.lane} * var(--lane-step))`,
                }}
                title={`${item.organisation}, ${item.role}, ${item.date}`}
              >
                <LogoTile item={item} />
                <span className={styles.barCopy}>
                  <strong>{item.timelineName || item.organisation}</strong>
                  <small>{item.role}</small>
                </span>
              </article>
            );
          })}
        </div>
        <div className={styles.yearLabels} aria-hidden="true">
          {YEARS.map((year) => (
            <span key={year}>{year}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExperienceShowcase() {
  const [view, setView] = useState("list");
  const [openIndex, setOpenIndex] = useState(0);
  const idBase = useId().replaceAll(":", "");

  return (
    <section className={styles.showcase} aria-labelledby={`${idBase}-title`}>
      <header className={styles.header}>
        <div>
          <h2 id={`${idBase}-title`}>My professional journey</h2>
        </div>
        <ViewToggle view={view} onChange={setView} />
      </header>
      <div className={styles.view} key={view}>
        {view === "list" ? (
          <ExperienceList openIndex={openIndex} setOpenIndex={setOpenIndex} idBase={idBase} />
        ) : (
          <>
            <ExperienceTimeline />
            <p className={styles.dragHint}>drag sideways to move across years</p>
          </>
        )}
      </div>
    </section>
  );
}
