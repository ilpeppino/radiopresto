import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Share2,
  BookOpen,
  Save,
  List,
  Trash2,
  GripVertical,
} from "lucide-react";
import type { ActiveScreenProps } from "./types";

interface QueueItem {
  id: number;
  title: string;
  duration: string;
  category: string;
}

export const ActiveScreen: React.FC<ActiveScreenProps> = ({ onSave, triggerHaptic }) => {
  const [showQueue, setShowQueue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(765);
  const [showShareToast, setShowShareToast] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 1, title: "The Future of Quantum Computing", duration: "15:20", category: "Tech" },
    { id: 2, title: "Mars Colonization: Phase 2", duration: "22:45", category: "Science" },
    { id: 3, title: "Synthwave Revival Trends", duration: "12:10", category: "Music" },
  ]);

  const totalDuration = 2520;
  const currentBroadcastTitle = "Neural Horizons: Part 04";
  const currentCategory = "Neuroscience";
  const currentArtwork = "https://picsum.photos/seed/neuro/200/200";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev < totalDuration ? prev + 1 : prev));
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(prev + 15, totalDuration));
  };

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(prev - 15, 0));
  };

  const jumpToNext = () => {
    if (queue.length > 0) {
      setCurrentTime(0);
      setQueue(queue.slice(1));
    }
  };

  const jumpToPrev = () => {
    setCurrentTime(0);
  };

  const removeFromQueue = (id: number) => {
    setQueue(queue.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
    setShowClearConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-32 px-6 max-w-5xl mx-auto flex flex-col gap-8"
    >
      <section className="relative group">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="relative w-full md:w-2/3 aspect-square md:aspect-video rounded-3xl overflow-hidden border border-outline-variant/15 shadow-2xl shadow-primary/10">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRVxjFay9zgU_PxZasULKhUomW9VV3EHHCDjd_fEV2T17zmwpUuLq2BtrikBjKcBlfTm7YSiN3GcH1FhM4w6HzdCnv-DNxeMvS0IFSV1KLMOr72iOdg0Eoc7ZXuGnkGSxqJXk_9C7K9lLlVzzVzFQYb3zHsr6bgG5OEITaOWJNpjTAZP0m2zdxGJcuh6l7V2VfRqj9Y2dS8xVIoWxaEdxMvfMPDYBH_RvQsD4ERSb5oAV32O18HIhaFFGNa-S-jXni1p6F1n0jgggn"
              alt="Artwork"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6">
              <div className="bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-headline text-[10px] uppercase font-bold tracking-widest text-on-surface">Podcast Segment</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-secondary font-headline text-sm font-medium tracking-widest uppercase">Now Streaming</p>
                  {isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-error/10 border border-error/20"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                      <span className="text-[10px] font-bold text-error uppercase tracking-tighter">Live</span>
                    </motion.div>
                  )}
                </div>
                <div className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/20">
                  <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{currentCategory}</span>
                </div>
              </div>
              <div className="flex items-start gap-4 pt-2">
                <img
                  src={currentArtwork}
                  alt="Small Artwork"
                  className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="font-headline text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-on-surface">{currentBroadcastTitle}</h2>
                  <p className="text-on-surface-variant text-sm mt-1">Exploring the convergence of AI and human sensory perception.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="flex -space-x-3">
                <img className="w-8 h-8 rounded-full border-2 border-surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0jBlkCP4H4qK-4HVeWgaAAqAMuGIsP7kTwsMrNX54m4u80UIXlJ2afMTkQ-VS16NLLPUi1HccsCc0yKzUjZ1QHihC9nTd8Pm_KqZoildBcVdbs4xz1AexIy8038xR6Thv11E0ElHSQNjV7m4mrYbVaxEUhbT19HMfnKXDO04RyEKWM-B8JArKj_qQBILi7GzzbKkKmZAOWW6VNB7e4jWUuZyNjnHjJrrPNJCYfttxypxETIMRCHPpTQd3rvqVEHzw7TEwhlWtw0dX" alt="Guest" referrerPolicy="no-referrer" />
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary text-[10px] font-bold text-background flex items-center justify-center">
                  +2
                </div>
              </div>
              <span className="text-on-surface-variant text-sm font-medium italic">Featuring Dr. Aris Thorne</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 flex flex-col gap-6 bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant/10">
          <div className="space-y-3">
            <div className="relative w-full h-6 flex items-center group">
              <input
                type="range"
                min="0"
                max={totalDuration}
                value={currentTime}
                onChange={(e) => {
                  triggerHaptic();
                  setCurrentTime(parseInt(e.target.value));
                }}
                className="absolute w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer z-10 accent-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:border-none"
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 h-1.5 bg-linear-to-r from-primary to-secondary rounded-full shadow-[0_0_12px_#53ddfc60] pointer-events-none"
                animate={{ width: `${(currentTime / totalDuration) * 100}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-primary shadow-[0_0_10px_#53ddfc] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ left: `calc(${(currentTime / totalDuration) * 100}% - 8px)` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between font-body text-[10px] text-on-surface-variant tracking-widest uppercase font-semibold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-between w-full max-w-md md:max-w-none md:gap-8">
              <button
                onClick={skipBackward}
                className="text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90 hidden sm:block"
              >
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={jumpToPrev}
                className="text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90"
              >
                <SkipBack className="w-7 h-7 md:w-8 md:h-8 fill-current" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-linear-to-br from-primary to-primary-dim flex items-center justify-center text-background shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 md:w-10 md:h-10 fill-current" />
                ) : (
                  <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                )}
              </button>
              <button
                onClick={jumpToNext}
                className="text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90"
              >
                <SkipForward className="w-7 h-7 md:w-8 md:h-8 fill-current" />
              </button>
              <button
                onClick={skipForward}
                className="text-on-surface-variant hover:text-primary transition-all duration-300 active:scale-90 hidden sm:block"
              >
                <RotateCw className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => {
                  triggerHaptic();
                  setShowShareToast(true);
                  setTimeout(() => setShowShareToast(false), 3000);
                }}
                className="text-on-surface-variant hover:text-secondary transition-all duration-300 active:scale-90 relative"
              >
                <Share2 className="w-6 h-6 md:w-7 md:h-7" />
                <AnimatePresence>
                  {showShareToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-xl border border-secondary/30 whitespace-nowrap z-50 pointer-events-none"
                    >
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">Link Copied to Clipboard</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 h-full flex flex-col gap-4">
          <button
            onClick={() => onSave?.(currentBroadcastTitle)}
            className="flex-1 bg-linear-to-r from-secondary to-primary p-6 rounded-[2rem] flex items-center justify-center gap-4 hover:opacity-90 transition-all group active:scale-95 text-background shadow-lg shadow-secondary/20"
          >
            <Save className="group-hover:scale-110 transition-transform" />
            <span className="font-headline font-bold text-lg tracking-tight">Save Broadcast</span>
          </button>
          <div className="flex gap-4 flex-1">
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`flex-1 glass-panel p-6 rounded-[2rem] border border-outline-variant/15 flex items-center justify-center gap-4 transition-all group active:scale-95 ${showQueue ? "bg-surface-container-highest text-tertiary border-tertiary/30" : "hover:bg-surface-container-high"}`}
            >
              <List className={`group-hover:scale-110 transition-transform ${showQueue ? "text-tertiary" : "text-secondary"}`} />
              <span className="font-headline font-bold text-lg tracking-tight">Queue</span>
            </button>
            <button className="flex-1 glass-panel p-6 rounded-[2rem] border border-outline-variant/15 flex items-center justify-center gap-4 hover:bg-surface-container-high transition-all group active:scale-95">
              <BookOpen className="text-secondary group-hover:scale-110 transition-transform" />
              <span className="font-headline font-bold text-lg tracking-tight">Sources</span>
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-[2rem] p-8 border border-outline-variant/10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-xl font-bold text-tertiary uppercase tracking-widest">Upcoming Transmissions</h3>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{queue.length} Items in Queue</span>
                  {queue.length > 0 && (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[10px] font-bold text-error uppercase tracking-widest hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <Reorder.Group axis="y" values={queue} onReorder={setQueue} className="space-y-3">
                {queue.length > 0 ? (
                  queue.map((item) => (
                    <Reorder.Item
                      key={item.id}
                      value={item}
                      className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container-high transition-colors group cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-on-surface-variant/40 group-hover:text-primary transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-secondary font-headline font-bold">
                          {item.category[0]}
                        </div>
                        <div>
                          <p className="font-body font-medium text-on-surface">{item.title}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">{item.category} • {item.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-surface-container-highest text-on-surface-variant hover:text-primary transition-colors">
                          <Play className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromQueue(item.id);
                          }}
                          className="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Reorder.Item>
                  ))
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto">
                      <List className="w-8 h-8 text-on-surface-variant/40" />
                    </div>
                    <p className="text-on-surface-variant font-body italic">The signal is clear. No upcoming transmissions.</p>
                  </div>
                )}
              </Reorder.Group>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mt-auto pb-12">
        <div className="flex items-end justify-center gap-1.5 h-32 w-full">
          {[40, 70, 55, 90, 60, 45, 80, 100, 65, 40, 55, 30, 85, 50, 75, 25, 60, 45, 95, 70].map((h, i) => (
            <motion.div
              key={i}
              animate={{ height: [`${h}%`, `${Math.min(100, h + 20)}%`, `${h}%`] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className={`w-3 rounded-full ${i % 3 === 0 ? "bg-secondary" : i % 3 === 1 ? "bg-primary" : "bg-tertiary"}`}
            />
          ))}
        </div>
        <p className="text-center mt-6 text-[10px] uppercase tracking-[0.4em] font-headline font-bold text-secondary/40">Syncing with Live Frequency 104.2 MHz</p>
      </section>

      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowClearConfirm(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel p-8 rounded-[2.5rem] border border-outline-variant/20 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-error" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-bold text-on-surface">Clear Queue?</h3>
                <p className="text-on-surface-variant text-sm">This will remove all upcoming transmissions from your current session.</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-2xl bg-surface-container-high font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={clearQueue}
                  className="flex-1 px-6 py-3 rounded-2xl bg-error text-white font-headline font-bold text-sm hover:bg-error/90 transition-colors shadow-lg shadow-error/20"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
