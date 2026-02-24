import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "blue" | "green" | "purple" | "red" | "amber";
  href?: string;
}

const StatCard = ({ label, value, icon: Icon, trend, color = "primary", href }: StatCardProps) => {
  const colorMap = {
    primary: { icon: "text-primary bg-primary/10", bar: "bg-primary" },
    blue:    { icon: "text-blue-500 bg-blue-500/10", bar: "bg-blue-500" },
    green:   { icon: "text-green-500 bg-green-500/10", bar: "bg-green-500" },
    purple:  { icon: "text-purple-500 bg-purple-500/10", bar: "bg-purple-500" },
    red:     { icon: "text-red-500 bg-red-500/10", bar: "bg-red-500" },
    amber:   { icon: "text-amber-500 bg-amber-500/10", bar: "bg-amber-500" },
  };

  const Wrapper = href ? "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${href ? "cursor-pointer" : ""}`}
    >
      {/* Subtle gradient bg on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
        color === "primary" ? "from-primary/3 to-primary/8" :
        color === "blue" ? "from-blue-500/3 to-blue-500/8" :
        color === "green" ? "from-green-500/3 to-green-500/8" :
        color === "purple" ? "from-purple-500/3 to-purple-500/8" :
        color === "red" ? "from-red-500/3 to-red-500/8" :
        "from-amber-500/3 to-amber-500/8"
      }`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</span>
          <div className={`p-2.5 rounded-xl ${colorMap[color].icon} group-hover:scale-110 transition-transform`}>
            <Icon size={18} />
          </div>
        </div>

        <div className="text-4xl font-black text-secondary tracking-tighter leading-none mb-1">{value}</div>

        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className={`w-1.5 h-1.5 rounded-full ${colorMap[color].bar}`} />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{trend}</span>
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${colorMap[color].bar} opacity-0 group-hover:opacity-100 transition-opacity`} />
    </Wrapper>
  );
};

export default StatCard;
