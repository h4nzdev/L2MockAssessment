import { useState } from 'react';
import alasql from 'alasql';
import { X, Database, Key, Table2, Layers, Eye } from 'lucide-react';
import { mockDatabaseSchema, ensureAlaSqlDatabase } from '../data/mockDatabase';
import ResultTable from './ResultTable';

export default function SchemaModal({ isOpen, onClose }) {
  const getActiveSchemaList = () => {
    try {
      const stored = localStorage.getItem('support_sql_custom_db_schema');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to mockDatabaseSchema if parsing fails
    }
    return mockDatabaseSchema;
  };

  const activeSchemaList = getActiveSchemaList();
  const [selectedTable, setSelectedTable] = useState(() => activeSchemaList[0]?.table || 'Stores');
  const [viewMode, setViewMode] = useState('schema'); // 'schema' | 'sample'

  if (!isOpen) return null;

  const currentTableMeta = activeSchemaList.find(t => t.table === selectedTable) || activeSchemaList[0] || mockDatabaseSchema[0];

  const getSampleData = (tableName) => {
    try {
      ensureAlaSqlDatabase();
      return alasql(`SELECT * FROM ${tableName} LIMIT 5`) || [];
    } catch {
      return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 dark:bg-slate-950/85 bg-slate-700/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border theme-border bg-[var(--bg-surface)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border-m bg-[var(--bg-surface2)] dark:bg-gradient-to-r dark:from-blue-950/80 dark:via-slate-900 dark:to-indigo-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold theme-text flex items-center gap-2">
                Retail POS Database Schema
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-blue-800/60">
                  In-Memory AlaSQL
                </span>
              </h3>
              <p className="text-xs theme-text-muted">
                Inspect physical tables, primary keys, relationships, and sample payloads
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg theme-text-muted hover:theme-text hover:bg-[var(--bg-surface2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden bg-[var(--bg-base)]">
          {/* Table Sidebar List */}
          <div className="w-60 border-r theme-border bg-[var(--bg-surface)] p-3 space-y-1.5 shrink-0 overflow-y-auto">
            <span className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider px-2 block mb-2 font-mono">
              Database Tables
            </span>
            {activeSchemaList.map((tbl) => {
              const isSelected = selectedTable === tbl.table;
              return (
                <button
                  key={tbl.table}
                  onClick={() => setSelectedTable(tbl.table)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white dark:bg-blue-900/50 dark:text-sky-200 border border-blue-500 dark:border-blue-600/60 font-medium shadow-sm'
                      : 'theme-text-muted hover:bg-[var(--bg-surface2)] hover:theme-text-sec border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Table2 className={`w-4 h-4 ${isSelected ? 'text-current' : 'text-[var(--text-muted)]'}`} />
                    <span>{tbl.table}</span>
                  </div>
                  <span className="text-[10px] theme-text-muted bg-[var(--bg-surface2)] px-1.5 py-0.5 rounded border theme-border-m">
                    {tbl.columns.length} cols
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Details Area */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-[var(--bg-base)]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b theme-border-m gap-4 flex-wrap sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold theme-text font-mono flex items-center gap-2">
                  <span className="text-blue-600 dark:text-sky-300">{currentTableMeta.table}</span>
                </h4>
                <p className="text-xs theme-text-muted mt-0.5">
                  {currentTableMeta.description}
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex items-center shrink-0 rounded-lg bg-[var(--bg-surface2)] border theme-border-m p-1 text-xs">
                <button
                  onClick={() => setViewMode('schema')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    viewMode === 'schema'
                      ? 'bg-blue-600 text-white dark:bg-blue-900 dark:text-sky-200 shadow-sm font-semibold'
                      : 'theme-text-muted hover:theme-text-sec'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 shrink-0" />
                  <span>Schema Columns</span>
                </button>
                <button
                  onClick={() => setViewMode('sample')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                    viewMode === 'sample'
                      ? 'bg-blue-600 text-white dark:bg-blue-900 dark:text-sky-200 shadow-sm font-semibold'
                      : 'theme-text-muted hover:theme-text-sec'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 shrink-0" />
                  <span>Sample Records</span>
                </button>
              </div>
            </div>

            {viewMode === 'schema' ? (
              <div className="rounded-xl border theme-border bg-[var(--bg-card)] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-[var(--bg-surface2)] border-b theme-border-m font-mono text-[11px] theme-text-muted">
                    <tr>
                      <th className="py-2.5 px-4">Column Name</th>
                      <th className="py-2.5 px-4">Data Type</th>
                      <th className="py-2.5 px-4">Key / Constraint</th>
                      <th className="py-2.5 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-muted)] font-mono theme-text-sec">
                    {currentTableMeta.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-[var(--bg-surface2)]">
                        <td className="py-2.5 px-4 font-semibold text-blue-700 dark:text-sky-300">
                          {col.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200 text-[10px] border border-blue-200 dark:border-blue-800/60 font-semibold">
                            {col.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {col.isPrimary && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] border border-amber-500/30 font-sans font-medium">
                              <Key className="w-2.5 h-2.5" /> PK (Primary)
                            </span>
                          )}
                          {col.isForeign && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-sky-300 text-[10px] border border-blue-300 dark:border-blue-500/30 font-sans font-medium">
                              FK &rarr; {col.references}
                            </span>
                          )}
                          {!col.isPrimary && !col.isForeign && (
                            <span className="theme-text-muted text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 theme-text-muted font-sans text-xs">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs theme-text-muted font-mono">
                  Displaying 5 sample rows from mock table <code className="text-blue-600 dark:text-sky-300 font-bold">{currentTableMeta.table}</code>:
                </span>
                <ResultTable 
                  data={getSampleData(currentTableMeta.table)} 
                  title={`Sample: ${currentTableMeta.table}`} 
                  maxHeight="max-h-[300px]" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t theme-border bg-[var(--bg-surface)] text-xs theme-text-muted">
          <span>Tip: You can join these tables directly using standard SQL syntax.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--bg-surface2)] hover:bg-[var(--border-base)] theme-text-sec transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
