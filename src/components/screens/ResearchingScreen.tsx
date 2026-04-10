import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import type { GenerationStep } from "@/src/types/api";
import { fetchGenerationJob } from "@/src/lib/api";
import type { ResearchingScreenProps } from "./types";

const STEP_LABELS: Record<GenerationStep, string> = {
  collecting_sources: "Collecting sources",
  building_bundle: "Building source bundle",
  generating_episode: "Generating episode",
  finalizing: "Finalizing",
};

export const ResearchingScreen: React.FC<ResearchingScreenProps> = ({
  topic,
  jobId,
  onCompleted,
  onCancel,
  onJobFailed,
}) => {
  const [step, setStep] = useState<GenerationStep>("collecting_sources");
  const [status, setStatus] = useState<"pending" | "running" | "failed" | "completed">("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stopped = false;

    const poll = async () => {
      try {
        const job = await fetchGenerationJob(jobId);
        if (stopped) return;

        setStatus(job.status);

        if (job.step) {
          setStep(job.step);
        }

        if (job.status === "completed" && job.episodeId) {
          await onCompleted(job.episodeId);
          return;
        }

        if (job.status === "failed") {
          const message = job.errorMessage || "Episode generation failed.";
          setError(message);
          onJobFailed(message);
          return;
        }
      } catch (pollError) {
        if (stopped) return;
        const message = pollError instanceof Error ? pollError.message : "Failed to check job status.";
        setError(message);
        setStatus("failed");
        onJobFailed(message);
        return;
      }

      window.setTimeout(poll, 1500);
    };

    void poll();

    return () => {
      stopped = true;
    };
  }, [jobId, onCompleted, onJobFailed]);

  const steps: GenerationStep[] = [
    "collecting_sources",
    "building_bundle",
    "generating_episode",
    "finalizing",
  ];

  const currentIndex = steps.indexOf(step);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-screen w-full flex flex-col items-center justify-center px-6 text-center overflow-hidden"
    >
      <div className="relative z-10 max-w-2xl space-y-8 w-full">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface">
          Researching <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">{topic}</span>
        </h1>

        {status !== "failed" ? (
          <div className="space-y-4">
            {steps.map((stepName, index) => {
              const isDone = index < currentIndex;
              const isActive = index === currentIndex;
              return (
                <div key={stepName} className="flex items-center justify-between glass-panel rounded-xl p-4 border border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="text-secondary w-5 h-5" />
                    ) : (
                      <Loader2 className={`w-5 h-5 ${isActive ? "animate-spin text-primary" : "text-on-surface-variant"}`} />
                    )}
                    <span className={isActive ? "text-on-surface" : "text-on-surface-variant"}>{STEP_LABELS[stepName]}</span>
                  </div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest">
                    {isDone ? "Done" : isActive ? "Running" : "Waiting"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-6 border border-error/30 space-y-3">
            <div className="flex items-center justify-center gap-2 text-error">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Generation failed</span>
            </div>
            <p className="text-sm text-on-surface-variant">{error || "Unexpected error."}</p>
            <button
              onClick={onCancel}
              className="mt-2 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface"
            >
              Back to Create
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
