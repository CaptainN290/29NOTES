"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "@/lib/supabase";

const COLOR_PALETTE: Array<{ id: string | null; hex: string | null; label: string }> = [
  { id: null,     hex: null,      label: "None"   },
  { id: "cyan",   hex: "#5DDCF5", label: "Cyan"   },
  { id: "green",  hex: "#4CFF91", label: "Green"  },
  { id: "amber",  hex: "#FFD166", label: "Amber"  },
  { id: "red",    hex: "#FF6B6B", label: "Red"    },
  { id: "purple", hex: "#B57BFF", label: "Purple" },
];

function colorHex(color: string | null): string | null {
  return COLOR_PALETTE.find(c => c.id === color)?.hex ?? null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

interface SidebarProps {
  notes:        Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onRenameNote: (id: string, title: string) => void;
  onPinNote:    (id: string, pinned: boolean) => void;
  onColorNote:  (id: string, color: string | null) => void;
  onExport:     () => void;
  onImport:     () => void;
  loading:      boolean;
}

export default function Sidebar({
  notes, activeNoteId, onSelectNote, onCreateNote, onDeleteNote, onRenameNote,
  onPinNote, onColorNote, onExport, onImport, loading,
}: SidebarProps) {
  const [renamingId, setRenamingId]   = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [colorMenuId, setColorMenuId] = useState<string | null>(null);
  const [search, setSearch]           = useState("");
  const renameRef = useRef<HTMLInputElement>(null);

  function startRename(note: Note) {
    setRenamingId(note.id); setRenameValue(note.title); setContextMenu(null);
    setTimeout(() => renameRef.current?.select(), 50);
  }
  function commitRename(id: string) {
    if (renameValue.trim()) onRenameNote(id, renameValue.trim());
    setRenamingId(null);
  }
  function handleContextMenu(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
    setColorMenuId(null);
  }
  function closeAll() { setContextMenu(null); setColorMenuId(null); }

  // Sort: pinned first, then by order_index; then filter by search
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return a.order_index - b.order_index;
  });

  const q = search.trim().toLowerCase();
  const filtered = q
    ? sorted.filter(n => n.title.toLowerCase().includes(q) || stripHtml(n.content).toLowerCase().includes(q))
    : sorted;

  const ctxNote = contextMenu ? notes.find(n => n.id === contextMenu.id) : null;

  return (
    <div className="relative flex flex-col h-full select-none"
      style={{ width: 228, minWidth: 200 }}
      onClick={closeAll}>

      {/* ── Sidebar panel ── */}
      <div className="h-full flex flex-col m-3 mr-2 rounded-[20px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(16,44,155,0.82) 0%, rgba(9,28,98,0.92) 100%)",
          boxShadow: "0 0 0 1px rgba(35,85,185,0.55), 0 0 0 2px rgba(10,30,90,0.5), inset 0 1px 0 rgba(110,180,255,0.14), inset 1px 0 0 rgba(110,180,255,0.06), 4px 0 24px rgba(0,0,0,0.4)",
        }}>

        {/* ── Header ── */}
        <div className="px-4 pt-5 pb-3" style={{ borderBottom: "1px solid rgba(40,90,180,0.25)" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-vault" style={{ fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(93,220,245,0.4)" }}>FILES</div>
            <div className="font-vault" style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(60,110,180,0.35)" }}>{notes.length}</div>
          </div>
          <button className="vault-btn w-full" onClick={e => { e.stopPropagation(); onCreateNote(); }}
            style={{ fontSize: "0.65rem", letterSpacing: "0.18em", padding: "10px 16px" }}>
            + NEW NOTE
          </button>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              className="sidebar-search w-full"
              placeholder="SEARCH..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ fontSize: "0.6rem", color: "rgba(93,220,245,0.5)" }}
                onClick={e => { e.stopPropagation(); setSearch(""); }}>
                ✕
              </button>
            )}
          </div>
          {search && (
            <div className="font-vault mt-1.5" style={{ fontSize: "0.48rem", letterSpacing: "0.25em", color: "rgba(93,220,245,0.35)", textAlign: "right" }}>
              {filtered.length} RESULT{filtered.length !== 1 ? "S" : ""}
            </div>
          )}
        </div>

        {/* ── Note list ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
          {loading ? (
            <div className="flex flex-col gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-[14px] animate-pulse"
                  style={{ height: 60, background: "linear-gradient(160deg, rgba(25,60,160,0.4) 0%, rgba(16,42,120,0.5) 100%)", boxShadow: "0 0 0 1px rgba(30,75,165,0.3)", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="font-vault text-center" style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(60,110,180,0.4)" }}>
                {search ? "NO MATCHES" : "NO FILES YET"}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {filtered.map((note, idx) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -16, scale: 0.94, transition: { duration: 0.15 } }}
                  transition={{ delay: idx * 0.03, type: "spring", stiffness: 320, damping: 26 }}>
                  <NoteCard
                    note={note}
                    isActive={note.id === activeNoteId}
                    isRenaming={renamingId === note.id}
                    renameValue={renameValue}
                    renameRef={renameRef}
                    searchQuery={q}
                    onSelect={() => onSelectNote(note.id)}
                    onContextMenu={e => handleContextMenu(e, note.id)}
                    onDoubleClick={() => startRename(note)}
                    onRenameChange={setRenameValue}
                    onRenameCommit={() => commitRename(note.id)}
                    onRenameKeyDown={e => {
                      if (e.key === "Enter") commitRename(note.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(40,90,180,0.18)" }}>
          <div className="font-vault" style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "rgba(50,95,170,0.35)" }}>
            29NOTES v1
          </div>
          <div className="flex items-center gap-2">
            <button className="font-vault sidebar-footer-btn" onClick={e => { e.stopPropagation(); onExport(); }} title="Export all notes as JSON">
              EXP
            </button>
            <button className="font-vault sidebar-footer-btn" onClick={e => { e.stopPropagation(); onImport(); }} title="Import notes from JSON">
              IMP
            </button>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(93,220,245,0.5)", boxShadow: "0 0 6px rgba(93,220,245,0.5)" }} />
          </div>
        </div>
      </div>

      {/* ── Context menu ── */}
      <AnimatePresence>
        {contextMenu && ctxNote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -4 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="fixed z-50 overflow-hidden"
            style={{
              left: contextMenu.x, top: contextMenu.y,
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(26,74,200,0.97) 0%, rgba(17,50,158,0.98) 100%)",
              boxShadow: "0 0 0 1px rgba(55,125,215,0.6), 0 0 0 2px rgba(20,55,140,0.4), inset 0 1px 0 rgba(140,200,255,0.16), 0 8px 32px rgba(0,0,0,0.55)",
              minWidth: 164,
            }}
            onClick={e => e.stopPropagation()}>

            {/* Rename */}
            <CtxItem label="RENAME" icon="✎" onClick={() => startRename(ctxNote)} />

            {/* Pin / Unpin */}
            <CtxItem
              label={ctxNote.pinned ? "UNPIN" : "PIN"}
              icon={ctxNote.pinned ? "⊘" : "⊕"}
              onClick={() => { onPinNote(ctxNote.id, !ctxNote.pinned); closeAll(); }}
              divider
            />

            {/* Color label */}
            <div style={{ borderTop: "1px solid rgba(40,90,180,0.2)" }}>
              <button
                className="w-full text-left px-4 py-2 font-vault flex items-center justify-between transition-colors"
                style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(200,228,255,0.85)" }}
                onClick={() => setColorMenuId(colorMenuId === ctxNote.id ? null : ctxNote.id)}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="flex items-center gap-2">
                  <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>◉</span>
                  COLOR
                </span>
                <span style={{ opacity: 0.5, fontSize: "0.55rem" }}>▸</span>
              </button>

              {colorMenuId === ctxNote.id && (
                <div className="px-3 pb-2.5 flex items-center gap-2 flex-wrap">
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={String(c.id)}
                      title={c.label}
                      onClick={() => { onColorNote(ctxNote.id, c.id); closeAll(); }}
                      style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: c.hex ?? "transparent",
                        border: c.hex
                          ? `2px solid ${ctxNote.color === c.id ? "white" : "rgba(255,255,255,0.3)"}`
                          : "2px dashed rgba(93,220,245,0.3)",
                        cursor: "pointer",
                        boxShadow: ctxNote.color === c.id ? `0 0 8px ${c.hex}` : "none",
                      }} />
                  ))}
                </div>
              )}
            </div>

            {/* Delete */}
            <CtxItem
              label="DELETE"
              icon="✕"
              danger
              divider
              onClick={() => { onDeleteNote(contextMenu.id); closeAll(); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Context menu item ────────────────────────────────────────────────────────

function CtxItem({ label, icon, danger, divider, onClick }: { label: string; icon: string; danger?: boolean; divider?: boolean; onClick: () => void }) {
  return (
    <button
      className="w-full text-left px-4 py-2.5 font-vault flex items-center gap-2.5 transition-colors"
      style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: danger ? "#FF8585" : "rgba(200,228,255,0.85)", borderTop: divider ? "1px solid rgba(40,90,180,0.2)" : "none" }}
      onClick={onClick}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
      <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>{icon}</span>
      {label}
    </button>
  );
}

// ─── Note Card ────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note:           Note;
  isActive:       boolean;
  isRenaming:     boolean;
  renameValue:    string;
  renameRef:      React.RefObject<HTMLInputElement>;
  searchQuery:    string;
  onSelect:       () => void;
  onContextMenu:  (e: React.MouseEvent) => void;
  onDoubleClick:  () => void;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(93,220,245,0.25)", color: "var(--c-accent)", borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function NoteCard({
  note, isActive, isRenaming, renameValue, renameRef, searchQuery,
  onSelect, onContextMenu, onDoubleClick,
  onRenameChange, onRenameCommit, onRenameKeyDown,
}: NoteCardProps) {
  const date    = new Date(note.updated_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const hex     = colorHex(note.color);

  return (
    <div
      className={`note-card ${isActive ? "active" : ""}`}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      style={hex ? { borderLeft: `3px solid ${hex}`, paddingLeft: 10 } : {}}>

      {/* Pinned indicator */}
      {note.pinned && (
        <div style={{ position: "absolute", top: 7, right: 8, fontSize: "0.55rem", color: "rgba(93,220,245,0.6)", lineHeight: 1 }}>⊕</div>
      )}

      <div className="flex items-start gap-2.5">
        {/* File icon with optional color tint */}
        <div className="shrink-0 mt-0.5" style={{ width: 28, height: 32, position: "relative" }}>
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            <rect x="1" y="1" width="22" height="30" rx="4"
              fill={hex ? `${hex}18` : isActive ? "rgba(93,220,245,0.12)" : "rgba(60,120,210,0.1)"}
              stroke={hex ?? (isActive ? "rgba(93,220,245,0.45)" : "rgba(60,120,210,0.35)") }
              strokeWidth="1"/>
            <path d="M17 1L23 7H17V1Z"
              fill={hex ? `${hex}30` : isActive ? "rgba(93,220,245,0.2)" : "rgba(60,120,210,0.18)"}
              stroke={hex ? `${hex}50` : isActive ? "rgba(93,220,245,0.35)" : "rgba(60,120,210,0.25)"}
              strokeWidth="0.8"/>
            <line x1="5" y1="14" x2="19" y2="14" stroke={isActive ? "rgba(93,220,245,0.4)" : "rgba(80,140,210,0.3)"} strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="18" x2="19" y2="18" stroke={isActive ? "rgba(93,220,245,0.3)" : "rgba(80,140,210,0.22)"} strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="22" x2="14" y2="22" stroke={isActive ? "rgba(93,220,245,0.2)" : "rgba(80,140,210,0.16)"} strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 py-0.5">
          {isRenaming ? (
            <input
              ref={renameRef}
              className="w-full bg-transparent outline-none font-vault"
              style={{ fontSize: "0.72rem", letterSpacing: "0.04em", color: "var(--c-accent)", borderBottom: "1px solid rgba(93,220,245,0.5)", paddingBottom: 2 }}
              value={renameValue}
              onChange={e => onRenameChange(e.target.value)}
              onBlur={onRenameCommit}
              onKeyDown={onRenameKeyDown}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div className="font-vault truncate"
              style={{ fontSize: "0.72rem", letterSpacing: "0.04em", color: isActive ? "var(--c-accent)" : "var(--c-text)", textShadow: isActive ? "0 0 12px rgba(114,235,255,0.4)" : "none", marginBottom: 3 }}>
              {highlight(note.title || "Untitled", searchQuery)}
            </div>
          )}
          <div className="font-body truncate" style={{ fontSize: "0.6rem", color: isActive ? "rgba(93,220,245,0.45)" : "rgba(80,130,200,0.4)", letterSpacing: "0.02em" }}>
            {dateStr} · {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
