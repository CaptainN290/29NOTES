# 29NOTES

A private, single-user note-taking app with a retro-future binder aesthetic.

## Stack
- **Framework**: Next.js 14 (App Router), TypeScript
- **Editor**: Tiptap (ProseMirror-based rich text)
- **Database**: Supabase (PostgreSQL via `supabase-server.ts`)
- **Styling**: Tailwind CSS + `styles/globals.css` (custom CSS variables, retro theme)
- **Animation**: Framer Motion
- **Auth**: Server-side password auth with httpOnly cookies (`VAULT_SESSION_SECRET`, `VAULT_PASSWORD`)

## Dev / Prod Ports
- Dev: `npm run dev` on port **5000**
- Production: `npm run start` on port **3000**

## Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only)
- `VAULT_SESSION_SECRET` — Cookie signing secret
- `VAULT_PASSWORD` — App lock password
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Anon key (optional, for client)

## Database Setup
Run `supabase-schema.sql` in the Supabase SQL Editor. This creates the `notes` table with all required columns including `pinned` and `color`.

## Key Files
- `app/components/layout/AppShell.tsx` — Main shell: state, note CRUD, offline sync, export/import
- `app/components/editor/NoteEditor.tsx` — Tiptap editor, toolbar, image insert, snapshot panel
- `app/components/sidebar/Sidebar.tsx` — Note list, search, pin/color context menu
- `app/components/tabs/HeadingTabs.tsx` — Nested H1/H2/H3 side tabs
- `app/components/lock/LockScreen.tsx` — Password gate
- `app/api/notes/route.ts` — GET/POST notes
- `app/api/notes/[id]/route.ts` — PATCH/DELETE note
- `app/api/auth/route.ts` — POST (login) / DELETE (logout)
- `lib/notes.ts` — Client-side API helpers
- `lib/supabase.ts` — Note type + Supabase anon client
- `lib/supabase-server.ts` — Admin client (service role)
- `lib/sounds.ts` — Web Audio API sound effects
- `lib/offlineCache.ts` — localStorage offline cache + update queue
- `lib/snapshots.ts` — localStorage per-note backup snapshots

## AI Assistant (SYNT)
- Toggle with **SYNT·AI** button in the top bar
- Requires `OPENAI_API_KEY` in Replit Secrets (uses `gpt-4o-mini`)
- Components: `app/components/ai/AiPanel.tsx`, `app/api/ai/route.ts`
- Streams responses; passes current note title + stripped HTML as context
- Quick actions: SUMMARIZE, CONTINUE, KEY POINTS, CLEAN UP
- Free-form chat with blinking cursor, green terminal aesthetic

## Features
1. **Search** — Sidebar search filters by title and content in real-time
2. **Pin notes** — Right-click → PIN; pinned notes float to top with ⊕ indicator
3. **Color labels** — Right-click → COLOR; 5 color choices shown as file icon tint + left border
4. **Export / Import** — EXP/IMP buttons in sidebar footer; exports/imports JSON
5. **Image support** — Toolbar IMG button → paste URL → insert; also supports base64
6. **Markdown formatting** — Toolbar: H1/H2/H3, Bold, Italic, Strike, Inline code, Bullets, Ordered list, Blockquote, Code block, Undo, Redo
7. **Nested tabs** — Side tabs show H1/H2/H3 with indented hierarchy
8. **Offline mode** — Reads from localStorage cache when offline; queues writes and flushes on reconnect; OFFLINE indicator in top bar
9. **Backup snapshots** — Toolbar SNAP button; save/restore/delete per-note snapshots stored in localStorage (max 20)
10. **Sound effects** — Subtle Web Audio API synth tones on create, select, delete, save, pin, snap, error

## Note Type
```ts
type Note = {
  id: string; title: string; content: string;
  created_at: string; updated_at: string;
  order_index: number; pinned: boolean; color: string | null;
};
```
