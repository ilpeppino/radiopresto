import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { 
  Bolt, 
  Rocket, 
  Waves, 
  Brain, 
  Mic, 
  Search, 
  ArrowRight, 
  Terminal, 
  TrendingUp, 
  Brush,
  CheckCircle2,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Share2,
  Bookmark,
  BookOpen,
  Activity,
  ChevronLeft,
  LogOut,
  Music,
  ShieldCheck,
  User,
  Save,
  List,
  Trash2,
  GripVertical,
  X,
  Sun,
  Moon,
  ToggleLeft,
  ToggleRight,
  Camera
} from "lucide-react";
import { StationCard, NewsCard } from "./UI";

export const DiscoverScreen: React.FC<{ 
  onNodes?: () => void, 
  onAddNode?: (category: string) => void,
  followedCategories: string[],
  onFollowCategory: (category: string) => void,
  followedNodes: string[],
  onFollowNode: (nodeId: string, label: string) => void
}> = ({ onNodes, onAddNode, followedCategories, onFollowCategory, followedNodes, onFollowNode }) => {
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
    "Digital Environments"
  ];

  const suggestions = searchQuery.trim() 
    ? POPULAR_TOPICS.filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
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

      {/* Persistent Search Bar with Autocomplete */}
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
            onClick={() => { triggerHaptic(); onNodes?.(); }}
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
                  onClick={() => { triggerHaptic(); setConfirmNode(null); }}
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

export const CreateScreen: React.FC<{ onStartResearch: (topic: string) => void }> = ({ onStartResearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setInputValue(transcript);
        if (event.results[0].isFinal) {
          // Auto-submit after a short delay if final
          setTimeout(() => {
            if (transcript.trim()) {
              onStartResearch(transcript);
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
          What do you want to hear <br/> <span className="bg-linear-to-br from-primary to-primary-dim bg-clip-text text-transparent">about today?</span>
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
                onKeyDown={(e) => e.key === 'Enter' && onStartResearch(inputValue)}
              />
              <button 
                onClick={() => inputValue.trim() && onStartResearch(inputValue)}
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
            { label: "Generative Art", icon: Brush }
          ].map((chip) => (
            <button 
              key={chip.label}
              onClick={() => onStartResearch(chip.label)}
              className="px-5 py-2 rounded-full glass-panel border border-outline-variant/10 text-on-surface-variant hover:text-secondary hover:border-secondary/30 transition-all text-sm font-medium flex items-center gap-2"
            >
              <chip.icon className="w-4 h-4" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ResearchingScreen: React.FC<{ topic: string }> = ({ topic }) => (
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

export const ActiveScreen: React.FC<{ 
  onSave?: (title: string) => void,
  triggerHaptic: () => void
}> = ({ onSave, triggerHaptic }) => {
  const [showQueue, setShowQueue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(765); // 12:45 in seconds
  const [showShareToast, setShowShareToast] = useState(false);
  const [queue, setQueue] = useState([
    { id: 1, title: "The Future of Quantum Computing", duration: "15:20", category: "Tech" },
    { id: 2, title: "Mars Colonization: Phase 2", duration: "22:45", category: "Science" },
    { id: 3, title: "Synthwave Revival Trends", duration: "12:10", category: "Music" },
  ]);

  const totalDuration = 2520; // 42:00 in seconds
  const currentBroadcastTitle = "Neural Horizons: Part 04";
  const currentCategory = "Neuroscience";
  const currentArtwork = "https://picsum.photos/seed/neuro/200/200";

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev < totalDuration ? prev + 1 : prev));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipForward = () => {
    setCurrentTime((prev) => Math.min(prev + 15, totalDuration));
  };

  const skipBackward = () => {
    setCurrentTime((prev) => Math.max(prev - 15, 0));
  };

  const jumpToNext = () => {
    if (queue.length > 0) {
      // In a real app, we'd set the current broadcast to queue[0]
      // For this demo, we'll just simulate moving to next by clearing time
      setCurrentTime(0);
      setQueue(queue.slice(1));
    }
  };

  const jumpToPrev = () => {
    // Simulate jump to previous by resetting current time
    setCurrentTime(0);
  };

  const removeFromQueue = (id: number) => {
    setQueue(queue.filter(item => item.id !== id));
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
              {/* Custom Thumb */}
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
              className={`flex-1 glass-panel p-6 rounded-[2rem] border border-outline-variant/15 flex items-center justify-center gap-4 transition-all group active:scale-95 ${showQueue ? 'bg-surface-container-highest text-tertiary border-tertiary/30' : 'hover:bg-surface-container-high'}`}
            >
              <List className={`group-hover:scale-110 transition-transform ${showQueue ? 'text-tertiary' : 'text-secondary'}`} />
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

export const NodesScreen: React.FC<{ 
  onBack: () => void, 
  nodes: any[], 
  onReorder: (nodes: any[]) => void 
}> = ({ onBack, nodes, onReorder }) => {
  const iconMap: Record<string, any> = {
    Bolt,
    Rocket,
    Waves,
    Brain,
    Activity
  };

  const removeNode = (id: string) => {
    onReorder(nodes.filter(n => n.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-32 px-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Active Nodes</h1>
          <p className="text-on-surface-variant text-sm">Manage and rearrange your transmission points.</p>
        </div>
      </div>

      <Reorder.Group axis="y" values={nodes} onReorder={onReorder} className="space-y-4">
        {nodes.map((node) => {
          const Icon = iconMap[node.icon] || Activity;
          return (
            <Reorder.Item 
              key={node.id} 
              value={node}
              className="glass-panel p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
            >
              <div className="text-on-surface-variant/40 group-hover:text-primary transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface">{node.label}</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'Active' ? 'bg-secondary' : node.status === 'Online' ? 'bg-primary' : 'bg-on-surface-variant/30'}`}></span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{node.status} • {node.freq}</span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  removeNode(node.id);
                }}
                className="p-2 rounded-lg hover:bg-error/10 text-on-surface-variant hover:text-error transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {nodes.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto">
            <Activity className="w-10 h-10 text-on-surface-variant/20" />
          </div>
          <p className="text-on-surface-variant font-body italic">All nodes offline. Frequency lost.</p>
          <button 
            onClick={onBack}
            className="text-primary font-headline font-bold hover:underline"
          >
            Return to Base
          </button>
        </div>
      )}
    </motion.div>
  );
};

export const ProfileScreen: React.FC<{ 
  savedBroadcasts?: string[], 
  avatarUrl?: string,
  onAvatarChange?: (url: string) => void
}> = ({ savedBroadcasts = [], avatarUrl, onAvatarChange }) => {
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
        {/* Avatar Placeholder */}
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
            onClick={() => { triggerHaptic(); fileInputRef.current?.click(); }}
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
            onClick={() => { triggerHaptic(); fileInputRef.current?.click(); }}
            className="absolute bottom-0 right-0 p-2 bg-secondary rounded-full text-background shadow-lg hover:scale-110 transition-transform"
          >
            <Bolt className="w-4 h-4" />
          </button>
        </div>

      {/* Username & Stats */}
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-glow">Commander Peppino</h1>
        <p className="text-on-surface-variant font-body text-sm uppercase tracking-[0.3em]">Frequency Level 42</p>
      </div>

      {/* Profile Stats Grid */}
      <div className="grid grid-cols-3 gap-4 w-full pt-4">
        {[
          { label: "Broadcasts", value: "128", icon: Mic },
          { label: "Hours", value: "450", icon: Activity },
          { label: "Nodes", value: "12", icon: Bolt }
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 rounded-2xl border border-outline-variant/10 flex flex-col items-center gap-1">
            <stat.icon className="w-4 h-4 text-secondary mb-1" />
            <span className="font-headline font-bold text-lg">{stat.value}</span>
            <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Saved Broadcasts Section */}
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

      {/* Recent Activity Section */}
      <div className="w-full text-left space-y-4 pt-8">
        <h2 className="font-headline text-lg font-bold text-primary uppercase tracking-widest">Recent Transmissions</h2>
        <div className="space-y-3">
          {[
            "The Future of Quantum Computing",
            "Mars Colonization: Phase 2",
            "Synthwave Revival Trends"
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

export const SettingsScreen: React.FC<{ 
  onBack: () => void, 
  theme: "dark" | "light", 
  onThemeToggle: () => void,
  hapticEnabled: boolean,
  onHapticToggle: () => void
}> = ({ onBack, theme, onThemeToggle, hapticEnabled, onHapticToggle }) => (
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
      {/* Appearance Section */}
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

      {/* Account Section */}
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

      {/* Music Integration Section */}
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

      {/* Security & Privacy */}
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
