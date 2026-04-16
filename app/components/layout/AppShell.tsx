"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/app/components/sidebar/Sidebar";
import NoteEditor from "@/app/components/editor/NoteEditor";
import HeadingTabs from "@/app/components/tabs/HeadingTabs";
import { fetchNotes, createNote, updateNote, deleteNote, importNote } from "@/lib/notes";
import { cacheNotes, getCachedNotes, enqueueOp, getQueue, clearQueue } from "@/lib/offlineCache";
import { saveSnapshot } from "@/lib/snapshots";
import { sounds } from "@/lib/sounds";
import type { Note } from "@/lib/supabase";
import type { HeadingItem } from "@/app/components/editor/NoteEditor";

const SCROLL_ID = "vault-editor-scroll";

export default function AppShell({ onLogout }: { onLogout: () => void }) {
  const [notes, setNotes]         = useState<Note[]>([]);
  const [activeNoteId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading]     = useState(true);
  const [dbError, setDbError]     = useState<string | null>(null);
  const [headings, setHeadings]   = useState<HeadingItem[]>([]);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [isOffline, setIsOffline] = useState(false);

  const titleSaveTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const importFileRef       = useRef<HTMLInputElement>(null);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  // ── Online/offline detection ───────────────────────────────────────────────
  useEffect(() => {
    const goOnline = async () => {
      setIsOffline(false);
      const q = getQueue();
      if (q.length > 0) {
        for (const op of q) {
          try {
            if (op.type === "update") await updateNote(op.id, op.fields);
            if (op.type === "delete") await deleteNote(op.id);
          } catch { /* best-effort */ }
        }
        clearQueue();
      }
    };
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    try {
      const data = await fetchNotes();
      setNotes(data);
      cacheNotes(data);
      if (data.length > 0) setActiveId(data[0].id);
    } catch (e) {
      const cached = getCachedNotes();
      if (cached) {
        setNotes(cached);
        if (cached.length > 0) setActiveId(cached[0].id);
        setIsOffline(true);
      } else {
        setDbError(String(e));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectNote(id: string) {
    sounds.select();
    setActiveId(id);
  }

  async function handleCreateNote() {
    sounds.create();
    try {
      const note = await createNote("Untitled");
      setNotes(p => {
        const next = [...p, note];
        cacheNotes(next);
        return next;
      });
      setActiveId(note.id);
    } catch (e) {
      console.error("Failed to create note:", e);
      setDbError(String(e));
    }
  }

  async function handleDeleteNote(id: string) {
    sounds.delete();
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    cacheNotes(remaining);
    if (activeNoteId === id) setActiveId(remaining.length > 0 ? remaining[0].id : null);
    try { await deleteNote(id); }
    catch { enqueueOp({ id, type: "delete", fields: {} }); }
  }

  async function handleRenameNote(id: string, title: string) {
    setNotes(p => {
      const next = p.map(n => n.id === id ? { ...n, title } : n);
      cacheNotes(next);
      return next;
    });
    try { await updateNote(id, { title }); } catch { /* ignore */ }
  }

  async function handlePinNote(id: string, pinned: boolean) {
    sounds.pin();
    setNotes(p => {
      const next = p.map(n => n.id === id ? { ...n, pinned } : n);
      cacheNotes(next);
      return next;
    });
    try { await updateNote(id, { pinned }); }
    catch { enqueueOp({ id, type: "update", fields: { pinned } }); }
  }

  async function handleColorNote(id: string, color: string | null) {
    sounds.click();
    setNotes(p => {
      const next = p.map(n => n.id === id ? { ...n, color } : n);
      cacheNotes(next);
      return next;
    });
    try { await updateNote(id, { color }); }
    catch { enqueueOp({ id, type: "update", fields: { color } }); }
  }

  const handleTitleChange = useCallback((id: string, title: string) => {
    setNotes(p => {
      const next = p.map(n => n.id === id ? { ...n, title } : n);
      cacheNotes(next);
      return next;
    });
    setSaveState("saving");
    if (titleSaveTimerRef.current) clearTimeout(titleSaveTimerRef.current);
    titleSaveTimerRef.current = setTimeout(async () => {
      try {
        await updateNote(id, { title });
        setSaveState("saved");
        sounds.save();
      } catch {
        enqueueOp({ id, type: "update", fields: { title } });
        setSaveState("error");
        sounds.error();
      }
    }, 1200);
  }, []);

  const handleContentChange = useCallback((id: string, content: string) => {
    setNotes(p => {
      const next = p.map(n => n.id === id ? { ...n, content } : n);
      cacheNotes(next);
      return next;
    });
    setSaveState("saving");
    if (contentSaveTimerRef.current) clearTimeout(contentSaveTimerRef.current);
    contentSaveTimerRef.current = setTimeout(async () => {
      try {
        await updateNote(id, { content });
        setSaveState("saved");
        sounds.save();
      } catch {
        enqueueOp({ id, type: "update", fields: { content } });
        setSaveState("error");
        sounds.error();
      }
    }, 1200);
  }, []);

  function handleSaveSnapshot(noteId: string, title: string, content: string) {
    sounds.snap();
    saveSnapshot(noteId, title, content);
  }

  function handleRestoreSnapshot(id: string, content: string, title: string) {
    handleTitleChange(id, title);
    handleContentChange(id, content);
    setNotes(p => p.map(n => n.id === id ? { ...n, title, content } : n));
  }

  // ── Export / Import ────────────────────────────────────────────────────────

  function handleExport() {
    sounds.click();
    const payload = {
      version:     2,
      exported_at: new Date().toISOString(),
      notes: notes.map(({ title, content, color, pinned }) => ({ title, content, color, pinned })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `29notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    sounds.click();
    importFileRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const noteList: Array<{ title: string; content: string; color?: string | null; pinned?: boolean }> =
        Array.isArray(data) ? data : (data.notes || []);
      for (const n of noteList) {
        try {
          const created = await importNote(n.title || "Imported", n.content || "", n.color ?? null, n.pinned ?? false);
          setNotes(p => [...p, created]);
        } catch { /* skip failed */ }
      }
      sounds.create();
    } catch {
      sounds.error();
    }
    e.target.value = "";
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 100% 80% at 30% 0%, rgba(18,55,175,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 70% 60% at 80% 100%, rgba(10,30,110,0.3) 0%, transparent 60%),
          linear-gradient(160deg, #0A2172 0%, #071560 40%, #040D3A 100%)
        `,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-0 shrink-0"
        style={{
          height: 44,
          background: "rgba(5,16,65,0.7)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(35,85,180,0.3)",
          boxShadow: "0 1px 0 rgba(80,150,255,0.06), 0 4px 16px rgba(0,0,0,0.25)",
        }}>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {["rgba(255,90,90,0.6)", "rgba(255,190,50,0.5)", "rgba(60,210,100,0.5)"].map((c, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, boxShadow: `0 0 4px ${c}` }} />
            ))}
          </div>
          <div style={{ width: 1, height: 14, background: "rgba(50,100,200,0.3)" }} />
          <div className="font-vault" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(93,220,245,0.6)", textShadow: "0 0 10px rgba(93,220,245,0.25)" }}>
            29NOTES
          </div>
        </div>

        <div className="font-vault absolute left-1/2 -translate-x-1/2" style={{ fontSize: "0.58rem", letterSpacing: "0.22em", color: "rgba(120,175,230,0.45)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {activeNote?.title || ""}
        </div>

        <div className="flex items-center gap-4">
          <button className="font-vault" onClick={async () => { await fetch("/api/auth", { method: "DELETE" }); onLogout(); }}
            style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(93,220,245,0.65)" }}>LOCK</button>
          <div className="font-vault" style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: saveState === "error" ? "#ff8c8c" : "rgba(93,220,245,0.5)" }}>
            {saveState === "saving" ? "SAVING" : saveState === "error" ? "SAVE ERROR" : "SAVED"}
          </div>
          {isOffline && (
            <div className="font-vault" style={{ fontSize: "0.5rem", letterSpacing: "0.2em", color: "#FFD166" }}>OFFLINE</div>
          )}
          <div className="font-vault" style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(50,95,170,0.5)" }}>
            {notes.length} {notes.length === 1 ? "FILE" : "FILES"}
          </div>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isOffline ? "rgba(255,180,50,0.7)" : "rgba(80,200,120,0.6)", boxShadow: isOffline ? "0 0 6px rgba(255,180,50,0.5)" : "0 0 6px rgba(80,200,120,0.4)" }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          onRenameNote={handleRenameNote}
          onPinNote={handlePinNote}
          onColorNote={handleColorNote}
          onExport={handleExport}
          onImport={handleImportClick}
          loading={loading}
        />

        <div className="flex-1 overflow-hidden">
          {dbError ? (
            <DbErrorState onRetry={() => { setDbError(null); setLoading(true); loadNotes(); }} />
          ) : activeNote ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              scrollContainerId={SCROLL_ID}
              onTitleChange={t => handleTitleChange(activeNote.id, t)}
              onContentChange={c => handleContentChange(activeNote.id, c)}
              onHeadingsChange={setHeadings}
              onSaveSnapshot={(title, content) => handleSaveSnapshot(activeNote.id, title, content)}
              onRestoreSnapshot={(content, title) => handleRestoreSnapshot(activeNote.id, content, title)}
            />
          ) : (
            <EmptyState onCreateNote={handleCreateNote} loading={loading} />
          )}
        </div>

        <HeadingTabs headings={headings} scrollContainerId={SCROLL_ID} />
      </div>

      {/* Hidden import file input */}
      <input ref={importFileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onCreateNote, loading }: { onCreateNote: () => void; loading: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{ width: 80, height: 80, borderRadius: 22, background: "linear-gradient(160deg, rgba(22,60,175,0.5) 0%, rgba(14,40,130,0.6) 100%)", boxShadow: "0 0 0 1px rgba(35,85,185,0.45), 0 0 0 2px rgba(12,35,110,0.4), inset 0 1px 0 rgba(120,185,255,0.1), 0 6px 0 rgba(5,15,55,0.7), 0 10px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="3" y="5" width="30" height="26" rx="4" fill="rgba(60,130,210,0.12)" stroke="rgba(93,220,245,0.3)" strokeWidth="1.4"/>
          <path d="M3 12h30" stroke="rgba(93,220,245,0.2)" strokeWidth="1.2"/>
          <line x1="10" y1="19" x2="26" y2="19" stroke="rgba(93,220,245,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10" y1="24" x2="22" y2="24" stroke="rgba(93,220,245,0.15)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </motion.div>
      <div className="text-center">
        <div className="font-vault mb-2" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(60,110,180,0.5)" }}>
          {loading ? "LOADING..." : "ARCHIVE EMPTY"}
        </div>
        {!loading && <div className="font-body" style={{ fontSize: "0.8rem", color: "rgba(80,130,200,0.35)" }}>Create your first note to begin</div>}
      </div>
      {!loading && (
        <button className="vault-btn" onClick={onCreateNote} style={{ fontSize: "0.68rem", letterSpacing: "0.2em" }}>
          + NEW NOTE
        </button>
      )}
    </div>
  );
}

// ─── DB error state ───────────────────────────────────────────────────────────

function DbErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 px-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{ width: 80, height: 80, borderRadius: 22, background: "linear-gradient(160deg, rgba(140,30,30,0.4) 0%, rgba(100,20,20,0.5) 100%)", boxShadow: "0 0 0 1px rgba(200,60,60,0.35), 0 6px 0 rgba(5,15,55,0.7), 0 10px 24px rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="14" stroke="rgba(255,120,120,0.6)" strokeWidth="1.4"/>
          <line x1="18" y1="10" x2="18" y2="20" stroke="rgba(255,120,120,0.8)" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="25" r="1.5" fill="rgba(255,120,120,0.8)"/>
        </svg>
      </motion.div>
      <div className="text-center max-w-sm">
        <div className="font-vault mb-3" style={{ fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(255,120,120,0.7)" }}>DATABASE NOT SET UP</div>
        <div className="font-body mb-4" style={{ fontSize: "0.82rem", color: "rgba(150,180,220,0.6)", lineHeight: 1.6 }}>
          The notes table doesn&apos;t exist in your Supabase database yet. Go to your Supabase dashboard, open the SQL Editor, and run the contents of{" "}
          <span style={{ color: "rgba(93,220,245,0.7)", fontFamily: "monospace" }}>supabase-schema.sql</span> from this project.
        </div>
        <button className="vault-btn" onClick={onRetry} style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>RETRY CONNECTION</button>
      </div>
    </div>
  );
}
