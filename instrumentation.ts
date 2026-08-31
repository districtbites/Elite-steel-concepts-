/**
 * instrumentation.ts
 *
 * Next.js server instrumentation — runs once when the server starts.
 * Schedules automatic daily database backups at midnight (PKT = UTC+5).
 * No manual commands needed. Works on local dev AND production (Hostinger).
 */

export async function register() {
    // Only run on the Node.js server, not in the Edge runtime or browser
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;

    // Dynamically import so this only executes server-side
    const { scheduleBackup } = await import('./lib/backupScheduler');
    scheduleBackup();
}
