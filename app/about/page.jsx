import Link from "next/link";
import AboutHero from "../../components/AboutHero";
import AboutKeyboard from "../../components/AboutKeyboard";
import ExperienceShowcase from "../../components/ExperienceShowcase";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <>
      <main className="standalone-main">
        <section className="about section-space">
          <AboutHero />
          <AboutKeyboard />

          <div className="hero-discipline section-label about-section-heading education-section-heading reveal">
            <span>Education</span>
            <i aria-hidden="true">&times;</i>
            <span>Practice</span>
          </div>

          <div className="career-highlight education-summary">
            <article className="education-copy reveal delay-1">
              <img
                className="education-heading-icon"
                src="/education-building-emoji.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <h3>KMCT Engineering College</h3>
              <p>Bachelor of Computer Science</p>
              <p>APJ Abdul Kalam Technological University &nbsp;&middot;&nbsp;</p>
              <div className="education-stats">
                <div>
                  <span>Engineering journey</span>
                  <strong>2022-26</strong>
                </div>
                <div>
                  <span>Creative roles</span>
                  <strong>03+</strong>
                </div>
              </div>
              <ul>
                <li>Creative &amp; Innovation Lead at IEDC KMCTCE</li>
                <li>Media Committee Head for KARMA &apos;26</li>
                <li>Working across product design, branding, campaigns, and community communication</li>
              </ul>
            </article>
          </div>

          <div className="hero-discipline section-label about-section-heading professional-section-heading reveal">
            <span>Professional</span>
            <i aria-hidden="true">&times;</i>
            <span>Experience</span>
          </div>

          <ExperienceShowcase />

          <div className="hero-discipline section-label about-section-heading beyond-section-heading reveal">
            <span>Beyond Product</span>
            <i aria-hidden="true">&times;</i>
            <span>Screens</span>
          </div>

          <section className="about-beyond-feature" aria-labelledby="about-beyond-title">
            <div className="about-beyond-copy reveal">
              <p className="about-beyond-eyebrow">
                <span className="blinking-status-dot" aria-hidden="true" />
                Offline, still observing
              </p>
              <h2 id="about-beyond-title">Good ideas rarely begin at the desk.</h2>
              <p>
                Beyond product screens, I recharge by noticing people, places,
                patterns, and the quiet details that make experiences feel human.
              </p>
              <p>
                Sketching, photography, community work, and everyday conversations
                keep my visual thinking curious—and give me fresh references to
                bring back into the work.
              </p>
              <ul className="about-beyond-notes" aria-label="How I stay curious">
                <li>Observe what people do</li>
                <li>Collect visual details</li>
                <li>Return with better questions</li>
              </ul>
            </div>

            <figure
              className="about-beyond-visual reveal delay-1"
              tabIndex={0}
            >
              <img
                src="/about-beyond-portrait.webp"
                alt="Sreedev framed by a torn-paper collage"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </section>

          <div className="resume-showcase" id="resume">
            <div className="resume-stack reveal">
              <img
                className="resume-actual"
                src="/sreedev-resume-stack-enhanced.png"
                alt="Sreedev VP resume preview"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="resume-details reveal delay-1">
              <img
                className="resume-emoji"
                src="/resume-note-emoji.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
              />
              <h2>Grab my resume!</h2>
              <p>
                A compact view of my product work, visual-design foundation,
                community leadership, tools, and the projects I&apos;m building
                next.
              </p>
              <div>
                <Link className="outline-btn" href="/works">
                  <span>Explore Projects</span><i aria-hidden="true">&#8599;</i>
                </Link>
                <a
                  className="primary-btn"
                  href="/sreedev-vp-resume.pdf"
                  download
                >
                  <span>Download Me</span><i aria-hidden="true">&rarr;</i>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
