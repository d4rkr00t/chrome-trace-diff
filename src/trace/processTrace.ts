import { getUniqueEventKey } from "./getUniqueKey.ts";
import type { ProcessedTrace } from "./ProcessedTrace.ts";
import type { ProcessedTraceEvent } from "./ProcessedTraceEvent.ts";
import type { TraceEvent } from "./TraceEvent.ts";

const IGNORED_EVENT_PH = new Set(["M", "I", "f", "s"]);

const IGNORED_EVENT_NAMES = new Set([
  "AnimationFrame",
  "AnimationFrame::Presentation",
  "AnimationFrame::Render",
  "AnimationFrame::Script::Compile",
  "AnimationFrame::Script::Execute",
  "AnimationFrame::StyleAndLayout",
  "BackForwardCacheBufferLimitTracker::DidRemoveFrameOrWorkerFromBackForwardCache",
  "ClearWeaknessProcessor start",
  "CommitLoad",
  "CommitToDidCommit",
  "CompressionStream Deflate",
  "ContextCreatedNotification",
  "DecodedDataDocumentParser::AppendBytes",
  "DocumentLoader::BodyDataReceivedImpl",
  "DocumentLoader::BodyLoadingFinished",
  "DocumentLoader::CommitData",
  "DocumentLoader::CommitNavigation",
  "DocumentLoader::CreateParserPostCommit",
  "DocumentLoader::DidCommitNavigation",
  "DocumentLoader::DidInstallNewDocument",
  "DocumentLoader::DocumentLoader",
  "DocumentLoader::FinishedLoading",
  "DocumentLoader::HandleData",
  "DocumentLoader::InitializeWindow",
  "DocumentLoader::RecordUseCountersForCommit",
  "DocumentLoader::StartLoadingResponse",
  "EventDispatch",
  "FrameLoader",
  "FrameLoader::CommitDocumentLoader",
  "FrameLoader::CommitNavigation",
  "FrameLoader::DetachDocument",
  "FrameLoader::DispatchUnloadEventAndFillOldDocInfo",
  "HTMLDocumentParser::DocumentElementAvailable",
  "HTMLDocumentParser::MaybeFetchQueuedPreloads",
  "HandlePostMessage",
  "HitTest",
  "InstallConditionalFeatures",
  "LargestTextPaint::Candidate",
  "LocalDOMWindow::FrameDestroyed",
  "LocalWindowProxy::CreateContext",
  "LocalWindowProxy::Initialize",
  "LocalWindowProxy::SetupWindowPrototypeChain",
  "LocalWindowProxy::UpdateDocumentProperty",
  "MojoURLLoaderClient::OnReceiveResponse",
  "NavigationBodyLoader::OnReadable",
  "NavigationBodyLoader::ReadFromDataPipe",
  "NavigationBodyLoader::StartLoadingBody",
  "PageAnimator::serviceScriptedAnimations",
  "Parallel scavenge started",
  "Profile",
  "ProfileChunk",
  "RenderFrameImpl::CommitNavigation",
  "RenderFrameImpl::CommitNavigationWithParams",
  "RenderFrameImpl::DidClearWindowObject",
  "RenderFrameImpl::DidCommitNavigation",
  "RenderFrameImpl::DidCreateScriptContext",
  "RenderFrameImpl::DidDispatchDOMContentLoadedEvent",
  "RenderFrameImpl::DidObserveNewFeatureUsage",
  "RenderFrameImpl::NotifyObserversOfNavigationCommit",
  "RenderFrameImpl::SetUpSharedMemoryForDroppedFrames",
  "RenderFrameImpl::didCommitProvisionalLoad",
  "RenderFrameImpl::didFinishLoad",
  "RenderFrameImpl::didStartLoading",
  "RenderFrameImpl::didStartProvisionalLoad",
  "RenderFrameImpl::didStopLoading",
  "Renderer Navigation",
  "ResourceRequestSender::OnReceivedResponse",
  "ResourceRequestSender::OnRequestComplete",
  "RunMicrotasks",
  "ScriptCatchup",
  "StubScriptCatchup",
  "ThrottlingURLLoader::OnReceiveResponse",
  "ThrottlingURLLoader::Start",
  "ThrottlingURLLoader::StartNow",
  "ThrottlingURLLoader::ThrottlingURLLoader",
  "ThrottlingURLLoader::~ThrottlingURLLoader",
  "URLLoader::Context::Cancel",
  "URLLoader::Context::OnCompletedRequest",
  "URLLoader::Context::OnReceivedResponse",
  "URLLoader::Context::Start",
  "URLLoader::loadAsynchronously",
  "V8.BytecodeBudgetInterrupt",
  "V8.BytecodeBudgetInterruptWithStackCheck",
  "V8.DeoptimizeAllOptimizedCodeWithFunction",
  "V8.DeserializeContext",
  "V8.GCScavenger",
  "V8.GC_BACKGROUND_SAFEPOINT",
  "V8.GC_BACKGROUND_YOUNG_ARRAY_BUFFER_SWEEP",
  "V8.GC_HEAP_EPILOGUE",
  "V8.GC_HEAP_EPILOGUE_SAFEPOINT",
  "V8.GC_HEAP_EXTERNAL_EPILOGUE",
  "V8.GC_HEAP_EXTERNAL_PROLOGUE",
  "V8.GC_HEAP_PROLOGUE",
  "V8.GC_HEAP_PROLOGUE_SAFEPOINT",
  "V8.GC_MC_COMPLETE_SWEEPING",
  "V8.GC_MC_SWEEP",
  "V8.GC_MINOR_MS_BACKGROUND_SWEEPING",
  "V8.GC_SCAVENGER",
  "V8.GC_SCAVENGER_BACKGROUND_SCAVENGE_PARALLEL",
  "V8.GC_SCAVENGER_BACKGROUND_TRACED_HANDLES_COMPUTE_WEAKNESS_PARALLEL",
  "V8.GC_SCAVENGER_COMPLETE_SWEEP_ARRAY_BUFFERS",
  "V8.GC_SCAVENGER_RESIZE_NEW_SPACE",
  "V8.GC_SCAVENGER_SCAVENGE",
  "V8.GC_SCAVENGER_SCAVENGE_FINALIZE",
  "V8.GC_SCAVENGER_SCAVENGE_PARALLEL",
  "V8.GC_SCAVENGER_SCAVENGE_PARALLEL_PHASE",
  "V8.GC_SCAVENGER_SCAVENGE_RESTORE_AND_QUARANTINE_PINNED",
  "V8.GC_SCAVENGER_SCAVENGE_ROOTS",
  "V8.GC_SCAVENGER_SCAVENGE_WEAK_GLOBAL_HANDLES_IDENTIFY",
  "V8.GC_SCAVENGER_SCAVENGE_WEAK_GLOBAL_HANDLES_PROCESS",
  "V8.GC_SCAVENGER_SWEEP_ARRAY_BUFFERS",
  "V8.GC_SCAVENGER_TRACED_HANDLES_COMPUTE_WEAKNESS_PARALLEL",
  "V8.GC_SCAVENGER_TRACED_HANDLES_RESET_PARALLEL",
  "V8.GC_TIME_TO_SAFEPOINT",
  "V8.HandleInterrupts",
  "V8.InvokeApiInterruptCallbacks",
  "V8.StackGuard",
  "V8StackTraceImpl::capture",
  "XHRLoad",
  "XHRReadyStateChange",
  "commitNavigationEnd",
  "domContentLoadedEventEnd",
  "domContentLoadedEventStart",
  "domLoading",
  "fetchStart",
  "firstMeaningfulPaintCandidate",
  "largestContentfulPaint::Candidate",
  "loadEventEnd",
  "loadEventStart",
  "responseEnd",
  "toFramesVector",
  "unloadEventEnd",
  "unloadEventStart",
  "v8.callFunction",
  "v8.newInstance",
  "v8.parseOnBackground",
  "v8.parseOnBackgroundParsing",
  "v8.parseOnBackgroundWaiting",
  "v8.produceCache",
  "v8::Debugger::AsyncTaskCanceled",
  "v8::Debugger::AsyncTaskRun",
  "v8::Debugger::AsyncTaskScheduled",
  "V8.GC_SCAVENGER_FREE_REMEMBERED_SET",
  "ComputeWeaknessProcessor start",
  "V8.GC_SCAVENGER_BACKGROUND_TRACED_HANDLES_RESET_PARALLEL",
  "V8.GC_BACKGROUND_UNPARK",
  "V8.GC_SCAVENGER_SCAVENGE_UPDATE_REFS",
  "RunTask",
  "Commit",
  "UpdateLayer",
  "RasterTask",
  "layerId",
  "PipelineReporter",
  "BeginImplFrameToSendBeginMainFrame",
  "SendBeginMainFrameToCommit",
  "EndCommitToActivation",
  "Activation",
  "EndActivateToSubmitCompositorFrame",
  "SubmitCompositorFrameToPresentationCompositorFrame",
  "SubmitToReceiveCompositorFrame",
  "ReceiveCompositorFrameToStartDraw",
  "StartDrawToSwapStart",
  "BufferAvailableToBufferReady",
  "BufferReadyToLatch",
  "LatchToSwapEnd",
  "SwapEndToPresentationCompositorFrame",
  "BackgroundProcessor::MaybeStartProcessingResponse",
  "BackgroundProcessor::OnDataPipeReadable",
  "BackgroundProcessor::TryStartStreamingTask",
  "BackgroundProcessor::RunScriptStreamingTask",
  "BackgroundProcessor::OnFinishStreaming",
]);

const MAIN_THREAD_NAME = "CrRendererMain";

export function processTrace(traceEvents: TraceEvent[]): ProcessedTrace {
  let mainThreadPID = null;
  for (const evt of traceEvents) {
    if (evt.args?.name === MAIN_THREAD_NAME) {
      mainThreadPID = evt.pid;
    }
  }

  const groupedTraceEvents: Record<string, ProcessedTraceEvent> = {};
  const filteredTraceEvents: Array<TraceEvent> = [];
  for (const evt of traceEvents) {
    if (evt.name.startsWith("URL:") && evt.cat === "navigation") {
      continue;
    }

    if (IGNORED_EVENT_PH.has(evt.ph)) {
      continue;
    }

    if (IGNORED_EVENT_NAMES.has(evt.name)) {
      continue;
    }

    if (evt.pid !== mainThreadPID) {
      continue;
    }

    const id = getUniqueEventKey(evt);
    if (!id) {
      console.log(evt);
      continue;
    }

    filteredTraceEvents.push(evt);

    groupedTraceEvents[id] = groupedTraceEvents[id] ?? {
      id,
      name: evt.name,
      originalEvents: [],
    };
    groupedTraceEvents[id].originalEvents.push(evt);
  }

  return {
    grouped: groupedTraceEvents,
    filtered: filteredTraceEvents,
  };
}
