import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bolt, Rocket, Waves, Brain, Search, TrendingUp } from "lucide-react";
import { StationCard, NewsCard } from "../UI";
import type { DiscoverScreenProps } from "./types";

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onNodes,
  onAddNode,
  followedCategories,
  onFollowCategory,
  followedNodes,
  onFollowNode,
}) => {
  const [confirmNode, setConfirmNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const POPULAR_TOPICS = [
    "Quantum Computing",
    "Meta-City",
    "Eco-Sync",
    "Cyberpunk",
    "Space Ambient",
    "Synthwave",
    "AI Brainwaves",
    "Atmosphere",
    "Technology",
    "Culture",
    "Mars Colonization",
    "Digital Environments",
  ];

  const suggestions = searchQuery.trim()
    ? POPULAR_TOPICS.filter((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-32 px-6"
    >
      <header className="mb-6">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-glow mb-2">Good evening, Commander.</h1>
        <p className="text-on-surface-variant font-body text-sm tracking-wide">Syncing your personal frequency... 89% complete.</p>
      </header>

      <div className="mb-10 relative group z-30">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search frequencies, nodes, or news..."
          value={searchQuery}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-low border border-outline-variant/15 rounded-2xl py-4 pl-12 pr-4 font-body text-sm focus:outline-hidden focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
        />

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl border border-outline-variant/20 overflow-hidden shadow-2xl z-40"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    triggerHaptic();
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-6 py-4 font-body text-sm text-on-surface hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 border-b border-outline-variant/5 last:border-0"
                >
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-headline text-xl font-bold text-primary">My Stations</h2>
          <button
            onClick={() => {
              triggerHaptic();
              onNodes?.();
            }}
            className="text-secondary font-body text-xs uppercase tracking-widest hover:text-primary transition-colors cursor-pointer"
          >
            Active Nodes
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
          <StationCard
            label="Cyberpunk"
            icon={Bolt}
            image="https://picsum.photos/seed/cyberpunk/400/400"
            isFollowed={followedNodes.includes("node-1")}
            onFollow={() => onFollowNode("node-1", "Cyberpunk")}
          />
          <StationCard
            label="Space Ambient"
            icon={Rocket}
            image="https://picsum.photos/seed/space/400/400"
            isFollowed={followedNodes.includes("node-2")}
            onFollow={() => onFollowNode("node-2", "Space Ambient")}
          />
          <StationCard
            label="Synthwave"
            icon={Waves}
            image="https://picsum.photos/seed/synthwave/400/400"
            isActive
            isFollowed={followedNodes.includes("node-3")}
            onFollow={() => onFollowNode("node-3", "Synthwave")}
          />
          <StationCard
            label="AI Brainwaves"
            icon={Brain}
            image="https://picsum.photos/seed/ai/400/400"
            isFollowed={followedNodes.includes("node-4")}
            onFollow={() => onFollowNode("node-4", "AI Brainwaves")}
          />
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-xl font-bold text-on-surface">Trending Global News</h2>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
          </div>
        </div>
        <div className="space-y-6">
          <NewsCard
            category="Technology"
            title="Quantum Neural Networks achieve consciousness milestone"
            description="Recent breakthroughs in silicon-based synaptic pathways suggest the gap between AI and biological thought is narrowing faster than predicted..."
            image="https://picsum.photos/seed/tech/800/600"
            time="3:42 mins • Live"
            onCategoryClick={setConfirmNode}
            isFollowed={followedCategories.includes("Technology")}
            onFollow={onFollowCategory}
          />
          <NewsCard
            category="Culture"
            title="The Meta-City: Living in 100% Digital Environments"
            description="As virtual real estate prices soar, the first generation of 'digital natives' is moving into entirely simulated urban centers."
            image="https://picsum.photos/seed/culture/800/600"
            time="5:12 mins"
            type="small"
            onCategoryClick={setConfirmNode}
            isFollowed={followedCategories.includes("Culture")}
            onFollow={onFollowCategory}
          />
          <NewsCard
            category="Atmosphere"
            title="Eco-Sync: Satellite audio feeds from the Amazon Basin"
            description="High-definition acoustic sensors are now streaming the sounds of biodiversity directly to your ears, updated in real-time by weather patterns."
            image="https://picsum.photos/seed/nature/800/600"
            time="Infinite Stream"
            onCategoryClick={setConfirmNode}
            isFollowed={followedCategories.includes("Atmosphere")}
            onFollow={onFollowCategory}
          />
        </div>
      </section>

      <AnimatePresence>
        {confirmNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmNode(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel p-8 rounded-[2.5rem] border border-outline-variant/20 max-w-sm w-full text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Bolt className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-2xl font-bold text-on-surface">Add New Node?</h3>
                <p className="text-on-surface-variant text-sm">Do you want to add <span className="text-secondary font-bold">"{confirmNode}"</span> as a new active transmission node?</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    triggerHaptic();
                    setConfirmNode(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-surface-container-high font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    triggerHaptic();
                    onAddNode?.(confirmNode);
                    setConfirmNode(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-primary text-background font-headline font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
