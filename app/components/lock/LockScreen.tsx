"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LockScreenProps { onUnlock: () => void; }

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState(false);
  const [shaking, setShaking]     = useState(false);
  const [focused, setFocused]     = useState(false);
  const [blink, setBlink]         = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    const t = setInterval(() => setBlink(b => !b), 650);
    return () => clearInterval(t);
  }, []);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ password }) });
      if (res.ok) { onUnlock(); return; }
      throw new Error("bad");
    } catch {
      setError(true); setShaking(true); setPassword("");
      setTimeout(() => { setShaking(false); setError(false); }, 900);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 120% 100% at 50% 40%, #0D2FA0 0%, #071D68 45%, #040D38 100%)",
      }}>

      {/* ── Deep background grid ── */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(60,120,220,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(60,120,220,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 100%)",
        }} />

      {/* ── Soft bloom behind card ── */}
      <div className="absolute pointer-events-none"
        style={{
          width: 520, height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,80,200,0.28) 0%, rgba(20,50,140,0.12) 50%, transparent 75%)",
          filter: "blur(48px)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -58%)",
        }} />

      {/* ── Secondary accent orb ── */}
      <div className="absolute pointer-events-none"
        style={{
          width: 300, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(93,220,245,0.08) 0%, transparent 70%)",
          filter: "blur(32px)",
          top: "42%", left: "50%",
          transform: "translate(-50%, -50%)",
        }} />

      {/* ── Floating decorative corner marks ── */}
      {[
        { top: 24, left: 24 },
        { top: 24, right: 24 },
        { bottom: 24, left: 24 },
        { bottom: 24, right: 24 },
      ].map((pos, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          className="absolute w-6 h-6 pointer-events-none"
          style={{ ...pos }}>
          <svg viewBox="0 0 24 24" fill="none">
            {i === 0 && <><path d="M1 8V1H8" stroke="#5DDCF5" strokeWidth="1.5" strokeLinecap="round"/></>}
            {i === 1 && <><path d="M16 1H23V8" stroke="#5DDCF5" strokeWidth="1.5" strokeLinecap="round"/></>}
            {i === 2 && <><path d="M1 16V23H8" stroke="#5DDCF5" strokeWidth="1.5" strokeLinecap="round"/></>}
            {i === 3 && <><path d="M23 16V23H16" stroke="#5DDCF5" strokeWidth="1.5" strokeLinecap="round"/></>}
          </svg>
        </motion.div>
      ))}

      {/* ── Main card ── */}
      <motion.div
        animate={shaking ? { x: [-14, 14, -11, 11, -7, 7, -3, 3, 0] } : {}}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
        style={{ width: 360 }}
      >
        {/* Lock icon */}
        <motion.div
          initial={{ y: -28, opacity: 0, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, type: "spring", stiffness: 220, damping: 18 }}
          className="mb-7 flex flex-col items-center gap-3"
        >
          {/* Icon housing */}
          <div style={{
            width: 72, height: 72,
            borderRadius: 22,
            background: "linear-gradient(160deg, #1D5FE0 0%, #1340B0 60%, #0F2E98 100%)",
            boxShadow: `
              0 0 0 1.5px rgba(50,120,210,0.6),
              0 0 0 3px rgba(93,220,245,0.14),
              inset 0 1.5px 0 rgba(160,210,255,0.22),
              inset 0 -2px 0 rgba(0,0,0,0.25),
              0 8px 0 rgba(5,15,55,0.8),
              0 12px 28px rgba(0,0,0,0.55),
              0 0 36px rgba(93,220,245,0.15)
            `,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect x="5" y="13" width="20" height="14" rx="4"
                fill="rgba(93,220,245,0.14)"
                stroke="rgba(93,220,245,0.8)" strokeWidth="1.4"/>
              <path d="M9 13V9C9 5.69 11.69 3 15 3C18.31 3 21 5.69 21 9V13"
                stroke="rgba(93,220,245,0.8)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
              <circle cx="15" cy="20" r="2.5"
                fill="rgba(93,220,245,0.9)"
                style={{ filter: "drop-shadow(0 0 4px rgba(93,220,245,0.8))" }}/>
            </svg>
          </div>

          {/* 29NOTES logotype */}
          <div style={{ textAlign: "center" }}>
            <div className="font-vault"
              style={{
                fontSize: "2.6rem",
                letterSpacing: "0.28em",
                color: "#72EBFF",
                textShadow: `
                  0 0 16px rgba(114,235,255,0.6),
                  0 0 40px rgba(114,235,255,0.25),
                  0 0 80px rgba(93,220,245,0.1)
                `,
                lineHeight: 1,
              }}>
              29NOTES
            </div>
            <div className="font-vault"
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.45em",
                color: "rgba(93,220,245,0.35)",
                marginTop: 7,
              }}>
              PRIVATE ARCHIVE SYSTEM
            </div>
          </div>
        </motion.div>

        {/* ── Password panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, type: "spring", stiffness: 180, damping: 22 }}
          style={{
            width: "100%",
            borderRadius: 24,
            padding: "28px 28px 24px",
            background: "linear-gradient(180deg, rgba(22,68,185,0.88) 0%, rgba(14,44,148,0.94) 100%)",
            boxShadow: `
              0 0 0 1px rgba(45,105,210,0.55),
              0 0 0 2px rgba(20,55,140,0.4),
              inset 0 1.5px 0 rgba(140,200,255,0.18),
              inset 0 -2px 0 rgba(0,0,0,0.22),
              0 6px 0 rgba(5,15,55,0.7),
              0 12px 36px rgba(0,0,0,0.55),
              0 0 50px rgba(30,80,200,0.2)
            `,
            backdropFilter: "blur(16px)",
          }}>

          {/* "ENTER PASSWORD" label */}
          <div className="font-vault text-center mb-5"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              color: "rgba(114,184,232,0.55)",
            }}>
            ENTER PASSWORD
          </div>

          {/* Input */}
          <div className="relative mb-4">
            <input
              ref={inputRef}
              type="password"
              className="lock-input"
              placeholder="············"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              autoComplete="off"
            />
            {/* Cursor blink indicator */}
            {focused && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ opacity: blink ? 0.8 : 0, transition: "opacity 0.1s" }}>
                <div style={{ width: 2, height: 18, background: "var(--c-cyan)", borderRadius: 1,
                  boxShadow: "0 0 6px var(--c-cyan)" }} />
              </div>
            )}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.2 }}
                className="font-vault text-center mb-3 overflow-hidden"
                style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "#FF7070" }}>
                ⚠ ACCESS DENIED
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unlock button */}
          <button className="vault-btn w-full" disabled={submitting} onClick={submit}
            style={{ fontSize: "0.75rem", letterSpacing: "0.22em", padding: "13px 28px" }}>
            {submitting ? "UNLOCKING..." : "UNLOCK"}
          </button>

          {/* Bottom hint */}
          <div className="font-vault text-center mt-4"
            style={{ fontSize: "0.52rem", letterSpacing: "0.25em", color: "rgba(60,110,180,0.4)" }}>
            SINGLE USER · PERSONAL VAULT
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
