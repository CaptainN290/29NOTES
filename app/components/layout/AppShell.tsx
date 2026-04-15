"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/app/components/sidebar/Sidebar";
import NoteEditor from "@/app/components/editor/NoteEditor";
import HeadingTabs from "@/app/components/tabs/HeadingTabs";
import { fetchNotes, createNote, updateNote, deleteNote } from "@/lib/notes";
import type { Note } from "@/lib/supabase";
import type { HeadingItem } from "@/app/components/editor/NoteEditor";

const SCROLL_ID = "vault-editor-scroll";

export default function AppShell({ onLogout }: { onLogout: () => void }) {
  const [notes, setNotes]           = useState<Note[]>([]);
  const [activeNoteId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [headings, setHeadings]     = useState<HeadingItem[]>([]);
  const [saveState, setSaveState] = useState<"saved"|"saving"|"error">("saved");
  const titleSaveTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contentSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeNote   = notes.find(n => n.id === activeNoteId) || null;

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    try {
      const data = await fetchNotes();
      setNotes(data);
      if (data.length > 0) setActiveId(data[0].id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleCreateNote() {
    try {
      const note = await createNote("Untitled");
      setNotes(p => [...p, note]); setActiveId(note.id);
    } catch (e) {
      console.error("Failed to create note:", e);
      setSaveState("error");
    }
  }

  async function handleDeleteNote(id: string) {
    try { await deleteNote(id); } catch { /* ignore */ }
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id) setActiveId(remaining.length > 0 ? remaining[0].id : null);
  }

  async function handleRenameNote(id: string, title: string) {
    setNotes(p => p.map(n => n.id === id ? { ...n, title } : n));
    try { await updateNote(id, { title }); } catch { /* ignore */ }
  }

  const handleTitleChange = useCallback((id: string, title: string) => {
    setNotes(p => p.map(n => n.id === id ? { ...n, title } : n));
    setSaveState("saving");
    if (titleSaveTimerRef.current) clearTimeout(titleSaveTimerRef.current);
    titleSaveTimerRef.current = setTimeout(async () => {
      try { await updateNote(id, { title }); setSaveState("saved"); }
      catch (e) { console.error("Title save failed:", e); setSaveState("error"); }
    }, 1200);
  }, []);

  const handleContentChange = useCallback((id: string, content: string) => {
    setNotes(p => p.map(n => n.id === id ? { ...n, content } : n));
    setSaveState("saving");
    if (contentSaveTimerRef.current) clearTimeout(contentSaveTimerRef.current);
    contentSaveTimerRef.current = setTimeout(async () => {
      try { await updateNote(id, { content }); setSaveState("saved"); }
      catch (e) { console.error("Content save failed:", e); setSaveState("error"); }
    }, 1200);
  }, []);

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

        {/* Left: App identity */}
        <div className="flex items-center gap-3">
          {/* Traffic-light dots */}
          <div className="flex gap-1.5">
            {["rgba(255,90,90,0.6)", "rgba(255,190,50,0.5)", "rgba(60,210,100,0.5)"].map((c, i) => (
              <div key={i} style={{
                width: 9, height: 9, borderRadius: "50%",
                background: c,
                boxShadow: `0 0 4px ${c}`,
              }} />
            ))}
          </div>
          <div style={{ width: 1, height: 14, background: "rgba(50,100,200,0.3)" }} />
          <div className="font-vault"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.3em",
              color: "rgba(93,220,245,0.6)",
              textShadow: "0 0 10px rgba(93,220,245,0.25)",
            }}>
            29NOTES
          </div>
        </div>

        {/* Center: active note title */}
        <div className="font-vault absolute left-1/2 -translate-x-1/2"
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            color: "rgba(120,175,230,0.45)",
            maxWidth: 260,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
          {activeNote?.title || ""}
        </div>

        {/* Right: meta */}
        <div className="flex items-center gap-4">
          <button className="font-vault" onClick={async ()=>{await fetch("/api/auth",{method:"DELETE"}); onLogout();}} style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(93,220,245,0.65)" }}>LOCK</button>
          <div className="font-vault" style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: saveState==="error"?"#ff8c8c":"rgba(93,220,245,0.5)" }}>{saveState==="saving"?"SAVING":saveState==="error"?"SAVE ERROR":"SAVED"}</div>
          <div className="font-vault"
            style={{ fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(50,95,170,0.5)" }}>
            {notes.length} {notes.length === 1 ? "FILE" : "FILES"}
          </div>
          {/* Online indicator */}
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "rgba(80,200,120,0.6)",
            boxShadow: "0 0 6px rgba(80,200,120,0.4)",
          }} />
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          notes={notes}
          activeNoteId={activeNoteId}
          onSelectNote={setActiveId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          onRenameNote={handleRenameNote}
          loading={loading}
        />

        <div className="flex-1 overflow-hidden">
          {activeNote ? (
            <NoteEditor
              key={activeNote.id}
              note={activeNote}
              scrollContainerId={SCROLL_ID}
              onTitleChange={t => handleTitleChange(activeNote.id, t)}
              onContentChange={c => handleContentChange(activeNote.id, c)}
              onHeadingsChange={setHeadings}
            />
          ) : (
            <EmptyState onCreateNote={handleCreateNote} loading={loading} />
          )}
        </div>

        <HeadingTabs headings={headings} scrollContainerId={SCROLL_ID} />
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreateNote, loading }: { onCreateNote: () => void; loading: boolean }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6">
      {/* Folder icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        style={{
          width: 80, height: 80, borderRadius: 22,
          background: "linear-gradient(160deg, rgba(22,60,175,0.5) 0%, rgba(14,40,130,0.6) 100%)",
          boxShadow: `
            0 0 0 1px rgba(35,85,185,0.45),
            0 0 0 2px rgba(12,35,110,0.4),
            inset 0 1px 0 rgba(120,185,255,0.1),
            0 6px 0 rgba(5,15,55,0.7),
            0 10px 24px rgba(0,0,0,0.4)
          `,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect x="3" y="5" width="30" height="26" rx="4"
            fill="rgba(60,130,210,0.12)" stroke="rgba(93,220,245,0.3)" strokeWidth="1.4"/>
          <path d="M3 12h30" stroke="rgba(93,220,245,0.2)" strokeWidth="1.2"/>
          <line x1="10" y1="19" x2="26" y2="19" stroke="rgba(93,220,245,0.2)" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="10" y1="24" x2="22" y2="24" stroke="rgba(93,220,245,0.15)" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </motion.div>

      <div className="text-center">
        <div className="font-vault mb-2"
          style={{ fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(60,110,180,0.5)" }}>
          {loading ? "LOADING..." : "ARCHIVE EMPTY"}
        </div>
        {!loading && (
          <div className="font-body"
            style={{ fontSize: "0.8rem", color: "rgba(80,130,200,0.35)" }}>
            Create your first note to begin
          </div>
        )}
      </div>

      {!loading && (
        <button className="vault-btn" onClick={onCreateNote}
          style={{ fontSize: "0.68rem", letterSpacing: "0.2em" }}>
          + NEW NOTE
        </button>
      )}
    </div>
  );
}
