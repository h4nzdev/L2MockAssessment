import { useState, useRef, useCallback } from 'react';
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
  Lock,
  Unlock,
  RotateCcw
} from 'lucide-react';
import { 
  DOMAIN_PRESETS, 
  parseSqlSchemaOnly,
  generateQuestionsPromptFromSqlSchema,
  parseCustomAssessmentTxt,
  parseAiTxt
} from '../utils/aiTxtParser';
import { applyCustomDatabase, clearCustomDatabase } from '../data/mockDatabase';
import { getStoredApiKey, saveApiKey, generateAITemplateQuestions } from '../services/geminiService';
import ThemeToggle from '../components/ThemeToggle';
import ssquelLogo from '../assets/ssquel.png';

export default function CustomBuilderPage() {
  const navigate = useNavigate();

  // Builder Mode: 'txt-sync' (No API Key - Prompt & TXT) | 'gemini-api' (API Key)
  const [builderMode, setBuilderMode] = useState('txt-sync');

  // Domain / Topic Selection
  const [selectedPresetId, setSelectedPresetId] = useState('restaurant');
  const [customTopic, setCustomTopic] = useState('Restaurant POS & Kitchen Display');

  // Step 1: Database SQL State
  const initialPresetSql = DOMAIN_PRESETS[0]?.sampleSql?.trim() || '';
  const [sqlInput, setSqlInput] = useState(initialPresetSql);
  const [sqlFileName, setSqlFileName] = useState('');
  const [sqlParseResult, setSqlParseResult] = useState(() => initialPresetSql ? parseSqlSchemaOnly(initialPresetSql) : null);
  const [sqlError, setSqlError] = useState('');
  const sqlFileInputRef = useRef(null);

  // Step 2: Generated Prompt State
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Step 3: Questions State
  const [txtContent, setTxtContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [parseError, setParseError] = useState('');
  const questionsFileInputRef = useRef(null);

  // Gemini API Mode States
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const isSavedKey = !!getStoredApiKey();
  const [apiDifficulty, setApiDifficulty] = useState('Mixed');
  const [selectedTopics, setSelectedTopics] = useState(['SQL', 'PowerShell', 'Network Troubleshooting']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState('');

  // Process and validate SQL
  const handleProcessSql = useCallback((sqlText) => {
    setSqlError('');
    if (!sqlText || !sqlText.trim()) {
      setSqlParseResult(null);
      return;
    }

    const res = parseSqlSchemaOnly(sqlText);
    if (res.success) {
      setSqlParseResult(res);
    } else {
      setSqlParseResult(null);
      setSqlError(res.error || 'Failed to parse database SQL.');
    }
  }, []);

  // Handle Preset Select
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCustomTopic(preset.title);
    setSqlFileName('');
    const sampleSql = preset.sampleSql.trim();
    setSqlInput(sampleSql);
    handleProcessSql(sampleSql);
  };

  // SQL File Upload (.sql or .txt)
  const handleSqlFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSqlFileName(file.name);
    setSqlError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setSqlInput(content);
        handleProcessSql(content);
      }
    };
    reader.onerror = () => {
      setSqlError('Failed to read the selected SQL file.');
    };
    reader.readAsText(file);
  };

  // Process Questions Text (.txt or pasted)
  const handleProcessQuestions = (content) => {
    setParseError('');
    if (!content.trim()) {
      setParseResult(null);
      return;
    }

    // Check if user uploaded a combined SQL + Questions document
    if (content.includes('=== MOCK DATABASE SQL ===') || content.includes('CREATE TABLE')) {
      const combinedRes = parseCustomAssessmentTxt(content);
      if (combinedRes.success) {
        setParseResult(combinedRes);
        if (combinedRes.databaseSql && !sqlInput) {
          setSqlInput(combinedRes.databaseSql);
          handleProcessSql(combinedRes.databaseSql);
        }
        return;
      }
    }

    // Standard question block parser
    const qRes = parseAiTxt(content);
    if (qRes.success && qRes.questions && qRes.questions.length > 0) {
      const activeSchema = sqlParseResult?.schema || [];
      setParseResult({
        success: true,
        hasCustomDatabase: activeSchema.length > 0,
        databaseSql: sqlInput,
        schema: activeSchema,
        questions: qRes.questions,
        count: qRes.questions.length
      });
    } else {
      setParseResult(null);
      setParseError(qRes.error || 'Could not extract questions from the provided text.');
    }
  };

  // Questions File Upload
  const handleQuestionsFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setParseError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setTxtContent(content);
        handleProcessQuestions(content);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the selected questions file.');
    };
    reader.readAsText(file);
  };

  // Copy Prompt
  const handleCopyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Launch Custom Assessment
  const handleLaunchAssessment = () => {
    if (!parseResult || !parseResult.questions || parseResult.questions.length === 0) return;

    // 1. If custom database SQL exists, apply it in AlaSQL & localStorage
    if (sqlInput && sqlInput.trim().length > 10) {
      applyCustomDatabase(sqlInput);
      if (sqlParseResult?.schema) {
        localStorage.setItem('support_sql_custom_db_schema', JSON.stringify(sqlParseResult.schema));
      }
      localStorage.setItem('support_sql_custom_db_domain', customTopic);
    } else if (parseResult.hasCustomDatabase && parseResult.databaseSql) {
      applyCustomDatabase(parseResult.databaseSql);
      localStorage.setItem('support_sql_custom_db_schema', JSON.stringify(parseResult.schema));
      localStorage.setItem('support_sql_custom_db_domain', customTopic);
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

  // Generated question prompt based on active SQL schema
  const isSqlReady = !!(sqlParseResult && sqlParseResult.success && sqlParseResult.schema?.length > 0);
  const generatedQuestionPrompt = isSqlReady
    ? generateQuestionsPromptFromSqlSchema({
        sqlCode: sqlInput,
        schema: sqlParseResult.schema,
        domainName: customTopic
      })
    : '';

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
                  SSEQUEL <span className="font-normal text-sm sm:text-base opacity-90">Custom Assessment Builder</span>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 text-[10px] font-mono border border-blue-200 dark:border-blue-700/60">
                    Synchronized AlaSQL Engine
                  </span>
                </h1>
                <p className="text-xs theme-text-muted">
                  Attach your SQL database to automatically generate your customized Question Prompt
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
                <span>SQL File &amp; Prompt (No API Key)</span>
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

        {/* MODE 1: SQL Attachment & Prompt Flow (No API Key) */}
        {builderMode === 'txt-sync' && (
          <div className="space-y-8">
            
            {/* STEP 1: Provide / Attach Mock Database SQL */}
            <section className="p-6 sm:p-8 rounded-2xl border theme-border bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                    1
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold theme-text flex items-center gap-2">
                      Attach or Provide Your Database SQL
                      {isSqlReady && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-600/60 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {sqlParseResult.schema.length} Table(s) Verified
                        </span>
                      )}
                    </h2>
                    <p className="text-xs theme-text-muted">
                      Attach a <strong className="theme-text">.sql file</strong>, paste raw <code className="text-blue-600 dark:text-sky-300">CREATE TABLE / INSERT</code> statements, or pick a pre-configured domain preset.
                    </p>
                  </div>
                </div>

                {/* Quick Presets Dropdown/Selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-mono theme-text-muted uppercase mr-1">Quick Presets:</span>
                  {DOMAIN_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                        selectedPresetId === preset.id
                          ? 'bg-blue-600 text-white border-blue-500 font-semibold dark:bg-blue-900 dark:text-sky-200 dark:border-blue-600'
                          : 'bg-[var(--bg-surface)] theme-border theme-text-muted hover:theme-text hover:bg-[var(--bg-surface2)]'
                      }`}
                    >
                      {preset.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Dropzone & SQL Editor Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* File Attachment Dropzone */}
                <div
                  onClick={() => sqlFileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 dark:border-blue-900 hover:border-blue-500 dark:hover:border-blue-600 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[var(--bg-surface2)] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 group flex flex-col items-center justify-center min-h-[160px]"
                >
                  <input
                    ref={sqlFileInputRef}
                    type="file"
                    accept=".sql,.txt,text/plain"
                    onChange={handleSqlFileUpload}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-2 group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-semibold theme-text mb-0.5">
                    Attach <span className="text-blue-600 dark:text-sky-300 font-mono">.sql / .txt</span> file
                  </h3>
                  <p className="text-[11px] theme-text-muted font-mono">
                    {sqlFileName ? `Attached: ${sqlFileName}` : 'Click to select SQL file from computer'}
                  </p>
                </div>

                {/* SQL Code Textarea */}
                <div className="lg:col-span-2 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold theme-text font-mono flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
                      SQL Table Definitions &amp; Sample Data:
                    </span>
                    {sqlInput && (
                      <button
                        onClick={() => {
                          setSqlInput('');
                          setSqlFileName('');
                          handleProcessSql('');
                        }}
                        className="theme-text-muted hover:theme-text text-xs font-mono flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Clear SQL
                      </button>
                    )}
                  </div>
                  <textarea
                    value={sqlInput}
                    onChange={(e) => {
                      setSqlInput(e.target.value);
                      handleProcessSql(e.target.value);
                    }}
                    rows={6}
                    placeholder="CREATE TABLE TableName (col1 INT, col2 STRING, col3 NUMBER);\nINSERT INTO TableName VALUES (1, 'Sample', 99.00);"
                    className="w-full p-3.5 rounded-xl bg-[var(--bg-input)] border theme-border text-xs font-mono theme-text placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 shadow-inner"
                  />
                </div>
              </div>

              {sqlError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                  <span>{sqlError}</span>
                </div>
              )}

              {/* Detected Tables Preview Pills */}
              {isSqlReady && (
                <div className="p-4 rounded-xl bg-[var(--bg-surface2)] border theme-border-m space-y-2">
                  <div className="text-xs font-mono font-semibold theme-text flex items-center gap-2">
                    <Table2 className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                    <span>Introspected Schema ({sqlParseResult.schema.length} Active Tables):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {sqlParseResult.schema.map((tbl) => (
                      <div key={tbl.table} className="p-2.5 rounded-lg bg-[var(--bg-surface)] border theme-border text-xs font-mono flex items-center justify-between">
                        <span className="font-bold text-blue-700 dark:text-sky-300">{tbl.table}</span>
                        <span className="text-[11px] theme-text-muted">
                          {tbl.columns.length} cols &bull; {tbl.rowCount} rows
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* STEP 2: Unlocked Question Generator Prompt */}
            <section className={`p-6 sm:p-8 rounded-2xl border transition-all shadow-xl space-y-6 ${
              isSqlReady
                ? 'border-blue-400 dark:border-blue-800 bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950'
                : 'border-[var(--border-muted)] bg-[var(--bg-surface2)] opacity-75'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl border flex items-center justify-center font-mono font-bold text-sm ${
                    isSqlReady
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500'
                  }`}>
                    {isSqlReady ? <Unlock className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4 text-slate-400" />}
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold theme-text flex items-center gap-2">
                      {isSqlReady ? 'Step 2: Copy Your Tailored AI Question Prompt' : 'Step 2: Question Prompt (Locked)'}
                      {isSqlReady && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 text-[10px] font-mono border border-blue-200 dark:border-blue-700/60 uppercase font-bold">
                          Unlocked &amp; Ready
                        </span>
                      )}
                    </h2>
                    <p className="text-xs theme-text-muted">
                      {isSqlReady
                        ? 'This prompt is automatically populated with your exact tables and columns. Copy and paste it into ChatGPT / Claude / Gemini / DeepSeek.'
                        : 'Provide or attach your database SQL in Step 1 above to unlock your customized AI Question Prompt.'}
                    </p>
                  </div>
                </div>

                {isSqlReady && (
                  <button
                    onClick={() => handleCopyPrompt(generatedQuestionPrompt)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-mono text-xs font-bold transition-all shadow-lg active:scale-95 shrink-0 border border-blue-400/40"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Prompt Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Prompt for Questions</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isSqlReady ? (
                <div className="p-4 rounded-xl bg-[var(--bg-surface)] border theme-border space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono theme-text-muted">
                    <span className="flex items-center gap-1.5 font-semibold text-blue-600 dark:text-sky-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      Customized AI Prompt (Includes your {sqlParseResult.schema.length} tables):
                    </span>
                    <span>10 Questions (6 SQL + 2 PowerShell + 2 Network)</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-[var(--bg-code)] text-xs font-mono theme-text max-h-52 overflow-y-auto leading-relaxed border theme-border-m select-all">
                    {generatedQuestionPrompt}
                  </pre>
                  <p className="text-[11px] theme-text-muted">
                    💡 <strong>Instructions:</strong> Copy the prompt above &rarr; Paste into any AI model &rarr; Copy the AI&apos;s generated text &rarr; Proceed to Step 3 below.
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl border border-dashed theme-border bg-[var(--bg-surface)] space-y-2">
                  <Lock className="w-8 h-8 text-slate-400 mx-auto opacity-60" />
                  <h4 className="text-xs font-semibold theme-text">Prompt Locked</h4>
                  <p className="text-[11px] theme-text-muted max-w-sm mx-auto">
                    Provide your SQL schema in Step 1 to automatically generate a question prompt tailored to your database tables.
                  </p>
                </div>
              )}
            </section>

            {/* STEP 3: Upload AI-Generated Questions (.txt or Paste) */}
            <section className="p-6 sm:p-8 rounded-2xl border theme-border bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                  3
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold theme-text">
                    Import AI-Generated Questions &amp; Answers (.txt)
                  </h2>
                  <p className="text-xs theme-text-muted">
                    Paste the response from your AI or attach your saved <strong className="theme-text">.txt</strong> file. SSEQUEL will automatically validate the queries against your database.
                  </p>
                </div>
              </div>

              {/* Drag & Drop File Picker */}
              <div
                onClick={() => questionsFileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 dark:border-blue-900 hover:border-blue-500 dark:hover:border-blue-600 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all bg-[var(--bg-surface2)] hover:bg-blue-50/50 dark:hover:bg-blue-950/20 group"
              >
                <input
                  ref={questionsFileInputRef}
                  type="file"
                  accept=".txt,.sql,text/plain"
                  onChange={handleQuestionsFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-sky-400 mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-current dark:text-sky-300" />
                </div>
                <h3 className="text-sm font-semibold theme-text mb-1">
                  Click to choose your <span className="text-blue-600 dark:text-sky-300 font-mono">.txt file</span>
                </h3>
                <p className="text-xs theme-text-muted font-mono">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Supports plain text files containing === QUESTION 1 === blocks'}
                </p>
              </div>

              {/* Text Area Paste */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold theme-text font-mono">Or paste the AI output directly:</span>
                  {txtContent && (
                    <button
                      onClick={() => {
                        setTxtContent('');
                        handleProcessQuestions('');
                      }}
                      className="theme-text-muted hover:theme-text text-xs font-mono"
                    >
                      Clear Content
                    </button>
                  )}
                </div>
                <textarea
                  value={txtContent}
                  onChange={(e) => {
                    setTxtContent(e.target.value);
                    handleProcessQuestions(e.target.value);
                  }}
                  rows={6}
                  placeholder="Paste AI response here (e.g. === QUESTION 1 ===\nCATEGORY: SQL\nDIFFICULTY: Basic\n...)"
                  className="w-full p-4 rounded-xl bg-[var(--bg-input)] border theme-border text-xs font-mono theme-text placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>

              {parseError && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}
            </section>

            {/* STEP 4: Live Synchronization Preview & Launch */}
            {parseResult && parseResult.questions && parseResult.questions.length > 0 && (
              <section className="p-6 sm:p-8 rounded-2xl border border-emerald-400 dark:border-emerald-500/50 bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 shadow-2xl space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b theme-border-m">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/60 text-emerald-600 dark:text-emerald-400 shadow-md">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold theme-text">
                        Custom Assessment Ready to Launch!
                      </h2>
                      <p className="text-xs text-emerald-600 dark:text-emerald-300 font-mono">
                        {sqlParseResult?.schema?.length || 0} Database Tables &bull; {parseResult.count} Troubleshooting Questions Extracted
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLaunchAssessment}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono text-sm transition-all shadow-lg shadow-blue-900/40 border border-blue-400/40 active:scale-95 flex items-center justify-center gap-2 shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Launch Custom Assessment</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Database Preview */}
                  <div className="p-5 rounded-xl bg-[var(--bg-surface2)] border theme-border-m space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b theme-border-m">
                      <h3 className="text-xs font-mono font-bold theme-text flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                        Database Tables ({sqlParseResult?.schema?.length || 0})
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800">
                        AlaSQL Ready
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(sqlParseResult?.schema || []).map((tbl) => (
                        <div key={tbl.table} className="p-3 rounded-lg bg-[var(--bg-surface)] border theme-border flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <Table2 className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
                            <span className="font-bold theme-text">{tbl.table}</span>
                          </div>
                          <span className="theme-text-muted">
                            {tbl.rowCount} rows &bull; {tbl.columns.length} cols
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Questions Preview */}
                  <div className="p-5 rounded-xl bg-[var(--bg-surface2)] border theme-border-m space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b theme-border-m">
                      <h3 className="text-xs font-mono font-bold theme-text flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                        Questions Extracted ({parseResult.count})
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 font-bold">
                        Validated
                      </span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {parseResult.questions.map((q, idx) => (
                        <div key={q.id || idx} className="p-2.5 rounded-lg bg-[var(--bg-surface)] border theme-border flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 dark:text-sky-400 font-bold">#{idx + 1}</span>
                            <span className="theme-text line-clamp-1">{q.title}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            q.category === 'PowerShell'
                              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              : q.category === 'Network Troubleshooting'
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300'
                          }`}>
                            {q.category || 'SQL'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>
        )}

        {/* MODE 2: Gemini API Key Mode */}
        {builderMode === 'gemini-api' && (
          <section className="p-6 sm:p-8 rounded-2xl border theme-border bg-[var(--bg-card)] dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-950 dark:to-slate-950 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-sky-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold theme-text">
                  Direct In-App AI Generation (Gemini API Key)
                </h2>
                <p className="text-xs theme-text-muted">
                  Enter your free Gemini API key to generate 10 custom troubleshooting scenarios directly in the browser.
                </p>
              </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold theme-text font-mono">Google Gemini API Key:</label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Get a Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full pl-4 pr-24 py-2.5 rounded-xl bg-[var(--bg-input)] border theme-border text-xs theme-text font-mono focus:outline-none focus:border-blue-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text text-xs flex items-center gap-1"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showKey ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              {isSavedKey && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ Active API Key securely stored in browser localStorage
                </p>
              )}
            </div>

            {/* Scenario Domain */}
            <div className="space-y-2">
              <label className="text-xs font-semibold theme-text font-mono">
                Scenario Domain / Industry Topic:
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Retail POS, Healthcare Clinic, Hotel PMS"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-input)] border theme-border text-xs theme-text font-mono focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold theme-text font-mono">
                Target Difficulty Level:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Mixed', 'Basic', 'Medium', 'Advanced'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setApiDifficulty(diff)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                      apiDifficulty === diff
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md font-bold dark:bg-blue-900 dark:text-sky-200 dark:border-blue-600'
                        : 'bg-[var(--bg-surface)] theme-border theme-text-muted hover:theme-text'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Included */}
            <div className="space-y-2">
              <label className="text-xs font-semibold theme-text font-mono">
                Topics Included (3-in-1 Troubleshooting):
              </label>
              <div className="flex flex-wrap gap-2">
                {['SQL', 'PowerShell', 'Network Troubleshooting'].map((t) => {
                  const isSel = selectedTopics.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        if (isSel) {
                          if (selectedTopics.length > 1) setSelectedTopics(selectedTopics.filter(x => x !== t));
                        } else {
                          setSelectedTopics([...selectedTopics, t]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        isSel
                          ? 'bg-blue-600 text-white border-blue-500 font-bold dark:bg-blue-950 dark:text-sky-300 dark:border-blue-700'
                          : 'bg-[var(--bg-surface)] theme-border theme-text-muted'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {apiError && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-500/50 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleGeminiGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono text-xs shadow-lg transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connecting to Gemini &amp; Generating 10 Questions...</span>
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
