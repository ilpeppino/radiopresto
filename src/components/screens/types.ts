import type { Episode, GenerationStep } from "@/src/types/api";

export type NodeStatus = "Online" | "Active" | "Standby";

export interface NodeItem {
  id: string;
  label: string;
  icon: string;
  status: NodeStatus;
  freq: string;
}

export interface DiscoverScreenProps {
  onNodes?: () => void;
  onAddNode?: (category: string) => void;
  followedCategories: string[];
  onFollowCategory: (category: string) => void;
  followedNodes: string[];
  onFollowNode: (nodeId: string, label: string) => void;
}

export interface CreateScreenProps {
  onStartResearch: (topic: string) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export interface ResearchingScreenProps {
  topic: string;
  jobId: string;
  onCompleted: (episodeId: string) => Promise<void>;
  onCancel: () => void;
  onJobFailed: (message: string) => void;
}

export interface ActiveScreenProps {
  episode: Episode;
  error?: string | null;
  triggerHaptic: () => void;
}

export interface NodesScreenProps {
  onBack: () => void;
  nodes: NodeItem[];
  onReorder: (nodes: NodeItem[]) => void;
}

export interface ProfileScreenProps {
  savedBroadcasts?: string[];
  avatarUrl?: string;
  onAvatarChange?: (url: string) => void;
}

export interface SettingsScreenProps {
  onBack: () => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  hapticEnabled: boolean;
  onHapticToggle: () => void;
}
