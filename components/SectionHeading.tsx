import React from "react";
import { Reveal } from "./Motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "start" | "center";
  light?: boolean;
  action?: React.ReactNode;
}

const SectionHeading = ({ eyebrow, title, lead, align = "start", light = false, action }: SectionHeadingProps) => {
  const centered = align === "center";
  return (
    <Reveal
      className={`mb-12 flex flex-col gap-6 md:mb-14 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centered ? "flex flex-col items-center" : ""}>
        {eyebrow && <span className={`eyebrow ${light ? "!text-brass-400" : ""}`}>{eyebrow}</span>}
        <h2 className={`section-title mt-4 ${light ? "!text-white" : ""}`}>{title}</h2>
        {lead && <p className={`section-lead ${light ? "!text-white/65" : ""}`}>{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
};

export default SectionHeading;
