import type { Note } from "@/lib/supabase";

const CACHE_KEY  = "29notes_cache_v1";
const QUEUE_KEY  = "29notes_queue_v1";

export function cacheNotes(notes: Note[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(notes)); } catch { /* ignore */ }
}

export function getCachedNotes(): Note[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : null;
  } catch { return null; }
}

export interface QueuedOp {
  id:     string;
  type:   "update" | "delete";
  fields: Partial<Note>;
}

export function enqueueOp(op: QueuedOp) {
  try {
    const q = getQueue().filter(o => !(o.type === op.type && o.id === op.id));
    q.push(op);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch { /* ignore */ }
}

export function getQueue(): QueuedOp[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as QueuedOp[]) : [];
  } catch { return []; }
}

export function clearQueue() {
  try { localStorage.removeItem(QUEUE_KEY); } catch { /* ignore */ }
}
