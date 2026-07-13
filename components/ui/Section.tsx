import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  light?: boolean;
  dark?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = "",
  light = false,
  dark = false,
}) => {
  const bgClass = dark ? "bg-secondary text-white" : light ? "bg-light" : "bg-white";
  return (
    <section id={id} className={`py-20 md:py-28 ${bgClass} ${className}`}>
      {children}
    </section>
  );
};

export default Section;
