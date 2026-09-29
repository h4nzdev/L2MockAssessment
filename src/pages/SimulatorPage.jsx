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
  Timer
} from 'lucide-react';
import { triageDrillSets, mockIncidentTickets, generateRandomIncident } from '../data/mockTickets';
import ThemeToggle from '../components/ThemeToggle';
import ssquelLogo from '../assets/ssquel.png';

export default function SimulatorPage() {
  const navigate = useNavigate();

  // Mode Selection: 'triage' | 'queue'
  const [activeMode, setActiveMode] = useState('queue');

  // ==========================================
  // MODE 1: TRIAGE CHALLENGE STATE
  // ==========================================
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const currentDrill = triageDrillSets[currentDrillIndex] || triageDrillSets[0];
  
  // User rankings: map ticket id -> rank (1, 2, 3)
  const [triageRankings, setTriageRankings] = useState({});
  const [triageSubmitted, setTriageSubmitted] = useState(false);
  const [triageScore, setTriageScore] = useState(null);
  const [triageHistory, setTriageHistory] = useState([]);

  // Assign or toggle rank for a ticket
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
      if (triageRankings[t.id] === t.correctRank) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / tickets.length) * 100);
    setTriageScore(scorePct);
    setTriageSubmitted(true);
    setTriageHistory(prev => [
      ...prev,
      { drillId: currentDrill.id, scorePct, date: new Date().toLocaleTimeString() }
    ]);
  };

  const handleNextDrill = () => {
    setTriageRankings({});
    setTriageSubmitted(false);
    setTriageScore(null);
    setCurrentDrillIndex(prev => (prev + 1) % triageDrillSets.length);
  };

  const handleResetDrill = () => {
    setTriageRankings({});
    setTriageSubmitted(false);
    setTriageScore(null);
  };

  // ==========================================
  // MODE 2: LIVE TICKET QUEUE & WORKSPACE STATE
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
      resolutionApplied: null,
      escalationSubmitted: null
    }));
  });

  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [workspaceTab, setWorkspaceTab] = useState('diagnostics'); // 'diagnostics' | 'workaround' | 'escalate'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // ==========================================
  // DYNAMIC REAL-TIME TICKET INCOMING STREAM
  // ==========================================
  const [isAutoStreamActive, setIsAutoStreamActive] = useState(true);
  const [streamInterval, setStreamInterval] = useState(60); // In seconds: 30, 60, 90, 120, 0=off
  const [countdownToNext, setCountdownToNext] = useState(60);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [newIncidentAlert, setNewIncidentAlert] = useState(null); // { ticket, timestamp }

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
      osc.frequency.setValueAtTime(784, ctx.currentTime); // G5
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.12); // C6
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context restricted or unsupported
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

  // Auto-dismiss floating alert toast after 8 seconds
  useEffect(() => {
    if (!newIncidentAlert) return;
    const timeout = setTimeout(() => {
      setNewIncidentAlert(null);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [newIncidentAlert]);

  // Real-time SLA Countdown Timer for active tickets
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

  // Active ticket in workspace
  const activeTicket = tickets.find(t => t.id === selectedTicketId) || null;

  // Diagnostics runner state
  const [runningDiagId, setRunningDiagId] = useState(null);
  const [copiedLog, setCopiedLog] = useState(false);

  const handleRunDiagnostic = (diagId) => {
    if (!activeTicket) return;
    setRunningDiagId(diagId);
    setTimeout(() => {
      setTickets(prev =>
        prev.map(t => {
          if (t.id === activeTicket.id) {
            const exists = t.runDiagnostics.includes(diagId);
            return {
              ...t,
              status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status,
              runDiagnostics: exists ? t.runDiagnostics : [...t.runDiagnostics, diagId]
            };
          }
          return t;
        })
      );
      setRunningDiagId(null);
    }, 600);
  };

  const handleRunAllDiagnostics = () => {
    if (!activeTicket) return;
    setRunningDiagId('ALL');
    setTimeout(() => {
      const allDiagIds = (activeTicket.diagnosticChecks || []).map(d => d.id);
      setTickets(prev =>
        prev.map(t => {
          if (t.id === activeTicket.id) {
            return {
              ...t,
              status: t.status === 'OPEN' ? 'IN_PROGRESS' : t.status,
              runDiagnostics: allDiagIds
            };
          }
          return t;
        })
      );
      setRunningDiagId(null);
    }, 1000);
  };

  // Workaround runner state
  const [applyingWorkaroundId, setApplyingWorkaroundId] = useState(null);
  const [workaroundResult, setWorkaroundResult] = useState(null);

  const handleApplyWorkaround = (workaround) => {
    if (!activeTicket) return;
    setApplyingWorkaroundId(workaround.id);
    setWorkaroundResult(null);

    setTimeout(() => {
      setApplyingWorkaroundId(null);
      const isCorrect = workaround.isCorrect;
      setWorkaroundResult({
        workaroundId: workaround.id,
        isCorrect,
        isMitigationOnly: workaround.isMitigationOnly,
        feedback: workaround.feedback
      });

      if (isCorrect && !workaround.isMitigationOnly) {
        setTickets(prev =>
          prev.map(t => {
            if (t.id === activeTicket.id) {
              return {
                ...t,
                status: 'RESOLVED',
                resolutionApplied: workaround.title
              };
            }
            return t;
          })
        );
      }
    }, 800);
  };

  // L3 Escalation Form State
  const [escalationForm, setEscalationForm] = useState({
    businessImpact: '',
    stepsTaken: '',
    suspectedCause: '',
    attachedLog: ''
  });
  const [escalationEvaluation, setEscalationEvaluation] = useState(null);

  const handleCopyLogSnippet = () => {
    if (!activeTicket) return;
    navigator.clipboard.writeText(activeTicket.terminalLogs);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const handlePasteLogToEscalation = () => {
    if (!activeTicket) return;
    setEscalationForm(prev => ({
      ...prev,
      attachedLog: activeTicket.terminalLogs
    }));
  };

  const handleAutoPopulateSteps = () => {
    if (!activeTicket) return;
    const completedDiags = (activeTicket.diagnosticChecks || [])
      .filter(d => (activeTicket.runDiagnostics || []).includes(d.id))
      .map(d => `- Executed "${d.name}": ${d.status}`)
      .join('\n');

    setEscalationForm(prev => ({
      ...prev,
      stepsTaken: completedDiags || '- Ran standard network & in-store service checks.\n- Verified store router connectivity.\n- Attempted service status query.'
    }));
  };

  const handleSubmitEscalation = (e) => {
    e.preventDefault();
    if (!activeTicket) return;

    const impactLen = escalationForm.businessImpact.trim().length;
    const stepsLen = escalationForm.stepsTaken.trim().length;
    const causeLen = escalationForm.suspectedCause.trim().length;
    const logLen = escalationForm.attachedLog.trim().length;
    const shouldEscalate = activeTicket.correctResolutionType === 'escalate';

    let isApproved = false;
    let rejectionReason = '';
    let gradeScore = 0;

    if (!shouldEscalate) {
      isApproved = false;
      rejectionReason = `REJECTED by Level 3 Escalations: This issue is a standard Level 2 resolvable incident (${activeTicket.category}). Please apply the appropriate local store workaround before escalating.`;
    } else if (impactLen < 15) {
      isApproved = false;
      rejectionReason = 'REJECTED: Business Impact description is too vague. Specify revenue risk, customer checkout impact, or number of affected stores.';
    } else if (stepsLen < 20 || (activeTicket.runDiagnostics || []).length === 0) {
      isApproved = false;
      rejectionReason = 'REJECTED: Insufficient diagnostic steps recorded. Level 2 must run and document network/service diagnostic checks before escalating.';
    } else if (logLen < 20) {
      isApproved = false;
      rejectionReason = 'REJECTED: No raw terminal log or error code snippet was attached. L3 requires exact stack trace/HTTP response logs.';
    } else {
      isApproved = true;
      gradeScore = 100;
      if (impactLen > 30 && stepsLen > 40 && logLen > 50 && causeLen > 20) {
        gradeScore = 100;
      } else {
        gradeScore = 85;
      }
    }

    const evaluation = {
      isApproved,
      gradeScore,
      rejectionReason,
      jiraTicketId: isApproved ? `CORE-${Math.floor(1000 + Math.random() * 9000)}` : null,
      timestamp: new Date().toLocaleTimeString()
    };

    setEscalationEvaluation(evaluation);

    if (isApproved) {
      setTickets(prev =>
        prev.map(t => {
          if (t.id === activeTicket.id) {
            return {
              ...t,
              status: 'ESCALATED',
              escalationSubmitted: evaluation
            };
          }
          return t;
        })
      );
    }
  };

  const handleResetSimulator = () => {
    if (window.confirm('Reset all ticket statuses, timers, and diagnostic logs to initial state?')) {
      const freshTickets = mockIncidentTickets.slice(0, 4).map(t => ({
        ...t,
        status: 'OPEN',
        remainingSeconds: t.slaMinutes * 60,
        slaBreached: false,
        runDiagnostics: [],
        resolutionApplied: null,
        escalationSubmitted: null
      }));
      setTickets(freshTickets);
      setSelectedTicketId(null);
      setWorkaroundResult(null);
      setEscalationEvaluation(null);
      setCountdownToNext(streamInterval || 60);
      localStorage.removeItem('ssequel_simulator_tickets');
    }
  };

  // Helper formatting for seconds to MM:SS
  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // KPI calculations
  const totalTickets = tickets.length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
  const escalatedCount = tickets.filter(t => t.status === 'ESCALATED').length;
  const openCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const breachedCount = tickets.filter(t => t.slaBreached && t.status !== 'RESOLVED' && t.status !== 'ESCALATED').length;
  const slaCompliance = totalTickets > 0 ? Math.round(((totalTickets - breachedCount) / totalTickets) * 100) : 100;

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.storeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || t.severity.toUpperCase() === filterSeverity;
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
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
                    🚨 LIVE INCIDENT SURGE
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {newIncidentAlert.timestamp}
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
              SLA Clock: {newIncidentAlert.ticket.slaMinutes}m countdown started
            </span>
            <button
              onClick={() => {
                setSelectedTicketId(newIncidentAlert.ticket.id);
                setNewIncidentAlert(null);
                setActiveMode('queue');
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <span>Inspect Ticket</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="border-b theme-border bg-[var(--bg-header)] backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
                  L2 Simulator
                </span>
              </span>
              <p className="text-[11px] theme-text-muted -mt-0.5">
                L2 Helpdesk &amp; Incident Triage Simulation
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
              <span className="hidden sm:inline">SQL/CLI Assessment</span>
              <span className="sm:hidden">Assessment</span>
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-sky-400">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <h1 className="text-sm font-bold theme-text">
                Level 2 Incident Command &amp; Triage Simulator
              </h1>
              <p className="text-[11px] theme-text-muted">
                Live stream simulating real-time store incidents, triage prioritization, and L3 escalations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Mode Tabs */}
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
                <span>Live Queue ({openCount})</span>
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ========================================================= */}
        {/* MODE 1: TRIAGE CHALLENGE DRILL                            */}
        {/* ========================================================= */}
        {activeMode === 'triage' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Drill Header Card */}
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
                    onClick={handleResetDrill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border theme-border-m bg-[var(--bg-surface2)] text-xs font-mono theme-text-sec hover:theme-text transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Ranks
                  </button>
                  <button
                    onClick={handleNextDrill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-all shadow-md"
                  >
                    <span>Next Drill</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Instructions Banner */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 text-xs theme-text-sec">
                <Info className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Incident Triage Instructions:</strong> Rank each incoming ticket by clicking <strong>P1 (Critical)</strong>, <strong>P2 (High/Medium)</strong>, or <strong>P3 (Low)</strong>. Prioritize based on: <em>Immediate Revenue Loss ($/hr)</em> &gt; <em>Scope of Affected POS Lanes/Stores</em> &gt; <em>Customer-facing Checkout Blockers vs Back-Office Cosmetic</em>.
                </p>
              </div>
            </div>

            {/* 3 Incoming Tickets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {currentDrill.tickets.map((ticket) => {
                const assignedRank = triageRankings[ticket.id];
                const isCorrect = triageSubmitted && assignedRank === ticket.correctRank;
                const isWrong = triageSubmitted && assignedRank !== ticket.correctRank;

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
                          : 'theme-border hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className="p-4 border-b theme-border-m bg-[var(--bg-surface2)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-sky-300">
                          {ticket.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-base)] border theme-border-m theme-text-muted">
                          {ticket.scope}
                        </span>
                      </div>

                      {assignedRank && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                          assignedRank === 1 ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800' :
                          assignedRank === 2 ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                          'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-950 dark:text-sky-300 dark:border-blue-800'
                        }`}>
                          PRIORITY {assignedRank}
                        </span>
                      )}
                    </div>

                    {/* Ticket Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <h3 className="font-bold text-sm theme-text leading-snug">
                          {ticket.title}
                        </h3>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 theme-text-muted font-mono">
                            <span className="text-slate-400">Store:</span>
                            <span className="theme-text-sec font-semibold">{ticket.storeId}</span>
                          </div>
                          <div className="flex items-center gap-1.5 theme-text-muted font-mono">
                            <span className="text-slate-400">System:</span>
                            <span className="theme-text-sec">{ticket.system}</span>
                          </div>
                          <div className="flex items-center gap-1.5 theme-text-muted font-mono">
                            <span className="text-slate-400">Reported By:</span>
                            <span className="theme-text-sec">{ticket.reportedBy}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[var(--bg-base)] border theme-border-m text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                            Operational Impact:
                          </span>
                          <p className="theme-text-sec leading-relaxed">
                            {ticket.impactDescription}
                          </p>
                        </div>
                      </div>

                      {/* Rank Selection Buttons */}
                      <div className="space-y-2 pt-2 border-t theme-border-m">
                        <span className="text-[11px] font-mono text-slate-400 block">
                          Assign ITIL Triage Priority:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((rankNum) => {
                            const isSelected = assignedRank === rankNum;
                            return (
                              <button
                                key={rankNum}
                                onClick={() => handleAssignRank(ticket.id, rankNum)}
                                disabled={triageSubmitted}
                                className={`py-2 px-1 rounded-xl text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                                  isSelected
                                    ? rankNum === 1
                                      ? 'bg-rose-600 text-white shadow-md'
                                      : rankNum === 2
                                        ? 'bg-amber-600 text-white shadow-md'
                                        : 'bg-blue-600 text-white shadow-md'
                                    : 'bg-[var(--bg-surface2)] hover:bg-[var(--bg-base)] theme-text-sec border theme-border-m'
                                } ${triageSubmitted ? 'cursor-default' : 'active:scale-95 cursor-pointer'}`}
                              >
                                <span>P{rankNum}</span>
                                <span className="text-[9px] font-normal opacity-80">
                                  {rankNum === 1 ? 'Critical' : rankNum === 2 ? 'High' : 'Normal'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Post-Submission Result Feedback */}
                      {triageSubmitted && (
                        <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          isCorrect
                            ? 'bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-100/50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>CORRECT TRIAGE (P{ticket.correctRank})</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                <span>INCORRECT (Should be P{ticket.correctRank}, you chose P{assignedRank || 'None'})</span>
                              </>
                            )}
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-90">
                            {ticket.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission Action Bar */}
            <div className="p-6 rounded-2xl border theme-border bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono theme-text-muted">
                  Rankings assigned: {Object.keys(triageRankings).length} of 3 tickets
                </span>
                {triageSubmitted && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold theme-text">
                      Drill Score: {triageScore}%
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      triageScore === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      triageScore >= 66 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {triageScore === 100 ? 'PERFECT TRIAGE' : triageScore >= 66 ? 'PARTIAL ALIGNMENT' : 'REVIEW REQUIRED'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!triageSubmitted ? (
                  <button
                    onClick={handleSubmitTriage}
                    disabled={Object.keys(triageRankings).length < 3}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-mono font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Evaluate Triage Ranking</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextDrill}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Next Round</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: LIVE TICKET QUEUE VIEW                            */}
        {/* ========================================================= */}
        {activeMode === 'queue' && !selectedTicketId && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Live Real-Time Incident Stream Banner & Controls */}
            <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative p-2 rounded-xl bg-blue-600 text-white shadow-md">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs theme-text uppercase font-mono tracking-wide">
                      Live Incident Simulation Stream
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isAutoStreamActive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {isAutoStreamActive ? 'STREAM ACTIVE' : 'PAUSED'}
                    </span>
                  </div>
                  <p className="text-[11px] theme-text-muted mt-0.5">
                    {isAutoStreamActive
                      ? `New store escalations automatically arrive every ${streamInterval}s.`
                      : 'Auto-stream paused. Trigger incidents manually.'}
                  </p>
                </div>
              </div>

              {/* Stream Settings & Quick Trigger */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
                {/* Interval Selector */}
                <div className="flex items-center gap-1.5 text-xs font-mono bg-[var(--bg-surface)] px-3 py-1.5 rounded-xl border theme-border-m shadow-inner">
                  <Timer className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-slate-400 text-[11px]">Interval:</span>
                  <select
                    value={streamInterval}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setStreamInterval(val);
                      setCountdownToNext(val);
                      if (val === 0) setIsAutoStreamActive(false);
                      else setIsAutoStreamActive(true);
                    }}
                    className="bg-transparent theme-text font-bold focus:outline-none cursor-pointer text-xs"
                  >
                    <option value={30} className="bg-slate-900 text-white">Every 30s (Rapid / Rush)</option>
                    <option value={60} className="bg-slate-900 text-white">Every 1 min (Standard)</option>
                    <option value={90} className="bg-slate-900 text-white">Every 1.5 min</option>
                    <option value={120} className="bg-slate-900 text-white">Every 2 min (Relaxed)</option>
                    <option value={0} className="bg-slate-900 text-white">Manual Trigger Only</option>
                  </select>
                </div>

                {/* Countdown Badge */}
                {isAutoStreamActive && streamInterval > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700/60 text-blue-800 dark:text-sky-300 text-xs font-mono font-bold shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500" />
                    </span>
                    <span>Next: {countdownToNext}s</span>
                  </div>
                )}

                {/* Sound Toggle */}
                <button
                  onClick={() => setIsSoundMuted(!isSoundMuted)}
                  className="p-2 rounded-xl border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] theme-text-muted hover:theme-text transition-all"
                  title={isSoundMuted ? "Unmute incident chime" : "Mute incident chime"}
                >
                  {isSoundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                {/* Manual Trigger Button */}
                <button
                  onClick={() => spawnIncomingIncident(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Force an incoming incident escalation immediately"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Spawn Incident Now</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Active Tickets</span>
                <span className="text-2xl font-bold font-mono theme-text mt-1 block">
                  {totalTickets}
                </span>
                <span className="text-[10px] text-blue-500 font-mono">Queue Buffer</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Open / In Progress</span>
                <span className="text-2xl font-bold font-mono text-amber-500 mt-1 block">
                  {openCount}
                </span>
                <span className="text-[10px] text-amber-500 font-mono">Requires Action</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Resolved at L2</span>
                <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 block">
                  {resolvedCount}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono">Workarounds Applied</span>
              </div>

              <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">Escalated to L3</span>
                <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                  {escalatedCount}
                </span>
                <span className="text-[10px] text-indigo-400 font-mono">Handover Accepted</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-sm">
                <span className="text-[11px] font-mono theme-text-muted block">SLA Compliance</span>
                <span className={`text-2xl font-bold font-mono mt-1 block ${
                  slaCompliance >= 90 ? 'text-emerald-400' : slaCompliance >= 70 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {slaCompliance}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {breachedCount > 0 ? `${breachedCount} breached` : '0 breaches'}
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl border theme-border bg-[var(--bg-surface)] flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by ID, Store, Error..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Severity:</span>
                </div>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text font-mono focus:outline-none"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                <div className="flex items-center gap-1 text-xs font-mono text-slate-400 ml-2">
                  <span>Status:</span>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text font-mono focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="ESCALATED">Escalated</option>
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
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Store Location &amp; Register</th>
                      <th className="py-3 px-4">Incident Summary</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">SLA Clock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-muted)] theme-text-sec">
                    {filteredTickets.map((ticket) => {
                      const isBreached = ticket.slaBreached && ticket.status !== 'RESOLVED' && ticket.status !== 'ESCALATED';

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
                              ticket.severity === 'Critical'
                                ? 'bg-rose-100 text-rose-700 border border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
                                : ticket.severity === 'High'
                                  ? 'bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800'
                                  : ticket.severity === 'Medium'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}>
                              {ticket.severity === 'Critical' && <Flame className="w-3 h-3 text-rose-500" />}
                              {ticket.severity.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold theme-text text-xs">
                              {ticket.storeName}
                            </div>
                            <div className="text-[11px] theme-text-muted font-mono">
                              {ticket.terminalId} • {ticket.terminalModel}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-medium theme-text truncate">
                              {ticket.title}
                            </div>
                            <div className="text-[11px] theme-text-muted truncate">
                              Reported by {ticket.reportedBy} ({ticket.openedAt})
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-[var(--bg-base)] border theme-border-m text-slate-400">
                              {ticket.category}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono">
                            {ticket.status === 'RESOLVED' ? (
                              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Met SLA
                              </span>
                            ) : ticket.status === 'ESCALATED' ? (
                              <span className="text-indigo-400 font-semibold flex items-center gap-1">
                                <Send className="w-3.5 h-3.5" /> Handed Over
                              </span>
                            ) : (
                              <span className={`flex items-center gap-1 font-bold ${
                                isBreached
                                  ? 'text-rose-500 animate-pulse'
                                  : ticket.remainingSeconds < 300
                                    ? 'text-amber-400'
                                    : 'text-sky-400'
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
                                : ticket.status === 'ESCALATED'
                                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800'
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
                              <span>Inspect</span>
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
        {/* MODE 2: SPLIT-SCREEN TICKET WORKSPACE                     */}
        {/* ========================================================= */}
        {activeMode === 'queue' && activeTicket && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Workspace Top Bar */}
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
                    activeTicket.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}>
                    {activeTicket.severity}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono font-semibold">
                    {activeTicket.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Assignee:</span>
                  <span className="theme-text font-bold">L2 Engineer (You)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">SLA Clock:</span>
                  <span className={`font-bold ${
                    activeTicket.status === 'RESOLVED' ? 'text-emerald-400' :
                    activeTicket.status === 'ESCALATED' ? 'text-indigo-400' :
                    activeTicket.slaBreached ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                  }`}>
                    {activeTicket.status === 'RESOLVED' ? 'MET' :
                     activeTicket.status === 'ESCALATED' ? 'HANDED OVER' :
                     formatTimer(activeTicket.remainingSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Split Screen Grid: 50% Left (Details & Console), 50% Right (Action Panel) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* ── LEFT PANEL: Details & Terminal Logs (Cols 1 to 6) ── */}
              <div className="lg:col-span-6 space-y-4">
                <div className="p-5 rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-md space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b theme-border-m pb-3">
                    <div>
                      <h3 className="font-bold text-sm theme-text">
                        {activeTicket.title}
                      </h3>
                      <p className="text-[11px] text-blue-500 font-mono mt-0.5">
                        {activeTicket.storeName} ({activeTicket.city}) • {activeTicket.terminalId}
                      </p>
                    </div>

                    <span className="text-[10px] font-mono theme-text-muted shrink-0">
                      Opened {activeTicket.openedAt}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border theme-border-m text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                        Customer &amp; Shift Supervisor Statement:
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Reported by: {activeTicket.reportedBy}
                      </span>
                    </div>
                    <p className="theme-text-sec leading-relaxed italic">
                      "{activeTicket.customerStatement}"
                    </p>
                  </div>
                </div>

                {/* Raw Terminal Console Log Card */}
                <div className="rounded-2xl border border-blue-900/60 bg-slate-950 shadow-xl overflow-hidden flex flex-col">
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-slate-300 font-semibold ml-2">
                        POS Terminal Diagnostic Event Log (/var/log/pos-error.log)
                      </span>
                    </div>

                    <button
                      onClick={handleCopyLogSnippet}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] transition-all active:scale-95"
                      title="Copy raw logs to clipboard"
                    >
                      {copiedLog ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Log</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 font-mono text-xs overflow-x-auto max-h-[360px] leading-relaxed space-y-1 text-slate-300 bg-slate-950">
                    {activeTicket.terminalLogs.split('\n').map((line, idx) => {
                      const isCritical = line.includes('[CRITICAL]');
                      const isError = line.includes('[ERROR]');
                      const isWarn = line.includes('[WARN]');
                      const isDebug = line.includes('[DEBUG]');
                      const isInfo = line.includes('[INFO]');

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 py-0.5 px-1 rounded hover:bg-slate-900/60 ${
                            isCritical ? 'text-rose-400 bg-rose-950/20 font-semibold' :
                            isError ? 'text-red-400 bg-red-950/10' :
                            isWarn ? 'text-amber-300' :
                            isDebug ? 'text-slate-500' :
                            isInfo ? 'text-sky-300' : 'text-slate-300'
                          }`}
                        >
                          <span className="text-slate-600 select-none text-[10px] w-6 shrink-0 text-right">
                            {idx + 1}
                          </span>
                          <span className="break-all">{line}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL: Action Panel with 3 Tabs (Cols 7 to 12) ── */}
              <div className="lg:col-span-6 flex flex-col rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-xl overflow-hidden">
                {/* Action Panel Tab Switcher */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-surface2)] border-b theme-border-m text-xs">
                  <div className="flex items-center gap-1 rounded-xl bg-[var(--bg-base)] border theme-border-m p-1 font-mono">
                    <button
                      onClick={() => setWorkspaceTab('diagnostics')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                        workspaceTab === 'diagnostics'
                          ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                          : 'theme-text-muted hover:theme-text-sec'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>1. Diagnostic Checks ({(activeTicket.runDiagnostics || []).length}/{(activeTicket.diagnosticChecks || []).length})</span>
                    </button>

                    <button
                      onClick={() => setWorkspaceTab('workaround')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                        workspaceTab === 'workaround'
                          ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                          : 'theme-text-muted hover:theme-text-sec'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>2. L2 Workaround</span>
                    </button>

                    <button
                      onClick={() => setWorkspaceTab('escalate')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                        workspaceTab === 'escalate'
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm dark:bg-indigo-900 dark:text-indigo-200'
                          : 'theme-text-muted hover:theme-text-sec'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>3. Escalate to L3</span>
                    </button>
                  </div>
                </div>

                {/* Tab 1: Diagnostics */}
                {workspaceTab === 'diagnostics' && (
                  <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between border-b theme-border-m pb-3">
                      <div>
                        <h4 className="text-xs font-bold theme-text uppercase font-mono">
                          Live Diagnostic Probes &amp; Telemetry
                        </h4>
                        <p className="text-[11px] theme-text-muted">
                          Run virtual tests on network gateways, local SQLite DB, and Cloud sync queues.
                        </p>
                      </div>

                      <button
                        onClick={handleRunAllDiagnostics}
                        disabled={runningDiagId !== null}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-mono font-semibold transition-all shadow-sm active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run All Diagnostics</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(activeTicket.diagnosticChecks || []).map((check) => {
                        const isExecuted = (activeTicket.runDiagnostics || []).includes(check.id);
                        const isRunning = runningDiagId === check.id || runningDiagId === 'ALL';

                        return (
                          <div
                            key={check.id}
                            className="p-3.5 rounded-xl border theme-border-m bg-[var(--bg-base)] space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold theme-text">
                                  {check.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isExecuted && (
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                    check.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                                    check.status === 'WARN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  }`}>
                                    {check.status}
                                  </span>
                                )}

                                <button
                                  onClick={() => handleRunDiagnostic(check.id)}
                                  disabled={isRunning}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] border theme-border-m text-xs font-mono theme-text transition-all active:scale-95"
                                >
                                  {isRunning ? (
                                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Play className="w-3 h-3 text-blue-500" />
                                  )}
                                  <span>{isExecuted ? 'Re-run' : 'Test'}</span>
                                </button>
                              </div>
                            </div>

                            <div className="font-mono text-[11px] text-slate-400 bg-[var(--bg-surface)] p-2 rounded-lg border theme-border-m">
                              <span className="text-blue-500 mr-1">$</span>
                              {check.command}
                            </div>

                            {isExecuted && (
                              <div className={`p-2.5 rounded-lg font-mono text-xs border ${
                                check.status === 'SUCCESS'
                                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                                  : check.status === 'WARN'
                                    ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                                    : 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                              }`}>
                                {check.output}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab 2: L2 Workaround */}
                {workspaceTab === 'workaround' && (
                  <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                    <div className="border-b theme-border-m pb-3">
                      <h4 className="text-xs font-bold theme-text uppercase font-mono">
                        Level 2 Standard Workaround &amp; Fix Actions
                      </h4>
                      <p className="text-[11px] theme-text-muted">
                        Select and execute an approved Level 2 store mitigation or local recovery procedure.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {(activeTicket.workarounds || []).map((wa) => {
                        const isApplying = applyingWorkaroundId === wa.id;

                        return (
                          <div
                            key={wa.id}
                            className="p-4 rounded-xl border theme-border-m bg-[var(--bg-base)] space-y-2.5 hover:border-blue-400 dark:hover:border-blue-700 transition-all"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h5 className="font-bold text-xs theme-text">
                                  {wa.title}
                                </h5>
                                <p className="text-[11px] theme-text-muted mt-0.5">
                                  {wa.description}
                                </p>
                              </div>

                              <button
                                onClick={() => handleApplyWorkaround(wa)}
                                disabled={isApplying || activeTicket.status === 'RESOLVED'}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-mono font-semibold transition-all shadow-sm active:scale-95 shrink-0"
                              >
                                {isApplying ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Zap className="w-3.5 h-3.5" />
                                )}
                                <span>Apply Fix</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {workaroundResult && (
                      <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                        workaroundResult.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-800 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-800 text-rose-200'
                      }`}>
                        <div className="flex items-center gap-2 font-bold font-mono">
                          {workaroundResult.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>WORKAROUND APPLIED • {workaroundResult.isMitigationOnly ? 'TEMPORARY MITIGATION' : 'TICKET RESOLVED'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>WORKAROUND INEFFECTIVE / INCORRECT</span>
                            </>
                          )}
                        </div>
                        <p className="leading-relaxed opacity-95">
                          {workaroundResult.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Escalate to L3 */}
                {workspaceTab === 'escalate' && (
                  <div className="p-5 space-y-4 flex-1 overflow-y-auto">
                    <div className="border-b theme-border-m pb-3">
                      <h4 className="text-xs font-bold theme-text uppercase font-mono flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-indigo-400" />
                        Structured Level 3 Escalation Form
                      </h4>
                      <p className="text-[11px] theme-text-muted">
                        L3 Core Engineering requires rigorous business impact, verified diagnostics, and attached logs.
                      </p>
                    </div>

                    <form onSubmit={handleSubmitEscalation} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-semibold theme-text flex items-center justify-between">
                          <span>1. Business &amp; Revenue Impact:</span>
                          <span className="text-[10px] text-slate-400 font-normal">e.g. stores affected, card failure</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={escalationForm.businessImpact}
                          onChange={(e) => setEscalationForm(prev => ({ ...prev, businessImpact: e.target.value }))}
                          placeholder="Describe store operations impact, checkout stoppage, or revenue risk..."
                          className="w-full p-2.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono font-semibold theme-text">
                            2. Troubleshooting Steps &amp; Diagnostics Run:
                          </label>
                          <button
                            type="button"
                            onClick={handleAutoPopulateSteps}
                            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline"
                          >
                            + Populate from Run Diagnostics
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          required
                          value={escalationForm.stepsTaken}
                          onChange={(e) => setEscalationForm(prev => ({ ...prev, stepsTaken: e.target.value }))}
                          placeholder="List diagnostic commands run and workarounds attempted..."
                          className="w-full p-2.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono font-semibold theme-text">
                          3. Suspected Subsystem / Root Cause:
                        </label>
                        <input
                          type="text"
                          required
                          value={escalationForm.suspectedCause}
                          onChange={(e) => setEscalationForm(prev => ({ ...prev, suspectedCause: e.target.value }))}
                          placeholder="e.g. CloudHQ upstream VPN route failure, SQLite corrupt lock handle..."
                          className="w-full p-2 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-mono font-semibold theme-text">
                            4. Attached Error Code / Terminal Log Snippet:
                          </label>
                          <button
                            type="button"
                            onClick={handlePasteLogToEscalation}
                            className="text-[10px] font-mono text-sky-400 hover:text-sky-300 underline"
                          >
                            + Attach Console Logs
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          required
                          value={escalationForm.attachedLog}
                          onChange={(e) => setEscalationForm(prev => ({ ...prev, attachedLog: e.target.value }))}
                          placeholder="Paste critical error code or stack trace snippet here..."
                          className="w-full p-2.5 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-mono text-xs font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Submit Ticket to Level 3 Engineering</span>
                      </button>
                    </form>

                    {escalationEvaluation && (
                      <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in duration-200 ${
                        escalationEvaluation.isApproved
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                          : 'bg-rose-950/40 border-rose-800 text-rose-200'
                      }`}>
                        <div className="flex items-center justify-between font-bold font-mono">
                          <div className="flex items-center gap-1.5">
                            {escalationEvaluation.isApproved ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>L3 HANDOVER ACCEPTED • JIRA {escalationEvaluation.jiraTicketId}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-rose-400" />
                                <span>ESCALATION REJECTED BY TIER 3</span>
                              </>
                            )}
                          </div>
                          {escalationEvaluation.isApproved && (
                            <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 font-mono text-[10px]">
                              SCORE: {escalationEvaluation.gradeScore}/100
                            </span>
                          )}
                        </div>

                        <p className="leading-relaxed opacity-95">
                          {escalationEvaluation.isApproved
                            ? `Level 3 Core SRE has acknowledged and taken ownership of this incident (${escalationEvaluation.jiraTicketId}). The ticket is now marked as Escalated with full SLA protection.`
                            : escalationEvaluation.rejectionReason}
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
