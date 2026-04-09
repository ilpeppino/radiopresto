import { motion } from "motion/react";
import { 
  Compass, 
  Mic, 
  Activity, 
  User, 
  Settings, 
  Bolt, 
  Rocket, 
  Waves, 
  Brain, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Share2, 
  Bookmark, 
  BookOpen,
  X,
  Search,
  ArrowRight,
  Terminal,
  TrendingUp,
  Brush,
  Radio,
  Bell
} from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence } from "motion/react";

// --- Types ---
export type Tab = "discover" | "create" | "active" | "profile";

// --- Components ---

export const TopNav = ({ 
  onSettings, 
  notifications = [], 
  onClearNotifications,
  onFollowAction
}: { 
  onSettings?: () => void, 
  notifications?: {id: string, text: string, time: string, read: boolean, type?: 'category' | 'node', targetId?: string, targetLabel?: string}[],
  onClearNotifications?: () => void,
  onFollowAction?: (type: 'category' | 'node', id: string, label: string) => void
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-linear-to-b from-surface-container-low to-transparent">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center bg-surface-container-low overflow-hidden">
          <Radio className="w-6 h-6 text-primary" />
        </div>
        <span className="font-headline text-primary font-bold text-xl tracking-tighter">Radio Presto</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => { triggerHaptic(); setShowNotifs(!showNotifs); }}
            className="text-on-surface-variant hover:text-secondary transition-colors duration-300 active:opacity-80 active:scale-95 relative"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-background">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-4 w-80 glass-panel rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-high">
                  <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface">Notifications</span>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => { triggerHaptic(); onClearNotifications?.(); }}
                      className="text-[10px] text-error font-bold uppercase tracking-widest hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto no-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-xs text-on-surface-variant font-body">No new transmissions.</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-outline-variant/5 hover:bg-white/5 transition-colors">
                        <p className="text-xs text-on-surface font-body leading-relaxed mb-2">{n.text}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] text-on-surface-variant uppercase tracking-widest">{n.time}</span>
                          {n.type && n.targetId && n.targetLabel && (
                            <button 
                              onClick={() => {
                                triggerHaptic();
                                onFollowAction?.(n.type!, n.targetId!, n.targetLabel!);
                              }}
                              className="text-[9px] font-bold text-secondary uppercase tracking-widest hover:underline"
                            >
                              Manage Follow
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => { triggerHaptic(); onSettings?.(); }}
          className="text-on-surface-variant hover:text-secondary transition-colors duration-300 active:opacity-80 active:scale-95"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, onTabChange }: { activeTab: Tab, onTabChange: (tab: Tab) => void }) => {
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const tabs: { id: Tab, label: string, icon: any }[] = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "create", label: "Create", icon: Mic },
    { id: "active", label: "Active", icon: Activity },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-background/60 backdrop-blur-3xl border-t border-outline-variant/15 shadow-[0_-8px_32px_rgba(186,158,255,0.06)] rounded-t-[1.5rem]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { triggerHaptic(); onTabChange(tab.id); }}
          className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
            activeTab === tab.id 
              ? "text-secondary drop-shadow-[0_0_8px_rgba(83,221,252,0.4)]" 
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <tab.icon className={`w-6 h-6 mb-1 ${activeTab === tab.id ? "fill-current" : ""}`} />
          <span className="font-body text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
        </button>
      ))}
    </footer>
  );
};

export const StationCard = ({ 
  label, 
  icon: Icon, 
  image, 
  isActive,
  isFollowed,
  onFollow
}: { 
  label: string, 
  icon: any, 
  image: string, 
  isActive?: boolean,
  isFollowed?: boolean,
  onFollow?: (e: React.MouseEvent) => void
}) => {
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  return (
    <div 
      onClick={triggerHaptic}
      className="flex flex-col items-center gap-3 flex-shrink-0 group cursor-pointer relative"
    >
      <div className={`w-20 h-20 rounded-full bg-surface-container-high p-1 border-2 transition-all duration-300 ${isActive ? "border-secondary neon-glow" : isFollowed ? "border-primary/50 shadow-[0_0_15px_rgba(186,158,255,0.3)]" : "border-transparent group-hover:border-secondary"}`}>
        <div className="w-full h-full rounded-full bg-linear-to-br from-primary-dim to-surface-variant flex items-center justify-center overflow-hidden relative">
          <img 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay" 
            src={image} 
            alt={label}
            referrerPolicy="no-referrer"
          />
          <Icon className={`absolute text-white w-8 h-8 group-hover:scale-110 transition-transform ${isFollowed ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`font-body text-[10px] uppercase font-bold tracking-tighter transition-colors ${isActive ? "text-secondary" : isFollowed ? "text-primary" : "text-on-surface-variant group-hover:text-secondary"}`}>
          {label}
        </span>
        {isFollowed && <Bookmark className="w-2.5 h-2.5 text-primary fill-current" />}
      </div>
      
      {onFollow && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            triggerHaptic();
            onFollow(e);
          }}
          className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${isFollowed ? 'bg-secondary border-secondary text-background' : 'bg-surface-container-highest border-outline-variant/30 text-on-surface-variant hover:text-secondary'}`}
        >
          {isFollowed ? <CheckCircle2 className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
        </button>
      )}
    </div>
  );
};

export const NewsCard = ({ 
  category, 
  title, 
  description, 
  image, 
  time, 
  type = "large",
  onCategoryClick,
  isFollowed,
  onFollow
}: { 
  category: string, 
  title: string, 
  description: string, 
  image: string, 
  time: string, 
  type?: "large" | "small",
  onCategoryClick?: (category: string) => void,
  isFollowed?: boolean,
  onFollow?: (category: string) => void
}) => {
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  if (type === "small") {
    return (
      <div 
        onClick={triggerHaptic}
        className="relative group ml-4 cursor-pointer"
      >
        <div className="bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/15 flex flex-row h-40">
          <div className="w-1/3 relative overflow-hidden">
            <img 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              src={image}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent to-surface-container-high group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
          <div className="w-2/3 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerHaptic();
                    onCategoryClick?.(category);
                  }}
                  className="font-body text-[8px] text-tertiary font-bold tracking-widest uppercase hover:underline"
                >
                  {category}
                </button>
                {onFollow && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic();
                      onFollow(category);
                    }}
                    className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${isFollowed ? 'text-secondary' : 'text-on-surface-variant hover:text-secondary'}`}
                  >
                    {isFollowed ? 'Following' : '+ Follow'}
                  </button>
                )}
              </div>
              <h3 className="font-headline text-md font-bold text-on-surface leading-tight">{title}</h3>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); triggerHaptic(); }}
              className="flex items-center justify-center gap-2 w-max px-4 py-1.5 border border-secondary/40 text-secondary bg-secondary/5 rounded-full font-bold text-[10px] hover:bg-secondary/10 transition-all uppercase tracking-widest"
            >
              <Play className="w-3 h-3 fill-current" />
              Tune In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={triggerHaptic}
      className="relative group cursor-pointer"
    >
      <div className={`bg-surface-container-low rounded-xl overflow-hidden border transition-all duration-300 ${isFollowed ? 'border-primary/30 shadow-[0_0_20px_rgba(186,158,255,0.1)]' : 'border-outline-variant/15'} flex flex-col`}>
        <div className="aspect-video relative overflow-hidden">
          <img 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src={image}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic();
                onCategoryClick?.(category);
              }}
              className={`glass-panel px-3 py-1 rounded-full border transition-colors ${isFollowed ? 'border-primary/40 bg-primary/10' : 'border-secondary/20 hover:bg-secondary/10'}`}
            >
              <span className={`font-body text-[10px] font-bold tracking-widest uppercase ${isFollowed ? 'text-primary' : 'text-secondary'}`}>{category}</span>
            </button>
            {onFollow && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  triggerHaptic();
                  onFollow(category);
                }}
                className={`glass-panel px-3 py-1 rounded-full border transition-all ${isFollowed ? 'bg-primary/20 border-primary text-primary' : 'border-white/20 text-white hover:bg-white/10'}`}
              >
                <span className="font-body text-[10px] font-bold tracking-widest uppercase">{isFollowed ? 'Following' : '+ Follow'}</span>
              </button>
            )}
          </div>
          {isFollowed && (
            <div className="absolute top-4 right-4 z-10 bg-primary/20 backdrop-blur-md p-1.5 rounded-full border border-primary/30">
              <Bookmark className="w-3 h-3 text-primary fill-current" />
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-3 leading-tight">{title}</h3>
          <p className="text-on-surface-variant text-sm font-body mb-6 line-clamp-2">{description}</p>
          <div className="flex justify-between items-center">
            <span className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest">{time}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); triggerHaptic(); }}
              className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-primary to-primary-dim text-background rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Play className="w-4 h-4 fill-current" />
              Listen Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
