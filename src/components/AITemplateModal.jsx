import { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Key, 
  Eye, 
  EyeOff, 
  Terminal, 
  Database, 
  Wifi, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Building2,
  Check,
  Upload,
  FileText,
  Copy,
  FileUp
} from 'lucide-react';
import { getStoredApiKey, saveApiKey, generateAITemplateQuestions } from '../services/geminiService';
import { parseAiTxt, AI_PROMPT_TEMPLATE } from '../utils/aiTxtParser';

export default function AITemplateModal({ isOpen, onClose, onQuestionsGenerated }) {
  // Primary Generator Mode: 'txt-upload' (No API Key) | 'gemini-api' (API Key)
  const [modalMode, setModalMode] = useState('txt-upload');

  // API Key State
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showKey, setShowKey] = useState(false);
  const [isSavedKey, setIsSavedKey] = useState(() => !!getStoredApiKey());

  // Tabs Process for API Wizard: 1 = 'api', 2 = 'domain', 3 = 'topics', 4 = 'difficulty', 5 = 'preview'
  const [activeStep, setActiveStep] = useState(1);

  // Common Form Fields
  const [domain, setDomain] = useState('Restaurant POS, Kitchen Display & Bar Registers');
  const [difficulty, setDifficulty] = useState('Mixed');
  const [selectedTopics, setSelectedTopics] = useState(['SQL', 'PowerShell', 'Network Troubleshooting']);

  // TXT Upload & Paste State
  const [txtPastedContent, setTxtPastedContent] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [parseError, setParseError] = useState('');
  const fileInputRef = useRef(null);

  // Loading & Error States
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  const presetDomains = [
    { title: 'Restaurant POS & Kitchen Display', desc: 'Orders, kitchen printers, drawer kicks & bar terminals' },
    { title: 'Retail Supermarket & Store Servers', desc: 'Checkout lanes, barcode scanners, price servers & inventory' },
    { title: 'Hospitality & Hotel PMS', desc: 'Front desk terminals, key card encoders & reservation servers' },
    { title: 'Healthcare Clinic & Patient Registry', desc: 'EHR check-in kiosks, badge readers & HIPAA logs' },
    { title: 'Banking Branch ATM Fleet', desc: 'Cash dispenser controllers, encrypted PIN pads & vault sync' }
  ];

  if (!isOpen) return null;

  // Build customized prompt template for the selected domain
  const getCustomizedPrompt = () => {
    return AI_PROMPT_TEMPLATE.replace(
      'in the domain: Retail POS, Store Servers & Transaction Sync.',
      `in the domain: ${domain.trim() || 'Retail POS, Store Servers & Transaction Sync'}.`
    );
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(getCustomizedPrompt());
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setParseError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setTxtPastedContent(content);
        processParsedText(content);
      }
    };
    reader.onerror = () => {
      setParseError('Failed to read the selected file. Please ensure it is a valid UTF-8 .txt document.');
    };
    reader.readAsText(file);
  };

  const processParsedText = (content) => {
    setParseError('');
    const result = parseAiTxt(content);
    if (result.success && result.questions.length > 0) {
      setGeneratedQuestions(result.questions);
    } else {
      setGeneratedQuestions(null);
      setParseError(result.error || 'Could not parse questions from text.');
    }
  };

  const handlePasteChange = (val) => {
    setTxtPastedContent(val);
    if (val.trim()) {
      processParsedText(val);
    } else {
      setGeneratedQuestions(null);
      setParseError('');
    }
  };

  const handleToggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) return;
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSaveKey = () => {
    saveApiKey(apiKey);
    setIsSavedKey(true);
  };

  const handleGenerate = async () => {
    setErrorMsg('');

    if (!apiKey.trim()) {
      setActiveStep(1);
      setErrorMsg('Please enter your Google Gemini API Key in Step 1.');
      return;
    }

    saveApiKey(apiKey);
    setIsGenerating(true);

    try {
      const questions = await generateAITemplateQuestions({
        apiKey,
        domain,
        difficulty,
        topics: selectedTopics
      });
      setGeneratedQuestions(questions);
      setActiveStep(5);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate questions. Please verify your Gemini API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadIntoSession = () => {
    if (generatedQuestions && generatedQuestions.length > 0) {
      onQuestionsGenerated(generatedQuestions, domain);
      onClose();
    }
  };

  const steps = [
    { id: 1, label: 'API Key', icon: Key, ready: !!apiKey.trim() },
    { id: 2, label: 'Domain', icon: Building2, ready: !!domain.trim() },
    { id: 3, label: 'Topics', icon: Sliders, ready: selectedTopics.length > 0 },
    { id: 4, label: 'Difficulty & Launch', icon: Sparkles, ready: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-blue-900/60 bg-slate-950 shadow-2xl shadow-blue-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-950 bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg shadow-blue-900/40 border border-blue-500/30">
              <FileUp className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Custom Question & Scenario Builder
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-sky-300 border border-blue-700/60 font-semibold">
                  10 Questions Max
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Mix <span className="text-sky-300 font-semibold">SQL</span>, <span className="text-blue-300 font-semibold">PowerShell</span>, and <span className="text-indigo-300 font-semibold">Network Troubleshooting</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top-Level Mode Selector */}
        <div className="flex items-center border-b border-blue-950 bg-slate-900/70 p-2 gap-2 text-xs font-mono">
          <button
            onClick={() => setModalMode('txt-upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
              modalMode === 'txt-upload'
                ? 'bg-blue-900 text-sky-200 border border-blue-600 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Upload .txt / Copy AI Prompt (No API Key)</span>
          </button>

          <button
            onClick={() => setModalMode('gemini-api')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
              modalMode === 'gemini-api'
                ? 'bg-blue-900 text-sky-200 border border-blue-600 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Key className="w-4 h-4 text-sky-400" />
            <span>In-Browser Gemini API Key</span>
          </button>
        </div>

        {/* MODE 1: TXT Upload & Prompt Template (No API Key) */}
        {modalMode === 'txt-upload' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-950 space-y-6">
            
            {/* Step 1: Copy AI Prompt */}
            <div className="p-5 rounded-2xl border border-blue-900/50 bg-slate-900/70 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-xs">
                    1
                  </span>
                  <h4 className="font-bold text-sm text-white">
                    Copy AI Prompt Template for ChatGPT / Claude / Gemini
                  </h4>
                </div>

                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900/80 text-sky-300 border border-blue-700 text-xs font-mono font-semibold transition-all shadow-md active:scale-95 shrink-0"
                >
                  {isPromptCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Prompt Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Prompt to Clipboard</span>
                    </>
                  )}
                </button>
              </div>

              {/* Domain Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">
                  Troubleshooting Domain (Customizable):
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Restaurant POS, Supermarket, Hospital, Banking ATM"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-blue-950 text-xs text-white focus:outline-none focus:border-blue-600 font-mono shadow-inner"
                />
              </div>

              {/* Instructions Callout */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-slate-300 leading-relaxed space-y-1">
                <div className="font-semibold text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  Quick Instructions:
                </div>
                <ol className="list-decimal pl-5 space-y-0.5 text-slate-300">
                  <li>Click <strong className="text-white">Copy Prompt to Clipboard</strong> above.</li>
                  <li>Paste into any AI model (ChatGPT, Claude, or free Gemini).</li>
                  <li>Save or download the response as a <code className="text-sky-300">.txt</code> file (or simply copy the text).</li>
                  <li>Attach or paste the output below to instantly load your assessment!</li>
                </ol>
              </div>
            </div>

            {/* Step 2: Upload File or Paste Text */}
            <div className="p-5 rounded-2xl border border-blue-900/50 bg-slate-900/70 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-xs">
                  2
                </span>
                <h4 className="font-bold text-sm text-white">
                  Attach AI-Generated .txt File or Paste Text
                </h4>
              </div>

              {/* File Upload Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-900 hover:border-blue-600 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/60 hover:bg-blue-950/20 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-sky-400 mx-auto mb-2.5 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-sky-300" />
                </div>
                <p className="text-xs font-semibold text-white mb-1">
                  Click to select <span className="text-sky-300">.txt file</span> from your computer
                </p>
                <p className="text-[11px] text-slate-400">
                  {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Supports UTF-8 plain text (.txt)'}
                </p>
              </div>

              {/* Or Paste Direct Text */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Or paste the AI output directly:</span>
                  {txtPastedContent && (
                    <button
                      onClick={() => handlePasteChange('')}
                      className="text-slate-500 hover:text-slate-300 text-[11px] font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <textarea
                  value={txtPastedContent}
                  onChange={(e) => handlePasteChange(e.target.value)}
                  placeholder="Paste AI response here (e.g. === QUESTION 1 === ...)"
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-blue-950 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Parse Error Display */}
              {parseError && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}
            </div>

            {/* Step 3: Extracted Questions Preview */}
            {generatedQuestions && generatedQuestions.length > 0 && (
              <div className="p-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-emerald-200">
                      Successfully Extracted {generatedQuestions.length} Questions!
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                    Ready to Practice
                  </span>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {generatedQuestions.map((q, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/90 border border-blue-950 flex items-start justify-between gap-3 text-slate-300"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sky-300 font-bold">#{idx + 1} {q.ticketId}</span>
                          <span className="px-2 py-0.2 rounded bg-blue-950 text-blue-200 text-[10px] border border-blue-800">
                            {q.category}
                          </span>
                          <span className="text-[10px] text-slate-400">({q.difficulty})</span>
                        </div>
                        <p className="text-xs text-slate-200 font-sans font-medium line-clamp-1">
                          {q.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                          {q.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleLoadIntoSession}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono text-sm transition-all shadow-lg shadow-blue-900/50 border border-blue-400/40 active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Launch {generatedQuestions.length} Questions into Assessment</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: Gemini API Key Generator (Wizard Steps) */}
        {modalMode === 'gemini-api' && (
          <>
            {/* Step Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-blue-950 bg-slate-900/70 px-4 sm:px-6 py-2.5 text-xs overflow-x-auto gap-1">
              {steps.map((s) => {
                const isCurrent = activeStep === s.id;
                const isCompleted = s.ready && activeStep > s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(s.id)}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-xl font-mono text-xs transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-blue-900 text-sky-200 border border-blue-500/60 font-semibold shadow-md shadow-blue-950/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-blue-950 text-sky-300 border border-blue-700/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isCompleted ? <Check className="w-3 h-3 text-sky-400" /> : s.id}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Step Content Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">
              
              {/* TAB 1: API Key */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300 leading-relaxed space-y-2">
                    <p className="font-semibold text-sky-300 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-sky-400" />
                      Client-Side Gemini API Key
                    </p>
                    <p>
                      Your Google Gemini API key is stored strictly in your browser&apos;s local storage and is never sent to any server. You can generate a free API key in Google AI Studio.
                    </p>
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold underline underline-offset-2"
                    >
                      Get a free Gemini API Key in Google AI Studio <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 font-mono">
                      Gemini API Key:
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
                        className="w-full px-3 py-2.5 pr-20 rounded-xl bg-slate-900 border border-blue-950 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="p-1 rounded text-slate-400 hover:text-slate-200"
                          title={showKey ? 'Hide Key' : 'Show Key'}
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveKey}
                          disabled={!apiKey.trim()}
                          className="px-2 py-1 rounded bg-blue-950 hover:bg-blue-900 text-sky-300 border border-blue-800 text-[11px] font-mono transition-colors disabled:opacity-50"
                        >
                          {isSavedKey ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Domain */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 font-mono">
                      Target Troubleshooting Domain:
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="e.g. Restaurant POS, Kitchen Display & Bar Registers"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-blue-950 text-xs text-white focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 font-mono uppercase tracking-wider block">
                      Or Choose Domain Presets:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {presetDomains.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setDomain(p.title)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            domain === p.title
                              ? 'bg-blue-900/60 border-blue-600 text-sky-200 shadow-sm'
                              : 'bg-slate-900/60 border-blue-950/80 text-slate-300 hover:bg-slate-900 hover:border-blue-800'
                          }`}
                        >
                          <div className="font-bold text-xs text-white">{p.title}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Topics */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <span className="text-xs text-slate-400">
                    Select which technical support areas should be generated in the 10-question set:
                  </span>
                  <div className="space-y-2.5">
                    {[
                      { name: 'SQL', desc: 'Queries, data reconciliation, error log analysis and sync audit', icon: Database },
                      { name: 'PowerShell', desc: 'Process management, service restart, and event log checking', icon: Terminal },
                      { name: 'Network Troubleshooting', desc: 'Ping diagnostics, TCP port connectivity, and gateway triage', icon: Wifi }
                    ].map((topic) => {
                      const isSelected = selectedTopics.includes(topic.name);
                      const Icon = topic.icon;
                      return (
                        <button
                          key={topic.name}
                          type="button"
                          onClick={() => handleToggleTopic(topic.name)}
                          className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                            isSelected
                              ? 'bg-blue-900/50 border-blue-600 text-sky-200 shadow-sm'
                              : 'bg-slate-900/50 border-blue-950 text-slate-400 hover:bg-slate-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-950 text-sky-400 border border-blue-700' : 'bg-slate-950 text-slate-500'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white flex items-center gap-2">
                              {topic.name}
                              {isSelected && <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-sky-300 font-mono">Selected</span>}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{topic.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: Difficulty & Launch */}
              {activeStep === 4 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200 font-mono">
                      Difficulty Curve:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Mixed', 'Basic', 'Medium', 'Advanced'].map((diff) => (
                        <button
                          key={diff}
                          type="button"
                          onClick={() => setDifficulty(diff)}
                          className={`py-2 px-3 rounded-xl border font-mono text-xs font-semibold transition-all ${
                            difficulty === diff
                              ? 'bg-blue-900 text-sky-200 border-blue-600 shadow-sm'
                              : 'bg-slate-900 border-blue-950 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {diff}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-950 space-y-2 font-mono text-xs">
                    <div className="text-slate-400">
                      Summary: <span className="text-sky-300 font-bold">10 Questions</span>
                    </div>
                    <div className="text-slate-400">
                      Domain: <span className="text-slate-200">{domain}</span>
                    </div>
                    <div className="text-slate-400">
                      Topics: <span className="text-slate-200">{selectedTopics.join(', ')}</span>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Preview & Load */}
              {activeStep === 5 && generatedQuestions && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">
                      10 Generated Questions Ready
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      Ready
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 font-mono text-xs">
                    {generatedQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-blue-950">
                        <div className="flex items-center gap-2 text-sky-300 font-bold">
                          <span>#{idx + 1} {q.ticketId}</span>
                          <span className="text-slate-400 font-normal">({q.category})</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 font-sans">{q.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* API Mode Footer Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-blue-950 bg-slate-950 text-xs">
              {activeStep > 1 && activeStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Cancel
                </button>
              )}

              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-sky-200 border border-blue-700/60 font-mono font-medium transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : activeStep === 4 ? (
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !apiKey.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono transition-all shadow-lg shadow-blue-900/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/40"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating 10 Scenarios...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate 10 AI Questions</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadIntoSession}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold font-mono transition-all shadow-lg shadow-blue-900/40 active:scale-95 border border-blue-400/40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start 10-Question AI Assessment</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
