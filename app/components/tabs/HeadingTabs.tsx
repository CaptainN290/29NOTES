"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeadingItem } from "@/app/components/editor/NoteEditor";

interface HeadingTabsProps {
  headings:          HeadingItem[];
  scrollContainerId: string;
}

export default function HeadingTabs({ headings, scrollContainerId }: HeadingTabsProps) {
  const [activeId, setActiveId]   = useState<string | null>(null);
  const observerRef               = useRef<IntersectionObserver | null>(null);
  const manualOverride            = useRef(false);

  // ── Active-heading tracking ────────────────────────────────────────────────

  const setupObserver = useCallback(() => {
    if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
    if (headings.length === 0) { setActiveId(null); return; }

    const scrollContainer = document.getElementById(scrollContainerId);
    if (!scrollContainer) return;

    const targets: HTMLElement[] = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    const visibleSet = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        if (manualOverride.current) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) visibleSet.add(entry.target.id);
          else visibleSet.delete(entry.target.id);
        });

        if (visibleSet.size > 0) {
          for (const h of headings) {
            if (visibleSet.has(h.id)) { setActiveId(h.id); return; }
          }
        }

        if (visibleSet.size === 0) {
          const scrollTop = scrollContainer.scrollTop;
          let best: string | null = null;
          for (const h of headings) {
            const el = document.getElementById(h.id);
            if (el && el.offsetTop <= scrollTop + 120) best = h.id;
          }
          setActiveId(best);
        }
      },
      { root: scrollContainer, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    targets.forEach(el => io.observe(el));
    observerRef.current = io;
  }, [headings, scrollContainerId]);

  useEffect(() => {
    const t = setTimeout(setupObserver, 80);
    return () => {
      clearTimeout(t);
      if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
    };
  }, [setupObserver]);

  // ── Click-to-scroll ────────────────────────────────────────────────────────

  function scrollToHeading(heading: HeadingItem) {
    const scrollContainer = document.getElementById(scrollContainerId);
    const target          = document.getElementById(heading.id);
    if (!scrollContainer || !target) return;

    setActiveId(heading.id);
    manualOverride.current = true;
    setTimeout(() => { manualOverride.current = false; }, 1000);

    let el: HTMLElement | null = target;
    let offsetTop = 0;
    while (el && el !== scrollContainer) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement | null;
    }

    scrollContainer.scrollTo({ top: offsetTop - 80, behavior: "smooth" });
    flashHeading(target);
  }

  const hasHeadings = headings.length > 0;

  return (
    <div
      className="relative h-full flex flex-col items-end shrink-0"
      style={{
        width: hasHeadings ? 160 : 20,
        transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
        paddingTop: 28,
        paddingBottom: 16,
      }}>
      <AnimatePresence mode="wait">
        {hasHeadings ? (
          <motion.div
            key="tabs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col w-full"
            style={{ gap: 3 }}>

            <div className="font-vault text-right pr-4 mb-3"
              style={{ fontSize: "0.48rem", letterSpacing: "0.38em", color: "rgba(60,110,180,0.32)" }}>
              SECTIONS
            </div>

            {headings.map((h, idx) => {
              const isActive = activeId === h.id;
              const tabClass = h.level === 1 ? "folder-tab" : h.level === 2 ? "folder-tab-h2" : "folder-tab-h3";
              const activeClass = h.level === 1 ? "active-tab" : h.level === 2 ? "active-tab-h2" : "active-tab-h3";

              return (
                <motion.button
                  key={h.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, transition: { duration: 0.12 } }}
                  transition={{ delay: idx * 0.04, type: "spring", stiffness: 320, damping: 28 }}
                  className={`${tabClass} ${isActive ? activeClass : ""}`}
                  style={h.level > 1 ? { marginLeft: (h.level - 1) * 10 } : undefined}
                  onClick={() => scrollToHeading(h)}
                  title={h.text}>
                  <span className="flex items-center gap-1.5">
                    <span style={{
                      width: h.level === 1 ? 4 : 3,
                      height: h.level === 1 ? 4 : 3,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: isActive ? "var(--c-cyan)" : `rgba(93,220,245,${h.level === 1 ? 0.25 : 0.15})`,
                      boxShadow: isActive ? "0 0 6px var(--c-cyan)" : "none",
                      transition: "all 0.22s ease",
                    }} />
                    <span style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: h.level === 1 ? 88 : 72,
                    }}>
                      {h.text}
                    </span>
                  </span>
                </motion.button>
              );
            })}

            <div style={{ height: 1, marginLeft: 12, marginTop: 8, background: "linear-gradient(90deg, rgba(93,220,245,0.18), transparent)" }} />
            <div className="font-vault text-right pr-4 mt-1"
              style={{ fontSize: "0.46rem", letterSpacing: "0.25em", color: "rgba(50,90,160,0.28)" }}>
              {headings.length} {headings.length === 1 ? "SECTION" : "SECTIONS"}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end pr-3 gap-1.5"
            style={{ paddingTop: 2 }}>
            <div className="font-vault" style={{ fontSize: "0.44rem", letterSpacing: "0.35em", color: "rgba(50,85,155,0.28)", writingMode: "vertical-rl" }}>
              NO SECTIONS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function flashHeading(el: HTMLElement) {
  const prev = { transition: el.style.transition, background: el.style.background, paddingLeft: el.style.paddingLeft, borderRadius: el.style.borderRadius };
  el.style.transition  = "background 0.18s ease, padding-left 0.18s ease";
  el.style.background  = "rgba(93,220,245,0.09)";
  el.style.paddingLeft = "8px";
  el.style.borderRadius = "4px";
  setTimeout(() => {
    el.style.background   = prev.background;
    el.style.paddingLeft  = prev.paddingLeft;
    el.style.borderRadius = prev.borderRadius;
    setTimeout(() => { el.style.transition = prev.transition; }, 300);
  }, 650);
}
