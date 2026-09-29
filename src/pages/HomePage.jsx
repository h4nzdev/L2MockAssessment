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
  Radio,
  HardDrive
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
  const heroStatsRef = useRef(null);
  const heroPreviewRef = useRef(null);
  const radarSweepRef = useRef(null);
  const featureBannerRef = useRef(null);
  const pillarsSectionRef = useRef(null);
  const howItWorksSectionRef = useRef(null);
  const curriculumSectionRef = useRef(null);
  const schemaSectionRef = useRef(null);
  const ambientOrb1Ref = useRef(null);
  const ambientOrb2Ref = useRef(null);

  // Counter metric refs
  const metricPosCountRef = useRef(null);
  const metricEngineCountRef = useRef(null);

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

      // 2. Hero 2-Column Master Timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(heroBadgeRef.current, {
        y: -25,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.8)",
      })
        .from(
          heroTitleRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .from(
          heroSubRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
          },
          "-=0.3"
        )
        .from(
          heroCtasRef.current ? heroCtasRef.current.children : [],
          {
            y: 20,
            opacity: 0,
            scale: 0.94,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.5)",
          },
          "-=0.3"
        )
        .from(
          heroStatsRef.current ? heroStatsRef.current.children : [],
          {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .from(
          heroPreviewRef.current,
          {
            x: 50,
            y: 20,
            opacity: 0,
            rotateY: -18,
            rotateX: 10,
            scale: 0.9,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.7"
        );

      // 3. Floating 3D Preview Idle Animation
      if (heroPreviewRef.current) {
        gsap.to(heroPreviewRef.current, {
          y: -12,
          rotateY: -4,
          rotateX: 2,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.2,
        });
      }

      // 4. Radar Sweep rotation
      if (radarSweepRef.current) {
        gsap.to(radarSweepRef.current, {
          rotate: 360,
          duration: 6,
          repeat: -1,
          ease: "none",
        });
      }

      // 5. Metric Number Counter Animation
      const counterObj = { pos: 0, engine: 0 };
      gsap.to(counterObj, {
        pos: 40,
        engine: 100,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.4,
        onUpdate: () => {
          if (metricPosCountRef.current) {
            metricPosCountRef.current.textContent = Math.round(
              counterObj.pos
            ).toString();
          }
          if (metricEngineCountRef.current) {
            metricEngineCountRef.current.textContent = Math.round(
              counterObj.engine
            ).toString();
          }
        },
      });

      // 6. Staggered Entrance for lower sections
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.from(entry.target.children, {
                y: 30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      [
        pillarsSectionRef.current,
        howItWorksSectionRef.current,
        curriculumSectionRef.current,
        schemaSectionRef.current,
      ].forEach((ref) => {
        if (ref) observer.observe(ref);
      });

      return () => observer.disconnect();
    }, pageContainerRef);

    return () => ctx.revert();
  }, []);

  const difficultyTiers = [
    {
      name: "Basic",
      count: "10 Scenarios",
      description:
        "Single-table SELECT, WHERE filters, AND/OR logic, IN operators, and basic status aggregations.",
      tag: "Tier 1",
      colorLight: "border-blue-200 text-blue-700 bg-blue-50",
      colorDark:
        "dark:border-blue-500/30 dark:text-sky-300 dark:bg-blue-950/40",
    },
    {
      name: "Medium",
      count: "10 Scenarios",
      description:
        "Multi-table INNER JOINs, GROUP BY aggregations, COUNT / SUM calculation, and store error metrics.",
      tag: "Tier 2",
      colorLight: "border-indigo-200 text-indigo-700 bg-indigo-50",
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
        className="pointer-events-none absolute -top-40 left-1/3 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-transparent rounded-full blur-3xl dark:from-blue-600/25 dark:via-sky-500/15"
      />
      <div
        ref={ambientOrb2Ref}
        aria-hidden="true"
        className="pointer-events-none absolute top-72 -right-20 w-[500px] h-[350px] bg-gradient-to-br from-indigo-600/15 to-blue-500/10 rounded-full blur-3xl dark:from-blue-700/20 dark:to-cyan-600/10"
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
              className="w-10 h-10 rounded-xl object-contain"
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

      {/* ── 2-Grid Hero Section (Inspired by Reference Design) ─────────────── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 flex flex-col relative z-10">
        
        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center min-h-[530px]">
          
          {/* Left Column (7 cols): Tag, Headline, Subtext, CTAs, Stats */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Top Tag / Badge */}
            <div
              ref={heroBadgeRef}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono shadow-sm
              border-blue-200 bg-blue-50 text-blue-700
              dark:border-blue-500/40 dark:bg-blue-950/70 dark:text-sky-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Multi-Discipline &bull; SQL, PowerShell &amp; Network Diagnostics</span>
            </div>

            {/* Hero Main Headline */}
            <h1
              ref={heroTitleRef}
              className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] theme-text"
            >
              Master Real-World <br />
              <span
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent
                dark:from-blue-400 dark:via-sky-300 dark:to-indigo-400 drop-shadow-sm"
              >
                Technical Support
              </span>{" "}
              Troubleshooting
            </h1>

            {/* Narrative Subtitle */}
            <p
              ref={heroSubRef}
              className="theme-text-sec text-base sm:text-lg max-w-xl leading-relaxed font-normal"
            >
              Real-world incident simulation for Tier 2 technical support interviews. Diagnose{" "}
              <span className="text-blue-600 dark:text-sky-300 font-semibold">
                offline store servers
              </span>
              , audit{" "}
              <span className="text-blue-600 dark:text-sky-300 font-semibold">
                payment gateway timeouts
              </span>
              , execute{" "}
              <span className="text-indigo-600 dark:text-purple-300 font-semibold">
                PowerShell cmdlets
              </span>
              , and isolate{" "}
              <span className="text-cyan-600 dark:text-cyan-300 font-semibold">
                network socket dropouts
              </span>.
            </p>

            {/* Action CTA Buttons */}
            <div
              ref={heroCtasRef}
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <button
                onClick={() => navigate("/assessment")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-blue-900/30 border border-blue-400/30 transition-all active:scale-95 group cursor-pointer hover:shadow-blue-500/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/builder")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl border font-semibold text-sm transition-all shadow-lg active:scale-95 cursor-pointer
                  border-blue-200 bg-white hover:bg-blue-50 text-blue-700
                  dark:border-blue-800/80 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 dark:text-sky-200 hover:border-blue-400 dark:hover:border-blue-600"
              >
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-sky-400" />
                <span>Custom .txt Builder</span>
              </button>

              <button
                onClick={() => setIsSchemaOpen(true)}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl border text-xs font-mono transition-all active:scale-95 cursor-pointer
                  border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700
                  dark:border-slate-800 dark:bg-slate-900/70 dark:hover:bg-slate-800 dark:text-slate-300"
              >
                <Database className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>POS Schema</span>
              </button>
            </div>

            {/* Quick Metrics Row (Reference-inspired stats) */}
            <div
              ref={heroStatsRef}
              className="grid grid-cols-3 gap-6 pt-5 border-t theme-border-m w-full max-w-lg"
            >
              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={metricPosCountRef}
                    className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-white"
                  >
                    40
                  </span>
                  <span className="text-blue-500 dark:text-sky-400 font-bold text-xl">+</span>
                </div>
                <div className="text-xs theme-text-muted font-mono mt-0.5">Scenarios Ready</div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span
                    ref={metricEngineCountRef}
                    className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-white"
                  >
                    100
                  </span>
                  <span className="text-blue-500 dark:text-sky-400 font-bold text-xl">%</span>
                </div>
                <div className="text-xs theme-text-muted font-mono mt-0.5">In-Browser AlaSQL</div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-600 dark:text-white">
                    3
                  </span>
                  <span className="text-blue-500 dark:text-sky-400 font-bold text-sm font-mono ml-0.5">in 1</span>
                </div>
                <div className="text-xs theme-text-muted font-mono mt-0.5">SQL &bull; PS &bull; Net</div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): 3D Perspective Isometric Live Telemetry & Radar Dashboard */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            
            {/* 3D Tilted Perspective Shell */}
            <div
              ref={heroPreviewRef}
              className="w-full max-w-[500px] transition-transform duration-500 ease-out hover:scale-[1.03]"
              style={{
                perspective: '1200px',
                transform: 'perspective(1200px) rotateY(-8deg) rotateX(5deg)'
              }}
            >
              {/* Main Glowing Console Frame */}
              <div className="relative rounded-3xl border border-blue-500/40 bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/90 backdrop-blur-xl p-5 shadow-2xl shadow-blue-950/90 overflow-hidden">
                
                {/* Top Subtle Light Reflection Streak */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

                {/* Window Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-300">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block shadow-sm shadow-rose-500/50" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block shadow-sm shadow-amber-500/50" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block shadow-sm shadow-emerald-500/50" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold ml-1.5 truncate">
                      SSEQUEL Live Fleet Radar &bull; Incident Map
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE
                  </span>
                </div>

                {/* Floating Incident Alert Badge (Like Reference Top Right) */}
                <div className="mt-3.5 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/40 text-xs shadow-lg">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    <span className="text-[11px] font-mono text-rose-300 font-semibold truncate">
                      P1 Incident: Store-101 Server OFFLINE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    NOC SLA: 12m
                  </span>
                </div>

                {/* Central Visualizer Radar & Topology Matrix */}
                <div className="mt-3.5 relative rounded-2xl bg-slate-950/90 border border-blue-950/80 h-52 overflow-hidden flex items-center justify-center">
                  
                  {/* Subtle Radar Grid Gridlines */}
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Concentric Radar Circles */}
                  <div className="absolute w-44 h-44 rounded-full border border-blue-500/20" />
                  <div className="absolute w-28 h-28 rounded-full border border-blue-500/30" />
                  <div className="absolute w-12 h-12 rounded-full border border-blue-500/40" />

                  {/* Rotating Radar Sweep Line */}
                  <div 
                    ref={radarSweepRef}
                    className="absolute w-48 h-48 rounded-full pointer-events-none"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.25) 0deg, transparent 60deg, transparent 360deg)'
                    }}
                  />

                  {/* Diagnostic Target Node 1: Red Offline Store */}
                  <div className="absolute top-8 left-12 group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-500/60 opacity-75" />
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-red-700 border border-rose-300 flex items-center justify-center shadow-lg shadow-rose-600/50 text-[9px] font-black text-white">
                        !
                      </div>
                    </div>
                    <div className="absolute -bottom-5 -left-4 px-1.5 py-0.5 rounded bg-slate-900/90 border border-rose-500/50 text-[9px] font-mono text-rose-300 whitespace-nowrap shadow">
                      Store-101 [CRITICAL]
                    </div>
                  </div>

                  {/* Diagnostic Target Node 2: Network Gateway Probe */}
                  <div className="absolute top-16 right-14 group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400/50 opacity-60" />
                      <div className="w-4 h-4 rounded-full bg-cyan-500 border border-cyan-200 flex items-center justify-center shadow-lg shadow-cyan-500/50 text-[8px] font-black text-slate-950">
                        GW
                      </div>
                    </div>
                    <div className="absolute -bottom-5 -right-3 px-1.5 py-0.5 rounded bg-slate-900/90 border border-cyan-500/50 text-[9px] font-mono text-cyan-300 whitespace-nowrap shadow">
                      GW-04 &bull; 3ms
                    </div>
                  </div>

                  {/* Diagnostic Target Node 3: EFT Bridge Center Node */}
                  <div className="absolute bottom-9 left-28 group cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-amber-500 border border-amber-200 flex items-center justify-center shadow-lg shadow-amber-500/50 text-[8px] font-black text-slate-950">
                        PS
                      </div>
                    </div>
                    <div className="absolute -bottom-5 -left-6 px-1.5 py-0.5 rounded bg-slate-900/90 border border-amber-500/50 text-[9px] font-mono text-amber-300 whitespace-nowrap shadow">
                      EFT-Bridge [RESTARTING]
                    </div>
                  </div>

                  {/* Connecting Dashed Diagnostic Vectors */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <line x1="60" y1="42" x2="122" y2="152" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="122" y1="152" x2="330" y2="74" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                  </svg>
                </div>

                {/* Bottom Sensor Telemetry Cards (Inspired by NH3, CH4, AQI in reference layout) */}
                <div className="mt-3.5 grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AlaSQL Engine</div>
                    <div className="text-base font-bold font-mono text-sky-400 mt-0.5">0.8ms</div>
                    <div className="text-[9px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>&bull;</span> In-Memory
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Fleet Health</div>
                    <div className="text-base font-bold font-mono text-amber-400 mt-0.5">94.2%</div>
                    <div className="text-[9px] font-mono text-slate-400 mt-0.5">38 / 40 Online</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Diagnostic Port</div>
                    <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">TCP 8080</div>
                    <div className="text-[9px] font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>&bull;</span> Verified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scroll Indicator (Reference Inspired) ──────────────────────── */}
        <div className="mt-14 mb-2 flex flex-col items-center justify-center text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-600 uppercase select-none">
          <span>SCROLL</span>
          <span className="animate-bounce mt-1 text-blue-500 dark:text-sky-400">&darr;</span>
        </div>

        {/* ── Custom Builder Banner ──────────────────────────────────── */}
        <div
          ref={featureBannerRef}
          className="mt-8 w-full max-w-5xl mx-auto p-5 rounded-2xl border text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl transition-all hover:border-blue-400 dark:hover:border-blue-700
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

        {/* ── Topic Triad ────────────────────────────────────────────── */}
        <div
          ref={pillarsSectionRef}
          className="mt-16 w-full max-w-5xl mx-auto text-left"
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
                color: "text-indigo-600 dark:text-purple-300",
                desc: "Restart hung POS controller services, inspect Windows Event Logs, verify registry settings, and test TCP ports.",
              },
              {
                Icon: Wifi,
                title: "Network Troubleshooting",
                color: "text-violet-600 dark:text-cyan-300",
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
          className="mt-16 w-full max-w-5xl mx-auto text-left"
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
        <div className="mt-12 w-full max-w-5xl mx-auto p-4 rounded-xl border border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20 text-left flex items-start gap-3 shadow-sm">
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
          className="mt-16 w-full max-w-5xl mx-auto text-left"
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
          className="mt-16 w-full max-w-5xl mx-auto text-left mb-16"
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
