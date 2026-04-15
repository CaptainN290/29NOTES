"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LockScreen from "@/app/components/lock/LockScreen";
import AppShell from "@/app/components/layout/AppShell";

export default function HomeClient({ initiallyUnlocked = false }: { initiallyUnlocked?: boolean }) {
  const [unlocked, setUnlocked] = useState(initiallyUnlocked);

  return (
    <AnimatePresence mode="wait">
      {!unlocked ? (
        <motion.div key="lock" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97, filter: "blur(8px)" }} transition={{ duration: 0.5, ease: "easeInOut" }}>
          <LockScreen onUnlock={() => setUnlocked(true)} />
        </motion.div>
      ) : (
        <motion.div key="app" initial={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 0.6, ease: "easeOut" }} className="h-screen">
          <AppShell onLogout={() => setUnlocked(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
