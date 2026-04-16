"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

interface AiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  noteTitle: string;
  noteContent: string;
}

const QUICK_ACTIONS = [
  { label: "SUMMARIZE", prompt: "Summarize this note in concise bullet points." },
  { label: "CONTINUE",  prompt: "Continue writing from where this note left off. Match the existing style and tone." },
  { label: "KEY POINTS", prompt: "What are the most important key points in this note?" },
  { label: "CLEAN UP",  prompt: "Rewrite this note with better structure, clarity, and flow. Keep all the content — just improve the presentation." },
];

export default function AiPanel({ isOpen, onClose, noteTitle, noteContent }: AiPanelProps) {
  const [messages, setMessages]         = useState<Message[]>([]);
  const [input, setInput]               = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const [copied, setCopied]             = useState<number | null>(null);

  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedText]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  async function sendMessage(userText: string) {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamedText("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/ai", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        signal:  abortRef.current.signal,
        body: JSON.stringify({
          messages:    newMessages.map(m => ({ role: m.role, content: m.content })),
          noteTitle,
          noteContent,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let full      = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setStreamedText(full);
      }

      setMessages(p => [...p, { role: "assistant", content: full }]);
      setStreamedText("");
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(p => [...p, { role: "assistant", content: msg, isError: true }]);
      setStreamedText("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
    if (e.key === "Escape") onClose();
  }

  function handleCopy(text: string, index: number) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(index);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  function handleClear() {
    if (isLoading) {
      abortRef.current?.abort();
      setIsLoading(false);
      setStreamedText("");
    }
    setMessages([]);
  }

  const hasNote = !!noteContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 310, opacity: 0 }}
          animate={{ x: 0,   opacity: 1 }}
          exit={{    x: 310, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
          style={{
            position:      "fixed",
            right:         0,
            top:           44,
            bottom:        0,
            width:         310,
            zIndex:        60,
            display:       "flex",
            flexDirection: "column",
            background:    "linear-gradient(180deg, rgba(2,7,26,0.98) 0%, rgba(3,9,32,0.97) 100%)",
            borderLeft:    "2px solid rgba(93,220,245,0.28)",
            borderTop:     "1px solid rgba(93,220,245,0.15)",
            boxShadow:     "-6px 0 40px rgba(0,0,0,0.6), -1px 0 0 rgba(93,220,245,0.08)",
          }}>

          {/* ── Header ─────────────────────────────────────────── */}
          <div className="ai-panel-header">
            <div className="flex items-center gap-2">
              <div className="ai-status-dot" />
              <span className="font-vault" style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "rgba(93,220,245,0.9)" }}>
                SYNT·AI
              </span>
              <span className="font-vault" style={{ fontSize: "0.46rem", letterSpacing: "0.18em", color: "rgba(80,210,130,0.6)", marginLeft: 2 }}>
                ONLINE
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="ai-header-btn" title="Clear chat">CLR</button>
              <button onClick={onClose}    className="ai-header-btn" title="Close">✕</button>
            </div>
          </div>

          {/* ── Context strip ──────────────────────────────────── */}
          <div className="ai-context-strip">
            <span className="font-vault" style={{ fontSize: "0.46rem", letterSpacing: "0.15em", color: hasNote ? "rgba(93,220,245,0.45)" : "rgba(80,100,150,0.4)" }}>
              {hasNote ? `▸ ${(noteTitle || "Untitled").slice(0, 28)}` : "▸ NO NOTE OPEN"}
            </span>
          </div>

          {/* ── Quick actions ──────────────────────────────────── */}
          <div className="ai-quick-actions">
            {QUICK_ACTIONS.map(a => (
              <button
                key={a.label}
                className="ai-quick-btn"
                disabled={isLoading || !hasNote}
                onClick={() => sendMessage(a.prompt)}>
                {a.label}
              </button>
            ))}
          </div>

          {/* ── Messages ───────────────────────────────────────── */}
          <div ref={scrollRef} className="ai-messages">
            {messages.length === 0 && !streamedText && (
              <div className="ai-empty-state">
                <div className="font-vault" style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: "rgba(40,80,140,0.6)", marginBottom: 6 }}>
                  SYNT TERMINAL v1.0
                </div>
                <div style={{ fontSize: "0.72rem", color: "rgba(60,100,160,0.45)", lineHeight: 1.7 }}>
                  Ask anything about your note, use a quick action above, or just chat.
                </div>
                <div className="ai-blink-cursor" style={{ marginTop: 12 }}>_</div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ai-message-${msg.role}`}>
                {msg.role === "user" ? (
                  <>
                    <span className="ai-prefix-user">YOU &gt;</span>
                    <span className="ai-message-text-user">{msg.content}</span>
                  </>
                ) : (
                  <div className="ai-assistant-block">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`ai-prefix-synt ${msg.isError ? "ai-prefix-error" : ""}`}>
                        {msg.isError ? "ERR >" : "SYNT >"}
                      </span>
                    </div>
                    <div className={`ai-message-text-synt ${msg.isError ? "ai-message-error" : ""}`}>
                      {msg.content}
                    </div>
                    {!msg.isError && (
                      <button
                        className="ai-copy-btn"
                        onClick={() => handleCopy(msg.content, i)}>
                        {copied === i ? "✓ COPIED" : "COPY"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Streaming response */}
            {streamedText && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-assistant-block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="ai-prefix-synt">SYNT &gt;</span>
                    <div className="ai-thinking-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                  <div className="ai-message-text-synt">{streamedText}<span className="ai-blink-cursor">▌</span></div>
                </div>
              </div>
            )}

            {/* Loading with no output yet */}
            {isLoading && !streamedText && (
              <div className="ai-message ai-message-assistant">
                <div className="ai-assistant-block">
                  <span className="ai-prefix-synt">SYNT &gt;</span>
                  <div className="ai-thinking-dots" style={{ marginTop: 6 }}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Input bar ──────────────────────────────────────── */}
          <div className="ai-input-bar">
            <span className="ai-input-prefix">&gt;</span>
            <input
              ref={inputRef}
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ask synt..."
              disabled={isLoading}
              maxLength={1000}
            />
            <button
              className="ai-send-btn"
              disabled={!input.trim() || isLoading}
              onClick={() => sendMessage(input)}>
              ⏎
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
