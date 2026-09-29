import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  ArrowLeft, 
  ArrowRight, 
  Lightbulb, 
  Clock, 
  Database, 
  RefreshCw, 
  Copy, 
  Check, 
  Code2, 
  Layers, 
  Eye, 
  EyeOff, 
  Pause, 
  Unlock, 
  RotateCcw, 
  Sparkles, 
  Lock
} from 'lucide-react';
import { questionBank, difficultyColors } from '../data/questionBank';
import { initializeDatabase, posDocumentation, clearCustomDatabase } from '../data/mockDatabase';
import { validateQuery } from '../utils/sqlValidator';
import { getStoredApiKey, evaluateAnswerWithGemini } from '../services/geminiService';
import ResultTable from '../components/ResultTable';
import SchemaModal from '../components/SchemaModal';
import QuestionNavigatorModal from '../components/QuestionNavigatorModal';
import ThemeToggle from '../components/ThemeToggle';
import ssquelLogo from '../assets/ssquel.png';

// Evaluates PowerShell / Network questions outside render scope
async function evaluateNonSQL({ apiKey, question, userQuery }) {
  const startTime = Date.now();
  if (apiKey) {
    try {
      const evalResult = await evaluateAnswerWithGemini({
        apiKey,
        question,
        userAnswer: userQuery
      });
      const execTime = Date.now() - startTime;
      return {
        isCorrect: evalResult.isCorrect,
        userResult: [{ SubmittedCommand: userQuery, Evaluation: evalResult.isCorrect ? 'VALID' : 'INCOMPLETE' }],
        expectedResult: [{ TargetSolution: question.expectedAnswer, Explanation: question.explanation }],
        feedback: evalResult.feedback + (evalResult.suggestion ? ` Hint: ${evalResult.suggestion}` : ''),
        executionTimeMs: execTime
      };
    } catch {
      // Fallback to pattern matching
    }
  }

  const cleanUser = userQuery.trim().toLowerCase().replace(/\s+/g, ' ');
  const cleanExp = (question.expectedAnswer || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const isExact = cleanUser === cleanExp;
  const isPartial = cleanUser.length > 5 && cleanExp.includes(cleanUser);
  const isCorrect = isExact || isPartial;

  return {
    isCorrect,
    userResult: [{ SubmittedCommand: userQuery, Status: isCorrect ? 'ACCEPTED' : 'NEEDS_REVIEW' }],
    expectedResult: [{ Solution: question.expectedAnswer, Purpose: question.explanation }],
    feedback: isCorrect
      ? 'Procedure Verified! Your command matches the required troubleshooting steps.'
      : 'Discrepancy detected: Verify parameters, syntax, and targeting for this incident.',
    executionTimeMs: Date.now() - startTime
  };
}

export default function AssessmentPage() {
  const navigate = useNavigate();

  // Initialize DB once on load
  useEffect(() => {
    initializeDatabase();
  }, []);

  // AI Questions State
  const [aiQuestions, setAiQuestions] = useState(() => {
    try {
      const stored = localStorage.getItem('support_sql_ai_questions');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [activeBankType, setActiveBankType] = useState(() => {
    try {
      const stored = localStorage.getItem('support_sql_ai_questions');
      if (stored && JSON.parse(stored)?.length > 0) return 'ai';
    } catch {
      // ignore
    }
    return 'default';
  });
  const [isCustomDbActive, setIsCustomDbActive] = useState(() => !!localStorage.getItem('support_sql_custom_db_sql'));
  const [customDbDomain, setCustomDbDomain] = useState(() => localStorage.getItem('support_sql_custom_db_domain') || '');

  // Active bank
  const currentBank = (activeBankType === 'ai' && aiQuestions && aiQuestions.length > 0)
    ? aiQuestions
    : questionBank;

  // Question navigation state
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = currentBank[currentIndex] || currentBank[0] || questionBank[0];

  const [userQuery, setUserQuery] = useState(() => currentQuestion?.starterCode || '');
  const [showHint, setShowHint] = useState(false);
  const [activeOutputTab, setActiveOutputTab] = useState('user'); // 'user' | 'expected'
  const [copied, setCopied] = useState(false);

  // Question Mode: 'simplified' (easy & clear) | 'technical' (L2 IT ticket)
  const [questionMode, setQuestionMode] = useState('simplified');

  // Solution Reveal State (Hide solution first during practice)
  const [isSolutionRevealed, setIsSolutionRevealed] = useState(false);

  // Validation & Execution State
  const [executionResult, setExecutionResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState({});
  const [practiceMode, setPracticeMode] = useState(false); // allows free next without lock

  // Modals
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const handleOpenDocumentation = (code = '') => {
    if (code) {
      navigate(`/documentation?search=${encodeURIComponent(code)}`);
    } else {
      navigate('/documentation');
    }
  };

  // Per-Question Timer (Seconds)
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const textareaRef = useRef(null);
  const colors = difficultyColors[currentQuestion.difficulty] || difficultyColors.Basic;

  // Change Question handler
  const handleSelectQuestion = (newIndex) => {
    if (newIndex < 0 || newIndex >= currentBank.length) return;
    const targetQ = currentBank[newIndex];
    setCurrentIndex(newIndex);
    setUserQuery(targetQ.starterCode || '');
    setExecutionResult(null);
    setShowHint(false);
    setIsSolutionRevealed(false);
    setActiveOutputTab('user');
    setSecondsElapsed(0);
    setIsTimerRunning(true);
  };

  // Switch between default and AI question banks
  const handleSwitchBank = (type) => {
    setActiveBankType(type);
    setCurrentIndex(0);
    const bank = (type === 'ai' && aiQuestions) ? aiQuestions : questionBank;
    const firstQ = bank[0] || questionBank[0];
    setUserQuery(firstQ.starterCode || '');
    setExecutionResult(null);
    setShowHint(false);
    setIsSolutionRevealed(false);
    setActiveOutputTab('user');
    setSecondsElapsed(0);
  };

  // Revert custom database back to standard Retail POS fleet
  const handleRevertToDefaultPOS = () => {
    if (window.confirm('Revert back to the standard Retail POS Fleet database and 40 scenarios?')) {
      clearCustomDatabase();
      localStorage.removeItem('support_sql_ai_questions');
      localStorage.removeItem('support_sql_ai_domain');
      setAiQuestions(null);
      setIsCustomDbActive(false);
      setCustomDbDomain('');
      setActiveBankType('default');
      setCurrentIndex(0);
      setUserQuery(questionBank[0]?.starterCode || '');
      setExecutionResult(null);
      setShowHint(false);
      setIsSolutionRevealed(false);
      setActiveOutputTab('user');
      setSecondsElapsed(0);
      alert('Restored standard Retail POS Fleet database.');
    }
  };

  // Per-Question Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Run and validate query or command
  const handleCheckAnswer = async () => {
    setIsValidating(true);
    const isSQL = !currentQuestion.category || currentQuestion.category === 'SQL';

    if (isSQL) {
      setTimeout(() => {
        const result = validateQuery(userQuery, currentQuestion.expectedQuery || currentQuestion.expectedAnswer);
        setExecutionResult(result);
        setIsValidating(false);

        if (result.isCorrect) {
          setCompletedQuestions(prev => ({
            ...prev,
            [currentQuestion.id]: true
          }));
        }
      }, 50);
    } else {
      // PowerShell or Network Troubleshooting evaluation
      const apiKey = getStoredApiKey();
      const result = await evaluateNonSQL({ apiKey, question: currentQuestion, userQuery });
      setExecutionResult(result);
      if (result.isCorrect) {
        setCompletedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));
      }
      setIsValidating(false);
    }
  };

  // Keyboard shortcut Ctrl+Enter
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCheckAnswer();
    }
  };

  // Copy query to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(userQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Insert snippet helper at cursor
  const handleInsertKeyword = (keyword) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setUserQuery(prev => prev + ' ' + keyword);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = userQuery.substring(0, start) + keyword + ' ' + userQuery.substring(end);
    setUserQuery(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + keyword.length + 1, start + keyword.length + 1);
    }, 10);
  };

  // Reset in-memory database
  const handleResetDatabase = () => {
    initializeDatabase();
    setExecutionResult(null);
    alert('Mock AlaSQL Database has been reset to original state.');
  };

  // Dynamic snippets based on question category
  const getSnippets = () => {
    if (currentQuestion.category === 'PowerShell') {
      return ['Get-Service', 'Restart-Service', 'Test-NetConnection', 'Get-WinEvent', 'Stop-Process', 'Test-Path', 'Get-Process'];
    }
    if (currentQuestion.category === 'Network Troubleshooting') {
      return ['ping -t', 'tracert', 'nslookup', 'netstat -ano', 'Test-NetConnection -Port', 'ipconfig /all', 'curl -I'];
    }
    return ['SELECT', 'FROM', 'WHERE', 'INNER JOIN', 'GROUP BY', 'HAVING', 'ORDER BY'];
  };

  const isCurrentSolved = !!completedQuestions[currentQuestion.id];
  const canGoNext = practiceMode || isCurrentSolved;

  return (
    <div className="min-h-screen theme-bg theme-text flex flex-col font-sans selection:bg-blue-400/30">
      {/* Top Header */}
      <header className="border-b theme-border bg-[var(--bg-header)] sticky top-0 z-30 px-4 sm:px-6 py-2.5 backdrop-blur flex items-center justify-between gap-4">
        {/* Left: Brand & Question Tracker */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border theme-border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] theme-text-muted hover:theme-text text-xs font-mono transition-colors"
            title="Return to SSEQUEL Home"
          >
            <img
              src={ssquelLogo}
              alt="SSEQUEL Logo"
              className="w-5 h-5 rounded-md object-contain bg-blue-600 p-0.5"
            />
            <span className="font-bold theme-text tracking-tight hidden md:inline">SSEQUEL</span>
            <ArrowLeft className="w-3.5 h-3.5 ml-0.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

          <div className="h-4 w-px bg-[var(--border-muted)] hidden sm:block" />

          {/* Active Bank Switcher */}
          <div className="flex items-center rounded-lg bg-[var(--bg-surface2)] p-0.5 border theme-border-m text-xs font-mono">
            <button
              onClick={() => handleSwitchBank('default')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeBankType === 'default'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                  : 'theme-text-muted hover:theme-text-sec'
              }`}
            >
              POS Fleet (40)
            </button>
            {aiQuestions && (
              <button
                onClick={() => handleSwitchBank('ai')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  activeBankType === 'ai'
                    ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                    : 'theme-text-muted hover:theme-text-sec'
                }`}
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                AI Set (10)
              </button>
            )}
          </div>

          {/* Category / Difficulty Badge */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-mono border ${colors.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {currentQuestion.category || currentQuestion.difficulty} &bull; #{currentQuestion.id}/{currentBank.length}
          </span>
        </div>

        {/* Center: Live Timer Per Question */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-blue-950 font-mono text-xs shadow-sm">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400 text-[11px] hidden sm:inline">Time:</span>
          <span className="font-semibold text-slate-200 tracking-wider">
            {formatTimer(secondsElapsed)}
          </span>
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
          >
            {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Custom DB Indicator if Active */}
          {isCustomDbActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline font-semibold">{customDbDomain ? customDbDomain.substring(0, 16) : 'Custom DB'}</span>
              <button
                onClick={handleRevertToDefaultPOS}
                className="ml-1 px-1.5 py-0.5 rounded bg-emerald-900/60 hover:bg-emerald-800/80 text-[10px] text-emerald-200 transition-colors"
                title="Revert back to standard Retail POS Fleet database"
              >
                Revert POS
              </button>
            </div>
          )}

          {/* Custom Assessment & Mock DB Builder */}
          <button
            onClick={() => navigate('/builder')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-800/80 bg-blue-950/50 hover:bg-blue-900/50 text-sky-300 text-xs font-mono transition-all shadow-sm"
            title="Custom Assessment & Mock Database Builder (Upload .txt or Gemini API)"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Custom Builder & .txt</span>
            <span className="sm:hidden">Builder</span>
          </button>

          {/* Question Navigator */}
          <button
            onClick={() => setIsNavigatorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Navigator</span>
            <span className="px-1.5 py-0.2 rounded bg-blue-950 text-[10px] text-sky-300 font-semibold">
              {Object.keys(completedQuestions).length}/{currentBank.length}
            </span>
          </button>

          {/* Documentation & Runbook Explorer */}
          <button
            onClick={() => handleOpenDocumentation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-sky-300 text-xs font-mono transition-colors shadow-sm"
            title="Inspect POS Architecture & SOP Runbooks"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
            <span className="hidden sm:inline">Documentation</span>
          </button>

          {/* Schema Explorer */}
          <button
            onClick={() => setIsSchemaOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border theme-border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] theme-text-sec text-xs font-mono transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
            <span className="hidden sm:inline">Schema</span>
          </button>

          {/* Reset DB */}
          <button
            onClick={handleResetDatabase}
            className="p-1.5 rounded-lg border theme-border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] theme-text-muted transition-colors"
            title="Reset Mock AlaSQL Database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <ThemeToggle />
        </div>
      </header>

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 gap-3 max-w-[1700px] w-full mx-auto overflow-hidden">
        
        {/* Question & Business Scenario Panel (Top) */}
        <section className="rounded-2xl border theme-border bg-[var(--bg-card)] dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-950/95 dark:to-slate-950 p-4 sm:p-5 shadow-xl space-y-3">
          {/* Top ITSM Meta Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b theme-border-m">
            <div className="flex items-center flex-wrap gap-2">
              {/* Ticket ID & Live Beacon */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/80 text-xs font-mono shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold">TICKET</span>
                <span className="text-blue-700 dark:text-sky-300 font-bold">{currentQuestion.ticketId || `INC-${currentQuestion.id}`}</span>
              </div>

              {/* Priority Badge - keep severity colors (rose/amber/blue) */}
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                currentQuestion.difficulty === 'Advanced' || currentQuestion.category === 'Network'
                  ? 'bg-rose-500/15 text-rose-700 border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40'
                  : currentQuestion.difficulty === 'Intermediate' || currentQuestion.category === 'PowerShell'
                  ? 'bg-amber-500/15 text-amber-700 border-amber-400/40 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40'
                  : currentQuestion.difficulty === 'Medium'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30'
                  : 'bg-blue-100 text-blue-700 border-blue-300/60 dark:bg-blue-500/20 dark:text-sky-300 dark:border-blue-500/40'
              }`}>
                {currentQuestion.difficulty === 'Advanced' ? 'P1 - CRITICAL' :
                 currentQuestion.difficulty === 'Intermediate' ? 'P2 - HIGH' :
                 currentQuestion.difficulty === 'Medium' ? 'P2 - MEDIUM' : 'P3 - STANDARD'}
              </span>

              {/* Status */}
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700/50 text-[10px] font-mono font-semibold uppercase">
                OPEN • L2 Escalation
              </span>

              {/* Reporter & Assignee (Desktop) */}
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] theme-text-muted font-mono">
                <span className="theme-text-muted">Assignee:</span> <strong className="theme-text-sec">L2 Store Systems (You)</strong>
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <span className="text-slate-500">SLA:</span> <span className="text-amber-400">&lt; 15 min</span>
              </span>
            </div>

            {/* Right Action Controls: Eye Icon Button & Mode Switcher */}
            <div className="flex items-center gap-2">
              {/* 👁️ View Documentation & Runbook Button */}
              <button
                onClick={() => {
                  const detectedCode = (posDocumentation.errorCodes || []).find(e => 
                    (currentQuestion.scenario + ' ' + currentQuestion.prompt + ' ' + (currentQuestion.tags || []).join(' ')).includes(e.code)
                  )?.code || '';
                  handleOpenDocumentation(detectedCode);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700/80 hover:border-blue-500 text-sky-300 text-xs font-mono font-semibold transition-all shadow-md shadow-blue-950/80 active:scale-95"
                title="Inspect POS Documentation & Error Code SOPs"
              >
                <Eye className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span className="hidden sm:inline">Check Documentation & Runbook</span>
                <span className="sm:hidden">Runbook</span>
              </button>

              {/* Question Mode Switcher: Blue/Navy */}
              <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-blue-950 text-xs">
                <button
                  onClick={() => setQuestionMode('simplified')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    questionMode === 'simplified'
                      ? 'bg-blue-900/70 text-sky-200 border border-blue-600/60 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Plain English</span>
                  <span className="sm:hidden">Simple</span>
                </button>
                <button
                  onClick={() => setQuestionMode('technical')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    questionMode === 'technical'
                      ? 'bg-indigo-950 text-indigo-200 border border-indigo-600/60 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">L2 Ticket</span>
                  <span className="sm:hidden">Ticket</span>
                </button>
              </div>
            </div>
          </div>

          {/* Ticket Header & Sub-Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {currentQuestion.title}
                </h2>
                {isCurrentSolved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950 text-sky-300 border border-blue-600/60 text-[11px] font-medium font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Solved
                  </span>
                )}
              </div>

              {/* Mode-Specific Content */}
              {questionMode === 'simplified' ? (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-blue-900/60 text-sky-300 shrink-0 font-mono">
                      Goal
                    </span>
                    <span className="text-slate-200 leading-relaxed font-medium">
                      {currentQuestion.simpleGoal || currentQuestion.scenario}
                    </span>
                  </div>

                  {currentQuestion.simpleSteps && currentQuestion.simpleSteps.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentQuestion.simpleSteps.map((step, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-blue-950 text-xs flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-950 text-sky-300 border border-blue-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/90 border border-blue-950 text-xs">
                    <Terminal className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sky-300 font-mono">Instructions: </span>
                      <span className="text-slate-300">{currentQuestion.simplePrompt || currentQuestion.prompt}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {/* ITSM Incident Details Card */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/50 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono pb-1 border-b border-indigo-950/60">
                      <span className="text-indigo-300 font-semibold uppercase tracking-wider">
                        Incident Narrative & Symptoms
                      </span>
                      <span className="text-slate-500">
                        Affected Fleet: Store On-Prem POS
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentQuestion.scenario}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/90 border border-blue-950 text-xs">
                    <Terminal className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sky-300 font-mono">Investigation Objective: </span>
                      <span className="text-slate-300">{currentQuestion.prompt}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hint & Tags (Keeps Amber/Orange for hint procedure) */}
            <div className="flex sm:flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  showHint 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60'
                }`}
              >
                <Lightbulb className={`w-3.5 h-3.5 ${showHint ? 'text-amber-400 fill-amber-400/20' : 'text-slate-400'}`} />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>

              <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                {(currentQuestion.tags || []).map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-sky-300/80 border border-blue-900/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hint Drawer in Amber/Orange */}
          {showHint && (
            <div className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs font-sans leading-relaxed animate-in fade-in duration-150 flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-300">Troubleshooting Hint: </strong>
                {currentQuestion.hint}
              </div>
            </div>
          )}
        </section>

        {/* Middle Area: Split Editor & Output Panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[460px]">
          
          {/* Left Panel: Query/Command Editor */}
          <div className="flex flex-col rounded-2xl border theme-border bg-[var(--bg-surface)] overflow-hidden shadow-xl">
            {/* Editor Subheader */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface2)] border-b theme-border-m text-xs">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                <span className="font-semibold theme-text font-mono">
                  {currentQuestion.category === 'PowerShell' ? 'PowerShell Terminal Script' :
                   currentQuestion.category === 'Network Troubleshooting' ? 'Network Command Console' :
                   'SQL Query Editor'}
                </span>
                <span className="text-[10px] font-mono text-blue-700 dark:text-sky-300 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60">
                  {currentQuestion.category || 'AlaSQL Dialect'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setUserQuery(currentQuestion.starterCode || '')}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--bg-surface2)] theme-text-muted hover:theme-text-sec text-[11px] font-mono transition-colors"
                  title="Reset to clean template"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--bg-surface2)] theme-text-muted hover:theme-text-sec text-[11px] font-mono transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-3 h-3 text-blue-500 dark:text-sky-400" /> : <Copy className="w-3 h-3" />}
                  <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Keyword / Cmdlet Helper Bar */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-surface2)] border-b theme-border-m overflow-x-auto text-[11px] font-mono scrollbar-none">
              <span className="theme-text-muted text-[10px] mr-1 uppercase">Snippets:</span>
              {getSnippets().map(kw => (
                <button
                  key={kw}
                  onClick={() => handleInsertKeyword(kw)}
                  className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 hover:bg-blue-200 dark:hover:bg-blue-900/60 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800/60 transition-colors whitespace-nowrap active:scale-95"
                >
                  {kw}
                </button>
              ))}
            </div>

            {/* Textarea Editor */}
            <div className="flex-1 relative flex bg-[var(--bg-input)] dark:bg-slate-950 font-mono text-xs sm:text-sm">
              <textarea
                ref={textareaRef}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  currentQuestion.category === 'PowerShell'
                    ? '# Write your PowerShell command here...\nRestart-Service -Name W3SVC -Force'
                    : currentQuestion.category === 'Network Troubleshooting'
                    ? '# Write your network diagnostic command here...\nTest-NetConnection -ComputerName 10.101.0.5 -Port 8080'
                    : '-- Write your SQL query here...\nSELECT * FROM Stores;'
                }
                spellCheck={false}
                className="w-full h-full p-4 bg-transparent theme-text font-mono resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface2)] border-t theme-border-m text-xs theme-text-muted">
              <span className="flex items-center gap-1.5 text-[11px]">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-sky-300 font-mono text-[10px]">
                  Ctrl + Enter
                </kbd>
                <span>to execute &amp; validate</span>
              </span>

              <span className="text-[11px] font-mono theme-text-muted">
                {userQuery.length} chars
              </span>
            </div>
          </div>

          {/* Right Panel: Output & Validation Results */}
          <div className="flex flex-col rounded-2xl border theme-border bg-[var(--bg-surface)] overflow-hidden shadow-xl">
            {/* Output Subheader & Tab Switcher */}
            <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface2)] border-b theme-border-m text-xs">
              <div className="flex items-center gap-1 rounded-lg bg-[var(--bg-base)] border theme-border-m p-0.5">
                <button
                  onClick={() => setActiveOutputTab('user')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                    activeOutputTab === 'user'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                      : 'theme-text-muted hover:theme-text-sec'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-current dark:text-sky-400" />
                  Execution Result
                </button>

                <button
                  onClick={() => setActiveOutputTab('expected')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-mono text-xs transition-colors ${
                    activeOutputTab === 'expected'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm dark:bg-blue-900 dark:text-sky-200'
                      : 'theme-text-muted hover:theme-text-sec'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-current dark:text-sky-400" />
                  Expected Solution
                </button>
              </div>

              {executionResult && (() => {
                const feedbackLower = (executionResult.feedback || '').toLowerCase();
                const errorLower = (executionResult.error || '').toLowerCase();
                const isErrorOrNoTable = 
                  Boolean(executionResult.error) ||
                  !executionResult.userResult ||
                  errorLower.includes('table') ||
                  feedbackLower.includes('no table found') ||
                  feedbackLower.includes('table not found') ||
                  feedbackLower.includes('does not exist') ||
                  feedbackLower.includes('syntax error') ||
                  feedbackLower.includes('failed to execute') ||
                  feedbackLower.includes('not working') ||
                  feedbackLower.includes('invalid result');

                if (executionResult.isCorrect) {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/60 font-semibold text-xs font-mono shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> PASSED
                    </span>
                  );
                }

                if (isErrorOrNoTable) {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-500/60 font-semibold text-xs font-mono shadow-sm">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      {errorLower.includes('table') || feedbackLower.includes('table') ? 'NO TABLE FOUND' : 'ERROR / NOT WORKING'}
                    </span>
                  );
                }

                return (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/60 font-semibold text-xs font-mono shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> MISSING / INCOMPLETE
                  </span>
                );
              })()}
            </div>

            {/* Validation Feedback Banner: Green (Correct), Red (Error/No Table), Orange (Missing/Incomplete) */}
            {executionResult && (() => {
              const feedbackLower = (executionResult.feedback || '').toLowerCase();
              const errorLower = (executionResult.error || '').toLowerCase();
              const isErrorOrNoTable = 
                Boolean(executionResult.error) ||
                !executionResult.userResult ||
                errorLower.includes('table') ||
                feedbackLower.includes('no table found') ||
                feedbackLower.includes('table not found') ||
                feedbackLower.includes('does not exist') ||
                feedbackLower.includes('syntax error') ||
                feedbackLower.includes('failed to execute') ||
                feedbackLower.includes('not working') ||
                feedbackLower.includes('invalid result');

              if (executionResult.isCorrect) {
                return (
                  <div className="px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 bg-emerald-950/60 border-emerald-500/50 text-emerald-200 shadow-sm animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold leading-relaxed">
                        {executionResult.feedback || 'Correct! All output data matches expected requirements.'}
                      </span>
                    </div>

                    {executionResult.executionTimeMs !== undefined && (
                      <span className="font-mono text-[11px] text-emerald-400/80 shrink-0">
                        {executionResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                );
              }

              if (isErrorOrNoTable) {
                return (
                  <div className="px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 bg-rose-950/60 border-rose-500/60 text-rose-200 shadow-sm animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-semibold leading-relaxed">
                        {executionResult.feedback || executionResult.error}
                      </span>
                    </div>

                    {executionResult.executionTimeMs !== undefined && (
                      <span className="font-mono text-[11px] text-rose-400/80 shrink-0">
                        {executionResult.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div className="px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 bg-amber-950/50 border-amber-500/60 text-amber-200 shadow-sm animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold leading-relaxed">
                      {executionResult.feedback || 'Data discrepancy: Output is missing expected rows or columns.'}
                    </span>
                  </div>

                  {executionResult.executionTimeMs !== undefined && (
                    <span className="font-mono text-[11px] text-amber-400/80 shrink-0">
                      {executionResult.executionTimeMs}ms
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Output Display Body */}
            <div className="flex-1 p-3 overflow-y-auto bg-[var(--bg-base)] dark:bg-slate-950/60">
              {activeOutputTab === 'user' ? (
                <ResultTable
                  data={executionResult?.userResult}
                  error={executionResult?.error}
                  executionTimeMs={executionResult?.executionTimeMs}
                  title="Your Execution Output"
                  maxHeight="max-h-[380px]"
                />
              ) : (
                /* Expected Solution Tab */
                <div className="space-y-3">
                  {!isSolutionRevealed && !isCurrentSolved ? (
                    <div className="p-6 rounded-xl border theme-border bg-[var(--bg-card)] text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-400/30 dark:border-amber-800/40 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-2.5">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h4 className="theme-text font-semibold text-sm mb-1">
                        Solution Hidden (Practice Active)
                      </h4>
                      <p className="theme-text-muted text-xs max-w-sm mb-4">
                        Attempt to write and execute your query or command first. If you need help, you can reveal the benchmark solution below.
                      </p>
                      <button
                        onClick={() => setIsSolutionRevealed(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white border border-blue-400/40 text-xs font-mono font-medium transition-all active:scale-95 shadow-lg"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Reveal Solution</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border theme-border text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="theme-text font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
                          Target Benchmark Solution:
                        </span>
                        {!isCurrentSolved && (
                          <button
                            onClick={() => setIsSolutionRevealed(false)}
                            className="flex items-center gap-1 text-[11px] font-mono theme-text-muted hover:theme-text-sec transition-colors"
                          >
                            <EyeOff className="w-3 h-3" />
                            Hide Query
                          </button>
                        )}
                      </div>
                      <pre className="p-2.5 rounded-lg bg-[var(--bg-code)] border theme-border-m font-mono text-blue-700 dark:text-sky-300 whitespace-pre-wrap text-xs">
                        {currentQuestion.expectedAnswer || currentQuestion.expectedQuery}
                      </pre>
                      {currentQuestion.explanation && (
                        <p className="mt-2 theme-text-muted text-xs leading-relaxed border-t theme-border-m pt-2">
                          <strong className="text-blue-600 dark:text-sky-300">Technical Rationale: </strong>
                          {currentQuestion.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {executionResult?.expectedResult && (
                    <ResultTable
                      data={executionResult.expectedResult}
                      title="Expected Result Set"
                      maxHeight="max-h-[280px]"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Navigation Bar */}
        <footer className="rounded-2xl border theme-border bg-[var(--bg-surface)] p-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          {/* Left: Exit Assessment & Practice Unlock Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border theme-border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] theme-text-muted text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Assessment</span>
            </button>

            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-all ${
                practiceMode
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-400/40 dark:border-amber-500/30'
                  : 'bg-[var(--bg-surface)] theme-text-muted border-[var(--border-base)] hover:theme-text-sec'
              }`}
              title="Practice Mode allows jumping to the next question without strictly passing"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{practiceMode ? 'Practice Unlock: ON' : 'Practice Unlock: OFF'}</span>
            </button>
          </div>

          {/* Center: Progression Dots / Bar */}
          <div className="hidden lg:flex items-center gap-1">
            {currentBank.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isSolved = !!completedQuestions[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-blue-500 ring-2 ring-blue-400/60 scale-125'
                      : isSolved
                      ? 'bg-blue-600'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  title={`Question ${q.id}: ${q.title} (${isSolved ? 'Solved' : 'Unsolved'})`}
                />
              );
            })}
          </div>

          {/* Right: Previous / Check Answer / Next Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Previous */}
            <button
              onClick={() => handleSelectQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border theme-border bg-[var(--bg-surface)] hover:bg-[var(--bg-surface2)] theme-text-sec text-xs font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Check Answer */}
            <button
              onClick={handleCheckAnswer}
              disabled={isValidating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs font-mono shadow-lg border border-blue-400/40 active:scale-95 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isValidating ? 'Validating...' : 'Check Answer'}</span>
            </button>

            {/* Next */}
            <button
              onClick={() => handleSelectQuestion(currentIndex + 1)}
              disabled={currentIndex === currentBank.length - 1 || !canGoNext}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl border text-xs font-mono transition-all ${
                canGoNext
                  ? 'border-blue-400 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:border-blue-600/50 dark:bg-blue-950/80 dark:text-sky-200 dark:hover:bg-blue-900/60'
                  : 'border-[var(--border-muted)] bg-[var(--bg-surface)] text-[var(--text-muted)] opacity-40 cursor-not-allowed'
              }`}
              title={canGoNext ? "Advance to Next Question" : "Solve this question or enable Practice Unlock to proceed"}
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </footer>
      </div>

      {/* Interactive Modals */}
      <SchemaModal 
        isOpen={isSchemaOpen} 
        onClose={() => setIsSchemaOpen(false)} 
      />

      <QuestionNavigatorModal
        isOpen={isNavigatorOpen}
        onClose={() => setIsNavigatorOpen(false)}
        currentIndex={currentIndex}
        onSelectQuestion={(idx) => handleSelectQuestion(idx)}
        completedMap={completedQuestions}
        questions={currentBank}
      />
    </div>
  );
}
