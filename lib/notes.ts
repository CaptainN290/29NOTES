export type Note = {
  id:          string;
  title:       string;
  content:     string;
  created_at:  string;
  updated_at:  string;
  order_index: number;
  pinned:      boolean;
  color:       string | null;
};

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const fetchNotes   = () => api<Note[]>("/api/notes");
export const createNote   = (title = "Untitled") =>
  api<Note>("/api/notes", { method: "POST", body: JSON.stringify({ title }) });
export const updateNote   = (id: string, fields: Partial<Pick<Note, "title" | "content" | "pinned" | "color">>) =>
  api(`/api/notes/${id}`, { method: "PATCH", body: JSON.stringify(fields) });
export const deleteNote   = (id: string) =>
  api(`/api/notes/${id}`, { method: "DELETE" });
export const importNote   = (title: string, content: string, color: string | null, pinned: boolean) =>
  api<Note>("/api/notes", { method: "POST", body: JSON.stringify({ title, content, color, pinned }) });
