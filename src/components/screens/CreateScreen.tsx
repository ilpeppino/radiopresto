import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Mic, Search, ArrowRight, Terminal, Rocket, TrendingUp, Brush } from "lucide-react";
import type { CreateScreenProps } from "./types";

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResult = {
  0: SpeechRecognitionResultItem;
  isFinal: boolean;
};

type SpeechRecognitionEvent = {
  results: SpeechRecognitionResult[];
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

export const CreateScreen: React.FC<CreateScreenProps> = ({ onStartResearch, isSubmitting = false, error }) => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        setInputValue(transcript);
        if (event.results[0].isFinal) {
          setTimeout(() => {
            if (transcript.trim()) {
              void onStartResearch(transcript);
            }
          }, 800);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [onStartResearch]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue("");
      recognitionRef.current?.start();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="relative pt-28 pb-32 px-6 flex flex-col items-center justify-center min-h-[80vh] max-w-4xl mx-auto text-center"
    >
      <div className="text-center mb-12 space-y-4">
        <span className="inline-block px-4 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-xs font-medium tracking-widest uppercase">Frequency Search</span>
        <h2 className="font-headline text-4xl md:text-6xl font-bold text-on-surface tracking-tighter leading-tight">
          What do you want to hear <br /> <span className="bg-linear-to-br from-primary to-primary-dim bg-clip-text text-transparent">about today?</span>
        </h2>
        <p className="text-on-surface-variant max-w-md mx-auto text-sm md:text-base leading-relaxed">
          Input a topic, trend, or deep-dive subject to generate your personalized AI broadcast.
        </p>
      </div>

      <div className="w-full space-y-10 relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full"></div>

        <div className="flex flex-col items-center justify-center gap-6">
          <button
            onClick={toggleListening}
            className="relative group"
          >
            <div className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-500 ${isListening ? "bg-secondary/60 animate-pulse" : "bg-secondary/20 group-hover:bg-secondary/40"}`}></div>
            <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center neon-glow group-active:scale-95 transition-all duration-200 ${isListening ? "bg-linear-to-br from-secondary to-secondary-dim scale-110" : "bg-linear-to-br from-primary to-primary-dim"}`}>
              {isListening ? (
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [12, 24, 12] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 bg-background rounded-full"
                    />
                  ))}
                </div>
              ) : (
                <Mic className="text-background w-12 h-12 md:w-16 md:h-16 fill-current" />
              )}
            </div>
            {isListening && (
              <div className="absolute inset-0 rounded-full border-2 border-secondary/50 animate-ping"></div>
            )}
          </button>
          <span className={`text-xs font-body uppercase tracking-widest transition-colors ${isListening ? "text-secondary font-bold" : "text-on-surface-variant animate-pulse"}`}>
            {isListening ? "Listening..." : "Tap to Speak"}
          </span>
        </div>

        <div className="max-w-2xl mx-auto w-full group">
          <div className={`relative glass-panel rounded-xl p-1 shadow-2xl transition-all duration-300 ${isListening ? "ring-2 ring-secondary/50" : "focus-within:ring-1 focus-within:ring-secondary/40"}`}>
            <div className="flex items-center gap-4 px-6 py-4">
              <Search className={`transition-colors ${isListening ? "text-secondary" : "text-on-surface-variant group-focus-within:text-secondary"}`} />
              <input
                className="bg-transparent border-none focus:outline-none text-on-surface placeholder:text-on-surface-variant/60 w-full font-body text-lg"
                placeholder={isListening ? "Transcribing..." : "Explore Tech Ethics, Quantum Mechanics..."}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void onStartResearch(inputValue);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    void onStartResearch(inputValue);
                  }
                }}
                disabled={isSubmitting}
                className="bg-surface-container-high hover:bg-surface-container-highest p-2 rounded-lg text-secondary transition-colors"
              >
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {[
            { label: "Tech Ethics", icon: Terminal },
            { label: "Space Exploration", icon: Rocket },
            { label: "Market Trends", icon: TrendingUp },
            { label: "Generative Art", icon: Brush },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                void onStartResearch(chip.label);
              }}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full glass-panel border border-outline-variant/10 text-on-surface-variant hover:text-secondary hover:border-secondary/30 transition-all text-sm font-medium flex items-center gap-2"
            >
              <chip.icon className="w-4 h-4" />
              {chip.label}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}
      </div>
    </motion.div>
  );
};
