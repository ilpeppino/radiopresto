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
  onStartResearch: (topic: string) => void;
}

export interface ResearchingScreenProps {
  topic: string;
}

export interface ActiveScreenProps {
  onSave?: (title: string) => void;
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
