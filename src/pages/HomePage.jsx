import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Eye,
  Activity,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { gsap } from "gsap";
import { mockDatabaseSchema } from "../data/mockDatabase";
import SchemaModal from "../components/SchemaModal";
import ThemeToggle from "../components/ThemeToggle";
import ssquelLogo from "../assets/ssquel.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  // Animation Refs
  const pageContainerRef = useRef(null);
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroCtasRef = useRef(null);
  const featureBannerRef = useRef(null);
  const metricsRowRef = useRef(null);
  const pillarsSectionRef = useRef(null);
  const howItWorksSectionRef = useRef(null);
  const curriculumSectionRef = useRef(null);
  const schemaSectionRef = useRef(null);
  const ambientOrb1Ref = useRef(null);
  const ambientOrb2Ref = useRef(null);

  // Counter metric refs
  const metricPosCountRef = useRef(null);
  const metricAiCountRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Ambient Background Glowing Orbs (Floating loop)
      if (ambientOrb1Ref.current && ambientOrb2Ref.current) {
        gsap.to(ambientOrb1Ref.current, {
          x: 40,
          y: 30,
          scale: 1.15,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(ambientOrb2Ref.current, {
          x: -50,
          y: -40,
          scale: 1.2,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }

      // 2. Hero Entrance Master Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroBadgeRef.current, {
        y: -25,
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        ease: "back.out(1.8)",
      })
        .from(
          heroTitleRef.current,
          {
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          heroSubRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          heroCtasRef.current ? heroCtasRef.current.children : [],
          {
            y: 20,
            opacity: 0,
            scale: 0.92,
            stagger: 0.12,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          "-=0.3"
        )
        .from(
          featureBannerRef.current,
          {
            y: 30,
            opacity: 0,
            scale: 0.98,
            duration: 0.7,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .from(
          metricsRowRef.current ? metricsRowRef.current.children : [],
          {
            y: 25,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );

      // 3. Metric Number Counter Animation
      const counterObj = { pos: 0, ai: 0 };
      gsap.to(counterObj, {
        pos: 40,
        ai: 10,
        duration: 1.6,
        ease: "power2.out",
        delay: 0.5,
        onUpdate: () => {
          if (metricPosCountRef.current) {
            metricPosCountRef.current.textContent = Math.round(
              counterObj.pos
            ).toString();
          }
          if (metricAiCountRef.current) {
            metricAiCountRef.current.textContent = Math.round(
              counterObj.ai
            ).toString();
          }
        },
      });

      // 4. Staggered Entrance for lower sections
      const sections = [
        pillarsSectionRef.current,
        howItWorksSectionRef.current,
        curriculumSectionRef.current,
        schemaSectionRef.current,
      ].filter(Boolean);

      sections.forEach((sec) => {
        gsap.from(sec, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.6,
        });
      });
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  const difficultyTiers = [
    {
      name: "Basic",
      count: "10 Scenarios",
      description:
        "Simple SELECT, WHERE filters, logical operators (AND/OR/IN), ORDER BY, and status filtering.",
      tag: "Tier 1",
      colorLight: "border-blue-300 text-blue-700 bg-blue-50",
      colorDark:
        "dark:border-blue-500/30 dark:text-sky-300 dark:bg-blue-950/50",
    },
    {
      name: "Medium",
      count: "10 Scenarios",
      description:
        "INNER JOINs between Registers and Stores, GROUP BY aggregations, COUNT, SUM, and revenue summaries.",
      tag: "Tier 2",
      colorLight: "border-indigo-300 text-indigo-700 bg-indigo-50",
      colorDark:
        "dark:border-blue-400/30 dark:text-blue-300 dark:bg-blue-900/30",
    },
    {
      name: "Intermediate",
      count: "10 Scenarios",
      description:
        "HAVING clauses, correlated subqueries, CASE WHEN conditional tiering, and fault-free register detection.",
      tag: "Tier 3",
      colorLight: "border-violet-300 text-violet-700 bg-violet-50",
      colorDark:
        "dark:border-indigo-500/30 dark:text-indigo-300 dark:bg-indigo-950/40",
    },
    {
      name: "Advanced",
      count: "10 Scenarios",
      description:
        "Multi-table correlation, failed sync window audits, offline registers with pending transactions, and rate analysis.",
      tag: "Tier 4",
      colorLight: "border-blue-400 text-blue-900 bg-blue-100",
      colorDark:
        "dark:border-blue-600/40 dark:text-blue-200 dark:bg-slate-900/80",
    },
  ];

  return (
    <div
      ref={pageContainerRef}
      className="min-h-screen theme-bg text-[var(--text-primary)] flex flex-col selection:bg-blue-400/30 relative overflow-hidden font-sans"
    >
      {/* ── Ambient Background Lighting (GSAP Animated) ─────────────── */}
      <div
        ref={ambientOrb1Ref}
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-transparent rounded-full blur-3xl dark:from-blue-600/25 dark:via-sky-500/15"
      />
      <div
        ref={ambientOrb2Ref}
        aria-hidden="true"
        className="pointer-events-none absolute top-96 -right-20 w-[450px] h-[300px] bg-gradient-to-br from-indigo-600/15 to-blue-500/10 rounded-full blur-3xl dark:from-blue-700/20 dark:to-cyan-600/10"
      />

      {/* ── Navigation Bar ─────────────────────────────────────────────── */}
      <header className="border-b theme-border bg-[var(--bg-header)] backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={ssquelLogo}
              alt="SSEQUEL Logo"
              className="w-10 h-10 rounded-xl object-contain bg-gradient-to-br from-blue-600 to-indigo-800 p-0.5 shadow-lg border border-blue-500/30 group-hover:scale-105 transition-transform"
            />
            <div>
              <span className="font-bold text-base tracking-tight theme-text flex items-center gap-1.5">
                SSEQUEL{" "}
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded
                  bg-blue-100 text-blue-700 border border-blue-200
                  dark:bg-blue-950 dark:text-sky-300 dark:border-blue-800/60"
                >
                  L2 Mock Engine
                </span>
              </span>
              <p className="text-[11px] theme-text-muted -mt-0.5">
                Retail POS &amp; Store Server Technical Interview Prep
              </p>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/builder")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-sm active:scale-95
                border-blue-200 bg-white hover:bg-blue-50 text-blue-700
                dark:border-blue-800/60 dark:bg-blue-950/50 dark:hover:bg-blue-900/40 dark:text-sky-300"
              title="Custom Assessment & Mock Database Builder"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
              <span className="hidden sm:inline">
                Custom Builder &amp; .txt
              </span>
              <span className="sm:hidden">Builder</span>
            </button>
            <button
              onClick={() => navigate("/documentation")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all shadow-sm active:scale-95
                border-blue-200 bg-white hover:bg-blue-50 text-blue-700
                dark:border-blue-800/60 dark:bg-blue-950/50 dark:hover:bg-blue-900/40 dark:text-sky-300"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">POS Documentation</span>
            </button>
            <button
              onClick={() => setIsSchemaOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all active:scale-95
                border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700
                dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-slate-300"
            >
              <Database className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span className="hidden sm:inline">View POS Schema</span>
            </button>
            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md border border-blue-500/40 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Assessment
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col items-center text-center relative z-10">
        {/* Top Badge */}
        <div
          ref={heroBadgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono mb-6 shadow-sm
          border-blue-200 bg-blue-50 text-blue-700
          dark:border-blue-800/60 dark:bg-blue-950/70 dark:text-sky-300"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
          <span>Level 2 Technical Support Practical Benchmark</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1
          ref={heroTitleRef}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight theme-text"
        >
          Master Real-World <br />
          <span
            className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent
            dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400 drop-shadow-sm"
          >
            Technical Support Troubleshooting
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p
          ref={heroSubRef}
          className="mt-5 theme-text-sec text-base sm:text-lg max-w-2xl leading-relaxed"
        >
          Prepare for Tier 2 technical support interviews. Diagnose{" "}
          <span className="text-blue-600 dark:text-sky-300 font-medium">
            offline store servers
          </span>
          , investigate{" "}
          <span className="text-blue-600 dark:text-sky-300 font-medium">
            payment gateway timeouts
          </span>
          , audit transaction queues, and mix with{" "}
          <span className="text-indigo-600 dark:text-blue-300 font-medium">
            PowerShell
          </span>{" "}
          and{" "}
          <span className="text-indigo-600 dark:text-blue-300 font-medium">
            Network Troubleshooting
          </span>{" "}
          scenarios.
        </p>

        {/* CTA Buttons */}
        <div
          ref={heroCtasRef}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate("/assessment")}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-900/30 border border-blue-400/30 transition-all active:scale-95 group cursor-pointer hover:shadow-blue-500/25"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start 40-Scenario Assessment</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/builder")}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-xl border font-semibold text-sm transition-all shadow-lg active:scale-95 cursor-pointer
              border-blue-200 bg-white hover:bg-blue-50 text-blue-700
              dark:border-blue-800/80 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 dark:text-sky-200 hover:border-blue-400 dark:hover:border-blue-600"
          >
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-sky-400" />
            <span>Custom Assessment &amp; Mock DB Builder</span>
          </button>
        </div>

        {/* Feature Banner */}
        <div
          ref={featureBannerRef}
          className="mt-12 w-full max-w-3xl p-5 rounded-2xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-all hover:border-blue-400 dark:hover:border-blue-700
          border-blue-200 bg-gradient-to-r from-blue-50 via-white to-indigo-50
          dark:border-blue-800/60 dark:bg-gradient-to-r dark:from-blue-950/60 dark:via-slate-900 dark:to-indigo-950/60"
        >
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[10px] sm:text-xs font-mono font-bold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 tracking-wide inline-flex items-center
                bg-blue-100 text-blue-700 border-blue-200
                dark:bg-blue-900/60 dark:text-sky-300 dark:border-blue-700/60"
              >
                CUSTOM SCENARIOS &amp; DATABASE
              </span>
              <h3 className="text-sm font-bold theme-text">
                Custom Assessment &amp; Synchronized Mock Database Builder
              </h3>
            </div>
            <p className="text-xs theme-text-muted leading-relaxed">
              Attach your own <strong className="text-blue-600 dark:text-sky-300 font-mono">.sql</strong> file or paste custom schema to unlock tailored AI question templates. Customize your domain (
              <span className="text-blue-600 dark:text-sky-300">
                Restaurant POS
              </span>
              ,{" "}
              <span className="text-blue-600 dark:text-sky-300">
                Healthcare Clinic
              </span>
              ,{" "}
              <span className="text-blue-600 dark:text-sky-300">Hotel PMS</span>
              ,{" "}
              <span className="text-blue-600 dark:text-sky-300">ATM Fleet</span>
              ) and launch in-browser assessments with zero configuration.
            </p>
          </div>
          <button
            onClick={() => navigate("/builder")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-mono font-semibold transition-all shrink-0 active:scale-95 shadow-md border border-blue-500/30 cursor-pointer hover:shadow-blue-500/25"
          >
            Launch Builder &rarr;
          </button>
        </div>

        {/* Metrics Row (GSAP Animated Numbers) */}
        <div
          ref={metricsRowRef}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          <div className="p-4 rounded-xl border text-center shadow-md theme-card theme-border hover:border-blue-400 dark:hover:border-blue-700 transition-colors">
            <div
              ref={metricPosCountRef}
              className="text-3xl font-bold font-mono text-blue-600 dark:text-sky-300"
            >
              40
            </div>
            <div className="text-xs theme-text-muted mt-1">POS Incidents</div>
          </div>

          <div className="p-4 rounded-xl border text-center shadow-md theme-card theme-border hover:border-blue-400 dark:hover:border-blue-700 transition-colors">
            <div
              ref={metricAiCountRef}
              className="text-3xl font-bold font-mono text-blue-600 dark:text-sky-300"
            >
              10
            </div>
            <div className="text-xs theme-text-muted mt-1">AI Template Limit</div>
          </div>

          <div className="p-4 rounded-xl border text-center shadow-md theme-card theme-border hover:border-blue-400 dark:hover:border-blue-700 transition-colors">
            <div className="text-3xl font-bold font-mono text-blue-600 dark:text-sky-300">
              3-in-1
            </div>
            <div className="text-xs theme-text-muted mt-1">SQL + PS + Network</div>
          </div>

          <div className="p-4 rounded-xl border text-center shadow-md theme-card theme-border hover:border-blue-400 dark:hover:border-blue-700 transition-colors">
            <div className="text-3xl font-bold font-mono text-blue-600 dark:text-sky-300">
              Client
            </div>
            <div className="text-xs theme-text-muted mt-1">Zero Backend Needed</div>
          </div>
        </div>

        {/* ── Topic Triad ────────────────────────────────────────────── */}
        <div
          ref={pillarsSectionRef}
          className="mt-16 w-full max-w-4xl text-left"
        >
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-blue-500 dark:text-sky-400" />
            <h2 className="text-xl font-bold theme-text">
              The 3 Essential Support Pillars
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icon: Database,
                title: "SQL Data Reconciliation",
                color: "text-blue-600 dark:text-sky-300",
                desc: "Extract affected transactions, isolate error codes, detect offline hardware lanes, and aggregate sales discrepancies.",
              },
              {
                Icon: Terminal,
                title: "PowerShell Automation",
                color: "text-indigo-600 dark:text-blue-300",
                desc: "Restart hung POS controller services, inspect Windows Event Logs, verify registry settings, and test TCP ports.",
              },
              {
                Icon: Wifi,
                title: "Network Troubleshooting",
                color: "text-violet-600 dark:text-indigo-300",
                desc: "Diagnose gateway dropouts, ping latency, DNS cache flushes, firewall port blocks, and upstream API socket errors.",
              },
            ].map(({ Icon, title, color, desc }) => (
              <div
                key={title}
                className="p-5 rounded-2xl border theme-border theme-card shadow-lg hover:border-blue-400 dark:hover:border-blue-700 transition-all hover:-translate-y-1"
              >
                <div
                  className="w-9 h-9 rounded-xl border theme-border-m flex items-center justify-center mb-3
                  bg-blue-50 dark:bg-blue-950/80 shadow-sm"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <h3 className="text-sm font-semibold theme-text mb-1">
                  {title}
                </h3>
                <p className="text-xs theme-text-muted leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How It Works ───────────────────────────────────────────── */}
        <div
          ref={howItWorksSectionRef}
          className="mt-16 w-full max-w-4xl text-left"
        >
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-sky-400" />
            <h2 className="text-xl font-bold theme-text">
              How Output Validation Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                Icon: Cpu,
                title: "In-Browser AlaSQL",
                desc: "Your SQL queries run directly in an in-memory SQL database initialized inside your browser. No backend required.",
              },
              {
                Icon: Activity,
                title: "Target Result Matching",
                desc: "We compare JSON result arrays semantically. Field casing, aliases, and row order are handled gracefully.",
              },
              {
                Icon: CheckCircle2,
                title: "Gemini AI Command Review",
                desc: "PowerShell and Network answers can be semantically reviewed by Gemini to explain alternative cmdlets and best practices.",
              },
            ].map(({ Icon, title, desc }, idx) => (
              <div
                key={title}
                className="p-5 rounded-2xl border theme-border theme-card shadow-lg hover:border-blue-400 dark:hover:border-blue-700 transition-all hover:-translate-y-1"
              >
                <div
                  className="w-9 h-9 rounded-xl border theme-border-m flex items-center justify-center text-blue-600 dark:text-sky-300 mb-3
                  bg-blue-50 dark:bg-blue-950/80 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-mono text-blue-500 dark:text-sky-400 uppercase font-bold mb-0.5">
                  Step 0{idx + 1}
                </div>
                <h3 className="text-sm font-semibold theme-text mb-1">
                  {title}
                </h3>
                <p className="text-xs theme-text-muted leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Warning Protocol Banner ────────────────────────────────── */}
        <div className="mt-12 w-full max-w-4xl p-4 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20 text-left flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
            <strong className="text-amber-700 dark:text-amber-300">
              Level 2 Support Protocol Notice:{" "}
            </strong>
            Application warnings, syntax anomalies, and critical service
            dropouts are flagged with{" "}
            <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">
              ORANGE / WARNING
            </span>{" "}
            and{" "}
            <span className="text-rose-600 dark:text-rose-400 font-semibold font-mono">
              RED / CRITICAL
            </span>{" "}
            indicators across all diagnostics.
          </div>
        </div>

        {/* ── 4-Stage Core Curriculum ────────────────────────────────── */}
        <div
          ref={curriculumSectionRef}
          className="mt-16 w-full max-w-4xl text-left"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-500 dark:text-sky-400" />
              <h2 className="text-xl font-bold theme-text">
                The 4-Stage Core Curriculum
              </h2>
            </div>
            <span className="text-xs font-mono theme-text-muted">
              40 POS Scenarios
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {difficultyTiers.map((tier) => (
              <div
                key={tier.name}
                className="p-5 rounded-2xl border theme-border theme-card hover:border-blue-400 dark:hover:border-blue-700 transition-all flex flex-col justify-between shadow-md hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-semibold ${tier.colorLight} ${tier.colorDark}`}
                    >
                      {tier.name}
                    </span>
                    <span className="text-xs font-mono theme-text-muted">
                      {tier.count}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold theme-text mb-1">
                    {tier.name} Proficiency
                  </h3>
                  <p className="text-xs theme-text-muted leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Schema Architecture Cards ──────────────────────────────── */}
        <div
          ref={schemaSectionRef}
          className="mt-16 w-full max-w-4xl text-left mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-500 dark:text-sky-400" />
              <h2 className="text-xl font-bold theme-text">
                Mock POS Database Schema
              </h2>
            </div>
            <button
              onClick={() => setIsSchemaOpen(true)}
              className="text-xs text-blue-600 dark:text-sky-400 hover:text-blue-800 dark:hover:text-sky-300 font-mono flex items-center gap-1 cursor-pointer"
            >
              Open Full Schema Inspector &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockDatabaseSchema.map((tbl) => (
              <div
                key={tbl.table}
                onClick={() => setIsSchemaOpen(true)}
                className="p-4 rounded-xl border theme-border theme-card hover:border-blue-400 dark:hover:border-blue-700 cursor-pointer transition-all shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-blue-700 dark:text-sky-300">
                    {tbl.table}
                  </span>
                  <span className="text-[10px] font-mono theme-text-muted bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {tbl.columns.length} cols
                  </span>
                </div>
                <p className="text-[11px] theme-text-muted line-clamp-2 mb-3">
                  {tbl.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {tbl.columns.slice(0, 3).map((c) => (
                    <span
                      key={c.name}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded
                      bg-blue-100 text-blue-700 border border-blue-200
                      dark:bg-blue-950/80 dark:text-sky-300/80 dark:border-blue-900/40"
                    >
                      {c.name}
                    </span>
                  ))}
                  {tbl.columns.length > 3 && (
                    <span className="text-[10px] font-mono theme-text-muted self-center">
                      +{tbl.columns.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t theme-border bg-[var(--bg-surface)] py-6 text-center text-xs theme-text-muted relative z-10">
        <p>
          SSEQUEL Assessment Tool &bull; Level 2 Technical Support Interview
          Preparation
        </p>
        <p className="mt-1">
          In-Browser AlaSQL Engine &bull; Gemini AI Scenario Integration &bull;
          Pure Client-Side
        </p>
      </footer>

      <SchemaModal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
      />
    </div>
  );
}
