"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { motion } from "framer-motion";
import type { Note } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HeadingItem = {
  id: string;   // stable DOM id  e.g. "vault-h1-0"
  text: string;
  index: number;
};

interface NoteEditorProps {
  note: Note;
  scrollContainerId: string;                         // ID of the outer scrollable div
  onContentChange: (html: string) => void;
  onHeadingsChange: (headings: HeadingItem[]) => void;
}

// ─── Heading ID extension ─────────────────────────────────────────────────────
// Runs after every transaction and stamps stable IDs onto every h1 in the DOM.
// Using a ProseMirror Plugin (appendTransaction) so it fires synchronously
// and before React re-renders — giving HeadingTabs consistent targets.

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
              // After each update, stamp IDs onto h1 DOM nodes
              requestAnimationFrame(() => {
                const dom = view.dom as HTMLElement;
                let idx = 0;
                dom.querySelectorAll("h1").forEach((el) => {
                  el.id = `vault-h1-${idx++}`;
                });
              });
            },
          };
        },
      }),
    ];
  },
});

// ─── Extract headings from ProseMirror doc ────────────────────────────────────
// Read directly from the Tiptap editor's document tree — no HTML parsing needed.

function extractH1sFromEditor(editor: ReturnType<typeof useEditor>): HeadingItem[] {
  if (!editor) return [];
  const items: HeadingItem[] = [];
  let index = 0;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "heading" && node.attrs.level === 1) {
      const text = node.textContent.trim();
      if (text) {
        items.push({ id: `vault-h1-${index}`, text, index });
        index++;
      }
    }
  });
  return items;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NoteEditor({
  note,
  scrollContainerId,
  onContentChange,
  onHeadingsChange,
}: NoteEditorProps) {
  const [title, setTitle]       = useState(note.title);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Editor setup ────────────────────────────────────────────────────────────

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false, bulletList: false, listItem: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      ListItem,
      Placeholder.configure({ placeholder: "Begin writing…" }),
      HeadingIdExtension,
    ],
    content: note.content || "",
    editorProps: {
      attributes: {
        class: "focus:outline-none vault-prose",
        spellcheck: "true",
      },
    },
    onUpdate({ editor }) {
      // Extract headings from the ProseMirror doc (reliable, no DOM parsing)
      const headings = extractH1sFromEditor(editor);
      onHeadingsChange(headings);

      // Propagate HTML content for save
      onContentChange(editor.getHTML());

      // Autosave indicator
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaveState("saved"), 1400);
    },
    onTransaction({ editor }) {
      // Also update headings on any transaction (handles undo/redo/paste)
      const headings = extractH1sFromEditor(editor);
      onHeadingsChange(headings);
    },
  });

  // ── Sync initial headings when note switches ─────────────────────────────────
  useEffect(() => {
    if (!editor) return;

    // Load new content
    const currentHTML = editor.getHTML();
    if (currentHTML !== (note.content || "")) {
      editor.commands.setContent(note.content || "", false);
    }

    setTitle(note.title);
    setSaveState("idle");

    // Extract after content is set
    requestAnimationFrame(() => {
      const headings = extractH1sFromEditor(editor);
      onHeadingsChange(headings);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div
      id={scrollContainerId}
      className="h-full overflow-y-auto"
      style={{ scrollBehavior: "smooth" }}
    >
      <motion.div
        key={note.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="min-h-full px-5 py-5 flex flex-col"
      >
        {/* ── Binder-page panel ── */}
        <div
          className="flex-1 relative flex flex-col rounded-[22px] overflow-hidden"
          style={{
            background: `linear-gradient(180deg,
              rgba(18,52,168,0.58) 0%,
              rgba(12,38,135,0.65) 60%,
              rgba(9,28,110,0.70) 100%)`,
            boxShadow: `
              0 0 0 1px rgba(40,95,195,0.50),
              0 0 0 2px rgba(12,35,110,0.50),
              inset 0 1.5px 0 rgba(130,190,255,0.14),
              inset 0 -2px 0 rgba(0,0,0,0.18),
              0 8px 0 rgba(5,15,55,0.60),
              0 16px 48px rgba(0,0,0,0.45),
              0 0 60px rgba(20,60,180,0.12)`,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Spine holes */}
          <div
            className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none py-10"
            style={{ width: 44 }}
          >
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 12, height: 12, borderRadius: "50%", margin: "0 auto",
                  background: "linear-gradient(180deg, rgba(5,14,50,0.95) 0%, rgba(8,22,72,0.90) 100%)",
                  boxShadow: `0 0 0 1px rgba(30,75,165,0.40),
                    inset 0 2px 4px rgba(0,0,0,0.60),
                    inset 0 -1px 0 rgba(50,100,190,0.15)`,
                }}
              />
            ))}
          </div>

          {/* Margin rule */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: 44, width: 1,
              background: "linear-gradient(180deg, transparent 2%, rgba(93,220,245,0.15) 10%, rgba(93,220,245,0.15) 90%, transparent 98%)",
            }}
          />

          {/* Ruled lines */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-[22px]"
            style={{ left: 44 }}
          >
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0"
                style={{ top: 148 + i * 34, height: 1, background: "rgba(40,90,185,0.08)" }}
              />
            ))}
          </div>

          {/* ── Content ── */}
          <div
            className="flex-1 flex flex-col"
            style={{ paddingLeft: 60, paddingRight: 32, paddingTop: 28, paddingBottom: 40 }}
          >
            {/* Title + save indicator */}
            <div
              className="flex items-start justify-between gap-4 mb-5 pb-4"
              style={{ borderBottom: "1px solid rgba(50,105,200,0.22)" }}
            >
              <input
                className="flex-1 bg-transparent outline-none font-vault"
                style={{
                  fontSize: "1.4rem",
                  letterSpacing: "0.07em",
                  lineHeight: 1.2,
                  color: "var(--c-accent)",
                  textShadow: "0 0 20px rgba(114,235,255,0.35)",
                  paddingBottom: 2,
                }}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Note title"
              />

              {/* Autosave pill */}
              <div
                className="flex items-center gap-2 shrink-0 pt-1.5"
                style={{
                  opacity: saveState === "idle" ? 0 : 1,
                  transition: "opacity 0.4s",
                }}
              >
                <div style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: saveState === "saved" ? "var(--c-cyan)" : "rgba(93,220,245,0.35)",
                  boxShadow: saveState === "saved" ? "0 0 6px var(--c-cyan)" : "none",
                  transition: "all 0.4s",
                }} />
                <span
                  className="font-vault"
                  style={{
                    fontSize: "0.5rem", letterSpacing: "0.22em",
                    color: saveState === "saved" ? "rgba(93,220,245,0.5)" : "rgba(93,220,245,0.28)",
                    transition: "color 0.4s",
                  }}
                >
                  {saveState === "saving" ? "SAVING" : "SAVED"}
                </span>
              </div>
            </div>

            {/* Toolbar */}
            {editor && <EditorToolbar editor={editor} />}

            {/* Editor body */}
            <div className="flex-1 mt-5">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const groups = [
    [
      {
        label: "H1", title: "Heading 1 — becomes a side tab",
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        isActive: () => editor.isActive("heading", { level: 1 }),
      },
      {
        label: "H2", title: "Heading 2",
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        isActive: () => editor.isActive("heading", { level: 2 }),
      },
      {
        label: "H3", title: "Heading 3",
        action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        isActive: () => editor.isActive("heading", { level: 3 }),
      },
    ],
    [
      {
        label: "B", title: "Bold",
        action: () => editor.chain().focus().toggleBold().run(),
        isActive: () => editor.isActive("bold"),
      },
      {
        label: "I", title: "Italic",
        action: () => editor.chain().focus().toggleItalic().run(),
        isActive: () => editor.isActive("italic"),
      },
    ],
    [
      {
        label: "≡", title: "Bullet list",
        action: () => editor.chain().focus().toggleBulletList().run(),
        isActive: () => editor.isActive("bulletList"),
      },
    ],
  ];

  return (
    <div
      className="flex items-center gap-3 pb-3"
      style={{ borderBottom: "1px solid rgba(40,90,185,0.18)" }}
    >
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1.5">
          {gi > 0 && (
            <div style={{
              width: 1, background: "rgba(40,90,180,0.28)",
              alignSelf: "stretch", margin: "0 3px",
            }} />
          )}
          {group.map(tool => (
            <button
              key={tool.label}
              title={tool.title}
              onClick={tool.action}
              className={`editor-tool-btn ${tool.isActive() ? "active" : ""}`}
            >
              {tool.label}
            </button>
          ))}
        </div>
      ))}

      {/* Hint */}
      <div className="ml-auto font-vault" style={{
        fontSize: "0.49rem", letterSpacing: "0.2em",
        color: "rgba(60,110,180,0.3)",
      }}>
        H1 → SIDE TAB
      </div>
    </div>
  );
}
