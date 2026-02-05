"use client";

import { useState, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaptionsData, CaptionWord } from "@/types/voiceover";

interface CaptionsEditorProps {
  captions: CaptionsData | null;
  onCaptionsChange: (captions: CaptionsData | null) => void;
  audioDurationMs?: number;
}

export function CaptionsEditor({
  captions,
  onCaptionsChange,
  audioDurationMs,
}: CaptionsEditorProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const words = captions?.words || [];

  const handleAddWord = useCallback(() => {
    const lastWord = words[words.length - 1];
    const startMs = lastWord ? lastWord.endMs + 100 : 0;
    const endMs = startMs + 500;

    const newWord: CaptionWord = {
      text: "",
      startMs,
      endMs: audioDurationMs ? Math.min(endMs, audioDurationMs) : endMs,
    };

    onCaptionsChange({
      words: [...words, newWord],
    });
  }, [words, onCaptionsChange, audioDurationMs]);

  const handleRemoveWord = useCallback(
    (index: number) => {
      const newWords = words.filter((_, i) => i !== index);
      onCaptionsChange(newWords.length > 0 ? { words: newWords } : null);
    },
    [words, onCaptionsChange]
  );

  const handleWordChange = useCallback(
    (index: number, field: keyof CaptionWord, value: string | number) => {
      const newWords = words.map((word, i) => {
        if (i !== index) return word;
        return { ...word, [field]: value };
      });
      onCaptionsChange({ words: newWords });
    },
    [words, onCaptionsChange]
  );

  const formatTime = (ms: number): string => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  const parseTimeInput = (value: string): number => {
    // Remove 's' suffix if present and parse
    const cleaned = value.replace(/s$/, "").trim();
    const seconds = parseFloat(cleaned);
    return isNaN(seconds) ? 0 : Math.max(0, Math.round(seconds * 1000));
  };

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
          <MessageSquareText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Captions</span>
        </div>
        {words.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {words.length} word{words.length !== 1 ? "s" : ""}
          </span>
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Word List */}
          {words.map((word, index) => (
            <div
              key={index}
              className="bg-secondary/30 rounded-lg p-2 space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={word.text}
                  onChange={(e) =>
                    handleWordChange(index, "text", e.target.value)
                  }
                  placeholder="Word..."
                  className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground-dim focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleRemoveWord(index)}
                  className="text-muted-foreground hover:text-destructive h-6 w-6 shrink-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <label className="text-muted-foreground">Start:</label>
                <input
                  type="text"
                  value={formatTime(word.startMs)}
                  onChange={(e) =>
                    handleWordChange(
                      index,
                      "startMs",
                      parseTimeInput(e.target.value)
                    )
                  }
                  className="w-16 bg-background border border-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <label className="text-muted-foreground ml-2">End:</label>
                <input
                  type="text"
                  value={formatTime(word.endMs)}
                  onChange={(e) =>
                    handleWordChange(
                      index,
                      "endMs",
                      parseTimeInput(e.target.value)
                    )
                  }
                  className="w-16 bg-background border border-border rounded px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          ))}

          {/* Add Word Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddWord}
            className="w-full"
          >
            <Plus className="w-4 h-4" />
            Add Word
          </Button>

          {words.length === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Add words with timing to display as captions. Enable captions in
              the Voiceover panel above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
