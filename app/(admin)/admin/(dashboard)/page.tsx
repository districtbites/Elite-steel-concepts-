import React from "react";
import StatCard from "@/components/admin/StatCard";
import { Users, FileText, MousePointer, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black uppercase text-secondary mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what is happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Views" value="12,450" icon={Users} color="blue" trend="+12% vs last month" />
        <StatCard label="Quote Requests" value="48" icon={MousePointer} color="primary" trend="+5 new today" />
        <StatCard label="Blog Posts" value="14" icon={FileText} color="purple" />
        <StatCard label="Avg. Time" value="2m 15s" icon={Activity} color="green" />
      </div>

      {/* Recent Activity Mock */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
         <h2 className="text-xl font-bold uppercase text-secondary mb-6 border-b border-gray-100 pb-4">
           Recent Activity
         </h2>
         <div className="space-y-4">
            {[
              { text: "New quote request from John Doe (Food Truck)", time: "10 mins ago" },
              { text: "Updated homepage hero section", time: "2 hours ago" },
              { text: "Published new blog post: 'Generator Maintenance'", time: "4 hours ago" },
              { text: "System backup completed", time: "1 day ago" },
            ].map((item, i) => (
               <div key={i} className="flex justify-between items-center py-2">
                  <span className="text-gray-700 font-medium">{item.text}</span>
                  <span className="text-xs text-gray-400 font-bold uppercase">{item.time}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
