import React from "react";

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = "",
  light = false,
}) => {
  const bgClass = light ? "bg-light" : "bg-white";
  return (
    <section id={id} className={`py-16 md:py-24 ${bgClass} ${className}`}>
      {children}
    </section>
  );
};

export default Section;
