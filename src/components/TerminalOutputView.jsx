import { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Play, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Wifi, 
  CornerDownLeft, 
  RotateCcw,
  Sparkles,
  Loader2
} from 'lucide-react';
import { generateSimulatedCliOutput } from '../utils/envHelper';

export default function TerminalOutputView({
  envType = 'powershell',
  command = '',
  executionResult = null,
  title = 'Command Output Terminal'
}) {
  const isPowerShell = envType === 'powershell';
  const promptSymbol = isPowerShell ? 'PS C:\\POS\\Support\\Diagnostics> ' : 'pos-admin@edge-gw-01:~$ ';
  const windowTitle = isPowerShell 
    ? 'Windows PowerShell (x64) - Elevation: RunAs (Admin)' 
    : 'Network Diagnostics Shell (ICMP / TCP Socket Gateway)';

  // Streaming State for Live Real-Time Terminal Log Execution
  const [streamedLines, setStreamedLines] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState(null);
  
  // Interactive Terminal In-Console Input
  const [inlineInput, setInlineInput] = useState('');
  const [interactiveHistory, setInteractiveHistory] = useState([]);
  
  const terminalEndRef = useRef(null);
  const streamTimerRef = useRef(null);

  // Trigger live real-time line-by-line streaming when executionResult arrives
  useEffect(() => {
    if (!executionResult) {
      setStreamedLines([]);
      setIsStreaming(false);
      return;
    }

    const targetLines = executionResult.cliOutput?.stdout || [
      `Command: ${command || 'Executed'}`,
      `Status: ${executionResult.isCorrect ? 'SUCCESS (0)' : 'FAILED / NEEDS REVIEW (1)'}`,
      `Feedback: ${executionResult.feedback || 'Command execution finished.'}`
    ];

    // Clear previous timer
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }

    setStreamedLines([]);
    setIsStreaming(true);
    setActiveTelemetry(null);

    let currentIndex = 0;
    const intervalMs = isPowerShell ? 240 : 280;

    streamTimerRef.current = setInterval(() => {
      if (currentIndex < targetLines.length) {
        const nextLine = targetLines[currentIndex];
        setStreamedLines(prev => [...prev, nextLine]);
        currentIndex++;
      } else {
        clearInterval(streamTimerRef.current);
        setIsStreaming(false);
        setActiveTelemetry(executionResult.cliOutput?.rawTelemetry || null);
      }
    }, intervalMs);

    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [executionResult, command, isPowerShell]);

  // Auto-scroll terminal to bottom as lines stream in
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [streamedLines, isStreaming, interactiveHistory]);

  // Handle ad-hoc in-terminal interactive command submission
  const handleInlineCommandSubmit = (e) => {
    e.preventDefault();
    const clean = inlineInput.trim();
    if (!clean) return;

    if (clean.toLowerCase() === 'cls' || clean.toLowerCase() === 'clear') {
      setInteractiveHistory([]);
      setStreamedLines([]);
      setInlineInput('');
      return;
    }

    // Generate real-time simulated CLI execution for user's inline command
    const simulated = generateSimulatedCliOutput(envType, clean, true, {});
    const logBatch = [
      { type: 'prompt', text: `${promptSymbol}${clean}` },
      ...simulated.stdout.map(line => ({ type: 'output', text: line }))
    ];

    setInteractiveHistory(prev => [...prev, ...logBatch]);
    setInlineInput('');
  };

  const isSuccess = executionResult?.isCorrect;
  const hasError = executionResult?.error || (executionResult && !isSuccess && executionResult?.cliOutput?.exitCode !== 0);

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl font-mono text-xs">
      {/* Top Terminal Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-slate-300 select-none shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] text-slate-400 ml-2 font-medium truncate">
            {windowTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          {isStreaming ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800 animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-sky-400" />
              <span>STREAMING PID: {isPowerShell ? '4892' : '1024'}...</span>
            </span>
          ) : executionResult ? (
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Exit Code: <strong className={isSuccess ? 'text-emerald-400' : 'text-rose-400'}>{executionResult.cliOutput?.exitCode ?? (isSuccess ? 0 : 1)}</strong>
            </span>
          ) : (
            <span className="text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Ready
            </span>
          )}

          {executionResult?.executionTimeMs !== undefined && (
            <span className="text-slate-400">
              {executionResult.executionTimeMs}ms
            </span>
          )}
        </div>
      </div>

      {/* Terminal Screen Body with Real-Time Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950 text-slate-200">
        
        {/* If no command run yet, show welcoming terminal idle banner */}
        {!executionResult && interactiveHistory.length === 0 && (
          <div className="py-8 px-4 rounded-xl border border-slate-900 bg-slate-900/40 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-sky-400 mb-3 shadow-inner">
              {isPowerShell ? <Terminal className="w-6 h-6" /> : <Wifi className="w-6 h-6" />}
            </div>
            <h4 className="text-slate-200 font-semibold text-sm mb-1">
              {isPowerShell ? 'PowerShell Live Console Ready' : 'Network Diagnostics Gateway Ready'}
            </h4>
            <p className="text-slate-400 max-w-sm mb-3 leading-relaxed text-[11px]">
              {isPowerShell 
                ? 'Type your PowerShell cmdlets (e.g. Restart-Service, Get-Service, Test-NetConnection) in the editor or CLI prompt below.'
                : 'Run live network diagnostics (e.g. ping -n 4 10.101.0.1, Test-NetConnection, tracert) to see real-time packet traces.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(isPowerShell 
                ? ['Restart-Service -Name W3SVC -Force', 'Get-Service -Name "POS*"', 'Get-Process']
                : ['ping -n 4 10.101.0.1', 'Test-NetConnection -ComputerName 10.101.0.5 -Port 8080', 'tracert 10.101.0.254']
              ).map(sampleCmd => (
                <button
                  key={sampleCmd}
                  onClick={() => {
                    setInlineInput(sampleCmd);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 text-[10px] transition-colors"
                >
                  {sampleCmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Executed Assessment Command Prompt Echo */}
        {executionResult && (
          <div className="space-y-2">
            <div className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-sky-400 font-bold select-none shrink-0">
                {promptSymbol}
              </span>
              <span className="text-white font-semibold break-all">
                {command || '# No command provided'}
              </span>
            </div>

            {/* Live Streaming Stdout Buffer */}
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1 text-slate-300 shadow-inner">
              {streamedLines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`leading-relaxed whitespace-pre-wrap animate-in fade-in duration-100 ${
                    line.toLowerCase().includes('error') || line.toLowerCase().includes('failed')
                      ? 'text-rose-300 font-semibold'
                      : line.toLowerCase().includes('running') || line.toLowerCase().includes('success') || line.toLowerCase().includes('succeeded') || line.toLowerCase().includes('http 200')
                      ? 'text-emerald-300'
                      : line.startsWith('Status') || line.startsWith('ComputerName') || line.startsWith('Pinging') || line.startsWith('Tracing') || line.startsWith('NPM(K)')
                      ? 'text-sky-300 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))}

              {/* Streaming Cursor Beacon */}
              {isStreaming && (
                <div className="flex items-center gap-1.5 text-sky-400 pt-1">
                  <span className="inline-block w-2 h-4 bg-sky-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400">Receiving socket response stream...</span>
                </div>
              )}
            </div>

            {/* Telemetry Metrics Grid (Appears when stream finishes) */}
            {!isStreaming && activeTelemetry && Object.keys(activeTelemetry).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 animate-in fade-in duration-200">
                {Object.entries(activeTelemetry).map(([key, val]) => (
                  <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px]">
                    <div className="text-slate-400 uppercase tracking-wider">{key}</div>
                    <div className="font-bold text-sky-300 truncate mt-0.5">{String(val)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* AI & Verification Diagnostic Note */}
            {!isStreaming && (
              <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                isSuccess 
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                  : hasError 
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}>
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : hasError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <span className="font-bold block text-[11px]">
                    {isSuccess ? 'Resolution Verified' : hasError ? 'Execution Error / Discrepancy' : 'Verification Incomplete'}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    {executionResult.feedback || (isSuccess ? 'Cmdlet output conforms to standard troubleshooting SOP.' : 'Verify target parameters and syntax.')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ad-Hoc Interactive CLI Session History */}
        {interactiveHistory.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === 'prompt' ? (
              <div className="text-sky-300 font-semibold pt-1">{item.text}</div>
            ) : (
              <div className="text-slate-300 pl-2 text-[11px] whitespace-pre-wrap">{item.text}</div>
            )}
          </div>
        ))}

        <div ref={terminalEndRef} />
      </div>

      {/* Interactive In-Terminal CLI Command Prompt Bar */}
      <form 
        onSubmit={handleInlineCommandSubmit}
        className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
      >
        <span className="text-sky-400 font-bold select-none text-xs hidden sm:inline">
          {isPowerShell ? 'PS>' : '$'}
        </span>
        
        <input
          type="text"
          value={inlineInput}
          onChange={(e) => setInlineInput(e.target.value)}
          placeholder={
            isPowerShell 
              ? 'Run live cmdlet (e.g. Restart-Service, Get-Process, ping, cls)...' 
              : 'Run live diagnostic (e.g. ping -n 4 10.101.0.1, Test-NetConnection, tracert)...'
          }
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-sky-500 placeholder:text-slate-600"
        />

        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-1 transition-colors active:scale-95 shadow"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
}
