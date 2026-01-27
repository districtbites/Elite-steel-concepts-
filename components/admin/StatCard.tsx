import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  color?: "primary" | "blue" | "green" | "purple";
}

const StatCard = ({ label, value, icon: Icon, trend, color = "primary" }: StatCardProps) => {
  const colorMap = {
    primary: "text-primary bg-primary/10",
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    purple: "text-purple-500 bg-purple-500/10",
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-bold uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-3xl font-black text-secondary">{value}</div>
      {trend && (
        <div className="mt-2 text-xs font-bold text-green-500">
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
