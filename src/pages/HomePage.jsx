import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Terminal, 
  Database, 
  Server, 
  Layers, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Sparkles,
  Wifi,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { mockDatabaseSchema } from '../data/mockDatabase';
import SchemaModal from '../components/SchemaModal';
import AITemplateModal from '../components/AITemplateModal';

export default function HomePage() {
  const navigate = useNavigate();
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);

  const difficultyTiers = [
    {
      name: 'Basic',
      count: '10 Scenarios',
      description: 'Simple SELECT, WHERE filters, logical operators (AND/OR/IN), ORDER BY, and status filtering.',
      tag: 'Tier 1',
      color: 'border-blue-500/30 text-sky-300 bg-blue-950/50'
    },
    {
      name: 'Medium',
      count: '10 Scenarios',
      description: 'INNER JOINs between Registers and Stores, GROUP BY aggregations, COUNT, SUM, and revenue summaries.',
      tag: 'Tier 2',
      color: 'border-blue-400/30 text-blue-300 bg-blue-900/30'
    },
    {
      name: 'Intermediate',
      count: '10 Scenarios',
      description: 'HAVING clauses, correlated subqueries, CASE WHEN conditional tiering, and fault-free register detection.',
      tag: 'Tier 3',
      color: 'border-indigo-500/30 text-indigo-300 bg-indigo-950/40'
    },
    {
      name: 'Advanced',
      count: '10 Scenarios',
      description: 'Multi-table correlation, failed sync window audits, offline registers with pending transactions, and rate analysis.',
      tag: 'Tier 4',
      color: 'border-blue-600/40 text-blue-200 bg-slate-900/80'
    }
  ];

  const handleAIQuestionsGenerated = (questions, domain) => {
    localStorage.setItem('support_sql_ai_questions', JSON.stringify(questions));
    localStorage.setItem('support_sql_ai_domain', domain);
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-sky-200">
      {/* Navigation Bar */}
      <header className="border-b border-blue-950/80 bg-slate-950/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white shadow-lg shadow-blue-900/30 border border-blue-500/30">
              <Terminal className="w-5 h-5 font-bold stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                SupportSQL <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800/60">L2 Mock Engine</span>
              </span>
              <p className="text-[11px] text-slate-400 -mt-0.5">Retail POS & Store Server Technical Interview Prep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAIGeneratorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-800/60 bg-blue-950/50 hover:bg-blue-900/40 text-sky-300 text-xs font-mono transition-colors shadow-sm"
              title="Generate with Gemini API or Upload .txt File (No API Key)"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">AI Questions / Upload .txt</span>
              <span className="sm:hidden">AI / .txt</span>
            </button>
            <button
              onClick={() => navigate('/documentation')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blue-800/60 bg-blue-950/50 hover:bg-blue-900/40 text-sky-300 text-xs font-mono transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">POS Documentation</span>
            </button>
            <button
              onClick={() => setIsSchemaOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">View POS Schema</span>
            </button>
            <button
              onClick={() => navigate('/assessment')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 border border-blue-500/40 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Assessment
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-blue-800/60 bg-blue-950/50 text-sky-300 text-xs font-mono mb-6 shadow-sm">
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>Level 2 Technical Support Practical Benchmark</span>
        </div>

        {/* Hero Title in Blue/Navy Gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          Master Real-World <br />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Technical Support Troubleshooting
          </span>
        </h1>

        <p className="mt-5 text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Prepare for Tier 2 technical support interviews. Diagnose <span className="text-sky-300 font-medium">offline store servers</span>, investigate <span className="text-sky-300 font-medium">payment gateway timeouts</span>, audit transaction queues, and mix with <span className="text-blue-300 font-medium">PowerShell</span> and <span className="text-blue-300 font-medium">Network Troubleshooting</span> scenarios.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/assessment')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-900/40 border border-blue-400/30 transition-all active:scale-95 group"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start 40-Scenario Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl border border-blue-800/80 bg-blue-950/40 hover:bg-blue-900/40 text-sky-200 font-semibold text-sm transition-all shadow-lg shadow-blue-950/40 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Generate 10 AI Questions (SQL + PS + Net)</span>
          </button>
        </div>

        {/* AI Generator Feature Highlight Banner in Deep Navy */}
        <div className="mt-12 w-full max-w-3xl p-5 rounded-2xl border border-blue-800/60 bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-sky-300 border border-blue-700/60">
                AI SCENARIO GENERATOR
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Gemini AI Question Generator (Fixed 10-Question Limit)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Customize your domain (<span className="text-sky-300">Restaurant POS</span>, <span className="text-sky-300">Healthcare</span>, <span className="text-sky-300">Banking</span>) and mix questions across <strong className="text-sky-300">SQL</strong>, <strong className="text-blue-300">PowerShell</strong>, and <strong className="text-indigo-300">Network Diagnostics</strong>. Powered directly by your Gemini API key.
            </p>
          </div>
          <button
            onClick={() => setIsAIGeneratorOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-mono font-semibold transition-all shrink-0 active:scale-95 shadow-md shadow-blue-950/50 border border-blue-500/30"
          >
            Create 10-Question Mix &rarr;
          </button>
        </div>

        {/* Metrics Row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          <div className="p-4 rounded-xl border border-blue-950/80 bg-slate-900/60 text-center shadow-md">
            <div className="text-2xl font-bold font-mono text-sky-300">40</div>
            <div className="text-xs text-slate-400 mt-1">POS Incidents</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-950/80 bg-slate-900/60 text-center shadow-md">
            <div className="text-2xl font-bold font-mono text-blue-300">10</div>
            <div className="text-xs text-slate-400 mt-1">AI Template Limit</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-950/80 bg-slate-900/60 text-center shadow-md">
            <div className="text-2xl font-bold font-mono text-indigo-300">3-in-1</div>
            <div className="text-xs text-slate-400 mt-1">SQL + PS + Network</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-950/80 bg-slate-900/60 text-center shadow-md">
            <div className="text-2xl font-bold font-mono text-sky-400">Client</div>
            <div className="text-xs text-slate-400 mt-1">Zero Backend Needed</div>
          </div>
        </div>

        {/* Topic Triad */}
        <div className="mt-16 w-full max-w-4xl text-left">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-200">The 3 Essential Support Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-sky-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">SQL Data Reconciliation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extract affected transactions, isolate error codes, detect offline hardware lanes, and aggregate sales discrepancies.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">PowerShell Automation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Restart hung POS controller services, inspect Windows Event Logs, verify registry settings, and test TCP ports.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-indigo-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                <Wifi className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Network Troubleshooting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diagnose gateway dropouts, ping latency, DNS cache flushes, firewall port blocks, and upstream API socket errors.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works & Validation Logic */}
        <div className="mt-16 w-full max-w-4xl text-left">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-slate-200">How Output Validation Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-sky-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">In-Browser AlaSQL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your SQL queries run directly in an in-memory SQL database initialized inside your browser. No backend required.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Target Result Matching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We compare JSON result arrays semantically. Field casing, aliases, and row order are handled gracefully.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-blue-900/40 bg-slate-900/70 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-indigo-300 flex items-center justify-center font-mono font-bold text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-semibold text-slate-200 mb-1">Gemini AI Command Review</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                PowerShell and Network answers can be semantically reviewed by Gemini to explain alternative cmdlets and best practices.
              </p>
            </div>
          </div>
        </div>

        {/* Procedures & Warning Standard Notice (Keeps Red/Orange as requested) */}
        <div className="mt-12 w-full max-w-4xl p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-left flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-200/90">
            <strong className="text-amber-300">Level 2 Support Protocol Notice: </strong>
            Application warnings, syntax anomalies, and critical service dropouts are flagged with <span className="text-amber-400 font-semibold font-mono">ORANGE / WARNING</span> and <span className="text-rose-400 font-semibold font-mono">RED / CRITICAL</span> indicators across all diagnostics to mimic real NOC alerting procedures.
          </div>
        </div>

        {/* 4 Difficulty Levels Overview */}
        <div className="mt-16 w-full max-w-4xl text-left">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-slate-200">The 4-Stage Core Curriculum</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">40 POS Scenarios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {difficultyTiers.map((tier) => (
              <div 
                key={tier.name}
                className="p-5 rounded-2xl border border-blue-950 bg-slate-900/60 hover:border-blue-800/60 transition-all flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${tier.color}`}>
                      {tier.name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{tier.count}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-200 mb-1">
                    {tier.name} Proficiency
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schema Architecture Cards */}
        <div className="mt-16 w-full max-w-4xl text-left mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-slate-200">Mock POS Database Schema</h2>
            </div>
            <button
              onClick={() => setIsSchemaOpen(true)}
              className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1"
            >
              Open Full Schema Inspector &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDatabaseSchema.map((tbl) => (
              <div
                key={tbl.table}
                onClick={() => setIsSchemaOpen(true)}
                className="p-4 rounded-xl border border-blue-950 bg-slate-900/50 hover:bg-slate-900 hover:border-blue-800/60 cursor-pointer transition-all shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-sky-300">{tbl.table}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {tbl.columns.length} cols
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                  {tbl.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tbl.columns.slice(0, 3).map(c => (
                    <span key={c.name} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/80 text-sky-300/80 border border-blue-900/40">
                      {c.name}
                    </span>
                  ))}
                  {tbl.columns.length > 3 && (
                    <span className="text-[10px] font-mono text-slate-400 self-center">
                      +{tbl.columns.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-950/80 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <p>SupportSQL Assessment Tool &bull; Level 2 Technical Support Interview Preparation</p>
        <p className="mt-1 text-slate-400">In-Browser AlaSQL Engine &bull; Gemini AI Scenario Integration &bull; Pure Client-Side</p>
      </footer>

      {/* Modals */}
      <SchemaModal isOpen={isSchemaOpen} onClose={() => setIsSchemaOpen(false)} />
      <AITemplateModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onQuestionsGenerated={handleAIQuestionsGenerated}
      />
    </div>
  );
}
