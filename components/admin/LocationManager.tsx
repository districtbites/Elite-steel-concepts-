"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { LocationEntry } from "@/lib/db";
import { MapPin, Plus, Edit2, Trash2, Search, ExternalLink, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { deleteLocation } from "@/app/actions/locations";

interface LocationManagerProps {
  initialLocations: LocationEntry[];
}

const STATE_NAMES: Record<string, string> = {
  VA: "Virginia",
  DC: "Washington DC",
  MD: "Maryland",
  WV: "West Virginia",
  PA: "Pennsylvania",
  DE: "Delaware",
  NC: "North Carolina",
  TN: "Tennessee",
  SC: "South Carolina",
  KY: "Kentucky",
  NJ: "New Jersey",
  OH: "Ohio",
};

export default function LocationManager({ initialLocations }: LocationManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("ALL");
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const states = Array.from(new Set(initialLocations.map((l) => l.state))).sort();

  const filteredLocations = initialLocations.filter((loc) => {
    const matchesState = selectedState === "ALL" || loc.state === selectedState;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      loc.city.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.slug.toLowerCase().includes(q) ||
      (STATE_NAMES[loc.state] && STATE_NAMES[loc.state].toLowerCase().includes(q));

    return matchesState && matchesSearch;
  });

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteLocation(id);
      setDeleteModal(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Stats Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-admin-surface p-5 border border-admin-border">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-admin-text">
            {initialLocations.length} Configured Locations
          </h2>
          <p className="text-xs text-admin-muted uppercase tracking-wider font-bold mt-0.5">
            Active landing pages across {states.length} states & regions
          </p>
        </div>
        <Link href="/admin/locations/new">
          <Button className="bg-primary text-black uppercase font-black tracking-widest gap-2">
            <Plus size={16} /> Add Location
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-admin-surface p-4 border border-admin-border">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Search by city, state, or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-admin-bg border border-admin-border text-admin-text text-xs pl-10 pr-4 py-2.5 outline-none focus:border-primary uppercase font-bold tracking-wider"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary font-bold hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="bg-admin-bg border border-admin-border text-admin-text text-xs px-4 py-2.5 outline-none focus:border-primary uppercase font-bold tracking-wider"
        >
          <option value="ALL">All States ({initialLocations.length})</option>
          {states.map((st) => {
            const count = initialLocations.filter((l) => l.state === st).length;
            return (
              <option key={st} value={st}>
                {STATE_NAMES[st] || st} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Locations Table */}
      {filteredLocations.length === 0 ? (
        <div className="border-2 border-dashed border-admin-border p-12 text-center flex flex-col items-center justify-center bg-admin-surface">
          <MapPin size={40} className="text-admin-muted mb-3 opacity-40" />
          <h3 className="text-lg font-black uppercase tracking-wider text-admin-text mb-1">
            No Locations Found
          </h3>
          <p className="text-admin-muted text-xs max-w-md mx-auto mb-4">
            No location entries match your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedState("ALL");
            }}
            className="text-xs text-primary font-bold uppercase tracking-wider hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-admin-surface border border-admin-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-bg border-b border-admin-border text-[11px] uppercase tracking-widest font-black text-admin-muted">
                  <th className="p-4">City / State</th>
                  <th className="p-4">Slug / Live Link</th>
                  <th className="p-4">Distance</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {filteredLocations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-admin-bg/40 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-admin-text uppercase tracking-wider text-sm flex items-center gap-2">
                        <span>{loc.city}, {loc.state}</span>
                        <span className="text-[10px] font-black text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.2">
                          {loc.state}
                        </span>
                      </div>
                      <div className="text-[11px] text-admin-muted mt-1 truncate max-w-sm">
                        {loc.h1}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-admin-muted">
                      <div className="flex items-center gap-2">
                        <span>/locations/{loc.slug}</span>
                        <a
                          href={`/locations/${loc.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-orange-400"
                          title="View Live Page"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-admin-muted font-bold">
                      {loc.distance}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest border ${
                          loc.published
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "bg-admin-bg text-admin-muted border-admin-border"
                        }`}
                      >
                        {loc.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/locations/${loc.slug}`}>
                          <button
                            className="p-2 bg-admin-bg text-admin-text border border-admin-border hover:border-primary hover:text-primary transition-colors"
                            title="Edit Location"
                          >
                            <Edit2 size={13} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ id: loc.id, name: `${loc.city}, ${loc.state}` })}
                          className="p-2 bg-admin-bg text-admin-muted border border-admin-border hover:border-red-500 hover:text-red-500 transition-colors"
                          title="Delete Location"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-admin-surface border border-admin-border max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                Delete Location?
              </h3>
              <p className="text-admin-muted text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">{deleteModal.name}</strong>? This action cannot be undone and will remove the city landing page from the site.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-admin-border">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-admin-text border border-admin-border hover:bg-admin-bg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteModal.id)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white"
              >
                {isPending ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
