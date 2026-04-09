import React, { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Camera, Mic, Activity, Bolt } from "lucide-react";
import type { ProfileScreenProps } from "./types";

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ savedBroadcasts = [], avatarUrl, onAvatarChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onAvatarChange?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative group">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="absolute -inset-1 bg-linear-to-r from-primary via-secondary to-tertiary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div
            onClick={() => {
              triggerHaptic();
              fileInputRef.current?.click();
            }}
            className="relative w-32 h-32 rounded-full border-2 border-outline-variant/20 bg-surface-container-low overflow-hidden flex items-center justify-center cursor-pointer"
          >
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic();
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 p-2 bg-secondary rounded-full text-background shadow-lg hover:scale-110 transition-transform"
          >
            <Bolt className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <h1 className="font-headline text-3xl font-bold tracking-tight text-glow">Commander Peppino</h1>
          <p className="text-on-surface-variant font-body text-sm uppercase tracking-[0.3em]">Frequency Level 42</p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full pt-4">
          {[
            { label: "Broadcasts", value: "128", icon: Mic },
            { label: "Hours", value: "450", icon: Activity },
            { label: "Nodes", value: "12", icon: Bolt },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center gap-1">
              <stat.icon className="w-4 h-4 text-secondary mb-1" />
              <span className="font-headline font-bold text-lg">{stat.value}</span>
              <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>

        {savedBroadcasts.length > 0 && (
          <div className="w-full text-left space-y-4 pt-8">
            <h2 className="font-headline text-lg font-bold text-tertiary uppercase tracking-widest">Saved Broadcasts</h2>
            <div className="space-y-3">
              {savedBroadcasts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    <span className="font-body text-sm text-on-surface">{item}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-tertiary transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full text-left space-y-4 pt-8">
          <h2 className="font-headline text-lg font-bold text-primary uppercase tracking-widest">Recent Transmissions</h2>
          <div className="space-y-3">
            {[
              "The Future of Quantum Computing",
              "Mars Colonization: Phase 2",
              "Synthwave Revival Trends",
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:bg-surface-container-high transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-body text-sm text-on-surface">{item}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
