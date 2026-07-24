"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import CreativeWorksGallery, { creativeWorks } from "./CreativeWorksGallery";
import styles from "./WorksArchive.module.css";

const projects = [
  {
    slug: "ano",
    title: "ANO.APP",
    category: "product",
    cover: "/projects/ano-cover.png",
    copy:
      "A live anonymous messaging app built for social sharing, link-based messages, and reply sharing across mobile platforms.",
    tags: ["Social", "Mobile app", "Live"],
    href: "https://play.google.com/store/apps/details?id=com.ano.ngl&hl=en_IN&pli=1",
    featured: true,
  },
  {
    slug: "payslate",
    title: "PaySlate",
    category: "product",
    cover: "/projects/payslate-dashboard-cover.png",
    copy:
      "An all-in-one finance management platform that helps freelancers create invoices, track payments, manage expenses, and understand their business performance.",
    tags: ["Fintech", "Dashboard"],
    href: "https://www.behance.net/gallery/253085727/PaySlate-Freelancer-Invoice-Payment-Dashboard",
  },
  {
    slug: "vantage",
    title: "Vantage",
    category: "product",
    cover: "/projects/vantage-cover.png",
    copy:
      "A real-time safety platform that helps trip organisers track participants, coordinate groups, and respond during emergencies.",
    tags: ["Safety", "Real-time", "Platform"],
  },
  {
    slug: "clarity-ai",
    title: "Clarity.ai",
    category: "product",
    cover: "/projects/clarity-cover.png",
    copy:
      "An AI-powered living professional profile that organises experiences, projects, goals, and career decisions.",
    tags: ["AI", "Career", "Platform"],
    href: "https://www.behance.net/gallery/252131697/Clarityai-AI-Powered-Career-Clarity-SaaS-Platform",
  },
  {
    slug: "spense",
    title: "Spense",
    category: "product",
    cover: "/projects/spense-cover.png",
    copy:
      "A fintech app that converts money spent into time worked and classifies transactions as useful or wasted spend.",
    tags: ["Fintech", "Mobile app", "Behaviour"],
    href: "https://www.behance.net/gallery/252503593/Spense-A-Time-Based-Finance-App",
  },
  {
    slug: "payslate-landing",
    title: "PaySlate Landing Page",
    category: "landing",
    cover: "/projects/payslate-landing-cover.png",
    copy:
      "A focused marketing website that presents PaySlate's invoicing, payment tracking, expense management, and business insights for freelancers.",
    tags: ["Fintech", "Landing", "SaaS"],
    href: "https://www.behance.net/gallery/253058537/PaySlate-Invoice-Payment-Management-Landing-page",
  },
  {
    slug: "clarity-landing",
    title: "Clarity.ai Landing Page",
    category: "landing",
    cover: "/projects/clarity-landing-cover-updated.webp",
    copy:
      "A premium marketing website that communicates the Clarity.ai vision, product features, and user benefits.",
    tags: ["AI", "Landing", "Marketing"],
    href: "https://www.behance.net/gallery/252709209/Landing-Page-Clarityai-Career-SaaS-Platform",
  },
  {
    slug: "mandate-landing",
    title: "Mandate Landing Page",
    category: "landing",
    cover: "/projects/mandate-landing-cover-updated.webp",
    copy:
      "A fintech landing page that simplifies AI financial control, permissions, and transaction oversight.",
    tags: ["Fintech", "Landing", "Storytelling"],
  },
  {
    slug: "mulearn-landing",
    title: "\u00b5Learn Conceptual Landing Page",
    category: "landing",
    cover: "/projects/mulearn-cover-final.webp",
    copy:
      "An internship design exploration presenting the community, chapters, achievements, and learning ecosystem.",
    tags: ["Community", "Internship", "Concept"],
    href: "https://www.behance.net/gallery/252914561/Learn-Conceptual-Landing-Page-Design",
  },
  {
    slug: "iedc-kmct",
    title: "IEDC KMCT Landing Page",
    category: "landing",
    cover: "/projects/iedc-kmct-cover-final.webp",
    copy:
      "An implemented dark visual website showcasing the organisation, events, team, and student community.",
    tags: ["Community", "Landing", "Implemented"],
    href: "https://www.behance.net/gallery/252915205/Building-Together-IEDC-KMCT-Web-Experience",
  },
  {
    slug: "crumbs",
    title: "Crumbs",
    category: "branding",
    cover: "/projects/crumbs-cover-updated.webp",
    copy:
      "A playful premium cookie identity spanning logo, packaging, patterns, mockups, and social media.",
    tags: ["Brand identity", "Packaging", "Social"],
    href: "https://www.behance.net/gallery/252762183/Crumbs-Cookie-Brand-Identity-Packaging-Design",
  },
  {
    slug: "kmct-silver-jubilee",
    title: "KMCT Silver Jubilee Logo",
    category: "branding",
    cover: "/projects/kmct-silver-jubilee-cover.webp",
    copy:
      "A commemorative identity created for KMCT Engineering College, celebrating 25 years through a distinctive anniversary emblem.",
    tags: ["Logo design", "Anniversary identity", "KMCT"],
    href: "https://www.instagram.com/p/DV6ceb8E26T/?utm_source=ig_web_button_share_sheet",
  },
  {
    slug: "bestado-logo",
    title: "Bestado Logo",
    category: "branding",
    cover: "/projects/bestado-logo-cover.webp",
    copy:
      "A bold, approachable logo identity designed for Bestado, an online shopping store.",
    tags: ["Logo design", "E-commerce", "Brand identity"],
    href: "https://www.instagram.com/p/DJ6YujbSEUV/?utm_source=ig_web_button_share_sheet",
  },
];

const filters = [
  { id: "all", label: "All" },
  { id: "product", label: "Projects" },
  { id: "landing", label: "Landing Pages" },
  { id: "branding", label: "Branding" },
  { id: "graphics", label: "Graphics" },
];

const featuredProject = projects.find((project) => project.featured);
const regularProjects = projects.filter((project) => !project.featured);

function ProjectTags({ tags }) {
  return (
    <ul className={styles.tags} aria-label="Project tags">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function ProjectCard({ project }) {
  const href = project.href ?? `/works#project-${project.slug}`;
  const externalProps = project.href ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <article className={styles.card} id={`project-${project.slug}`}>
      <a
        className={styles.cardLink}
        href={href}
        aria-label={`View ${project.title} project`}
        {...externalProps}
      >
        <div className={styles.cardMedia}>
          <Image
            src={project.cover}
            alt={`${project.title} project cover`}
            fill
            sizes="(max-width: 720px) 100vw, (max-width: 1080px) 50vw, 33vw"
          />
          <span className={styles.cardArrow} aria-hidden="true">
            <FiArrowUpRight />
          </span>
        </div>
        <div className={styles.cardInfo}>
          <div>
            <h2>{project.title}<span>.</span></h2>
            <p>{project.copy}</p>
          </div>
          <ProjectTags tags={project.tags} />
        </div>
      </a>
    </article>
  );
}

export default function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(
    () =>
      activeFilter === "all"
        ? regularProjects
        : regularProjects.filter((project) => project.category === activeFilter),
    [activeFilter],
  );

  const showFeatured = activeFilter === "all" || activeFilter === "product";

  const countFor = (category) =>
    category === "graphics"
      ? creativeWorks.length
      : category === "all"
      ? projects.length
      : projects.filter((project) => project.category === category).length;

  return (
    <section className={styles.archive} aria-labelledby="works-title">
      <header className={styles.header}>
        <p><span aria-hidden="true" /> Creative Gallery</p>
        <h1 id="works-title">
          Designing products beyond <br />the obvious.
        </h1>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters} aria-label="Filter projects">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter.id ? styles.activeFilter : ""}
              key={filter.id}
              type="button"
              aria-pressed={activeFilter === filter.id}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
              <span>{String(countFor(filter.id)).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

      </div>

      {showFeatured && (
        <article className={styles.featured} id="project-ano">
          <div className={styles.featuredCopy}>
            <div className={styles.featuredHeading}>
              <h2>{featuredProject.title}<span>.</span></h2>
              <em>Featured</em>
            </div>
            <p>{featuredProject.copy}</p>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>Live on App Store &amp; Google Play</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>Anonymous social messaging</dd>
              </div>
              <div>
                <dt>Tags</dt>
                <dd><ProjectTags tags={featuredProject.tags} /></dd>
              </div>
            </dl>
          </div>
          <a
            className={styles.featuredMedia}
            href={featuredProject.href ?? "/works#project-ano"}
            aria-label="View ANO.APP project"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={featuredProject.cover}
              alt="ANO.APP project cover"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 50vw"
            />
            <span className={styles.cardArrow} aria-hidden="true">
              <FiArrowUpRight />
            </span>
          </a>
        </article>
      )}

      {activeFilter === "graphics" ? (
        <div className={styles.graphicsGallery} aria-live="polite">
          <CreativeWorksGallery reveal={false} />
        </div>
      ) : (
        <div className={styles.grid} aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
