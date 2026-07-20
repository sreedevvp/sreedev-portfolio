export const creativeWorks = [
  {
    title: "Visual Story Poster",
    code: "01",
    type: "vsd",
    image: "/showcase/creative-vsd.webp",
  },
  {
    title: "KARMA DJ Night Poster",
    code: "02",
    type: "karma-dj",
    image: "/showcase/creative-karma-dj-night.webp",
  },
  {
    title: "Community Campaign Poster",
    code: "03",
    type: "csc",
    image: "/showcase/creative-csc.webp",
  },
  {
    title: "KARMA Sponsors Poster",
    code: "04",
    type: "karma-sponsors",
    image: "/showcase/creative-karma-sponsors.webp",
  },
  {
    title: "Creative Campaign Poster",
    code: "05",
    type: "dsccs",
    image: "/showcase/creative-dsccs.webp",
  },
  {
    title: "Scrapbook Collage Poster",
    code: "06",
    type: "scrapbook",
    image: "/showcase/creative-scrapbook-collage.webp",
  },
  {
    title: "Spinora Phuket and Krabi Travel Poster",
    code: "07",
    type: "spinora-phuket-krabi",
    image: "/showcase/creative-spinora-phuket-krabi.webp",
  },
  {
    title: "Spinora Eid al-Adha Family Poster",
    code: "08",
    type: "spinora-eid-family",
    image: "/showcase/creative-spinora-eid-family.webp",
  },
  {
    title: "Crack Hackathons Event Poster",
    code: "09",
    type: "crack-hackathons",
    image: "/showcase/creative-crack-hackathons-new.webp",
  },
  {
    title: "KARMA 25 Onam Poster",
    code: "10",
    type: "karma25-onam",
    image: "/showcase/creative-karma25-onam.webp",
  },
  {
    title: "KMCT Silver Jubilee Logo Launch Poster",
    code: "11",
    type: "kmct-silver-jubilee",
    image: "/showcase/creative-kmct-silver-jubilee.webp",
  },
  {
    title: "Spinora Eid al-Adha Lamb Poster",
    code: "12",
    type: "spinora-eid-lamb",
    image: "/showcase/creative-spinora-eid-lamb.webp",
  },
];

export default function CreativeWorksGallery({ reveal = true, limit }) {
  const visibleWorks = Number.isInteger(limit)
    ? creativeWorks.slice(0, limit)
    : creativeWorks;

  return (
    <div className={`creative-gallery${reveal ? " reveal" : ""}`}>
      {visibleWorks.map((work) => (
        <figure
          className={[
            "creative-image",
            `creative-image-${work.type}`,
            work.image ? "creative-image-photo" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          key={work.code}
          aria-label={`${work.code} ${work.title}`}
          role="img"
          tabIndex={0}
        >
          <img src={work.image} alt="" loading="lazy" decoding="async" />
        </figure>
      ))}
    </div>
  );
}
