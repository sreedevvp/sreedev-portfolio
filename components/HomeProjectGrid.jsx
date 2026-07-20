import Link from "next/link";

const projects = [
  {
    slug: "ano",
    title: "ANO.APP",
    cover: "/projects/ano-cover.png",
    copy:
      "An anonymous ask-and-answer platform shaped around clear interaction, responsive flows, and a consistent multi-platform design system.",
  },
  {
    slug: "spense",
    title: "Spense",
    cover: "/projects/spense-cover.png",
    copy:
      "A finance app that turns every transaction into time, helping users understand what was worth it, and where their future freedom is going.",
  },
  {
    slug: "clarity-ai",
    title: "Clarity.ai",
    cover: "/projects/clarity-cover.png",
    copy:
      "An AI-powered career clarity SaaS platform that helps users discover career paths, compare options, and build personalized roadmaps for their future.",
  },
];

export default function HomeProjectGrid() {
  return (
    <div className="project-grid archive-project-grid">
      {projects.map((project) => (
        <article
          className="archive-project-card"
          id={`home-project-${project.slug}`}
          key={project.slug}
        >
          <Link
            className="archive-project-media"
            href={`/works#project-${project.slug}`}
            aria-label={`View ${project.title} project`}
          >
            <img
              src={project.cover}
              alt={`${project.title} cover`}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <div className="archive-project-copy">
            <h3>
              <Link href={`/works#project-${project.slug}`}>{project.title}</Link>
            </h3>
            <p>{project.copy}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
