import React from "react";
import { motion, Reorder } from "motion/react";
import { Bolt, Rocket, Waves, Brain, Activity, ChevronLeft, Trash2, GripVertical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NodesScreenProps } from "./types";

export const NodesScreen: React.FC<NodesScreenProps> = ({ onBack, nodes, onReorder }) => {
  const iconMap: Record<string, LucideIcon> = {
    Bolt,
    Rocket,
    Waves,
    Brain,
    Activity,
  };

  const removeNode = (id: string) => {
    onReorder(nodes.filter((n) => n.id !== id));
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
                  <span className={`w-1.5 h-1.5 rounded-full ${node.status === "Active" ? "bg-secondary" : node.status === "Online" ? "bg-primary" : "bg-on-surface-variant/30"}`}></span>
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
