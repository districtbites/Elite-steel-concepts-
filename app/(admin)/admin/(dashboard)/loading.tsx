// Shown instantly while an admin page loads its data, so sidebar clicks give immediate feedback
export default function AdminLoading() {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status" aria-live="polite">
 <div className="w-10 h-10 border-4 border-admin-border border-t-primary rounded-full animate-spin" />
 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-muted">Loading...</p>
 </div>
 );
}
