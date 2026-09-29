import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  ShieldAlert,
  Network,
  Cpu,
  FileText,
  Database,
  Check,
  Copy,
  ChevronRight,
  Server,
  Sparkles,
  Activity,
} from "lucide-react";
import { posDocumentation, mockDatabaseSchema } from "../data/mockDatabase";
import ThemeToggle from "../components/ThemeToggle";
import ssquelLogo from "../assets/ssquel.png";

export default function DocumentationPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState("errors"); // 'errors' | 'architecture' | 'fleet' | 'sop' | 'schema'
  const [searchTerm, setSearchTerm] = useState(() => initialSearch);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      setSearchParams({ search: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "FATAL":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-400/40 dark:border-rose-500/40">
            FATAL
          </span>
        );
      case "CRITICAL":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-400/30 dark:border-rose-500/30">
            CRITICAL
          </span>
        );
      case "WARN":
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40 dark:border-amber-500/40">
            WARN
          </span>
        );
      case "INFO":
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-sky-300 border border-blue-300 dark:border-blue-500/40">
            INFO
          </span>
        );
    }
  };

  const filteredErrors = (posDocumentation.errorCodes || []).filter((err) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      err.code.toLowerCase().includes(term) ||
      err.title.toLowerCase().includes(term) ||
      err.description.toLowerCase().includes(term) ||
      err.procedure.toLowerCase().includes(term) ||
      err.severity.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen theme-bg theme-text flex flex-col font-sans selection:bg-blue-400/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b theme-border bg-[var(--bg-header)] backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Back button & Title */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/assessment")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-sky-300 text-xs font-mono transition-all shadow-sm active:scale-95 shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Assessment</span>
            </button>

            <button
              onClick={() => navigate("/simulator")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-mono transition-all shadow-sm active:scale-95 shrink-0"
              title="Open L2 Incident & Triage Simulator"
            >
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              <span>L2 Simulator</span>
            </button>

            <div className="h-6 w-px bg-[var(--border-muted)] hidden sm:block" />

            <div className="flex items-center gap-3">
              <img
                src={ssquelLogo}
                alt="SSEQUEL Logo"
                className="w-10 h-10 rounded-xl object-contain "
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold theme-text tracking-tight">
                    SSEQUEL{" "}
                    <span className="font-normal text-sm sm:text-base opacity-90">
                      POS Documentation &amp; L2 Runbook
                    </span>
                  </h1>
                  <span className="hidden md:inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-sky-300 text-[10px] font-mono uppercase border border-blue-200 dark:border-blue-700/60">
                    KB-POS-2026
                  </span>
                </div>
                <p className="text-xs theme-text-muted">
                  Standard Operating Procedures, Error Code Index, and
                  Architecture Fleet Guide
                </p>
              </div>
            </div>
          </div>

          {/* Right: Search Box + ThemeToggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 theme-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search error codes, models, SQL..."
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-[var(--bg-input)] border theme-border theme-text text-xs placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 theme-text-muted hover:theme-text-sec text-xs font-mono"
                >
                  Clear
                </button>
              )}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Spacious Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 space-y-8">
        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 border-b theme-border-m pb-3 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab("errors")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === "errors"
                ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold dark:bg-blue-900/70 dark:text-sky-200 dark:border-blue-600"
                : "bg-[var(--bg-card)] border-[var(--border-base)] theme-text-muted hover:theme-text-sec hover:bg-[var(--bg-surface2)]"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-current dark:text-sky-400" />
            <span>
              Error Codes & SOP ({posDocumentation.errorCodes?.length || 0})
            </span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === "architecture"
                ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold dark:bg-blue-900/70 dark:text-sky-200 dark:border-blue-600"
                : "bg-[var(--bg-card)] border-[var(--border-base)] theme-text-muted hover:theme-text-sec hover:bg-[var(--bg-surface2)]"
            }`}
          >
            <Network className="w-4 h-4 text-current dark:text-sky-400" />
            <span>POS Architecture &amp; Subnets</span>
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === "fleet"
                ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold dark:bg-blue-900/70 dark:text-sky-200 dark:border-blue-600"
                : "bg-[var(--bg-card)] border-[var(--border-base)] theme-text-muted hover:theme-text-sec hover:bg-[var(--bg-surface2)]"
            }`}
          >
            <Cpu className="w-4 h-4 text-current dark:text-sky-400" />
            <span>Hardware Terminal Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab("sop")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === "sop"
                ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold dark:bg-blue-900/70 dark:text-sky-200 dark:border-blue-600"
                : "bg-[var(--bg-card)] border-[var(--border-base)] theme-text-muted hover:theme-text-sec hover:bg-[var(--bg-surface2)]"
            }`}
          >
            <FileText className="w-4 h-4 text-current dark:text-sky-400" />
            <span>Standard Operating Procedures</span>
          </button>

          <button
            onClick={() => setActiveTab("schema")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              activeTab === "schema"
                ? "bg-blue-600 text-white border-blue-500 shadow-md font-semibold dark:bg-blue-900/70 dark:text-sky-200 dark:border-blue-600"
                : "bg-[var(--bg-card)] border-[var(--border-base)] theme-text-muted hover:theme-text-sec hover:bg-[var(--bg-surface2)]"
            }`}
          >
            <Database className="w-4 h-4 text-current dark:text-sky-400" />
            <span>Database Data Dictionary</span>
          </button>
        </div>

        {/* TAB 1: Error Codes & SOP Runbook */}
        {activeTab === "errors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold theme-text tracking-tight">
                  POS Incident Error Codes &amp; Triage Procedures
                </h2>
                <p className="text-sm theme-text-muted mt-1">
                  Each incident code includes observed hardware/network
                  symptoms, standard L2 resolution steps, and an instant
                  diagnostic SQL check.
                </p>
              </div>
              <span className="text-xs font-mono theme-text-muted bg-[var(--bg-card)] px-3 py-1.5 rounded-lg border theme-border">
                Showing {filteredErrors.length} of{" "}
                {posDocumentation.errorCodes?.length || 0} Codes
              </span>
            </div>

            {filteredErrors.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-blue-950 bg-slate-950/60 space-y-3">
                <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">
                  No Matching Error Codes
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No records matched &quot;{searchTerm}&quot;. Try searching for
                  general terms like &quot;sync&quot;, &quot;timeout&quot;,
                  &quot;printer&quot;, or &quot;lock&quot;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredErrors.map((err, idx) => (
                  <div
                    key={err.code}
                    className="p-6 sm:p-7 rounded-2xl border border-blue-900/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-950 shadow-xl space-y-5 transition-all hover:border-blue-700/60"
                  >
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-950">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-base font-bold text-sky-300">
                          {err.code}
                        </span>
                        {getSeverityBadge(err.severity)}
                        <h3 className="text-base font-semibold text-white">
                          {err.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {err.description}
                    </p>

                    {/* L2 Action Procedure */}
                    <div className="p-4 sm:p-5 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-2">
                      <div className="flex items-center gap-2 text-sky-300 font-mono font-semibold text-xs uppercase tracking-wider">
                        <Check className="w-4 h-4 text-sky-400" />
                        <span>Standard Operating Procedure (L2 Action):</span>
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed pl-6">
                        {err.procedure}
                      </p>
                    </div>

                    {/* Diagnostic SQL Check */}
                    {err.sqlCheck && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-blue-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                            Diagnostic SQL Verification:
                          </span>
                          <button
                            onClick={() => handleCopy(err.sqlCheck, idx)}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950 hover:bg-blue-900/80 text-sky-300 text-xs font-mono border border-blue-800/80 transition-colors"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Query</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-slate-200 overflow-x-auto border border-blue-950">
                          {err.sqlCheck}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Architecture & Topology */}
        {activeTab === "architecture" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                POS Infrastructure Architecture & Network Topology
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Overview of the 3-tier retail system: Lane Terminals, In-Store
                Controllers, and Enterprise Payment Gateways.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-indigo-950/40 border border-blue-900/50 space-y-3">
              <h3 className="text-base font-bold text-sky-300 flex items-center gap-2">
                <Network className="w-5 h-5 text-sky-400" />
                Executive Architecture Summary
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                {posDocumentation.overview}
              </p>
            </div>

            {/* 3 Tier Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posDocumentation.architectureLayers?.map((layer, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-blue-900/50 bg-slate-900/60 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-sm shadow-inner">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-base text-white">
                        {layer.layer}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {layer.components}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-blue-950 text-xs font-mono text-sky-400">
                    Tier {idx + 1} Managed Layer
                  </div>
                </div>
              ))}
            </div>

            {/* Subnet Table Card */}
            <div className="p-6 sm:p-7 rounded-2xl border border-blue-950 bg-slate-900/70 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-sky-400" />
                Standard Store IP Addressing & VLAN Allocations
              </h3>
              <p className="text-xs text-slate-400">
                All retail outlets follow a strict RFC 1918 Class A private
                subnetting model (
                <code className="text-sky-300">10.&lt;store_id&gt;.0.0/24</code>
                ).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-blue-950 text-slate-400 bg-slate-950/60">
                      <th className="py-3 px-4">Subnet IP Range</th>
                      <th className="py-3 px-4">Role / Assignment</th>
                      <th className="py-3 px-4">VLAN</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950/60 text-slate-300">
                    <tr className="hover:bg-blue-950/20">
                      <td className="py-3 px-4 text-sky-300 font-bold">
                        10.xxx.0.1
                      </td>
                      <td className="py-3 px-4">
                        Default Gateway (Cisco Meraki MX)
                      </td>
                      <td className="py-3 px-4">VLAN 10</td>
                      <td className="py-3 px-4 text-slate-400">
                        Primary WAN link with automatic 5G failover
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-950/20">
                      <td className="py-3 px-4 text-sky-300 font-bold">
                        10.xxx.0.5
                      </td>
                      <td className="py-3 px-4">
                        In-Store Controller (Stores.server_ip)
                      </td>
                      <td className="py-3 px-4">VLAN 10</td>
                      <td className="py-3 px-4 text-slate-400">
                        Hosts local sync daemon & offline buffer DB
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-950/20">
                      <td className="py-3 px-4 text-sky-300 font-bold">
                        10.xxx.0.10 - 10.xxx.0.50
                      </td>
                      <td className="py-3 px-4">
                        Static POS Checkout Terminals
                      </td>
                      <td className="py-3 px-4">VLAN 20</td>
                      <td className="py-3 px-4 text-slate-400">
                        PCI-DSS segmented terminal network
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-950/20">
                      <td className="py-3 px-4 text-sky-300 font-bold">
                        10.xxx.0.100+
                      </td>
                      <td className="py-3 px-4">
                        DHCP Handheld Barcode Scanners
                      </td>
                      <td className="py-3 px-4">VLAN 30</td>
                      <td className="py-3 px-4 text-slate-400">
                        Zebra Android mobile inventory guns
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Hardware Terminal Fleet */}
        {activeTab === "fleet" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Store Terminal Hardware Fleet Reference
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Hardware specifications, operating systems, default
                communication ports, and diagnostic procedures for each terminal
                type.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posDocumentation.terminalModels?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl border border-blue-900/50 bg-slate-900/60 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-blue-950">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      {item.model}
                    </h3>
                    <span className="px-2.5 py-1 rounded-md bg-blue-950 text-sky-300 font-mono text-xs border border-blue-800">
                      {item.defaultPort}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="text-slate-400">
                      OS Platform:{" "}
                      <span className="text-slate-100 font-semibold">
                        {item.os}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Standard Operating Procedures (SOP) */}
        {activeTab === "sop" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                L2 Standard Operating Playbooks & Incident SLAs
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Mandatory resolution protocols to maintain 99.9% uptime across
                store checkout operations.
              </p>
            </div>

            <div className="space-y-6">
              {posDocumentation.sopProcedures?.map((sop) => (
                <div
                  key={sop.id}
                  className="p-6 sm:p-7 rounded-2xl border border-blue-900/50 bg-slate-900/60 shadow-xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-950">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-blue-900/70 text-sky-300 font-mono font-bold text-xs border border-blue-700">
                        {sop.id}
                      </span>
                      <h3 className="font-bold text-white text-base">
                        {sop.title}
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-xs font-semibold">
                      {sop.sla}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider block">
                      Investigation & Resolution Steps:
                    </span>
                    <div className="space-y-2.5">
                      {sop.steps.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className="text-sm text-slate-200 leading-relaxed flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-blue-950"
                        >
                          <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Database Data Dictionary */}
        {activeTab === "schema" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Database Schema & Physical Data Dictionary
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Column definitions, data types, primary/foreign key
                relationships across the 4 in-memory SQL tables.
              </p>
            </div>

            <div className="space-y-8">
              {mockDatabaseSchema.map((tbl) => (
                <div
                  key={tbl.table}
                  className="p-6 sm:p-7 rounded-2xl border border-blue-900/50 bg-slate-900/60 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-blue-950">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-800 text-sky-300 flex items-center justify-center font-mono font-bold text-sm">
                        <Database className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="font-bold text-white text-base font-mono">
                          {tbl.table}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {tbl.description}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-blue-950 text-sky-300 font-mono text-xs border border-blue-800">
                      {tbl.columns.length} Columns
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="border-b border-blue-950 text-slate-400 bg-slate-950/80">
                          <th className="py-2.5 px-3">Column</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Key Constraints</th>
                          <th className="py-2.5 px-3">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-950/50 text-slate-300">
                        {tbl.columns.map((col) => (
                          <tr key={col.name} className="hover:bg-blue-950/20">
                            <td className="py-2.5 px-3 font-bold text-sky-300">
                              {col.name}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">
                              {col.type}
                            </td>
                            <td className="py-2.5 px-3">
                              {col.isPrimary && (
                                <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-sky-300 border border-blue-700 text-[10px] font-bold mr-1">
                                  PK
                                </span>
                              )}
                              {col.isForeign && (
                                <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-indigo-300 border border-indigo-700 text-[10px] font-bold">
                                  FK &rarr; {col.references}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300">
                              {col.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Spacious Footer */}
      <footer className="border-t border-blue-950/80 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Enterprise POS Systems Engineering • Level 2 Support Knowledge Base
          </span>
          <button
            onClick={() => navigate("/assessment")}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4"
          >
            Return to Active Assessment
          </button>
        </div>
      </footer>
    </div>
  );
}
