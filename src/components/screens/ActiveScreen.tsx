import React, { useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, AlertTriangle, ExternalLink } from "lucide-react";
import type { ActiveScreenProps } from "./types";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const ActiveScreen: React.FC<ActiveScreenProps> = ({ episode, error, triggerHaptic }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode.durationSeconds ?? 0);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const resolvedError = error || playbackError;

  const progressPercent = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  const togglePlayback = async () => {
    triggerHaptic();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setPlaybackError(null);
    } catch (playError) {
      setPlaybackError(playError instanceof Error ? playError.message : "Playback failed.");
    }
  };

  const handleSeek = (nextValue: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = (nextValue / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-32 px-6 max-w-4xl mx-auto flex flex-col gap-8"
    >
      <section className="glass-panel rounded-3xl p-6 border border-outline-variant/15 space-y-4">
        <p className="text-xs uppercase tracking-widest text-secondary">Generated Episode</p>
        <h2 className="font-headline text-3xl md:text-4xl font-bold leading-tight text-on-surface">{episode.title}</h2>
        <p className="text-on-surface-variant">{episode.topic}</p>
        <p className="text-sm text-on-surface-variant">{episode.summary}</p>
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-outline-variant/15 space-y-6">
        <audio
          ref={audioRef}
          src={episode.audioUrl}
          preload="metadata"
          onTimeUpdate={(event) => {
            setCurrentTime(event.currentTarget.currentTime);
          }}
          onLoadedMetadata={(event) => {
            setDuration(event.currentTarget.duration || episode.durationSeconds || 0);
          }}
          onEnded={() => setIsPlaying(false)}
          onError={() => {
            setPlaybackError("Unable to play this audio file.");
            setIsPlaying(false);
          }}
        />

        <div className="space-y-3">
          <div className="relative w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-secondary"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercent}
            onChange={(event) => handleSeek(Number(event.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs uppercase tracking-widest text-on-surface-variant">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              void togglePlayback();
            }}
            className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-primary-dim flex items-center justify-center text-background shadow-lg"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>

        {resolvedError && (
          <div className="flex items-center gap-2 text-error text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{resolvedError}</span>
          </div>
        )}
      </section>

      <section className="glass-panel rounded-3xl p-6 border border-outline-variant/15">
        <h3 className="font-headline text-xl font-bold mb-4">Sources</h3>
        <ul className="space-y-3">
          {episode.sources.map((source) => (
            <li key={source.id} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:underline"
              >
                {source.title}
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-on-surface-variant mt-1">
                {source.publisher || "Unknown publisher"}
                {source.publishedAt ? ` • ${new Date(source.publishedAt).toLocaleDateString()}` : ""}
              </p>
              {source.excerpt && <p className="text-sm text-on-surface-variant mt-2">{source.excerpt}</p>}
            </li>
          ))}
        </ul>
      </section>
    </motion.div>
  );
};
