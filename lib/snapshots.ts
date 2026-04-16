const MAX_SNAPS = 20;

export interface Snapshot {
  id:        string;
  noteId:    string;
  timestamp: string;
  title:     string;
  content:   string;
}

function storageKey(noteId: string) {
  return `29notes_snaps_${noteId}`;
}

export function saveSnapshot(noteId: string, title: string, content: string): Snapshot {
  const snap: Snapshot = {
    id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    noteId,
    timestamp: new Date().toISOString(),
    title,
    content,
  };
  const existing = getSnapshots(noteId);
  const updated  = [snap, ...existing].slice(0, MAX_SNAPS);
  try { localStorage.setItem(storageKey(noteId), JSON.stringify(updated)); } catch { /* ignore */ }
  return snap;
}

export function getSnapshots(noteId: string): Snapshot[] {
  try {
    const raw = localStorage.getItem(storageKey(noteId));
    return raw ? (JSON.parse(raw) as Snapshot[]) : [];
  } catch { return []; }
}

export function deleteSnapshot(noteId: string, snapId: string) {
  const updated = getSnapshots(noteId).filter(s => s.id !== snapId);
  try { localStorage.setItem(storageKey(noteId), JSON.stringify(updated)); } catch { /* ignore */ }
}

export function clearSnapshots(noteId: string) {
  try { localStorage.removeItem(storageKey(noteId)); } catch { /* ignore */ }
}
