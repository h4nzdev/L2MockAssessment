import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Terminal,
  Activity,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Wifi,
  Cpu,
  Server,
  ArrowRight,
  ArrowLeft,
  ArrowUpDown,
  Search,
  Filter,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Send,
  HelpCircle,
  ShieldAlert,
  FileText,
  Zap,
  ChevronRight,
  BarChart3,
  Flame,
  Award,
  BookOpen,
  Eye,
  Info,
  Bell,
  Volume2,
  VolumeX,
  PlusCircle,
  Radio,
  X,
  Timer,
  Lightbulb,
  Code2,
  Key
} from 'lucide-react';
import alasql from 'alasql';
import { triageDrillSets, mockIncidentTickets, generateRandomIncident } from '../data/mockTickets';
import { ensureAlaSqlDatabase } from '../data/mockDatabase';
import ResultTable from '../components/ResultTable';
import ThemeToggle from '../components/ThemeToggle';
import ssquelLogo from '../assets/ssquel.png';

export default function SimulatorPage() {
  const navigate = useNavigate();

  // Mode Selection: 'queue' | 'triage'
  const [activeMode, setActiveMode] = useState('queue');

  // ==========================================
  // MODE 1: TRIAGE DRILL STATE
  // ==========================================
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const currentDrill = triageDrillSets[currentDrillIndex] || triageDrillSets[0];
  const [triageRankings, setTriageRankings] = useState({});
  const [triageSubmitted, setTriageSubmitted] = useState(false);
  const [triageScore, setTriageScore] = useState(null);

  const handleAssignRank = (ticketId, rank) => {
    if (triageSubmitted) return;
    setTriageRankings(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (next[k] === rank) delete next[k];
      });
      next[ticketId] = rank;
      return next;
    });
  };

  const handleSubmitTriage = () => {
    const tickets = currentDrill.tickets;
    let correctCount = 0;
    tickets.forEach(t => {
      if (triageRankings[t.id] === t.correctRank) correctCount++;
    });

    const scorePct = Math.round((correctCount / tickets.length) * 100);
    setTriageScore(scorePct);
    setTriageSubmitted(true);
  };

  const handleNextDrill = () => {
    setTriageRankings({});
    setTriageSubmitted(false);
    setTriageScore(null);
    setCurrentDrillIndex(prev => (prev + 1) % triageDrillSets.length);
  };

  // ==========================================
  // MODE 2: LIVE TICKET QUEUE & HANDS-ON WORKSPACE
  // ==========================================
  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('ssequel_simulator_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return mockIncidentTickets.slice(0, 4).map(t => ({
      ...t,
      status: 'OPEN',
      remainingSeconds: t.slaMinutes * 60,
      slaBreached: false,
      runDiagnostics: [],
      userCode: t.starterCode || '',
      executionResult: null
    }));
  });

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterDiscipline, setFilterDiscipline] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Real-time Incident Influx Stream state
  const [isAutoStreamActive, setIsAutoStreamActive] = useState(true);
  const [streamInterval, setStreamInterval] = useState(60); // In seconds
  const [countdownToNext, setCountdownToNext] = useState(60);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [newIncidentAlert, setNewIncidentAlert] = useState(null);

  // Active ticket in workspace
  const activeTicket = tickets.find(t => t.id === selectedTicketId) || null;

  // Active user code in editor
  const [currentCode, setCurrentCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedLog, setCopiedLog] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);

  const handleCopySolution = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const handleCopyTerminalLog = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  // Sync editor with active ticket
  useEffect(() => {
    if (activeTicket) {
      setCurrentCode(activeTicket.userCode || activeTicket.starterCode || '');
      setShowHint(false);
    }
  }, [selectedTicketId]);

  // Audio synthesizer tone for incoming tickets (Web Audio API)
  const playIncidentAlertBeep = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, ctx.currentTime);
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // ignore
    }
  };

  const playSuccessChime = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  };

  // Spawn dynamic incident ticket
  const spawnIncomingIncident = (customToast = true) => {
    const newTicket = generateRandomIncident();
    setTickets(prev => [newTicket, ...prev]);
    if (customToast) {
      setNewIncidentAlert({
        ticket: newTicket,
        timestamp: new Date().toLocaleTimeString()
      });
      playIncidentAlertBeep();
    }
    setCountdownToNext(streamInterval || 60);
  };

  // Countdown timer for automatic ticket stream
  useEffect(() => {
    if (!isAutoStreamActive || streamInterval === 0) return;

    const streamTimer = setInterval(() => {
      setCountdownToNext(prev => {
        if (prev <= 1) {
          spawnIncomingIncident(true);
          return streamInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(streamTimer);
  }, [isAutoStreamActive, streamInterval, isSoundMuted]);

  // Auto-dismiss floating alert toast
  useEffect(() => {
    if (!newIncidentAlert) return;
    const timeout = setTimeout(() => {
      setNewIncidentAlert(null);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [newIncidentAlert]);

  // SLA countdown timer
  useEffect(() => {
    const slaTimer = setInterval(() => {
      setTickets(prevTickets =>
        prevTickets.map(ticket => {
          if (ticket.status === 'RESOLVED' || ticket.status === 'ESCALATED') {
            return ticket;
          }
          const nextSec = Math.max(0, ticket.remainingSeconds - 1);
          return {
            ...ticket,
            remainingSeconds: nextSec,
            slaBreached: nextSec === 0
          };
        })
      );
    }, 1000);

    return () => clearInterval(slaTimer);
  }, []);

  // Save tickets state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ssequel_simulator_tickets', JSON.stringify(tickets));
    } catch {
      // ignore
    }
  }, [tickets]);

  // Run a diagnostic check
  const handleRunDiagnostic = (checkId) => {
    if (!activeTicket) return;
    setTickets(prev =>
      prev.map(t => {
        if (t.id === activeTicket.id) {
          const exists = (t.runDiagnostics || []).includes(checkId);
          return {
            ...t,
            status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status,
            runDiagnostics: exists ? t.runDiagnostics : [...t.runDiagnostics, checkId]
          };
        }
        return t;
      })
    );
  };

  // ==========================================
  // HANDS-ON FIX EXECUTION ENGINE
  // ==========================================
  const handleExecuteUserFix = () => {
    if (!activeTicket || !currentCode.trim()) return;

    setIsExecuting(true);
    const trimmedCode = currentCode.trim();
    const env = activeTicket.envType; // 'sql' or 'powershell'

    setTimeout(() => {
      setIsExecuting(false);
      let isCorrect = false;
      let outputPayload = null;
      let errorMessage = null;

      if (env === 'sql') {
        try {
          ensureAlaSqlDatabase();
          // Synthesize necessary helper tables if needed
          try {
            alasql(`CREATE TABLE IF NOT EXISTS Transactions (transaction_id INT, store_id INT, terminal_id STRING, amount FLOAT, status STRING);`);
            alasql(`CREATE TABLE IF NOT EXISTS SystemLocks (lock_id STRING, table_name STRING, lock_type STRING, acquired_by_pid INT, created_at STRING);`);
            alasql(`CREATE TABLE IF NOT EXISTS Terminals (terminal_id STRING, store_id INT, model STRING, status STRING, last_ping STRING);`);
          } catch {
            // ignore table creation if exists
          }

          // Execute query
          const result = alasql(trimmedCode);
          outputPayload = result;

          // Validate correctness
          const lower = trimmedCode.toLowerCase();
          const hasKeywords = (activeTicket.validationKeywords || []).every(kw => lower.includes(kw.toLowerCase()));
          const matchesRegex = (activeTicket.validationRegex || []).every(rgx => rgx.test(trimmedCode));

          if (hasKeywords || matchesRegex) {
            isCorrect = true;
          } else {
            isCorrect = false;
            errorMessage = "SQL query executed successfully, but it did not satisfy the incident objective. Check column names and WHERE filter conditions.";
          }
        } catch (err) {
          isCorrect = false;
          errorMessage = `SQL Execution Error: ${err.message || String(err)}`;
        }
      } else {
        // PowerShell Execution Simulation
        const lower = trimmedCode.toLowerCase();
        const hasKeywords = (activeTicket.validationKeywords || []).every(kw => lower.includes(kw.toLowerCase()));
        const matchesRegex = (activeTicket.validationRegex || []).every(rgx => rgx.test(trimmedCode));

        const timestamp = new Date().toLocaleTimeString();

        if (hasKeywords || matchesRegex) {
          isCorrect = true;
          outputPayload = [
            `[${timestamp}] PS C:\\POS\\System> ${trimmedCode}`,
            `[${timestamp}] [SUCCESS] Command dispatched to local host controller.`,
            `[${timestamp}] Target resource state updated successfully. Exit code: 0`
          ];
        } else {
          isCorrect = false;
          outputPayload = [
            `[${timestamp}] PS C:\\POS\\System> ${trimmedCode}`,
            `[${timestamp}] [ERROR] Cmdlet syntax error or incorrect parameters for this incident.`,
            `[${timestamp}] Review the Incident Objective and verify cmdlet name, -Name, and -Force flags.`
          ];
          errorMessage = "PowerShell command did not resolve the incident objective. Check cmdlet spelling and parameters.";
        }
      }

      const execResult = {
        isCorrect,
        outputPayload,
        errorMessage,
        executedAt: new Date().toLocaleTimeString(),
        explanation: activeTicket.verificationExplanation
      };

      if (isCorrect) {
        playSuccessChime();
      }

      setTickets(prev =>
        prev.map(t => {
          if (t.id === activeTicket.id) {
            return {
              ...t,
              status: isCorrect ? 'RESOLVED' : 'IN_PROGRESS',
              userCode: currentCode,
              executionResult: execResult
            };
          }
          return t;
        })
      );
    }, 450);
  };

  // Keyboard shortcut Ctrl + Enter to run
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecuteUserFix();
    }
  };

  const handleInsertSnippet = (snippet) => {
    setCurrentCode(prev => prev ? `${prev} ${snippet}` : snippet);
  };

  const handleResetSimulator = () => {
    if (window.confirm('Reset all ticket statuses, timers, and diagnostic logs to initial state?')) {
      const freshTickets = mockIncidentTickets.slice(0, 4).map(t => ({
        ...t,
        status: 'OPEN',
        remainingSeconds: t.slaMinutes * 60,
        slaBreached: false,
        runDiagnostics: [],
        userCode: t.starterCode || '',
        executionResult: null
      }));
      setTickets(freshTickets);
      setSelectedTicketId(null);
      setCountdownToNext(streamInterval || 60);
      localStorage.removeItem('ssequel_simulator_tickets');
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // KPI calculations
  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const breachedCount = tickets.filter(t => t.slaBreached && t.status !== 'RESOLVED').length;
  const slaCompliance = totalTickets > 0 ? Math.round(((totalTickets - breachedCount) / totalTickets) * 100) : 100;

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.storeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || t.severity.toUpperCase() === filterSeverity;
    const matchesDiscipline = filterDiscipline === 'ALL' || t.envType === filterDiscipline;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesDiscipline && matchesStatus;
  });

  return (
    <div className="min-h-screen theme-bg text-[var(--text-primary)] flex flex-col selection:bg-blue-400/30 font-sans relative">
      {/* ── Floating Real-time Incident Arrival Alert Toast ──── */}
      {newIncidentAlert && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full bg-slate-950 border-2 border-rose-500/80 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300 backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="relative flex h-3 w-3 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-mono font-bold border border-rose-800">
                    🚨 LIVE INCIDENT POPUP
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800">
                    {newIncidentAlert.ticket.envType.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">
                  {newIncidentAlert.ticket.title}
                </h4>
                <p className="text-[11px] text-sky-300 font-mono">
                  {newIncidentAlert.ticket.storeName} • {newIncidentAlert.ticket.id}
                </p>
              </div>
            </div>

            <button
              onClick={() => setNewIncidentAlert(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">
              SLA: {newIncidentAlert.ticket.slaMinutes}m countdown
            </span>
            <button
              onClick={() => {
                setSelectedTicketId(newIncidentAlert.ticket.id);
                setNewIncidentAlert(null);
                setActiveMode('queue');
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <span>Implement Fix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="border-b theme-border bg-[var(--bg-header)] backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={ssquelLogo}
              alt="SSEQUEL Logo"
              className="w-10 h-10 rounded-xl object-contain"
            />
            <div>
              <span className="font-bold text-base tracking-tight theme-text flex items-center gap-1.5">
                SSEQUEL{' '}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-sky-300 dark:border-blue-800/60">
                  Hands-On L2 Simulator
                </span>
              </span>
              <p className="text-[11px] theme-text-muted -mt-0.5">
                Apply Your Own SQL &amp; PowerShell Fixes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-sm active:scale-95
                border-blue-200 bg-white hover:bg-blue-50 text-blue-700
                dark:border-blue-800/60 dark:bg-blue-950/50 dark:hover:bg-blue-900/40 dark:text-sky-300"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
              <span className="hidden sm:inline">Assessment Bank</span>
              <span className="sm:hidden">Bank</span>
            </button>

            <button
              onClick={() => navigate('/documentation')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-sm active:scale-95
                border-blue-200 bg-white hover:bg-blue-50 text-blue-700
                dark:border-blue-800/60 dark:bg-blue-950/50 dark:hover:bg-blue-900/40 dark:text-sky-300"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Runbooks</span>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Subheader / Mode Switcher & Stream Controls ───────── */}
      <div className="border-b theme-border-m bg-[var(--bg-surface2)] px-4 py-3">
        <div className="max-w-[1720px] mx-auto px-0 sm:px-2 lg:px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-sky-400">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold theme-text flex items-center gap-2">
                Hands-On SQL &amp; PowerShell Troubleshooting Simulator
              </h1>
              <p className="text-[11px] theme-text-muted">
                Write real SQL statements and PowerShell cmdlets to resolve incoming store incidents before SLA breach.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center p-1 rounded-xl bg-[var(--bg-base)] border theme-border-m text-xs font-mono">
              <button
                onClick={() => {
                  setActiveMode('queue');
                  setSelectedTicketId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'queue'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                    : 'theme-text-muted hover:theme-text-sec'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Active Queue ({openCount})</span>
              </button>

              <button
                onClick={() => {
                  setActiveMode('triage');
                  setSelectedTicketId(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeMode === 'triage'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                    : 'theme-text-muted hover:theme-text-sec'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Triage Drill</span>
              </button>
            </div>

            {activeMode === 'queue' && (
              <button
                onClick={handleResetSimulator}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-xs theme-text-muted hover:theme-text-sec transition-all active:scale-95"
                title="Reset simulation data"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Body ─────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* ========================================================= */}
        {/* MODE 1: TRIAGE CHALLENGE DRILL                            */}
        {/* ========================================================= */}
        {activeMode === 'triage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b theme-border-m pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-xs font-mono font-bold">
                      DRILL ROUND {currentDrillIndex + 1} OF {triageDrillSets.length}
                    </span>
                    <h2 className="text-lg font-bold theme-text">
                      {currentDrill.title}
                    </h2>
                  </div>
                  <p className="text-xs theme-text-muted mt-1.5 leading-relaxed">
                    {currentDrill.context}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleNextDrill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-all shadow-md"
                  >
                    <span>Next Drill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Incoming Tickets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {currentDrill.tickets.map((ticket) => {
                const assignedRank = triageRankings[ticket.id];
                const isCorrect = triageSubmitted && assignedRank === ticket.correctRank;

                return (
                  <div
                    key={ticket.id}
                    className={`flex flex-col rounded-2xl border transition-all shadow-md overflow-hidden bg-[var(--bg-surface)] ${
                      triageSubmitted
                        ? isCorrect
                          ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                          : 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20'
                        : assignedRank
                          ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20'
                          : 'theme-border hover:border-blue-300'
                    }`}
                  >
                    <div className="p-4 border-b theme-border-m bg-[var(--bg-surface2)] flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-sky-300">
                        {ticket.id}
                      </span>
                      {assignedRank && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-600 text-white">
                          PRIORITY {assignedRank}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-sm theme-text leading-snug">
                          {ticket.title}
                        </h3>
                        <p className="text-xs theme-text-sec">
                          {ticket.impactDescription}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t theme-border-m">
                        {[1, 2, 3].map((rankNum) => (
                          <button
                            key={rankNum}
                            onClick={() => handleAssignRank(ticket.id, rankNum)}
                            disabled={triageSubmitted}
                            className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                              assignedRank === rankNum
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-[var(--bg-surface2)] theme-text-sec border theme-border-m'
                            }`}
                          >
                            <span>P{rankNum}</span>
                          </button>
                        ))}
                      </div>

                      {triageSubmitted && (
                        <div className={`p-3 rounded-xl border text-xs ${
                          isCorrect ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20' : 'border-rose-500 text-rose-300 bg-rose-950/20'
                        }`}>
                          <p className="font-bold font-mono">
                            {isCorrect ? `CORRECT (P${ticket.correctRank})` : `SHOULD BE P${ticket.correctRank}`}
                          </p>
                          <p className="text-[11px] mt-1">{ticket.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] flex justify-end">
              {!triageSubmitted ? (
                <button
                  onClick={handleSubmitTriage}
                  disabled={Object.keys(triageRankings).length < 3}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold"
                >
                  Evaluate Rankings
                </button>
              ) : (
                <button
                  onClick={handleNextDrill}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold"
                >
                  Proceed to Next Drill
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: QUEUE VIEW (LIVE INCIDENT STREAM)                 */}
        {/* ========================================================= */}
        {activeMode === 'queue' && !selectedTicketId && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Incident Stream Banner & Controls */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs theme-text uppercase font-mono tracking-wide">
                      Live Incident Simulation Stream
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      STREAM ACTIVE
                    </span>
                  </div>
                  <p className="text-[11px] theme-text-muted mt-0.5">
                    {isAutoStreamActive
                      ? `New store incidents automatically arrive every ${streamInterval}s.`
                      : 'Auto-stream paused. Trigger incidents manually.'}
                  </p>
                </div>
              </div>

              {/* Stream Settings & Quick Trigger */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 text-xs font-mono bg-[var(--bg-surface)] px-3 py-1.5 rounded-xl border theme-border-m shadow-inner">
                  <Timer className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-slate-400 text-[11px]">Interval:</span>
                  <select
                    value={streamInterval}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStreamInterval(val);
                      setCountdownToNext(val);
                      setIsAutoStreamActive(val > 0);
                    }}
                    className="bg-transparent theme-text font-bold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value={30} className="bg-slate-900 text-white">Every 30s (Rapid)</option>
                    <option value={60} className="bg-slate-900 text-white">Every 1 min (Standard)</option>
                    <option value={90} className="bg-slate-900 text-white">Every 1.5 min</option>
                    <option value={120} className="bg-slate-900 text-white">Every 2 min</option>
                    <option value={0} className="bg-slate-900 text-white">Manual Trigger Only</option>
                  </select>
                </div>

                {isAutoStreamActive && streamInterval > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700/60 text-blue-800 dark:text-sky-300 text-xs font-mono font-bold shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                    </span>
                    <span>Next: {countdownToNext}s</span>
                  </div>
                )}

                <button
                  onClick={() => setIsSoundMuted(!isSoundMuted)}
                  className="p-2 rounded-xl border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] theme-text-muted hover:theme-text transition-all"
                  title={isSoundMuted ? "Unmute sound" : "Mute sound"}
                >
                  {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => spawnIncomingIncident(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Spawn Incident Now</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Active Tickets</span>
                <span className="text-2xl font-bold font-mono theme-text mt-1 block">
                  {totalTickets}
                </span>
                <span className="text-[10px] text-blue-500 font-mono">Live Queue Buffer</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Open / In Progress</span>
                <span className="text-2xl font-bold font-mono text-amber-500 mt-1 block">
                  {openCount}
                </span>
                <span className="text-[10px] text-amber-500 font-mono">Requires Implementation</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Resolved</span>
                <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 block">
                  {resolvedCount}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">Fix Validated</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">SLA Compliance</span>
                <span className={`text-2xl font-bold font-mono mt-1 block ${
                  slaCompliance >= 90 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {slaCompliance}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {breachedCount > 0 ? `${breachedCount} breached` : '0 breaches'}
                </span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Store, Error..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <span className="text-xs font-mono text-slate-400">Discipline:</span>
                <select
                  value={filterDiscipline}
                  onChange={(e) => setFilterDiscipline(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text font-mono focus:outline-none"
                >
                  <option value="ALL">All (SQL &amp; PowerShell)</option>
                  <option value="sql">SQL Database Only</option>
                  <option value="powershell">PowerShell Only</option>
                </select>

                <span className="text-xs font-mono text-slate-400 ml-2">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text font-mono focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Ticket Queue List Table */}
            <div className="rounded-2xl border theme-border bg-[var(--bg-surface)] overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead className="bg-[var(--bg-surface2)] border-b theme-border-m font-mono text-[11px] theme-text-muted">
                    <tr>
                      <th className="py-3 px-4">Ticket ID</th>
                      <th className="py-3 px-4">Discipline</th>
                      <th className="py-3 px-4">Store Location &amp; Target</th>
                      <th className="py-3 px-4">Incident Summary</th>
                      <th className="py-3 px-4">SLA Clock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-muted)] theme-text-sec">
                    {filteredTickets.map((ticket) => {
                      const isBreached = ticket.slaBreached && ticket.status !== 'RESOLVED';

                      return (
                        <tr
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className="hover:bg-[var(--bg-surface2)] cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-sky-300">
                            {ticket.id}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              ticket.envType === 'sql'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300 border border-blue-300 dark:border-blue-800'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                            }`}>
                              {ticket.envType === 'sql' ? <Database className="w-3 h-3" /> : <Terminal className="w-3 h-3" />}
                              {ticket.envType === 'sql' ? 'SQL DATABASE' : 'POWERSHELL'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold theme-text text-xs">
                              {ticket.storeName}
                            </div>
                            <div className="text-[11px] theme-text-muted font-mono">
                              {ticket.terminalId}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="font-medium theme-text truncate">
                              {ticket.title}
                            </div>
                            <div className="text-[11px] theme-text-muted truncate">
                              {ticket.category}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            {ticket.status === 'RESOLVED' ? (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Met SLA
                              </span>
                            ) : (
                              <span className={`flex items-center gap-1 font-bold ${
                                isBreached ? 'text-rose-500 animate-pulse' : 'text-sky-400'
                              }`}>
                                <Clock className="w-3.5 h-3.5" />
                                {formatTimer(ticket.remainingSeconds)}
                                {isBreached && <span className="text-[9px] uppercase font-mono px-1 rounded bg-rose-950 text-rose-300 ml-1">BREACHED</span>}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              ticket.status === 'RESOLVED'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : ticket.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300 border border-blue-300 dark:border-blue-800'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border theme-border-m'
                            }`}>
                              {ticket.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicketId(ticket.id);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold shadow-sm transition-all active:scale-95"
                            >
                              <span>Write Fix</span>
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: HANDS-ON INTERACTIVE TROUBLESHOOTING WORKBENCH     */}
        {/* ========================================================= */}
        {activeMode === 'queue' && activeTicket && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Ribbon */}
            <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTicketId(null)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border theme-border-m bg-[var(--bg-surface2)] hover:bg-[var(--bg-base)] text-xs font-mono theme-text transition-all active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Queue</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-blue-600 dark:text-sky-300">
                    {activeTicket.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    activeTicket.envType === 'sql'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300 border border-blue-300 dark:border-blue-800'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                  }`}>
                    {activeTicket.envType === 'sql' ? 'SQL FIX' : 'POWERSHELL FIX'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-semibold">
                    {activeTicket.severity}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">SLA Clock:</span>
                  <span className={`font-bold ${
                    activeTicket.status === 'RESOLVED' ? 'text-emerald-400' :
                    activeTicket.slaBreached ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                  }`}>
                    {activeTicket.status === 'RESOLVED' ? 'RESOLVED' : formatTimer(activeTicket.remainingSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Split Screen Grid: Left Side Detailed Docs / Right Side Enlarged Compiler */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ── LEFT PANEL: Comprehensive Enterprise L2 ITSM Ticket Dossier (Scrollable / Sticky) ── */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-4 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                {/* 1. Troubleshooting Objective Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-blue-500/50 bg-blue-500/10 dark:bg-blue-950/30 shadow-md space-y-2.5">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-sky-300">
                    <TargetIcon className="w-4 h-4 text-blue-500 shrink-0" />
                    <h3 className="font-bold text-xs uppercase font-mono tracking-wide">
                      Level 2 Incident Resolution Objective
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm theme-text font-medium leading-relaxed">
                    {activeTicket.incidentObjective}
                  </p>
                </div>

                {/* 2. Enterprise Incident Metadata & Asset Ribbon */}
                <div className="p-5 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-md space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-sky-300 border border-blue-300 dark:border-blue-800">
                        {activeTicket.category}
                      </span>
                      <span className="text-xs theme-text-muted font-mono">
                        Opened {activeTicket.openedAt}
                      </span>
                    </div>
                    <h4 className="font-bold text-base sm:text-lg theme-text leading-snug">
                      {activeTicket.title}
                    </h4>
                  </div>

                  {/* Asset & Topology Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--bg-base)] border theme-border-m text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-0.5">
                        Target Host / Asset:
                      </span>
                      <span className="font-mono font-semibold theme-text text-xs break-all">
                        {activeTicket.affectedHost || activeTicket.terminalId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-0.5">
                        Affected Service / Layer:
                      </span>
                      <span className="font-mono font-semibold theme-text text-xs break-all">
                        {activeTicket.affectedService || activeTicket.terminalModel}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-0.5">
                        Reported By / Source:
                      </span>
                      <span className="theme-text-sec text-xs font-medium">
                        {activeTicket.reportedBy}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-0.5">
                        Store Facility:
                      </span>
                      <span className="theme-text-sec text-xs font-medium">
                        {activeTicket.storeName} ({activeTicket.city})
                      </span>
                    </div>
                  </div>

                  {/* Business Impact / Revenue Risk Alert */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-xs uppercase">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Business Impact &amp; Revenue Risk</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed text-xs">
                      {activeTicket.businessImpact || activeTicket.customerStatement}
                    </p>
                  </div>

                  {/* L2 Incident Narrative */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      Detailed Incident Narrative &amp; Root Cause Analysis:
                    </span>
                    <p className="text-xs sm:text-sm theme-text-sec leading-relaxed">
                      {activeTicket.incidentNarrative || activeTicket.customerStatement}
                    </p>
                  </div>

                  {/* L1 Triage Notes */}
                  {activeTicket.l1TriageNotes && (
                    <div className="p-3.5 rounded-xl bg-[var(--bg-surface2)] border theme-border-m text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-400 block">
                        Level 1 Initial Triage Escalation Notes:
                      </span>
                      <p className="text-slate-300 italic text-xs leading-relaxed">
                        "{activeTicket.l1TriageNotes}"
                      </p>
                    </div>
                  )}

                  {/* Incident Event Timeline */}
                  {activeTicket.timeline && activeTicket.timeline.length > 0 && (
                    <div className="space-y-2 pt-2 border-t theme-border-m">
                      <span className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        Incident Event Timeline Sequence:
                      </span>
                      <div className="space-y-2.5 pl-2 border-l-2 border-blue-500/30">
                        {activeTicket.timeline.map((event, idx) => (
                          <div key={idx} className="relative pl-3 text-xs">
                            <span className="absolute -left-[11px] top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                            <p className="theme-text-sec text-xs leading-snug">
                              {event}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Raw Diagnostic Log / Stack Trace */}
                {activeTicket.terminalLogs && (
                  <div className="p-4 rounded-2xl border theme-border bg-slate-950 text-slate-200 shadow-md space-y-2 font-mono">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-1.5 text-xs text-sky-400 font-bold">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>System Diagnostic Stack Trace</span>
                      </div>
                      <button
                        onClick={() => handleCopyTerminalLog(activeTicket.terminalLogs)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLog ? 'Copied' : 'Copy Logs'}</span>
                      </button>
                    </div>
                    <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-56 select-all font-mono">
                      {activeTicket.terminalLogs}
                    </pre>
                  </div>
                )}

                {/* 4. Diagnostic Telemetry Probes */}
                <div className="p-4 sm:p-5 rounded-2xl border theme-border bg-[var(--bg-surface)] space-y-3.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold theme-text uppercase font-mono">
                      Live Telemetry Probes
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {(activeTicket.runDiagnostics || []).length} / {(activeTicket.diagnosticChecks || []).length} Probes Executed
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {(activeTicket.diagnosticChecks || []).map(diag => {
                      const isRun = (activeTicket.runDiagnostics || []).includes(diag.id);

                      return (
                        <div key={diag.id} className="p-3.5 rounded-xl border theme-border-m bg-[var(--bg-base)] space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-mono font-bold theme-text">
                              {diag.name}
                            </span>
                            <button
                              onClick={() => handleRunDiagnostic(diag.id)}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold shadow-sm transition-all active:scale-95 shrink-0"
                            >
                              {isRun ? 'Re-run' : 'Inspect'}
                            </button>
                          </div>

                          <div className="font-mono text-xs text-slate-400 bg-[var(--bg-surface)] p-2 rounded-lg border theme-border-m overflow-x-auto">
                            $ {diag.command}
                          </div>

                          {isRun && (
                            <div className="p-2.5 rounded-lg font-mono text-xs bg-slate-950 text-sky-300 border border-slate-800 leading-relaxed">
                              {diag.output}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL: Enlarged Interactive Compiler & Code Execution Workbench ── */}
              <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-4 lg:sticky lg:top-20">
                {/* Editor Container */}
                <div className="rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-2xl overflow-hidden flex flex-col">
                  {/* Editor Header */}
                  <div className="px-5 py-3 bg-[var(--bg-surface2)] border-b theme-border-m flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2.5">
                      <Code2 className="w-5 h-5 text-blue-500" />
                      <span className="font-bold theme-text text-sm">
                        {activeTicket.envType === 'sql' ? 'Interactive SQL Query Editor' : 'PowerShell 7 CLI Console'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all text-xs font-mono font-bold shadow-sm active:scale-95 ${
                          showHint
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'theme-border-m bg-[var(--bg-surface)] text-amber-500 hover:bg-[var(--bg-base)]'
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>{showHint ? 'Hide Hints & Solution' : 'Show Hint & Solution'}</span>
                      </button>

                      <button
                        onClick={() => setCurrentCode(activeTicket.starterCode || '')}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-white border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] transition-all"
                        title="Reset code editor"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Hint Banner with Full Solution Answer & Quick-Insert */}
                  {showHint && activeTicket && (
                    <div className="p-4 sm:p-5 bg-amber-500/10 border-b border-amber-500/30 text-xs text-amber-200 space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
                        <span className="font-bold font-mono text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
                          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                          Technical Troubleshooting Guidance &amp; Solution:
                        </span>
                        {activeTicket.expectedSolution && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopySolution(activeTicket.expectedSolution)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                            >
                              {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedSolution ? 'Copied' : 'Copy Solution'}</span>
                            </button>
                            <button
                              onClick={() => setCurrentCode(activeTicket.expectedSolution)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Insert Solution to Editor</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {activeTicket.hints && activeTicket.hints.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block">
                            Key Diagnostic Pointers:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs leading-relaxed">
                            {activeTicket.hints.map((h, idx) => (
                              <li key={idx}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeTicket.expectedSolution && (
                        <div className="pt-2 border-t border-amber-500/20 space-y-2">
                          <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                            <Code2 className="w-4 h-4" />
                            Target Expected Solution Query / Cmdlet:
                          </span>
                          <div className="relative group">
                            <pre className="p-3.5 rounded-xl bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm border border-emerald-500/40 overflow-x-auto whitespace-pre-wrap select-all shadow-inner leading-relaxed">
                              {activeTicket.expectedSolution}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enlarged Code Textarea */}
                  <div className="p-5 bg-slate-950 font-mono text-sm">
                    <textarea
                      rows={14}
                      value={currentCode}
                      onChange={(e) => setCurrentCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={activeTicket.envType === 'sql' ? '-- Write your SQL fix statement here...\n-- Example: UPDATE Transactions SET status = ...;' : '# Write your PowerShell cmdlet here...\n# Example: Restart-Service -Name "..." -Force;'}
                      className="w-full bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none font-mono text-xs sm:text-sm leading-relaxed min-h-[260px] sm:min-h-[320px]"
                    />
                  </div>

                  {/* Quick Snippet Bar & Primary Action */}
                  <div className="px-5 py-3 bg-[var(--bg-surface2)] border-t theme-border-m flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                      <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">Snippets:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(activeTicket.envType === 'sql'
                          ? ['UPDATE', 'SET', 'WHERE', 'DELETE', 'SELECT', 'PRAGMA']
                          : ['Restart-Service', 'Stop-Process', '-Force', '-Name', 'Remove-Item', 'Get-Service']
                        ).map(snip => (
                          <button
                            key={snip}
                            onClick={() => handleInsertSnippet(snip)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] border theme-border-m text-xs font-mono theme-text-sec font-semibold transition-all active:scale-95"
                          >
                            {snip}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleExecuteUserFix}
                      disabled={isExecuting || !currentCode.trim()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-mono text-xs sm:text-sm font-bold shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      {isExecuting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                      <span>Execute &amp; Apply Fix</span>
                      <span className="text-[11px] opacity-75 hidden md:inline">(Ctrl+Enter)</span>
                    </button>
                  </div>
                </div>

                {/* Execution Output & Verification Results Card */}
                {activeTicket.executionResult && (
                  <div className={`p-5 rounded-2xl border shadow-xl space-y-3.5 animate-in fade-in duration-200 ${
                    activeTicket.executionResult.isCorrect
                      ? 'bg-emerald-950/30 border-emerald-500/70 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/70 text-rose-200'
                  }`}>
                    <div className="flex items-center justify-between border-b border-current/20 pb-2.5">
                      <div className="flex items-center gap-2 font-bold font-mono text-sm sm:text-base">
                        {activeTicket.executionResult.isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            <span>INCIDENT RESOLVED • L2 FIX APPLIED!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-rose-400" />
                            <span>EXECUTION ERROR / INCIDENT UNRESOLVED</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs font-mono opacity-80">
                        {activeTicket.executionResult.executedAt}
                      </span>
                    </div>

                    {/* Output Details */}
                    {activeTicket.executionResult.errorMessage && (
                      <p className="text-xs sm:text-sm font-mono text-rose-300 leading-relaxed">
                        {activeTicket.executionResult.errorMessage}
                      </p>
                    )}

                    {activeTicket.executionResult.outputPayload && Array.isArray(activeTicket.executionResult.outputPayload) && (
                      <div className="p-3.5 bg-slate-950 rounded-xl font-mono text-xs sm:text-sm space-y-1 text-slate-300 border border-slate-800 overflow-x-auto leading-relaxed">
                        {activeTicket.executionResult.outputPayload.map((line, i) => (
                          <div key={i}>{typeof line === 'object' ? JSON.stringify(line) : line}</div>
                        ))}
                      </div>
                    )}

                    {activeTicket.executionResult.isCorrect && (
                      <div className="p-4 bg-emerald-900/40 rounded-xl text-xs sm:text-sm space-y-1.5">
                        <span className="font-bold font-mono text-emerald-300 block">
                          Technical Post-Mortem &amp; Verification:
                        </span>
                        <p className="opacity-95 leading-relaxed">
                          {activeTicket.executionResult.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TargetIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
