import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Database, 
  FileText, 
  Copy, 
  Check, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Table2,
  UtensilsCrossed,
  Stethoscope,
  Hotel,
  Landmark,
  ShoppingCart,
  Wand2
} from 'lucide-react';
import { 
  DOMAIN_PRESETS, 
  getSynchronizedAllInOnePrompt, 
  getDatabasePromptOnly, 
  getQuestionsPromptOnly, 
  parseCustomAssessmentTxt 
} from '../utils/aiTxtParser';
import { applyCustomDatabase, clearCustomDatabase } from '../data/mockDatabase';
import { getStoredApiKey, saveApiKey, generateAITemplateQuestions } from '../services/geminiService';
import ThemeToggle from '../components/ThemeToggle';
import ssquelLogo from '../assets/ssquel.png';

export default function CustomBuilderPage() {
  const navigate = useNavigate();

  // Builder Mode: 'txt-sync' (No API Key - Prompt & TXT) | 'gemini-api' (API Key)
  const [builderMode, setBuilderMode] = useState('txt-sync');

  // Prompt View Tab: 'all-in-one' | 'separate'
  const [promptTab, setPromptTab] = useState('all-in-one');

  // Domain / Topic Selection
  const [selectedPresetId, setSelectedPresetId] = useState('restaurant');
  const [customTopic, setCustomTopic] = useState('Restaurant POS, Kitchen Display & Bar Registers');

  // Copy Feedback States
  const [copiedType, setCopiedType] = useState(null); // 'all' | 'db' | 'questions'

  // Input & Parse State
  const [txtContent, setTxtContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef(null);

  // Gemini API Mode States
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isSavedKey, setIsSavedKey] = useState(() => !!getStoredApiKey());
  const [apiDifficulty, setApiDifficulty] = useState('Mixed');
  const [selectedTopics, setSelectedTopics] = useState(['SQL', 'PowerShell', 'Network Troubleshooting']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState('');

  // Handle Preset Select
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCustomTopic(preset.title);
    setParseError('');
  };

  // Load Built-in Example Immediately
  const handleLoadExample = (preset) => {
    const exampleText = `=== MOCK DATABASE SQL ===\n${preset.sampleSql.trim()}\n\n=== QUESTION 1 ===\nCATEGORY: SQL\nDIFFICULTY: Basic\nTICKET_ID: INC-701\nTITLE: Inspect Table Records in ${preset.title}\nSCENARIO: Support operations detected irregular sync states.\nPROMPT: SELECT * FROM ${preset.tables[0].split(' ')[0]} LIMIT 5;\nHINT: Run SELECT * with LIMIT.\nSTARTER_CODE: -- Query table records:\nSELECT * FROM ${preset.tables[0].split(' ')[0]};\nEXPECTED_ANSWER: SELECT * FROM ${preset.tables[0].split(' ')[0]} LIMIT 5;\nEXPLANATION: Returns initial table rows for audit.\n\n=== QUESTION 2 ===\nCATEGORY: PowerShell\nDIFFICULTY: Medium\nTICKET_ID: INC-702\nTITLE: Restart Local System Service\nSCENARIO: Terminal communication service is frozen.\nPROMPT: Write a PowerShell command to restart the PosGateway service.\nHINT: Use Restart-Service.\nSTARTER_CODE: # Restart command:\nEXPECTED_ANSWER: Restart-Service -Name PosGateway -Force\nEXPLANATION: Forcibly restarts the gateway daemon.`;
    
    setTxtContent(exampleText);
    handleProcessText(exampleText);
  };

  // Copy helper
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Process text parsing
  const handleProcessText = (content) => {
    setParseError('');
    if (!content.trim()) {
      setParseResult(null);
      return;
    }

    const res = parseCustomAssessmentTxt(content);
    if (res.success) {
      setParseResult(res);
    } else {
      setParseResult(null);
      setParseError(res.error || 'Failed to extract database or questions.');
    }
  };

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setParseError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setTxtContent(content);
        handleProcessText(content);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the selected file.');
    };
    reader.readAsText(file);
  };

  // Launch Custom Assessment
  const handleLaunchAssessment = () => {
    if (!parseResult || !parseResult.questions || parseResult.questions.length === 0) return;

    // 1. If custom database SQL exists, apply it in AlaSQL & localStorage
    if (parseResult.hasCustomDatabase && parseResult.databaseSql) {
      applyCustomDatabase(parseResult.databaseSql);
      localStorage.setItem('support_sql_custom_db_schema', JSON.stringify(parseResult.schema));
    } else {
      clearCustomDatabase();
    }

    // 2. Save Questions & Domain
    localStorage.setItem('support_sql_ai_questions', JSON.stringify(parseResult.questions));
    localStorage.setItem('support_sql_ai_domain', customTopic);

    // 3. Navigate to Assessment
    navigate('/assessment');
  };

  // Gemini API Generate
  const handleGeminiGenerate = async () => {
    setApiError('');
    if (!apiKey.trim()) {
      setApiError('Please enter your Google Gemini API key.');
      return;
    }

    saveApiKey(apiKey);
    setIsGenerating(true);

    try {
      const questions = await generateAITemplateQuestions({
        apiKey,
        domain: customTopic,
        difficulty: apiDifficulty,
        topics: selectedTopics
      });
      
      localStorage.setItem('support_sql_ai_questions', JSON.stringify(questions));
      localStorage.setItem('support_sql_ai_domain', customTopic);
      clearCustomDatabase(); // uses standard schema
      navigate('/assessment');
    } catch (err) {
      setApiError(err.message || 'Generation failed. Check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPresetIcon = (iconName) => {
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-sky-400" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-sky-400" />;
      case 'Hotel': return <Hotel className="w-5 h-5 text-sky-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-sky-400" />;
      default: return <ShoppingCart className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="min-h-screen theme-bg theme-text flex flex-col font-sans selection:bg-blue-400/30">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b theme-border bg-[var(--bg-header)] backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-sky-300 text-xs font-mono transition-all shadow-sm active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Assessment</span>
            </button>

            <div className="h-6 w-px bg-[var(--border-muted)] hidden sm:block" />

            <div className="flex items-center gap-3">
              <img
                src={ssquelLogo}
                alt="SSEQUEL Logo"
                className="w-10 h-10 rounded-xl object-contain bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-lg border border-blue-500/30 shrink-0"
              />
              <div>
                <h1 className="text-base sm:text-lg font-bold theme-text tracking-tight flex items-center gap-2">
                  SSEQUEL <span className="font-normal text-sm sm:text-base opacity-90">Custom Builder &amp; Mock DB</span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 text-[10px] font-mono border border-blue-200 dark:border-blue-700/60">
                    Synchronized AlaSQL Engine
                  </span>
                </h1>
                <p className="text-xs theme-text-muted">
                  Build custom troubleshooting scenarios synchronized with your own Mock Database
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher + ThemeToggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-[var(--bg-surface2)] p-1 border theme-border-m text-xs font-mono">
              <button
                onClick={() => setBuilderMode('txt-sync')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  builderMode === 'txt-sync'
                    ? 'bg-blue-600 text-white border border-blue-500 shadow-md font-semibold dark:bg-blue-900 dark:text-sky-200 dark:border-blue-600'
                    : 'theme-text-muted hover:theme-text-sec'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-current dark:text-sky-400" />
                <span>Synchronized .txt (No API Key)</span>
              </button>
              <button
                onClick={() => setBuilderMode('gemini-api')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  builderMode === 'gemini-api'
                    ? 'bg-blue-600 text-white border border-blue-500 shadow-md font-semibold dark:bg-blue-900 dark:text-sky-200 dark:border-blue-600'
                    : 'theme-text-muted hover:theme-text-sec'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-current dark:text-sky-400" />
                <span>Gemini API Key</span>
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Spacious Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">

        {/* MODE 1: Synchronized .txt Builder (No API Key) */}
        {builderMode === 'txt-sync' && (
          <div className="space-y-8">
            
            {/* Step 1: Topic & Scenario Domain Selection */}
            <section className="p-6 sm:p-8 rounded-2xl border theme-border bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                  1
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold theme-text">
                    Select or Define Your Custom Scenario Domain
                  </h2>
                  <p className="text-xs text-slate-400">
                    Pick a pre-configured domain or type any industry scenario. The AI prompts below will automatically synchronize!
                  </p>
                </div>
              </div>

              {/* Preset Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {DOMAIN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all space-y-3 ${
                      selectedPresetId === preset.id
                        ? 'bg-blue-900/50 border-blue-500 shadow-lg shadow-blue-950/60 ring-1 ring-blue-500/50'
                        : 'bg-slate-900/60 border-blue-950/80 hover:bg-slate-900 hover:border-blue-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/80">
                        {getPresetIcon(preset.icon)}
                      </div>
                      <div className="font-bold text-xs text-white line-clamp-1">{preset.title}</div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {preset.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-blue-950/60 text-[10px] font-mono text-sky-400">
                      <span>3 Tables Included</span>
                      <span className="hover:underline" onClick={(e) => { e.stopPropagation(); handleLoadExample(preset); }}>
                        Load Example &rarr;
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Topic Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 font-mono">
                  Custom Domain / Topic Name:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTopic}
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      setSelectedPresetId('custom');
                    }}
                    placeholder="e.g. Airline Departure Gate & Baggage Handling, Warehouse Inventory IoT"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-blue-950 text-xs text-white focus:outline-none focus:border-blue-600 font-mono shadow-inner"
                  />
                  {selectedPresetId && (
                    <button
                      type="button"
                      onClick={() => {
                        const p = DOMAIN_PRESETS.find(p => p.id === selectedPresetId);
                        if (p) handleLoadExample(p);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900/80 text-sky-300 text-xs font-mono font-semibold border border-blue-800/80 transition-all shrink-0"
                      title="Instantly test with pre-built sample data and questions"
                    >
                      Instant Test Example
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Step 2: Auto-Synchronized AI Prompts (Copy & Paste) */}
            <section className="p-6 sm:p-8 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                    2
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      Copy Synchronized AI Prompts for ChatGPT / Claude / Gemini
                    </h2>
                    <p className="text-xs text-slate-400">
                      These prompts are automatically synchronized with your chosen topic: <strong className="text-sky-300">&quot;{customTopic}&quot;</strong>
                    </p>
                  </div>
                </div>

                {/* Prompt Format Selector */}
                <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-blue-950 text-xs font-mono">
                  <button
                    onClick={() => setPromptTab('all-in-one')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      promptTab === 'all-in-one'
                        ? 'bg-blue-900 text-sky-200 border border-blue-600 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All-in-One Prompt (Recommended)
                  </button>
                  <button
                    onClick={() => setPromptTab('separate')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      promptTab === 'separate'
                        ? 'bg-blue-900 text-sky-200 border border-blue-600 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Separate Prompts (SQL & Questions)
                  </button>
                </div>
              </div>

              {/* Prompt Box: All-In-One */}
              {promptTab === 'all-in-one' ? (
                <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-sky-300 font-semibold">
                      <Sparkles className="w-4 h-4 text-sky-400" />
                      <span>All-in-One Synchronized Prompt (Database SQL + 10 Questions):</span>
                    </div>

                    <button
                      onClick={() => handleCopy(getSynchronizedAllInOnePrompt(customTopic), 'all')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900/80 text-sky-300 border border-blue-700/80 text-xs font-mono font-bold transition-all shadow-md active:scale-95"
                    >
                      {copiedType === 'all' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-300">Prompt Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy All-in-One Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-slate-900/90 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed border border-blue-950/80 select-all">
                    {getSynchronizedAllInOnePrompt(customTopic)}
                  </pre>
                </div>
              ) : (
                /* Prompt Box: Separate Prompts */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Database Prompt */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-sky-300 flex items-center gap-1.5">
                        <Database className="w-4 h-4 text-sky-400" />
                        Part 1: Mock Database Prompt
                      </span>
                      <button
                        onClick={() => handleCopy(getDatabasePromptOnly(customTopic), 'db')}
                        className="px-3 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-sky-300 border border-blue-800 text-xs font-mono font-semibold"
                      >
                        {copiedType === 'db' ? 'Copied!' : 'Copy SQL Prompt'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto border border-blue-950">
                      {getDatabasePromptOnly(customTopic)}
                    </pre>
                  </div>

                  {/* Questions Prompt */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-sky-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-sky-400" />
                        Part 2: Questions Prompt
                      </span>
                      <button
                        onClick={() => handleCopy(getQuestionsPromptOnly(customTopic), 'questions')}
                        className="px-3 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-sky-300 border border-blue-800 text-xs font-mono font-semibold"
                      >
                        {copiedType === 'questions' ? 'Copied!' : 'Copy Questions Prompt'}
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto border border-blue-950">
                      {getQuestionsPromptOnly(customTopic)}
                    </pre>
                  </div>
                </div>
              )}
            </section>

            {/* Step 3: Upload .txt File or Paste Response */}
            <section className="p-6 sm:p-8 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                  3
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Upload AI .txt Document or Paste Content
                  </h2>
                  <p className="text-xs text-slate-400">
                    Paste the response from ChatGPT/Claude or attach your saved .txt file. The system will auto-test the database and parse the questions!
                  </p>
                </div>
              </div>

              {/* Drag & Drop File Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-900 hover:border-blue-600 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-slate-950/60 hover:bg-blue-950/20 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-sky-400 mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-sky-300" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  Click to choose a <span className="text-sky-300">.txt file</span> from your computer
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Supports UTF-8 plain text files generated by any AI'}
                </p>
              </div>

              {/* Text Area Paste */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 font-mono">Or paste the AI output directly:</span>
                  {txtContent && (
                    <button
                      onClick={() => {
                        setTxtContent('');
                        handleProcessText('');
                      }}
                      className="text-slate-500 hover:text-slate-300 text-xs font-mono"
                    >
                      Clear Content
                    </button>
                  )}
                </div>
                <textarea
                  value={txtContent}
                  onChange={(e) => {
                    setTxtContent(e.target.value);
                    handleProcessText(e.target.value);
                  }}
                  rows={6}
                  placeholder="Paste AI response here (e.g. === MOCK DATABASE SQL === ... === QUESTION 1 === ...)"
                  className="w-full p-4 rounded-xl bg-slate-950 border border-blue-950 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 shadow-inner"
                />
              </div>

              {parseError && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}
            </section>

            {/* Step 4: Live Synchronization Preview & Launch */}
            {parseResult && (
              <section className="p-6 sm:p-8 rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/20 via-slate-950 to-slate-950 shadow-2xl space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/60 text-emerald-400 shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Synchronized Custom Assessment Ready!
                      </h2>
                      <p className="text-xs text-emerald-300 font-mono">
                        Mock Database & Questions are verified and ready for browser execution.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLaunchAssessment}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono text-sm transition-all shadow-lg shadow-blue-900/50 border border-blue-400/40 active:scale-95 flex items-center justify-center gap-2 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Launch Custom Assessment</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Database Preview */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-950">
                      <h3 className="text-xs font-mono font-bold text-sky-300 flex items-center gap-2">
                        <Database className="w-4 h-4 text-sky-400" />
                        Mock Database Tables ({parseResult.schema.length})
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800">
                        {parseResult.hasCustomDatabase ? 'Custom Schema Loaded' : 'Default POS Tables'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {parseResult.schema.map((tbl) => (
                        <div key={tbl.table} className="p-3 rounded-lg bg-slate-900/80 border border-blue-950/80 flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <Table2 className="w-3.5 h-3.5 text-sky-400" />
                            <span className="font-bold text-white">{tbl.table}</span>
                          </div>
                          <span className="text-slate-400">
                            {tbl.rowCount} rows &bull; {tbl.columns.length} cols
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Questions Preview */}
                  <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-950">
                      <h3 className="text-xs font-mono font-bold text-sky-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-sky-400" />
                        Questions Extracted ({parseResult.count})
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                        Validated
                      </span>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                      {parseResult.questions.map((q, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-blue-950/80 text-slate-300">
                          <div className="flex items-center gap-2 font-bold text-sky-300 text-[11px]">
                            <span>#{idx + 1} {q.ticketId}</span>
                            <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-200 text-[10px]">
                              {q.category}
                            </span>
                            <span className="text-slate-400 font-normal">({q.difficulty})</span>
                          </div>
                          <p className="text-xs text-slate-200 mt-1 font-sans line-clamp-1">{q.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* MODE 2: Gemini API Key Generator */}
        {builderMode === 'gemini-api' && (
          <section className="p-6 sm:p-8 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                ⚡
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Direct In-Browser Gemini AI Generator
                </h2>
                <p className="text-xs text-slate-400">
                  Generate 10 technical support troubleshooting questions directly using your Google Gemini API key.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: API Key */}
              <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200 font-mono">
                    Google Gemini API Key:
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        setIsSavedKey(false);
                      }}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-2.5 pr-20 rounded-xl bg-slate-900 border border-blue-950 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-600"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          saveApiKey(apiKey);
                          setIsSavedKey(true);
                        }}
                        disabled={!apiKey.trim()}
                        className="px-2 py-1 rounded bg-blue-950 hover:bg-blue-900 text-sky-300 border border-blue-800 text-[11px] font-mono"
                      >
                        {isSavedKey ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 underline font-mono"
                >
                  Get free API key in Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Right: Parameters */}
              <div className="p-5 rounded-xl bg-slate-950 border border-blue-950 space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-slate-300 font-semibold">Domain:</span>
                  <div className="text-sky-300 font-bold">{customTopic}</div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-300 font-semibold">Difficulty:</span>
                  <div className="flex gap-2">
                    {['Mixed', 'Basic', 'Medium', 'Advanced'].map(diff => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setApiDifficulty(diff)}
                        className={`px-3 py-1.5 rounded-lg border ${
                          apiDifficulty === diff
                            ? 'bg-blue-900 text-sky-200 border-blue-600 font-bold'
                            : 'bg-slate-900 border-blue-950 text-slate-400'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-300 font-semibold">Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['SQL', 'PowerShell', 'Network Troubleshooting'].map(topic => {
                      const isSelected = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (selectedTopics.length > 1) {
                                setSelectedTopics(selectedTopics.filter(t => t !== topic));
                              }
                            } else {
                              setSelectedTopics([...selectedTopics, topic]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                            isSelected
                              ? 'bg-blue-900/80 text-sky-200 border-blue-600 font-semibold'
                              : 'bg-slate-900 border-blue-950 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{apiError}</span>
              </div>
            )}

            <button
              onClick={handleGeminiGenerate}
              disabled={isGenerating || !apiKey.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono text-sm transition-all shadow-lg shadow-blue-900/50 border border-blue-400/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating 10 Scenarios via Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 10 Questions and Launch</span>
                </>
              )}
            </button>
          </section>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t theme-border bg-[var(--bg-surface)] py-6 px-6 text-center text-xs theme-text-muted font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>SSEQUEL Assessment Platform &bull; Dynamic AlaSQL Execution Engine</span>
          <button
            onClick={() => navigate('/assessment')}
            className="text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 underline underline-offset-4"
          >
            Return to Active Assessment
          </button>
        </div>
      </footer>
    </div>
  );
}
