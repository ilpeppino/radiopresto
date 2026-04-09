import React from "react";
import { motion } from "motion/react";
import {
  Waves,
  ArrowRight,
  Activity,
  ChevronLeft,
  LogOut,
  Music,
  ShieldCheck,
  User,
  Sun,
  Moon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import type { SettingsScreenProps } from "./types";

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, theme, onThemeToggle, hapticEnabled, onHapticToggle }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 50 }}
    className="min-h-screen pt-24 pb-32 px-6 max-w-2xl mx-auto"
  >
    <div className="flex items-center gap-4 mb-10">
      <button
        onClick={onBack}
        className="p-2 rounded-full bg-surface-container-high text-on-surface hover:text-secondary transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
    </div>

    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="w-5 h-5" />
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Appearance</h2>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-surface-container-high text-secondary">
                {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-body font-medium">Theme Mode</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">{theme} Mode Active</p>
              </div>
            </div>
            <button
              onClick={onThemeToggle}
              className="text-secondary hover:text-primary transition-colors"
            >
              {theme === "dark" ? <ToggleLeft className="w-10 h-10" /> : <ToggleRight className="w-10 h-10" />}
            </button>
          </div>

          <div className="h-px bg-outline-variant/10 my-4"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-surface-container-high text-tertiary">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <p className="font-body font-medium">Haptic Feedback</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest">Tactile Response {hapticEnabled ? "On" : "Off"}</p>
              </div>
            </div>
            <button
              onClick={onHapticToggle}
              className="text-tertiary hover:text-primary transition-colors"
            >
              {hapticEnabled ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <User className="w-5 h-5" />
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Account</h2>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 space-y-4">
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              </div>
              <span className="font-body font-medium">Sign in with Google</span>
            </div>
            <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <img src="https://www.apple.com/favicon.ico" alt="Apple" className="w-6 h-6" />
              </div>
              <span className="font-body font-medium">Sign in with Apple</span>
            </div>
            <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-secondary">
          <Music className="w-5 h-5" />
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Music Services</h2>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 space-y-4">
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
                <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-body font-medium">Connect Spotify</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Not Connected</span>
              <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#fa243c] to-[#fb5c74] flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="font-body font-medium">Connect Apple Music</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Not Connected</span>
              <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-secondary transition-colors" />
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-tertiary">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest">Privacy</h2>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10">
          <div className="flex items-center justify-between py-2">
            <span className="font-body text-on-surface-variant">Personalized Frequency</span>
            <div className="w-12 h-6 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </section>

      <button className="w-full py-4 rounded-2xl border border-error/20 text-error font-headline font-bold uppercase tracking-widest hover:bg-error/5 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  </motion.div>
);
