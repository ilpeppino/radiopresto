import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { TopNav, BottomNav, type Tab } from "./components/UI";
import { 
  DiscoverScreen, 
  CreateScreen, 
  ResearchingScreen, 
  ActiveScreen,
  SettingsScreen,
  ProfileScreen,
  NodesScreen
} from "./components/Screens";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("discover");
  const [isResearching, setIsResearching] = useState(false);
  const [researchTopic, setResearchTopic] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showNodes, setShowNodes] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [followedCategories, setFollowedCategories] = useState<string[]>([]);
  const [followedNodes, setFollowedNodes] = useState<string[]>(["node-3"]); // Synthwave is active by default
  const [notifications, setNotifications] = useState<{id: string, text: string, time: string, read: boolean, type?: 'category' | 'node', targetId?: string, targetLabel?: string}[]>([]);
  const [savedBroadcasts, setSavedBroadcasts] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("https://picsum.photos/seed/commander/400/400");
  const [nodes, setNodes] = useState([
    { id: "node-1", label: "Cyberpunk", icon: "Bolt", status: "Online", freq: "104.2 MHz" },
    { id: "node-2", label: "Space Ambient", icon: "Rocket", status: "Online", freq: "98.5 MHz" },
    { id: "node-3", label: "Synthwave", icon: "Waves", status: "Active", freq: "102.1 MHz" },
    { id: "node-4", label: "AI Brainwaves", icon: "Brain", status: "Standby", freq: "106.8 MHz" },
  ]);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [theme]);

  const triggerHaptic = () => {
    if (hapticEnabled && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };

  const addNotification = (text: string, type?: 'category' | 'node', targetId?: string, targetLabel?: string) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      text,
      time: "Just now",
      read: false,
      type,
      targetId,
      targetLabel
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const toggleFollowCategory = (category: string) => {
    triggerHaptic();
    setFollowedCategories(prev => {
      const isFollowing = prev.includes(category);
      if (isFollowing) {
        return prev.filter(c => c !== category);
      } else {
        addNotification(`You are now following ${category}. We'll notify you of new trends.`);
        return [...prev, category];
      }
    });
  };

  const toggleFollowNode = (nodeId: string, label: string) => {
    triggerHaptic();
    setFollowedNodes(prev => {
      const isFollowing = prev.includes(nodeId);
      if (isFollowing) {
        return prev.filter(id => id !== nodeId);
      } else {
        addNotification(`Node "${label}" followed. Syncing latest transmissions...`);
        return [...prev, nodeId];
      }
    });
  };

  // Simulate periodic notifications for followed content
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const isCategory = Math.random() > 0.5;
        if (isCategory) {
          const categories = ["Technology", "Culture", "Atmosphere", "Science", "Music"];
          const cat = categories[Math.floor(Math.random() * categories.length)];
          addNotification(`New trending content detected in ${cat}!`, 'category', cat, cat);
        } else {
          const node = nodes[Math.floor(Math.random() * nodes.length)];
          addNotification(`Node "${node.label}" is broadcasting a new high-priority signal.`, 'node', node.id, node.label);
        }
      }
    }, 20000);
    
    return () => clearInterval(interval);
  }, [nodes]);

  const handleFollowActionFromNotif = (type: 'category' | 'node', id: string, label: string) => {
    if (type === 'category') {
      toggleFollowCategory(id);
    } else {
      toggleFollowNode(id, label);
    }
  };

  const handleStartResearch = (topic: string) => {
    triggerHaptic();
    setResearchTopic(topic);
    setIsResearching(true);
    // Simulate research time
    setTimeout(() => {
      setIsResearching(false);
      setActiveTab("active");
    }, 3000);
  };

  const handleSaveBroadcast = (title: string) => {
    triggerHaptic();
    if (!savedBroadcasts.includes(title)) {
      setSavedBroadcasts([...savedBroadcasts, title]);
    }
  };

  const handleAddNode = (category: string) => {
    triggerHaptic();
    const newNode = {
      id: `node-${Date.now()}`,
      label: category,
      icon: "Activity",
      status: "Online",
      freq: `${(Math.random() * (108 - 88) + 88).toFixed(1)} MHz`
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-background atmospheric-bg">
      <TopNav 
        onSettings={() => { triggerHaptic(); setShowSettings(true); }} 
        notifications={notifications}
        onClearNotifications={() => setNotifications([])}
        onFollowAction={handleFollowActionFromNotif}
      />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <SettingsScreen 
              key="settings" 
              onBack={() => { triggerHaptic(); setShowSettings(false); }} 
              theme={theme}
              onThemeToggle={() => { triggerHaptic(); setTheme(theme === "dark" ? "light" : "dark"); }}
              hapticEnabled={hapticEnabled}
              onHapticToggle={() => { setHapticEnabled(!hapticEnabled); setTimeout(triggerHaptic, 0); }}
            />
          ) : showNodes ? (
            <NodesScreen 
              key="nodes" 
              onBack={() => { triggerHaptic(); setShowNodes(false); }} 
              nodes={nodes}
              onReorder={(newNodes) => { triggerHaptic(); setNodes(newNodes); }}
            />
          ) : isResearching ? (
            <ResearchingScreen key="researching" topic={researchTopic} />
          ) : (
            <>
              {activeTab === "discover" && (
                <DiscoverScreen 
                  key="discover" 
                  onNodes={() => { triggerHaptic(); setShowNodes(true); }} 
                  onAddNode={handleAddNode}
                  followedCategories={followedCategories}
                  onFollowCategory={toggleFollowCategory}
                  followedNodes={followedNodes}
                  onFollowNode={toggleFollowNode}
                />
              )}
              {activeTab === "create" && <CreateScreen key="create" onStartResearch={handleStartResearch} />}
              {activeTab === "active" && <ActiveScreen key="active" onSave={handleSaveBroadcast} triggerHaptic={triggerHaptic} />}
              {activeTab === "profile" && (
                <ProfileScreen 
                  key="profile" 
                  savedBroadcasts={savedBroadcasts} 
                  avatarUrl={avatarUrl}
                  onAvatarChange={(url) => { triggerHaptic(); setAvatarUrl(url); }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {!isResearching && !showSettings && !showNodes && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={(tab) => { triggerHaptic(); setActiveTab(tab); }} 
        />
      )}
    </div>
  );
}
