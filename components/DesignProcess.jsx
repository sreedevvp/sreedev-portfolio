import {
  FiBarChart2,
  FiCheckCircle,
  FiCode,
  FiList,
  FiSearch,
} from "react-icons/fi";
import { DiIllustrator } from "react-icons/di";
import {
  SiClaude,
  SiFigma,
  SiFramer,
  SiGithub,
  SiGoogleanalytics,
  SiGoogledocs,
  SiGoogleforms,
  SiNotion,
  SiOpenai,
  SiWebflow,
} from "react-icons/si";

const processSteps = [
  {
    number: "01",
    side: "left",
    icon: FiSearch,
    title: "Research & synthesis",
    description:
      "Talk to users, analyze data to find real problems. Then use AI to surface patterns and insights at scale.",
    tools: [
      { label: "ChatGPT", icon: SiOpenai, color: "#10a37f" },
      { label: "Claude", icon: SiClaude, color: "#d97757" },
      { label: "Notion", icon: SiNotion, color: "#111111" },
    ],
  },
  {
    number: "02",
    side: "right",
    icon: FiList,
    title: "Prioritize with stakeholders",
    description:
      "Align business and user needs. Decide what to build first and why.",
    tools: [
      { label: "Notion", icon: SiNotion, color: "#111111" },
      { label: "FigJam", icon: SiFigma, color: "#f24e1e" },
      { label: "Google Docs", icon: SiGoogledocs, color: "#4285f4" },
    ],
  },
  {
    number: "03",
    side: "left",
    icon: FiCode,
    title: "Design & prototype",
    description:
      "Design end-to-end flows, then build a functional prototype in code - not just Figma - to validate ideas fast.",
    tools: [
      { label: "Figma", icon: SiFigma, color: "#f24e1e" },
      { label: "Adobe Illustrator", icon: DiIllustrator, color: "#ff9a00" },
      { label: "Framer", icon: SiFramer, color: "#0055ff" },
    ],
  },
  {
    number: "04",
    side: "right",
    icon: FiCheckCircle,
    title: "Test & iterate",
    description:
      "Validate with real users and stakeholders. Iterate until the solution is right.",
    tools: [
      { label: "Figma", icon: SiFigma, color: "#f24e1e" },
      { label: "Google Forms", icon: SiGoogleforms, color: "#7248b9" },
      { label: "Notion", icon: SiNotion, color: "#111111" },
    ],
  },
  {
    number: "05",
    side: "left",
    icon: FiBarChart2,
    title: "Ship & measure",
    description:
      "Dev collab or own the build. Then track adoption, task completion and NPS delta to close the loop.",
    tools: [
      { label: "Framer", icon: SiFramer, color: "#0055ff" },
      { label: "Webflow", icon: SiWebflow, color: "#146ef5" },
      { label: "GitHub", icon: SiGithub, color: "#181717" },
      { label: "Google Analytics", icon: SiGoogleanalytics, color: "#e37400" },
      { label: "Codex", icon: SiOpenai, color: "#10a37f" },
    ],
  },
];

function ProcessMarker({ icon: Icon, number }) {
  return (
    <div className="design-process-marker" aria-hidden="true">
      <div className="design-process-icon">
        <Icon />
      </div>
      <span>{number}</span>
    </div>
  );
}

function ProcessCopy({ step }) {
  return (
    <div className="design-process-copy">
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <ul className="design-process-tools" aria-label={`Tools used for ${step.title}`}>
        {step.tools.map(({ label, icon: Icon, color }) => (
          <li key={label} title={label} data-tool={label} style={{ color }}>
            <Icon aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DesignProcess() {
  return (
    <section
      id="design-process"
      className="design-process"
      aria-labelledby="design-process-title"
    >
      <div className="design-process-inner">
        <header className="design-process-header reveal">
          <p>
            <span className="blinking-status-dot" aria-hidden="true" />
            MY DESIGN PROCESS
          </p>
          <h2 id="design-process-title">
            From ideas to experiences <em>&mdash; built with purpose.</em>
          </h2>
        </header>

        <ol className="design-process-timeline">
          {processSteps.map((step) => (
            <li
              className={`design-process-step design-process-step--${step.side}`}
              key={step.number}
            >
              {step.side === "left" ? (
                <>
                  <ProcessMarker icon={step.icon} number={step.number} />
                  <span className="design-process-node" aria-hidden="true" />
                  <ProcessCopy step={step} />
                </>
              ) : (
                <>
                  <ProcessCopy step={step} />
                  <span className="design-process-node" aria-hidden="true" />
                  <ProcessMarker icon={step.icon} number={step.number} />
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
