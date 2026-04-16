"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { motion, AnimatePresence } from "framer-motion";
import type { Note } from "@/lib/supabase";
import { getSnapshots, deleteSnapshot } from "@/lib/snapshots";
import type { Snapshot } from "@/lib/snapshots";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HeadingItem = {
  id:    string;
  text:  string;
  index: number;
  level: 1 | 2 | 3;
};

interface NoteEditorProps {
  note:              Note;
  scrollContainerId: string;
  onTitleChange:     (title: string) => void;
  onContentChange:   (html: string) => void;
  onHeadingsChange:  (headings: HeadingItem[]) => void;
  onSaveSnapshot:    (title: string, content: string) => void;
  onRestoreSnapshot: (content: string, title: string) => void;
}

// ─── Heading ID extension ─────────────────────────────────────────────────────
// Stamps vault-h-{n} IDs onto ALL heading levels (h1, h2, h3) after each update.

const HeadingIdPlugin = new PluginKey("headingIds");

const HeadingIdExtension = Extension.create({
  name: "headingIdExtension",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: HeadingIdPlugin,
        view() {
          return {
            update(view) {
              requestAnimationFrame(() => {
                const dom = view.dom as HTMLElement;
                let idx = 0;
                dom.querySelectorAll("h1, h2, h3").forEach(el => {
                  el.id = `vault-h-${idx++}`;
                });
              });
            },
          };
        },
      }),
    ];
  },
});

// ─── Extract all headings from editor ────────────────────────────────────────

function extractHeadingsFromEditor(editor: ReturnType<typeof useEditor>): HeadingItem[] {
  if (!editor) return [];
  const items: HeadingItem[] = [];
  let index = 0;
  editor.state.doc.descendants(node => {
    if (node.type.name === "heading" && [1, 2, 3].includes(node.attrs.level)) {
      const text = node.textContent.trim();
      if (text) {
        items.push({ id: `vault-h-${index}`, text, index, level: node.attrs.level as 1 | 2 | 3 });
        index++;
      }
    }
  });
  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NoteEditor({
  note, scrollContainerId,
  onTitleChange, onContentChange, onHeadingsChange,
  onSaveSnapshot, onRestoreSnapshot,
}: NoteEditorProps) {
  const [title, setTitle]               = useState(note.title);
  const [imageInputOpen, setImageInputOpen] = useState(false);
  const [imageUrl, setImageUrl]         = useState("");
  const [snapPanelOpen, setSnapPanelOpen] = useState(false);
  const [snapshots, setSnapshots]       = useState<Snapshot[]>([]);
  const titleSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgInputRef    = useRef<HTMLInputElement>(null);

  const loadSnaps = useCallback(() => {
    setSnapshots(getSnapshots(note.id));
  }, [note.id]);

  useEffect(() => {
    if (snapPanelOpen) loadSnaps();
  }, [snapPanelOpen, loadSnaps]);

  // ── Editor setup ────────────────────────────────────────────────────────────

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, listItem: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      ListItem,
      Placeholder.configure({ placeholder: "Begin writing…" }),
      Image.configure({ inline: false, allowBase64: true }),
      HeadingIdExtension,
    ],
    content: note.content || "",
    editorProps: {
      attributes: { class: "focus:outline-none vault-prose", spellcheck: "true" },
    },
    onUpdate({ editor }) {
      onHeadingsChange(extractHeadingsFromEditor(editor));
      onContentChange(editor.getHTML());
    },
    onTransaction({ editor }) {
      onHeadingsChange(extractHeadingsFromEditor(editor));
    },
  });

  // ── Sync content when note switches ──────────────────────────────────────────

  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (currentHTML !== (note.content || "")) {
      editor.commands.setContent(note.content || "", false);
    }
    setTitle(note.title);
    requestAnimationFrame(() => {
      onHeadingsChange(extractHeadingsFromEditor(editor));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  // Close image input on click outside
  useEffect(() => {
    if (imageInputOpen) setTimeout(() => imgInputRef.current?.focus(), 60);
  }, [imageInputOpen]);

  function insertImage() {
    const url = imageUrl.trim();
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setImageUrl(""); setImageInputOpen(false);
  }

  function handleSnapSave() {
    onSaveSnapshot(title, editor?.getHTML() || "");
    loadSnaps();
  }

  function handleSnapRestore(snap: Snapshot) {
    onRestoreSnapshot(snap.content, snap.title);
    setTitle(snap.title);
    editor?.commands.setContent(snap.content, false);
    setSnapPanelOpen(false);
  }

  function handleSnapDelete(snapId: string) {
    deleteSnapshot(note.id, snapId);
    loadSnaps();
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div id={scrollContainerId} className="h-full overflow-y-auto" style={{ scrollBehavior: "smooth" }}>
      <motion.div
        key={note.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="min-h-full px-5 py-5 flex flex-col">

        {/* ── Binder-page panel ── */}
        <div className="flex-1 relative flex flex-col rounded-[22px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(18,52,168,0.58) 0%, rgba(12,38,135,0.65) 60%, rgba(9,28,110,0.70) 100%)",
            boxShadow: "0 0 0 1px rgba(40,95,195,0.50), 0 0 0 2px rgba(12,35,110,0.50), inset 0 1.5px 0 rgba(130,190,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.18), 0 8px 0 rgba(5,15,55,0.60), 0 16px 48px rgba(0,0,0,0.45), 0 0 60px rgba(20,60,180,0.12)",
            backdropFilter: "blur(10px)",
          }}>

          {/* Spine holes */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none py-10" style={{ width: 44 }}>
            {[...Array(7)].map((_, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", margin: "0 auto", background: "linear-gradient(180deg, rgba(5,14,50,0.95) 0%, rgba(8,22,72,0.90) 100%)", boxShadow: "0 0 0 1px rgba(30,75,165,0.40), inset 0 2px 4px rgba(0,0,0,0.60), inset 0 -1px 0 rgba(50,100,190,0.15)" }} />
            ))}
          </div>

          {/* Margin rule */}
          <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 44, width: 1, background: "linear-gradient(180deg, transparent 2%, rgba(93,220,245,0.15) 10%, rgba(93,220,245,0.15) 90%, transparent 98%)" }} />

          {/* Ruled lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[22px]" style={{ left: 44 }}>
            {[...Array(30)].map((_, i) => (
              <div key={i} className="absolute left-0 right-0" style={{ top: 148 + i * 34, height: 1, background: "rgba(40,90,185,0.08)" }} />
            ))}
          </div>

          {/* ── Content ── */}
          <div className="flex-1 flex flex-col" style={{ paddingLeft: 60, paddingRight: 32, paddingTop: 28, paddingBottom: 40 }}>

            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(50,105,200,0.22)" }}>
              <input
                className="flex-1 bg-transparent outline-none font-vault"
                style={{ fontSize: "1.4rem", letterSpacing: "0.07em", lineHeight: 1.2, color: "var(--c-accent)", textShadow: "0 0 20px rgba(114,235,255,0.35)", paddingBottom: 2 }}
                value={title}
                onChange={e => {
                  const v = e.target.value;
                  setTitle(v);
                  if (titleSaveTimer.current) clearTimeout(titleSaveTimer.current);
                  titleSaveTimer.current = setTimeout(() => onTitleChange(v), 800);
                }}
                placeholder="Note title"
              />
            </div>

            {/* Toolbar */}
            {editor && (
              <EditorToolbar
                editor={editor}
                imageInputOpen={imageInputOpen}
                imageUrl={imageUrl}
                imgInputRef={imgInputRef}
                snapPanelOpen={snapPanelOpen}
                onToggleImage={() => { setImageInputOpen(p => !p); setImageUrl(""); }}
                onImageUrlChange={setImageUrl}
                onInsertImage={insertImage}
                onImageInputKeyDown={e => { if (e.key === "Enter") insertImage(); if (e.key === "Escape") { setImageInputOpen(false); setImageUrl(""); } }}
                onToggleSnap={() => setSnapPanelOpen(p => !p)}
              />
            )}

            {/* Editor body */}
            <div className="flex-1 mt-5">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* ── Snapshot panel (overlay) ── */}
          <AnimatePresence>
            {snapPanelOpen && (
              <SnapshotPanel
                snapshots={snapshots}
                onSave={handleSnapSave}
                onRestore={handleSnapRestore}
                onDelete={handleSnapDelete}
                onClose={() => setSnapPanelOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Editor Toolbar ────────────────────────────────────────────────────────────

interface EditorToolbarProps {
  editor:            ReturnType<typeof useEditor>;
  imageInputOpen:    boolean;
  imageUrl:          string;
  imgInputRef:       React.RefObject<HTMLInputElement>;
  snapPanelOpen:     boolean;
  onToggleImage:     () => void;
  onImageUrlChange:  (v: string) => void;
  onInsertImage:     () => void;
  onImageInputKeyDown: (e: React.KeyboardEvent) => void;
  onToggleSnap:      () => void;
}

function EditorToolbar({
  editor, imageInputOpen, imageUrl, imgInputRef, snapPanelOpen,
  onToggleImage, onImageUrlChange, onInsertImage, onImageInputKeyDown, onToggleSnap,
}: EditorToolbarProps) {
  if (!editor) return null;

  type ToolDef = { label: string; title: string; action: () => void; isActive: () => boolean };

  const groups: ToolDef[][] = [
    [
      { label: "H1", title: "Heading 1 — creates a side tab",  action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
      { label: "H2", title: "Heading 2",  action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
      { label: "H3", title: "Heading 3",  action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
    ],
    [
      { label: "B",  title: "Bold",          action: () => editor.chain().focus().toggleBold().run(),          isActive: () => editor.isActive("bold") },
      { label: "I",  title: "Italic",        action: () => editor.chain().focus().toggleItalic().run(),        isActive: () => editor.isActive("italic") },
      { label: "S",  title: "Strikethrough", action: () => editor.chain().focus().toggleStrike().run(),        isActive: () => editor.isActive("strike") },
      { label: "{}",  title: "Inline code",  action: () => editor.chain().focus().toggleCode().run(),          isActive: () => editor.isActive("code") },
    ],
    [
      { label: "≡",  title: "Bullet list",   action: () => editor.chain().focus().toggleBulletList().run(),    isActive: () => editor.isActive("bulletList") },
      { label: "1.", title: "Ordered list",  action: () => editor.chain().focus().toggleOrderedList().run(),   isActive: () => editor.isActive("orderedList") },
      { label: "\"", title: "Blockquote",    action: () => editor.chain().focus().toggleBlockquote().run(),    isActive: () => editor.isActive("blockquote") },
      { label: "⌥",  title: "Code block",   action: () => editor.chain().focus().toggleCodeBlock().run(),     isActive: () => editor.isActive("codeBlock") },
    ],
    [
      { label: "↩", title: "Undo",  action: () => editor.chain().focus().undo().run(), isActive: () => false },
      { label: "↪", title: "Redo",  action: () => editor.chain().focus().redo().run(), isActive: () => false },
    ],
  ];

  return (
    <div style={{ borderBottom: "1px solid rgba(40,90,185,0.18)", paddingBottom: 8 }}>
      {/* Main tool row */}
      <div className="flex items-center gap-2 flex-wrap" style={{ gap: "6px 8px" }}>
        {groups.map((group, gi) => (
          <div key={gi} className="flex items-center" style={{ gap: 4 }}>
            {gi > 0 && <div style={{ width: 1, background: "rgba(40,90,180,0.28)", alignSelf: "stretch", margin: "0 2px" }} />}
            {group.map(tool => (
              <button
                key={tool.label}
                title={tool.title}
                onClick={tool.action}
                className={`editor-tool-btn ${tool.isActive() ? "active" : ""}`}
                style={{ padding: "5px 9px", fontSize: "0.64rem" }}>
                {tool.label}
              </button>
            ))}
          </div>
        ))}

        {/* Image */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <div style={{ width: 1, background: "rgba(40,90,180,0.28)", alignSelf: "stretch", margin: "0 2px" }} />
          <button
            title="Insert image"
            className={`editor-tool-btn ${imageInputOpen ? "active" : ""}`}
            style={{ padding: "5px 9px", fontSize: "0.64rem" }}
            onClick={onToggleImage}>
            IMG
          </button>
        </div>

        {/* Snapshot */}
        <div className="flex items-center" style={{ gap: 4 }}>
          <div style={{ width: 1, background: "rgba(40,90,180,0.28)", alignSelf: "stretch", margin: "0 2px" }} />
          <button
            title="Backup snapshots"
            className={`editor-tool-btn ${snapPanelOpen ? "active" : ""}`}
            style={{ padding: "5px 9px", fontSize: "0.64rem" }}
            onClick={onToggleSnap}>
            SNAP
          </button>
        </div>

        {/* Hint */}
        <div className="ml-auto font-vault" style={{ fontSize: "0.46rem", letterSpacing: "0.18em", color: "rgba(60,110,180,0.28)" }}>
          H1 → TAB
        </div>
      </div>

      {/* Image URL input row */}
      <AnimatePresence>
        {imageInputOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}>
            <div className="flex items-center gap-2 mt-2">
              <input
                ref={imgInputRef}
                className="img-url-input flex-1"
                placeholder="Paste image URL and press Enter…"
                value={imageUrl}
                onChange={e => onImageUrlChange(e.target.value)}
                onKeyDown={onImageInputKeyDown}
              />
              <button className="editor-tool-btn" onClick={onInsertImage} style={{ padding: "5px 10px", fontSize: "0.6rem" }}>OK</button>
              <button className="editor-tool-btn" onClick={() => { onToggleImage(); }} style={{ padding: "5px 8px", fontSize: "0.6rem" }}>✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Snapshot Panel ────────────────────────────────────────────────────────────

interface SnapPanelProps {
  snapshots:  Snapshot[];
  onSave:     () => void;
  onRestore:  (snap: Snapshot) => void;
  onDelete:   (id: string) => void;
  onClose:    () => void;
}

function SnapshotPanel({ snapshots, onSave, onRestore, onDelete, onClose }: SnapPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute inset-y-0 right-0 flex flex-col"
      style={{
        width: 260,
        background: "linear-gradient(180deg, rgba(10,32,120,0.97) 0%, rgba(6,20,80,0.99) 100%)",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.5), -1px 0 0 rgba(40,100,200,0.4)",
        zIndex: 20,
        borderRadius: "0 22px 22px 0",
      }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(40,90,180,0.3)" }}>
        <div className="font-vault" style={{ fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(93,220,245,0.7)" }}>SNAPSHOTS</div>
        <button onClick={onClose} style={{ fontSize: "0.65rem", color: "rgba(93,220,245,0.5)" }}>✕</button>
      </div>

      {/* Save current */}
      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(40,90,180,0.2)" }}>
        <button
          className="vault-btn w-full"
          style={{ fontSize: "0.58rem", letterSpacing: "0.18em", padding: "9px 16px" }}
          onClick={onSave}>
          + SAVE SNAPSHOT
        </button>
      </div>

      {/* Snapshot list */}
      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
        {snapshots.length === 0 ? (
          <div className="font-vault text-center py-8" style={{ fontSize: "0.52rem", letterSpacing: "0.25em", color: "rgba(60,100,180,0.45)" }}>
            NO SNAPSHOTS YET
          </div>
        ) : (
          snapshots.map(snap => {
            const d = new Date(snap.timestamp);
            const ts = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
            return (
              <div key={snap.id}
                style={{
                  background: "rgba(20,55,160,0.4)",
                  borderRadius: 10,
                  border: "1px solid rgba(40,90,180,0.35)",
                  padding: "9px 11px",
                }}>
                <div className="font-vault mb-1" style={{ fontSize: "0.52rem", letterSpacing: "0.15em", color: "rgba(93,220,245,0.55)" }}>{ts}</div>
                <div className="font-vault mb-2 truncate" style={{ fontSize: "0.62rem", letterSpacing: "0.04em", color: "rgba(200,228,255,0.75)" }}>{snap.title || "Untitled"}</div>
                <div className="flex gap-1.5">
                  <button
                    className="editor-tool-btn"
                    style={{ fontSize: "0.52rem", padding: "4px 8px", flex: 1 }}
                    onClick={() => onRestore(snap)}>
                    RESTORE
                  </button>
                  <button
                    className="editor-tool-btn"
                    style={{ fontSize: "0.52rem", padding: "4px 8px", color: "#FF8585" }}
                    onClick={() => onDelete(snap.id)}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-4 py-2" style={{ borderTop: "1px solid rgba(40,90,180,0.2)" }}>
        <div className="font-vault" style={{ fontSize: "0.46rem", letterSpacing: "0.2em", color: "rgba(50,90,160,0.4)" }}>
          {snapshots.length} / 20 SLOTS · LOCAL STORAGE
        </div>
      </div>
    </motion.div>
  );
}
