"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeadingItem } from "@/app/components/editor/NoteEditor";

interface HeadingTabsProps {
  headings: HeadingItem[];
  scrollContainerId: string;
}

export default function HeadingTabs({ headings, scrollContainerId }: HeadingTabsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const manualOverride = useRef(false); // suppress observer briefly after click

  // ── Active-heading tracking via IntersectionObserver ──────────────────────
  // Watches all h1 elements in the editor scroll container and highlights
  // whichever heading is nearest the top of the viewport.

  const setupObserver = useCallback(() => {
    // Tear down existing
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (headings.length === 0) {
      setActiveId(null);
      return;
    }

    const scrollContainer = document.getElementById(scrollContainerId);
    if (!scrollContainer) return;

    // Collect live h1 DOM nodes by their stamped IDs
    const targets: HTMLElement[] = headings
      .map(h => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (targets.length === 0) return;

    // Track visible headings and pick the topmost one
    const visibleSet = new Set<string>();

    const io = new IntersectionObserver(
      (entries) => {
        if (manualOverride.current) return;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleSet.add(entry.target.id);
          } else {
            visibleSet.delete(entry.target.id);
          }
        });

        // Pick the first heading (in document order) that's visible
        if (visibleSet.size > 0) {
          for (const h of headings) {
            if (visibleSet.has(h.id)) {
              setActiveId(h.id);
              return;
            }
          }
        }

        // If nothing visible, pick the last heading that passed above the fold
        // by checking scroll position against each heading's offsetTop
        if (visibleSet.size === 0) {
          const scrollTop = scrollContainer.scrollTop;
          let best: string | null = null;
          for (const h of headings) {
            const el = document.getElementById(h.id);
            if (el && el.offsetTop <= scrollTop + 120) {
              best = h.id;
            }
          }
          setActiveId(best);
        }
      },
      {
        root: scrollContainer,
        rootMargin: "-10% 0px -70% 0px", // trigger when heading is in upper 30% of container
        threshold: 0,
      }
    );

    targets.forEach(el => io.observe(el));
    observerRef.current = io;
  }, [headings, scrollContainerId]);

  // Re-run observer whenever headings list changes
  useEffect(() => {
    // Small delay so HeadingIdExtension has had time to stamp IDs onto the DOM
    const t = setTimeout(setupObserver, 80);
    return () => {
      clearTimeout(t);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [setupObserver]);

  // ── Click-to-scroll ────────────────────────────────────────────────────────

  function scrollToHeading(heading: HeadingItem) {
    const scrollContainer = document.getElementById(scrollContainerId);
    const target = document.getElementById(heading.id);
    if (!scrollContainer || !target) return;

    // Set active immediately so click feels responsive
    setActiveId(heading.id);

    // Suppress observer for 1s so the scroll animation doesn't fight the active state
    manualOverride.current = true;
    setTimeout(() => { manualOverride.current = false; }, 1000);

    // Scroll target into view within the container
    const containerTop = scrollContainer.getBoundingClientRect().top;
    const targetTop    = target.getBoundingClientRect().top;
    const offset       = targetTop - containerTop - 80; // 80px breathing room

    scrollContainer.scrollBy({ top: offset, behavior: "smooth" });

    // Brief visual flash on the heading
    flashHeading(target);
  }

  return (
    <div
      className="relative h-full flex flex-col items-end shrink-0"
      style={{
        width: headings.length > 0 ? 150 : 20,
        transition: "width 0.35s cubic-bezier(0.4,0,0.2,1)",
        paddingTop: 28,
        paddingBottom: 16,
      }}
    >
      <AnimatePresence mode="wait">
        {headings.length > 0 ? (
          <motion.div
            key="tabs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col w-full"
            style={{ gap: 4 }}
          >
            {/* Rail label */}
            <div
              className="font-vault text-right pr-4 mb-3"
              style={{ fontSize: "0.48rem", letterSpacing: "0.38em", color: "rgba(60,110,180,0.32)" }}
            >
              SECTIONS
            </div>

            {/* Tab buttons */}
            {headings.map((h, idx) => {
              const isActive = activeId === h.id;
              return (
                <motion.button
                  key={h.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12, transition: { duration: 0.12 } }}
                  transition={{
                    delay: idx * 0.045,
                    type: "spring",
                    stiffness: 320,
                    damping: 28,
                  }}
                  className={`folder-tab ${isActive ? "active-tab" : ""}`}
                  onClick={() => scrollToHeading(h)}
                  title={h.text}
                >
                  <span className="flex items-center gap-2">
                    {/* Dot indicator */}
                    <span
                      style={{
                        width: 4, height: 4, borderRadius: "50%", flexShrink: 0,
                        background: isActive ? "var(--c-cyan)" : "rgba(93,220,245,0.25)",
                        boxShadow: isActive ? "0 0 6px var(--c-cyan)" : "none",
                        transition: "all 0.22s ease",
                      }}
                    />
                    {/* Label */}
                    <span style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 88,
                    }}>
                      {h.text}
                    </span>
                  </span>
                </motion.button>
              );
            })}

            {/* Bottom rule + count */}
            <div style={{
              height: 1, marginLeft: 12, marginTop: 8,
              background: "linear-gradient(90deg, rgba(93,220,245,0.18), transparent)",
            }} />
            <div
              className="font-vault text-right pr-4 mt-1"
              style={{ fontSize: "0.46rem", letterSpacing: "0.25em", color: "rgba(50,90,160,0.28)" }}
            >
              {headings.length} {headings.length === 1 ? "SECTION" : "SECTIONS"}
            </div>
          </motion.div>
        ) : (
          // Empty state — subtle, doesn't shout
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end pr-3 gap-1.5"
            style={{ paddingTop: 2 }}
          >
            <div className="font-vault"
              style={{ fontSize: "0.44rem", letterSpacing: "0.35em", color: "rgba(50,85,155,0.28)", writingMode: "vertical-rl" }}>
              NO SECTIONS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flashHeading(el: HTMLElement) {
  const prev = {
    transition: el.style.transition,
    background: el.style.background,
    paddingLeft: el.style.paddingLeft,
    borderRadius: el.style.borderRadius,
  };
  el.style.transition = "background 0.18s ease, padding-left 0.18s ease";
  el.style.background = "rgba(93,220,245,0.09)";
  el.style.paddingLeft = "8px";
  el.style.borderRadius = "4px";
  setTimeout(() => {
    el.style.background   = prev.background;
    el.style.paddingLeft  = prev.paddingLeft;
    el.style.borderRadius = prev.borderRadius;
    setTimeout(() => { el.style.transition = prev.transition; }, 300);
  }, 650);
}
