import {
  PiArrowsClockwise,
  PiArrowsOutCardinalFill,
  PiBrowser,
  PiCloud,
  PiCompassTool,
  PiCubeFocus,
  PiCursorClickFill,
  PiCursorFill,
  PiCursorText,
  PiHandPalm,
  PiLayout,
  PiSelectionForeground,
} from "react-icons/pi";

const services = [
  { label: "UI Design", Icon: PiCursorFill },
  { label: "Graphic Design", Icon: PiCursorText },
  { label: "UX Design", Icon: PiArrowsOutCardinalFill },
  { label: "Logo Design", Icon: PiHandPalm },
  { label: "Brand Identity Design", Icon: PiSelectionForeground },
  { label: "Product Design", Icon: PiCubeFocus },
  { label: "Web Design", Icon: PiBrowser },
  { label: "Prototyping", Icon: PiCursorClickFill },
  { label: "SaaS Design", Icon: PiCloud },
  { label: "Rebranding", Icon: PiArrowsClockwise },
  { label: "Creative Direction", Icon: PiCompassTool },
  { label: "Landing Page Design", Icon: PiLayout },
];

function ServiceSet({ duplicate = false }) {
  return (
    <div className="service-marquee-set" aria-hidden={duplicate || undefined}>
      {services.map(({ label, Icon }) => (
        <div className="service-marquee-item" key={label}>
          <span>{label}</span>
          <Icon className="service-marquee-icon" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export default function ServiceMarquee() {
  return (
    <div
      className="logo-marquee marquee service-marquee"
      aria-label={`Design services: ${services.map(({ label }) => label).join(", ")}`}
    >
      <div className="marquee-track identity-track">
        <ServiceSet />
        <ServiceSet duplicate />
      </div>
    </div>
  );
}
