import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, Activity } from "lucide-react";
import type { ResearchingScreenProps } from "./types";

export const ResearchingScreen: React.FC<ResearchingScreenProps> = ({ topic }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="relative h-screen w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden"
  >
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]"></div>
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]"></div>
    </div>

    <div className="relative z-10 mb-12 flex items-center justify-center">
      <div className="absolute w-64 h-64 rounded-full border border-secondary/20 animate-pulse"></div>
      <div className="absolute w-48 h-48 rounded-full border border-primary/20 scale-125"></div>
      <div className="absolute w-32 h-32 rounded-full border border-tertiary/20"></div>
      <div className="relative w-24 h-24 rounded-full bg-linear-to-tr from-primary to-secondary flex items-center justify-center neon-glow">
        <Activity className="text-background w-10 h-10" />
      </div>

      <div className="absolute -top-12 -right-16 glass-panel px-4 py-2 rounded-xl border border-outline-variant/15 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
        <span className="text-[10px] font-body font-medium text-secondary uppercase tracking-[0.2em]">Live Feed</span>
      </div>
      <div className="absolute bottom-4 -left-20 glass-panel px-4 py-2 rounded-xl border border-outline-variant/15 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
        <span className="text-[10px] font-body font-medium text-tertiary uppercase tracking-[0.2em]">Neural Sync</span>
      </div>
    </div>

    <div className="relative z-10 max-w-2xl space-y-4">
      <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-on-surface">
        Researching the latest on <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{topic}</span>...
      </h1>

      <div className="pt-8 flex flex-col items-center gap-6">
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-secondary w-5 h-5" />
              <span className="text-on-surface-variant text-sm font-medium">Scanning news sources...</span>
            </div>
            <span className="text-[10px] text-secondary font-mono">100%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="text-primary w-5 h-5 animate-spin" />
              <span className="text-on-surface text-sm font-medium">Synthesizing key insights...</span>
            </div>
            <span className="text-[10px] text-primary font-mono italic">Processing</span>
          </div>
        </div>

        <div className="w-full max-w-md h-[2px] bg-surface-container-high rounded-full overflow-hidden mt-4">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-full w-2/3 bg-linear-to-r from-primary-dim via-secondary to-primary rounded-full neon-glow"
          />
        </div>
      </div>
    </div>
  </motion.div>
);
