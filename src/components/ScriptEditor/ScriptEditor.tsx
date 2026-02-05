"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Scene, Script } from "@/types/voiceover";

interface ScriptEditorProps {
  script: Script;
  onScriptChange: (script: Script) => void;
}

export function ScriptEditor({ script, onScriptChange }: ScriptEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const generateId = () => {
    return `scene-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  };

  const handleAddScene = useCallback(() => {
    const newScene: Scene = {
      id: generateId(),
      text: "",
      visualHint: "",
    };
    onScriptChange({
      ...script,
      scenes: [...script.scenes, newScene],
    });
  }, [script, onScriptChange]);

  const handleRemoveScene = useCallback(
    (sceneId: string) => {
      onScriptChange({
        ...script,
        scenes: script.scenes.filter((s) => s.id !== sceneId),
      });
    },
    [script, onScriptChange]
  );

  const handleSceneTextChange = useCallback(
    (sceneId: string, text: string) => {
      onScriptChange({
        ...script,
        scenes: script.scenes.map((s) =>
          s.id === sceneId ? { ...s, text } : s
        ),
      });
    },
    [script, onScriptChange]
  );

  const handleSceneHintChange = useCallback(
    (sceneId: string, visualHint: string) => {
      onScriptChange({
        ...script,
        scenes: script.scenes.map((s) =>
          s.id === sceneId ? { ...s, visualHint } : s
        ),
      });
    },
    [script, onScriptChange]
  );

  return (
    <div className="border-b border-border">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Script</span>
        </div>
        {script.scenes.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {script.scenes.length} scene{script.scenes.length !== 1 ? "s" : ""}
          </span>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Scene List */}
          {script.scenes.map((scene, index) => (
            <SceneItem
              key={scene.id}
              scene={scene}
              index={index}
              onTextChange={(text) => handleSceneTextChange(scene.id, text)}
              onHintChange={(hint) => handleSceneHintChange(scene.id, hint)}
              onRemove={() => handleRemoveScene(scene.id)}
            />
          ))}

          {/* Add Scene Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddScene}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Add Scene
          </Button>

          {script.scenes.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Add scenes to define your script. Each scene contains voiceover
              text and optional visual hints for the AI.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface SceneItemProps {
  scene: Scene;
  index: number;
  onTextChange: (text: string) => void;
  onHintChange: (hint: string) => void;
  onRemove: () => void;
}

function SceneItem({
  scene,
  index,
  onTextChange,
  onHintChange,
  onRemove,
}: SceneItemProps) {
  return (
    <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
      {/* Scene Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground-dim cursor-grab" />
          <span className="text-xs font-medium text-muted-foreground">
            Scene {index + 1}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive h-6 w-6"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Scene Text */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Voiceover Text</label>
        <textarea
          value={scene.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="What the narrator says in this scene..."
          className="w-full min-h-[60px] bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground-dim resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Visual Hint */}
      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          Visual Hint (optional)
        </label>
        <input
          type="text"
          value={scene.visualHint || ""}
          onChange={(e) => onHintChange(e.target.value)}
          placeholder="e.g., Show a bar chart, Zoom into logo..."
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground-dim focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
