"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import type { NextPage } from "next";
import { useSearchParams } from "next/navigation";
import { Loader2, PanelRightClose, PanelRightOpen } from "lucide-react";
import { CodeEditor } from "../../components/CodeEditor";
import { AnimationPlayer } from "../../components/AnimationPlayer";
import { PageLayout } from "../../components/PageLayout";
import { ChatSidebar, type ChatSidebarRef } from "../../components/ChatSidebar";
import { VoiceoverPanel } from "../../components/VoiceoverPanel";
import { CaptionsEditor } from "../../components/CaptionsEditor";
import { ScriptEditor } from "../../components/ScriptEditor";
import { Button } from "../../components/ui/button";
import type { StreamPhase, GenerationErrorType } from "../../types/generation";
import { examples } from "../../examples/code";
import { useAnimationState } from "../../hooks/useAnimationState";
import { useConversationState } from "../../hooks/useConversationState";
import { useAutoCorrection } from "../../hooks/useAutoCorrection";
import type {
  AssistantMetadata,
  ErrorCorrectionContext,
} from "../../types/conversation";
import type {
  Voiceover,
  Script,
  CaptionConfig,
  CaptionsData,
} from "../../types/voiceover";

const MAX_CORRECTION_ATTEMPTS = 3;

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";

  // If we have an initial prompt from URL, start in streaming state
  // so syntax highlighting is disabled from the beginning
  const willAutoStart = Boolean(initialPrompt);

  const [durationInFrames, setDurationInFrames] = useState(
    examples[0]?.durationInFrames || 150,
  );
  const [fps, setFps] = useState(examples[0]?.fps || 30);
  const [isStreaming, setIsStreaming] = useState(willAutoStart);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>(
    willAutoStart ? "reasoning" : "idle",
  );
  const [prompt, setPrompt] = useState(initialPrompt);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [generationError, setGenerationError] = useState<{
    message: string;
    type: GenerationErrorType;
  } | null>(null);

  // Self-correction state
  const [errorCorrection, setErrorCorrection] =
    useState<ErrorCorrectionContext | null>(null);

  // Conversation state for follow-up edits
  const {
    messages,
    hasManualEdits,
    pendingMessage,
    addUserMessage,
    addAssistantMessage,
    addErrorMessage,
    markManualEdit,
    getFullContext,
    getPreviouslyUsedSkills,
    setPendingMessage,
    clearPendingMessage,
    isFirstGeneration,
  } = useConversationState();

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

  // Voiceover/Script state
  const [voiceover, setVoiceover] = useState<Voiceover | null>(null);
  const [script, setScript] = useState<Script>({ scenes: [] });
  const [captionConfig, setCaptionConfig] = useState<CaptionConfig>({
    enabled: false,
    style: "bottom",
    fontSize: 48,
    highlightColor: "#FFFF00",
  });
  const [captions, setCaptions] = useState<CaptionsData | null>(null);

  const { code, Component, error: compilationError, isCompiling, setCode, compileCode } =
    useAnimationState(examples[0]?.code || "");

  // Runtime errors from the Player (e.g., "cannot access variable before initialization")
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  // Combined error for display - either compilation or runtime error
  const codeError = compilationError || runtimeError;

  // Refs
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStreamingRef = useRef(isStreaming);
  const codeRef = useRef(code);
  const chatSidebarRef = useRef<ChatSidebarRef>(null);

  // Auto-correction hook - use combined code error (compilation + runtime)
  const { markAsAiGenerated, markAsUserEdited } = useAutoCorrection({
    maxAttempts: MAX_CORRECTION_ATTEMPTS,
    compilationError: codeError,
    generationError,
    isStreaming,
    isCompiling,
    hasGeneratedOnce,
    code,
    errorCorrection,
    onTriggerCorrection: useCallback((correctionPrompt: string, context: ErrorCorrectionContext) => {
      setErrorCorrection(context);
      setPrompt(correctionPrompt);
      setTimeout(() => {
        // Use silent mode to avoid showing retry as a user message
        chatSidebarRef.current?.triggerGeneration({ silent: true });
      }, 100);
    }, []),
    onAddErrorMessage: addErrorMessage,
    onClearGenerationError: useCallback(() => setGenerationError(null), []),
    onClearErrorCorrection: useCallback(() => setErrorCorrection(null), []),
  });

  // Sync refs
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    const wasStreaming = isStreamingRef.current;
    isStreamingRef.current = isStreaming;

    // Compile when streaming ends - mark as AI change
    if (wasStreaming && !isStreaming) {
      markAsAiGenerated();
      compileCode(codeRef.current);
    }
  }, [isStreaming, compileCode, markAsAiGenerated]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      setHasGeneratedOnce(true);

      // Mark as manual edit if not streaming (user typing)
      if (!isStreamingRef.current) {
        markManualEdit(newCode);
        markAsUserEdited();
      }

      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Skip compilation while streaming - will compile when streaming ends
      if (isStreamingRef.current) {
        return;
      }

      // Set new debounce
      debounceRef.current = setTimeout(() => {
        compileCode(newCode);
      }, 500);
    },
    [setCode, compileCode, markManualEdit, markAsUserEdited],
  );

  // Handle message sent for history
  const handleMessageSent = useCallback(
    (promptText: string) => {
      addUserMessage(promptText);
    },
    [addUserMessage],
  );

  // Handle generation complete for history
  const handleGenerationComplete = useCallback(
    (generatedCode: string, summary?: string, metadata?: AssistantMetadata) => {
      const content = summary || "Generated your animation, any follow up edits?";
      addAssistantMessage(content, generatedCode, metadata);
      markAsAiGenerated();
    },
    [addAssistantMessage, markAsAiGenerated],
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleStreamingChange = useCallback((streaming: boolean) => {
    setIsStreaming(streaming);
    // Clear errors when starting a new generation
    if (streaming) {
      setGenerationError(null);
      setRuntimeError(null);
    }
  }, []);

  const handleError = useCallback(
    (message: string, type: GenerationErrorType) => {
      setGenerationError({ message, type });
    },
    [],
  );

  // Handle runtime errors from the Player (e.g., "cannot access variable before initialization")
  const handleRuntimeError = useCallback(
    (errorMessage: string) => {
      // Set runtime error - this will be combined with compilation errors via codeError
      // The useAutoCorrection hook will pick this up via the compilationError prop
      setRuntimeError(errorMessage);
    },
    [],
  );

  // Auto-trigger generation if prompt came from URL
  useEffect(() => {
    if (initialPrompt && !hasAutoStarted && chatSidebarRef.current) {
      setHasAutoStarted(true);
      setTimeout(() => {
        chatSidebarRef.current?.triggerGeneration();
      }, 100);
    }
  }, [initialPrompt, hasAutoStarted]);

  // Update duration when voiceover changes
  useEffect(() => {
    if (voiceover?.durationMs) {
      const newDuration = Math.ceil((voiceover.durationMs / 1000) * fps);
      setDurationInFrames(newDuration);
    }
  }, [voiceover, fps]);

  return (
    <PageLayout showLogoAsLink>
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {/* Chat History Sidebar */}
        <ChatSidebar
          ref={chatSidebarRef}
          messages={messages}
          pendingMessage={pendingMessage}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasManualEdits={hasManualEdits}
          // Generation props for embedded input
          onCodeGenerated={handleCodeChange}
          onStreamingChange={handleStreamingChange}
          onStreamPhaseChange={setStreamPhase}
          onError={handleError}
          prompt={prompt}
          onPromptChange={setPrompt}
          currentCode={code}
          conversationHistory={getFullContext()}
          previouslyUsedSkills={getPreviouslyUsedSkills()}
          isFollowUp={!isFirstGeneration}
          onMessageSent={handleMessageSent}
          onGenerationComplete={handleGenerationComplete}
          onErrorMessage={addErrorMessage}
          errorCorrection={errorCorrection ?? undefined}
          onPendingMessage={setPendingMessage}
          onClearPendingMessage={clearPendingMessage}
        />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 px-12 pb-8 gap-8 overflow-hidden">
          <div className="flex-1 flex flex-col lg:flex-row overflow-auto lg:overflow-hidden gap-8">
            <CodeEditor
              code={hasGeneratedOnce && !generationError ? code : ""}
              onChange={handleCodeChange}
              isStreaming={isStreaming}
              streamPhase={streamPhase}
            />
            <div className="shrink-0 lg:shrink lg:flex-[2.5] lg:min-w-0 lg:h-full">
              <AnimationPlayer
                Component={generationError ? null : Component}
                durationInFrames={durationInFrames}
                fps={fps}
                onDurationChange={setDurationInFrames}
                onFpsChange={setFps}
                isCompiling={isCompiling}
                isStreaming={isStreaming}
                error={generationError?.message || codeError}
                errorType={generationError?.type || "compilation"}
                code={code}
                onRuntimeError={handleRuntimeError}
                voiceover={voiceover}
                captionConfig={captionConfig}
                captions={captions}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Voiceover & Script */}
        <div
          className={`flex flex-col bg-background border-l border-border transition-all duration-300 shrink-0 ${
            isRightSidebarCollapsed ? "w-12" : "w-[300px]"
          }`}
        >
          {isRightSidebarCollapsed ? (
            <div className="flex justify-center px-4 pt-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsRightSidebarCollapsed(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <PanelRightOpen className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Media
                </h2>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsRightSidebarCollapsed(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </div>

              {/* Panels */}
              <div className="flex-1 overflow-y-auto">
                <VoiceoverPanel
                  voiceover={voiceover}
                  onVoiceoverChange={setVoiceover}
                  captionConfig={captionConfig}
                  onCaptionConfigChange={setCaptionConfig}
                  onCaptionsChange={setCaptions}
                  onScriptChange={setScript}
                />
                <CaptionsEditor
                  captions={captions}
                  onCaptionsChange={setCaptions}
                  audioDurationMs={voiceover?.durationMs}
                />
                <ScriptEditor
                  script={script}
                  onScriptChange={setScript}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-foreground" />
    </div>
  );
}

const GeneratePage: NextPage = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GeneratePageContent />
    </Suspense>
  );
};

export default GeneratePage;
