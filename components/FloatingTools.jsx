"use client";

import {
  SiAffinitydesigner,
  SiBehance,
  SiFramer,
  SiPenpot,
  SiSketch,
  SiWix,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";

const tools = [
  { className: "framer", label: "Framer", x: 12, y: 20, Icon: SiFramer },
  { className: "sketch", label: "Sketch", x: 34, y: 13, Icon: SiSketch },
  { className: "figma", label: "Figma", x: 63, y: 18, custom: "figma" },
  { className: "canva", label: "Canva", x: 86, y: 25, custom: "canva" },
  { className: "ps", label: "Photoshop", x: 20, y: 48, text: "Ps" },
  { className: "affinity", label: "Affinity Designer", x: 48, y: 40, Icon: SiAffinitydesigner },
  { className: "ai", label: "Illustrator", x: 78, y: 49, text: "Ai" },
  { className: "penpot", label: "Penpot", x: 92, y: 68, Icon: SiPenpot },
  { className: "behance", label: "Behance", x: 15, y: 78, Icon: SiBehance },
  { className: "xd", label: "Adobe XD", x: 39, y: 72, text: "Xd" },
  { className: "linkedin", label: "LinkedIn", x: 64, y: 82, Icon: FaLinkedinIn },
  { className: "wix", label: "Wix Studio", x: 83, y: 84, Icon: SiWix },
];

function ToolMark({ tool }) {
  const Icon = tool.Icon;

  return (
    <span className="tool-mark">
      {tool.custom === "figma" && (
        <span className="figma-logo">
          <i></i><i></i><i></i><i></i><i></i>
        </span>
      )}
      {tool.custom === "canva" && (
        <span className="canva-logo">Canva</span>
      )}
      {!tool.custom && (
        Icon ? <Icon /> : <span>{tool.text}</span>
      )}
    </span>
  );
}

function StickerSkin({ tool, clone = false }) {
  return (
    <span className={`sticker-skin${clone ? " sticker-skin-clone" : ""}`}>
      <ToolMark tool={tool} />
    </span>
  );
}

function ToolIcon({ tool, index }) {
  return (
    <button
      className={`floating-tool tool-icon ${tool.className}`}
      data-index={index}
      style={{ "--tool-x": `${tool.x}%`, "--tool-y": `${tool.y}%` }}
      aria-label={`${tool.label} sticker`}
      type="button"
    >
      <span className="sticker-sheet" aria-hidden="true">
        <span className="sticker-contact-shadow"></span>
        <span className="sticker-fixed">
          <StickerSkin tool={tool} />
        </span>
        <span className="sticker-fold">
          <span className="sticker-fold-front">
            <StickerSkin tool={tool} clone />
          </span>
          <span className="sticker-fold-back">
            <span className="sticker-adhesive-grain"></span>
          </span>
        </span>
      </span>
    </button>
  );
}

export default function FloatingTools() {
  return (
    <div className="contact-tool-field" aria-label="Design tools">
      {tools.map((tool, index) => (
        <ToolIcon tool={tool} index={index} key={tool.className} />
      ))}
    </div>
  );
}
