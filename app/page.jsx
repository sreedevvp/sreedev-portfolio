import Link from "next/link";
import Image from "next/image";
import InteractiveLanyard from "../components/InteractiveLanyard";
import HomeProjectGrid from "../components/HomeProjectGrid";
import CreativeWorksGallery from "../components/CreativeWorksGallery";
import DesignProcess from "../components/DesignProcess";
import DesignOpinions from "../components/DesignOpinions";
import ServiceMarquee from "../components/ServiceMarquee";
import ContactGlobe from "../components/ContactGlobe";

const showcasePhotos = [
  {
    src: "/showcase/classroom-workshop.png",
    alt: "Sreedev leading a design workshop in a computer lab",
    position: "50% 38%",
  },
  {
    src: "/showcase/recognition-award.png",
    alt: "Sreedev receiving recognition at KARMA 26",
    position: "48% center",
  },
  {
    src: "/showcase/student-mentoring.png",
    alt: "Sreedev mentoring students during a practical session",
    position: "48% center",
  },
  {
    src: "/showcase/auditorium-presentation-new.png",
    alt: "Sreedev presenting to a college auditorium",
    position: "50% center",
  },
  {
    src: "/showcase/live-design-demo.png",
    alt: "Live visual design demonstration on a laptop",
    position: "48% center",
  },
  {
    src: "/showcase/trophy-presentation.png",
    alt: "Sreedev receiving the KARMA 25 trophy",
    position: "48% 42%",
  },
  {
    src: "/showcase/workshop-speaking.png",
    alt: "Sreedev speaking into a microphone during a workshop",
    position: "52% 40%",
  },
];

export default function HomePage() {
  return (
    <>
      <main>
        <section className="hero section-space" id="home">
          <div className="hero-content">
            <div className="hero-discipline reveal">
              <span className="blinking-status-dot" aria-hidden="true" />
              <span>Product Design</span>
              <i aria-hidden="true">&times;</i>
              <span>Visual Systems</span>
            </div>

            <h1 className="reveal delay-1">
              Crafting Digital
              <br />
              Products, Brands, and Experience!
            </h1>

            <p className="hero-copy reveal delay-2">
              I started with visual design, branding, and creative storytelling.
              Today, I turn that foundation into digital products, interfaces,
              and visual systems built with purpose.
            </p>

            <div className="hero-actions reveal delay-3" id="resume">
              <div className="resume-block">
                <a
                  className="primary-btn"
                  href="/sreedev-vp-resume.pdf"
                  download
                >
                  <span>Download Me</span>
                  <i aria-hidden="true">&rarr;</i>
                </a>
              </div>
              <Link className="text-link" href="/works">
                Explore projects <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <InteractiveLanyard />
          </div>
        </section>

        <section className="partners" aria-label="Design disciplines and visual work">
          <ServiceMarquee />

          <div className="photo-marquee marquee reverse">
            <div className="marquee-track photo-track">
              {[...showcasePhotos, ...showcasePhotos].map((photo, index) => (
                <figure
                  className="photo-tile"
                  key={`${photo.src}-${index}`}
                  aria-hidden={index >= showcasePhotos.length}
                >
                  <Image
                    src={photo.src}
                    alt={index < showcasePhotos.length ? photo.alt : ""}
                    width={640}
                    height={520}
                    sizes="(max-width: 700px) 250px, 320px"
                    style={{ objectPosition: photo.position }}
                  />
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="beyond-screen" className="beyond-screen section-space" aria-labelledby="beyond-screen-title">
          <div className="beyond-screen-copy reveal">
            <p className="beyond-screen-eyebrow">
              <span className="blinking-status-dot" aria-hidden="true" />
              BEYOND THE SCREEN
            </p>
            <h2 id="beyond-screen-title">Designing with Purpose.</h2>
            <p>
              I&apos;m Sreedev, a product designer focused on creating digital
              products that feel simple, purposeful, and visually refined. I
              enjoy transforming early concepts into intuitive user flows and
              polished interfaces, with every design decision shaped by
              clarity, usability, and real user needs.
            </p>
          </div>

          <dl className="beyond-screen-stats reveal delay-1">
            <div>
              <dt>03</dt>
              <dd>Years of<br />exploration</dd>
            </div>
            <div>
              <dt>25</dt>
              <dd>Digital<br />experiences</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>Products<br />launched</dd>
            </div>
          </dl>
        </section>

        <DesignProcess />

        <section className="works section-space" id="works">
          <div className="hero-discipline section-label reveal">
            <span>Product Design</span>
            <i aria-hidden="true">&times;</i>
            <span>Projects</span>
          </div>
          <HomeProjectGrid />
          <Link className="outline-btn reveal" href="/works">
            <span>Explore all Projects</span>
            <i aria-hidden="true">&#8599;</i>
          </Link>
        </section>

        <DesignOpinions />

        <section className="creative-works section-space" aria-labelledby="creative-works-title">
          <div className="hero-discipline section-label reveal" id="creative-works-title">
            <span>Visual Design</span>
            <i aria-hidden="true">&times;</i>
            <span>Creative Works</span>
          </div>
          <CreativeWorksGallery limit={6} />
          <Link className="outline-btn reveal" href="/works">
            <span>Explore all Works</span>
            <i aria-hidden="true">&#8599;</i>
          </Link>
        </section>

        <ContactGlobe />
      </main>

    </>
  );
}
