"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "@/lib/supabase";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  onRenameNote: (id: string, title: string) => void;
  loading: boolean;
}

export default function Sidebar({
  notes, activeNoteId, onSelectNote, onCreateNote, onDeleteNote, onRenameNote, loading
}: SidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const renameRef = useRef<HTMLInputElement>(null);

  function startRename(note: Note) {
    setRenamingId(note.id);
    setRenameValue(note.title);
    setContextMenu(null);
    setTimeout(() => renameRef.current?.select(), 50);
  }
  function commitRename(id: string) {
    if (renameValue.trim()) onRenameNote(id, renameValue.trim());
    setRenamingId(null);
  }
  function handleContextMenu(e: React.MouseEvent, id: string) {
    e.preventDefault();
    setContextMenu({ id, x: e.clientX, y: e.clientY });
  }

  return (
    <div className="relative flex flex-col h-full select-none"
      style={{ width: 228, minWidth: 200 }}
      onClick={() => setContextMenu(null)}>

      {/* ── Sidebar panel ── */}
      <div className="h-full flex flex-col m-3 mr-2 rounded-[20px] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(16,44,155,0.82) 0%, rgba(9,28,98,0.92) 100%)",
          boxShadow: `
            0 0 0 1px rgba(35,85,185,0.55),
            0 0 0 2px rgba(10,30,90,0.5),
            inset 0 1px 0 rgba(110,180,255,0.14),
            inset 1px 0 0 rgba(110,180,255,0.06),
            4px 0 24px rgba(0,0,0,0.4)
          `,
        }}>

        {/* ── Header ── */}
        <div className="px-4 pt-5 pb-4"
          style={{ borderBottom: "1px solid rgba(40,90,180,0.25)" }}>

          {/* Label row */}
          <div className="flex items-center justify-between mb-3">
            <div className="font-vault"
              style={{ fontSize: "0.55rem", letterSpacing: "0.35em", color: "rgba(93,220,245,0.4)" }}>
              FILES
            </div>
            <div className="font-vault"
              style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: "rgba(60,110,180,0.35)" }}>
              {notes.length}
            </div>
          </div>

          {/* New note button */}
          <button
            className="vault-btn w-full"
            onClick={onCreateNote}
            style={{ fontSize: "0.65rem", letterSpacing: "0.18em", padding: "10px 16px" }}>
            + NEW NOTE
          </button>
        </div>

        {/* ── Note list ── */}
        <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
          {loading ? (
            // Skeleton cards
            <div className="flex flex-col gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i}
                  className="rounded-[14px] animate-pulse"
                  style={{
                    height: 60,
                    background: "linear-gradient(160deg, rgba(25,60,160,0.4) 0%, rgba(16,42,120,0.5) 100%)",
                    boxShadow: "0 0 0 1px rgba(30,75,165,0.3)",
                    animationDelay: `${i * 0.1}s`,
                  }} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div style={{
                width: 36, height: 36,
                borderRadius: 10,
                background: "rgba(20,55,150,0.4)",
                boxShadow: "0 0 0 1px rgba(40,90,180,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="rgba(93,220,245,0.3)" strokeWidth="1"/>
                  <line x1="4.5" y1="5" x2="11.5" y2="5" stroke="rgba(93,220,245,0.3)" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="4.5" y1="8" x2="11.5" y2="8" stroke="rgba(93,220,245,0.3)" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="4.5" y1="11" x2="8.5" y2="11" stroke="rgba(93,220,245,0.3)" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="font-vault text-center"
                style={{ fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(60,110,180,0.4)" }}>
                NO FILES YET
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {notes.map((note, idx) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -16, scale: 0.94, transition: { duration: 0.15 } }}
                  transition={{ delay: idx * 0.035, type: "spring", stiffness: 320, damping: 26 }}
                >
                  <NoteCard
                    note={note}
                    isActive={note.id === activeNoteId}
                    isRenaming={renamingId === note.id}
                    renameValue={renameValue}
                    renameRef={renameRef}
                    onSelect={() => onSelectNote(note.id)}
                    onContextMenu={(e) => handleContextMenu(e, note.id)}
                    onDoubleClick={() => startRename(note)}
                    onRenameChange={setRenameValue}
                    onRenameCommit={() => commitRename(note.id)}
                    onRenameKeyDown={(e) => {
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
          <div className="font-vault"
            style={{ fontSize: "0.5rem", letterSpacing: "0.25em", color: "rgba(50,95,170,0.35)" }}>
            29NOTES v1
          </div>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "rgba(93,220,245,0.5)",
            boxShadow: "0 0 6px rgba(93,220,245,0.5)",
          }} />
        </div>
      </div>

      {/* ── Context menu ── */}
      <AnimatePresence>
        {contextMenu && (
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
              boxShadow: `
                0 0 0 1px rgba(55,125,215,0.6),
                0 0 0 2px rgba(20,55,140,0.4),
                inset 0 1px 0 rgba(140,200,255,0.16),
                0 8px 32px rgba(0,0,0,0.55),
                0 0 20px rgba(0,0,0,0.3)
              `,
              minWidth: 148,
            }}>
            {[
              { label: "RENAME", icon: "✎", action: () => { const n = notes.find(n => n.id === contextMenu.id); if (n) startRename(n); } },
              { label: "DELETE", icon: "✕", danger: true, action: () => { onDeleteNote(contextMenu.id); setContextMenu(null); } },
            ].map((item, i) => (
              <button key={item.label}
                className="w-full text-left px-4 py-2.5 font-vault flex items-center gap-2.5 transition-colors"
                style={{
                  fontSize: "0.62rem", letterSpacing: "0.22em",
                  color: item.danger ? "#FF8585" : "rgba(200,228,255,0.85)",
                  borderTop: i > 0 ? "1px solid rgba(40,90,180,0.2)" : "none",
                }}
                onClick={item.action}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span style={{ opacity: 0.6, fontSize: "0.7rem" }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Note Card ─────────────────────────────────────────────────────

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  isRenaming: boolean;
  renameValue: string;
  renameRef: React.RefObject<HTMLInputElement>;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
  onRenameChange: (v: string) => void;
  onRenameCommit: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
}

function NoteCard({
  note, isActive, isRenaming, renameValue, renameRef,
  onSelect, onContextMenu, onDoubleClick,
  onRenameChange, onRenameCommit, onRenameKeyDown,
}: NoteCardProps) {
  const date = new Date(note.updated_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div
      className={`note-card ${isActive ? "active" : ""}`}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-start gap-2.5">
        {/* File icon */}
        <div className="shrink-0 mt-0.5"
          style={{
            width: 28, height: 32,
            position: "relative",
          }}>
          <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
            {/* File body */}
            <rect x="1" y="1" width="22" height="30" rx="4"
              fill={isActive ? "rgba(93,220,245,0.12)" : "rgba(60,120,210,0.1)"}
              stroke={isActive ? "rgba(93,220,245,0.45)" : "rgba(60,120,210,0.35)"}
              strokeWidth="1"/>
            {/* Folded corner */}
            <path d="M17 1L23 7H17V1Z"
              fill={isActive ? "rgba(93,220,245,0.2)" : "rgba(60,120,210,0.18)"}
              stroke={isActive ? "rgba(93,220,245,0.35)" : "rgba(60,120,210,0.25)"}
              strokeWidth="0.8"/>
            {/* Text lines */}
            <line x1="5" y1="14" x2="19" y2="14"
              stroke={isActive ? "rgba(93,220,245,0.4)" : "rgba(80,140,210,0.3)"} strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="18" x2="19" y2="18"
              stroke={isActive ? "rgba(93,220,245,0.3)" : "rgba(80,140,210,0.22)"} strokeWidth="1" strokeLinecap="round"/>
            <line x1="5" y1="22" x2="14" y2="22"
              stroke={isActive ? "rgba(93,220,245,0.2)" : "rgba(80,140,210,0.16)"} strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Text content */}
        <div className="flex-1 min-w-0 py-0.5">
          {isRenaming ? (
            <input
              ref={renameRef}
              className="w-full bg-transparent outline-none font-vault"
              style={{
                fontSize: "0.72rem", letterSpacing: "0.04em",
                color: "var(--c-accent)",
                borderBottom: "1px solid rgba(93,220,245,0.5)",
                paddingBottom: 2,
              }}
              value={renameValue}
              onChange={e => onRenameChange(e.target.value)}
              onBlur={onRenameCommit}
              onKeyDown={onRenameKeyDown}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <div className="font-vault truncate"
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.04em",
                color: isActive ? "var(--c-accent)" : "var(--c-text)",
                textShadow: isActive ? "0 0 12px rgba(114,235,255,0.4)" : "none",
                marginBottom: 3,
              }}>
              {note.title || "Untitled"}
            </div>
          )}
          <div className="font-body truncate"
            style={{
              fontSize: "0.6rem",
              color: isActive ? "rgba(93,220,245,0.45)" : "rgba(80,130,200,0.4)",
              letterSpacing: "0.02em",
            }}>
            {dateStr} · {timeStr}
          </div>
        </div>
      </div>
    </div>
  );
}
