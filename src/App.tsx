import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { TopNav, BottomNav, type Tab } from "./components/UI";
import {
  DiscoverScreen,
  CreateScreen,
  ResearchingScreen,
  ActiveScreen,
  SettingsScreen,
  ProfileScreen,
} from "./components/screens";
import { createGenerationJob, fetchEpisode } from "@/src/lib/api";
import type { Episode } from "@/src/types/api";

type AppState = {
  currentTopic: string | null;
  currentJobId: string | null;
  currentEpisode: Episode | null;
  isGenerating: boolean;
  error: string | null;
};

const initialState: AppState = {
  currentTopic: null,
  currentJobId: null,
  currentEpisode: null,
  isGenerating: false,
  error: null,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [appState, setAppState] = useState<AppState>(initialState);

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

  const handleStartResearch = async (topicInput: string) => {
    const topic = topicInput.trim();
    if (!topic) {
      setAppState((prev) => ({
        ...prev,
        error: "Please enter a topic.",
      }));
      return;
    }

    setAppState({
      currentTopic: topic,
      currentJobId: null,
      currentEpisode: null,
      isGenerating: true,
      error: null,
    });

    try {
      const { jobId } = await createGenerationJob(topic);
      setAppState((prev) => ({
        ...prev,
        currentJobId: jobId,
      }));
    } catch (error) {
      setAppState((prev) => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : "Failed to start generation.",
      }));
    }
  };

  const handleGenerationCompleted = async (episodeId: string) => {
    try {
      const episode = await fetchEpisode(episodeId);
      setAppState((prev) => ({
        ...prev,
        currentEpisode: episode,
        currentJobId: null,
        isGenerating: false,
        error: null,
      }));
      setActiveTab("active");
    } catch (error) {
      setAppState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to load generated episode.",
      }));
    }
  };

  const handleGenerationFailed = (message: string) => {
    setAppState((prev) => ({
      ...prev,
      error: message,
    }));
  };

  const cancelGeneration = () => {
    setAppState((prev) => ({
      ...prev,
      currentJobId: null,
      isGenerating: false,
    }));
    setActiveTab("create");
  };

  const isResearching = appState.isGenerating && Boolean(appState.currentJobId);

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-background atmospheric-bg">
      <TopNav onSettings={() => setShowSettings(true)} notifications={[]} />

      <main className="relative">
        <AnimatePresence mode="wait">
          {showSettings ? (
            <SettingsScreen
              key="settings"
              onBack={() => setShowSettings(false)}
              theme={theme}
              onThemeToggle={() => {
                triggerHaptic();
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              hapticEnabled={hapticEnabled}
              onHapticToggle={() => {
                setHapticEnabled(!hapticEnabled);
                setTimeout(triggerHaptic, 0);
              }}
            />
          ) : isResearching && appState.currentTopic && appState.currentJobId ? (
            <ResearchingScreen
              key="researching"
              topic={appState.currentTopic}
              jobId={appState.currentJobId}
              onCompleted={handleGenerationCompleted}
              onCancel={cancelGeneration}
              onJobFailed={handleGenerationFailed}
            />
          ) : (
            <>
              {activeTab === "discover" && (
                <DiscoverScreen
                  key="discover"
                  followedCategories={[]}
                  onFollowCategory={() => undefined}
                  followedNodes={[]}
                  onFollowNode={() => undefined}
                />
              )}
              {activeTab === "create" && (
                <CreateScreen
                  key="create"
                  onStartResearch={handleStartResearch}
                  isSubmitting={appState.isGenerating}
                  error={appState.error}
                />
              )}
              {activeTab === "active" && appState.currentEpisode && (
                <ActiveScreen
                  key="active"
                  episode={appState.currentEpisode}
                  triggerHaptic={triggerHaptic}
                  error={appState.error}
                />
              )}
              {activeTab === "active" && !appState.currentEpisode && (
                <CreateScreen
                  key="create-fallback"
                  onStartResearch={handleStartResearch}
                  isSubmitting={appState.isGenerating}
                  error={appState.error || "Generate an episode from the Create tab first."}
                />
              )}
              {activeTab === "profile" && <ProfileScreen key="profile" savedBroadcasts={[]} />}
            </>
          )}
        </AnimatePresence>
      </main>

      {!isResearching && !showSettings && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            triggerHaptic();
            setActiveTab(tab);
          }}
        />
      )}
    </div>
  );
}
