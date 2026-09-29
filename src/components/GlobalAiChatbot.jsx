import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  X,
  Minus,
  Send,
  RotateCcw,
  Key,
  Shield,
  ExternalLink,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  Code2,
  Check,
  Eye,
  EyeOff,
  ChevronRight,
  Database,
  Terminal,
  FileQuestion,
  Lock
} from 'lucide-react';
import { getStoredApiKey, saveApiKey, chatWithGeminiMentor } from '../services/geminiService';
import ssquelLogo from '../assets/ssquel.png';

export default function GlobalAiChatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // API Key State
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [tempApiKey, setTempApiKey] = useState('');
  const [showKeyText, setShowKeyText] = useState(false);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Active Problem Context
  const [activeContext, setActiveContext] = useState(null);
  const [includeContext, setIncludeContext] = useState(true);

  // Chat Messages
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'model',
      content: "👋 Hello! I am **SSEQUEL AI Mentor**.\n\nI am here to help you understand difficult technical problems, explain error codes in simple terms, and review your troubleshooting logic **without spoiling the full query or giving away the answers**.\n\nHow can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Listen for context broadcasts from pages (Simulator, Assessment, Builder, etc.)
  useEffect(() => {
    const handleContextEvent = (event) => {
      if (event.detail) {
        setActiveContext(event.detail);
        if (event.detail.autoOpen) {
          setIsOpen(true);
          setIsMinimized(false);
        }
      }
    };

    window.addEventListener('ssequel:set-ai-context', handleContextEvent);
    return () => window.removeEventListener('ssequel:set-ai-context', handleContextEvent);
  }, []);

  // Update context dynamically based on route if no specific custom event was fired
  useEffect(() => {
    if (location.pathname === '/simulator') {
      try {
        const saved = localStorage.getItem('ssequel_simulator_tickets');
        if (saved) {
          const tickets = JSON.parse(saved);
          const firstOpen = tickets.find(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS');
          if (firstOpen) {
            setActiveContext({
              source: 'Simulator Active Incident',
              title: `${firstOpen.id}: ${firstOpen.title}`,
              details: {
                ticketId: firstOpen.id,
                title: firstOpen.title,
                category: firstOpen.category,
                scenario: firstOpen.incidentNarrative || firstOpen.customerStatement,
                objective: firstOpen.incidentObjective,
                affectedService: firstOpen.affectedService,
                logs: firstOpen.terminalLogs
              }
            });
            return;
          }
        }
      } catch {
        // ignore
      }
    } else if (location.pathname === '/builder') {
      setActiveContext({
        source: 'AI Custom Assessment & Database Builder',
        title: 'Custom Questions & Schema Builder',
        details: 'User is creating customized technical questions and mock database schemas.'
      });
    } else if (location.pathname === '/documentation') {
      setActiveContext({
        source: 'L2 Technical Runbooks & Architecture Guide',
        title: 'Runbooks Documentation',
        details: 'User is reviewing error code matrices, SOP flowcharts, and SQL database schemas.'
      });
    } else if (location.pathname === '/assessment') {
      setActiveContext({
        source: 'L2 Hands-On Assessment Bank',
        title: 'Assessment Mode',
        details: 'User is completing hands-on Level 2 SQL, PowerShell, and SRE incident questions.'
      });
    } else {
      setActiveContext(null);
    }
  }, [location.pathname]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Handle Save API Key
  const handleSaveApiKey = () => {
    saveApiKey(tempApiKey);
    setApiKey(tempApiKey.trim());
    setShowSettings(false);
    setKeySavedToast(true);
    setErrorMessage('');
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  // Handle Clear API Key
  const handleClearApiKey = () => {
    saveApiKey('');
    setApiKey('');
    setTempApiKey('');
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 2500);
  };

  // Handle Send Message
  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Build conversation history (skip initial welcome message)
      const chatHistory = newMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, content: m.content }));

      const problemPayload = includeContext && activeContext ? activeContext : null;

      const aiResponse = await chatWithGeminiMentor({
        apiKey,
        messages: chatHistory,
        problemContext: problemPayload
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: aiResponse
        }
      ]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to get a response from Gemini API.');
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: `⚠️ **Error communicating with Gemini API:** ${err.message || 'Unknown error'}\n\nPlease check your API key in Settings (🔑).`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        content: "Chat cleared. I am ready to guide you on any SQL, PowerShell, or IT support problem without spoiling direct answers. What are you working on?"
      }
    ]);
    setErrorMessage('');
  };

  // Suggested Prompts
  const quickPrompts = [
    "Explain this problem in simple terms",
    "What table and columns should I look at?",
    "What does this error message mean?",
    "Can you review my draft query without giving the solution?"
  ];

  return (
    <>
      {/* ── Global Floating Trigger Button (Bottom-Right: Pure Circular Icon) ── */}
      {(!isOpen || isMinimized) && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in zoom-in-90 duration-200">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              if (!apiKey) setShowSettings(true);
            }}
            className="group relative w-14 h-14 rounded-full bg-white hover:bg-slate-100 shadow-2xl hover:shadow-blue-500/25 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center p-2.5 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            title="SSEQUEL AI Mentor"
            aria-label="Ask SSEQUEL AI Mentor"
          >
            {/* Pulsing Status Ring */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white" />
            </span>

            {/* SSEQUEL Logo */}
            <img
              src={ssquelLogo}
              alt="SSEQUEL AI Mentor"
              className="w-full h-full object-contain rounded-full group-hover:scale-105 transition-transform"
            />

            {/* Unread message count if minimized */}
            {isMinimized && messages.length > 1 && (
              <span className="absolute -top-1 -left-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] border-2 border-white shadow-md">
                {messages.length - 1}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ── Expanded AI Chatbot Window ── */}
      {isOpen && !isMinimized && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] h-[600px] max-h-[85vh] rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border-b theme-border-m flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={ssquelLogo}
                alt="SSEQUEL AI"
                className="w-7 h-7 rounded-xl object-contain shadow-md bg-white border border-slate-200 p-0.5"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs sm:text-sm theme-text font-mono flex items-center gap-1.5">
                    SSEQUEL AI Mentor
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Guiding Only
                  </span>
                </div>
                <p className="text-[10px] theme-text-muted">
                  Powered by Google Gemini • Socratic Guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setTempApiKey(apiKey);
                  setShowSettings(!showSettings);
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  showSettings || !apiKey
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-slate-400 hover:theme-text'
                }`}
                title="Gemini API Key & Privacy Settings"
              >
                <Key className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-slate-400 hover:theme-text transition-all"
                title="Clear Conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-slate-400 hover:theme-text transition-all"
                title="Minimize Window"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border theme-border-m bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] text-slate-400 hover:theme-text transition-all"
                title="Close Chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Context Ribbon */}
          {activeContext && (
            <div className="px-3.5 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-[10px] font-mono text-blue-300 font-bold uppercase truncate">
                  Context: {activeContext.title || activeContext.source}
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-mono text-slate-400 shrink-0">
                <input
                  type="checkbox"
                  checked={includeContext}
                  onChange={(e) => setIncludeContext(e.target.checked)}
                  className="rounded accent-blue-600"
                />
                <span>Attach</span>
              </label>
            </div>
          )}

          {/* API Key / Privacy Settings Drawer */}
          {showSettings && (
            <div className="p-4 bg-slate-950 border-b border-blue-500/30 text-xs space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold font-mono text-sky-300">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Gemini API Key &amp; Privacy Policy</span>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Privacy Notice Card */}
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 space-y-1">
                <div className="flex items-center gap-1 font-bold font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>100% Client-Side Privacy Guarantee</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[10px]">
                  Your API Key is stored <strong>strictly on your local machine (`localStorage`)</strong>. It is never uploaded to any database or backend server. All calls are made directly from your browser to Google's official Gemini API.
                </p>
              </div>

              {/* Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  Google Gemini API Key:
                </label>
                <div className="relative">
                  <input
                    type={showKeyText ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-600 font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showKeyText ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 underline"
                >
                  <span>Get Free Key at Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  {apiKey && (
                    <button
                      onClick={handleClearApiKey}
                      className="px-2.5 py-1 rounded-lg border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 text-[11px] font-mono transition-all"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!tempApiKey.trim()}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-[11px] font-mono font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Save Key
                  </button>
                </div>
              </div>

              {keySavedToast && (
                <div className="p-1.5 rounded-lg bg-emerald-900/50 text-emerald-300 font-mono text-[10px] text-center">
                  ✓ API Key configuration updated!
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <img
                      src={ssquelLogo}
                      alt="SSEQUEL AI"
                      className="w-7 h-7 rounded-xl object-contain shadow-md bg-white border border-slate-200 p-0.5 shrink-0"
                    />
                  )}

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs space-y-1.5 ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md font-sans'
                        : 'bg-[var(--bg-base)] border theme-border-m theme-text rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                      {msg.content}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-in fade-in duration-200">
                <img
                  src={ssquelLogo}
                  alt="SSEQUEL AI"
                  className="w-7 h-7 rounded-xl object-contain shadow-md bg-white border border-slate-200 p-0.5 shrink-0 animate-pulse"
                />
                <div className="p-3 rounded-2xl bg-[var(--bg-base)] border theme-border-m text-xs flex items-center gap-2 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-mono ml-1">AI Mentor thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-[var(--bg-surface2)] border-t theme-border-m overflow-x-auto flex gap-1.5 flex-nowrap scrollbar-none">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(qp)}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--bg-base)] border theme-border-m text-[10px] font-mono theme-text-sec hover:theme-text whitespace-nowrap transition-all shrink-0 active:scale-95"
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 bg-[var(--bg-surface2)] border-t theme-border-m space-y-2">
            <div className="relative flex items-center">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  !apiKey
                    ? "Enter your Gemini API Key in Settings (🔑) to begin..."
                    : "Ask AI Mentor a question or paste your draft code..."
                }
                disabled={!apiKey}
                className="w-full pl-3 pr-12 py-2 rounded-xl text-xs bg-[var(--bg-input)] border theme-border-m theme-text placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim() || !apiKey}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all shadow-md active:scale-95 cursor-pointer"
                title="Send Message (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono theme-text-muted px-1">
              <span>Shift+Enter for new line</span>
              <span className="text-amber-500/90 font-semibold">
                Guidance only • No direct answers
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
