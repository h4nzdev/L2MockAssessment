import { useState } from 'react';
import { X, Database, Key, Table2, Layers, Eye } from 'lucide-react';
import { mockDatabaseSchema, mockStores, mockRegisters, mockTransactions, mockErrorLogs } from '../data/mockDatabase';
import ResultTable from './ResultTable';

export default function SchemaModal({ isOpen, onClose }) {
  const [selectedTable, setSelectedTable] = useState('Stores');
  const [viewMode, setViewMode] = useState('schema'); // 'schema' | 'sample'

  if (!isOpen) return null;

  const currentTableMeta = mockDatabaseSchema.find(t => t.table === selectedTable) || mockDatabaseSchema[0];

  const getSampleData = (tableName) => {
    switch (tableName) {
      case 'Stores': return mockStores.slice(0, 5);
      case 'Registers': return mockRegisters.slice(0, 5);
      case 'Transactions': return mockTransactions.slice(0, 5);
      case 'ErrorLogs': return mockErrorLogs.slice(0, 5);
      default: return [];
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-blue-900/60 bg-slate-950 shadow-2xl shadow-blue-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-950 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/60 text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Retail POS Database Schema
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800/60">
                  In-Memory AlaSQL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspect physical tables, primary keys, relationships, and sample payloads
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

        {/* Content Body */}
        <div className="flex flex-1 overflow-hidden bg-slate-950">
          {/* Table Sidebar List */}
          <div className="w-60 border-r border-blue-950 bg-slate-950 p-3 space-y-1.5 shrink-0 overflow-y-auto">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 block mb-2 font-mono">
              Database Tables
            </span>
            {mockDatabaseSchema.map((tbl) => {
              const isSelected = selectedTable === tbl.table;
              return (
                <button
                  key={tbl.table}
                  onClick={() => setSelectedTable(tbl.table)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-900/50 text-sky-200 border border-blue-600/60 font-medium shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Table2 className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
                    <span>{tbl.table}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-blue-950">
                    {tbl.columns.length} cols
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Details Area */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-950">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-950">
              <div>
                <h4 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-sky-300">{currentTableMeta.table}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentTableMeta.description}
                </p>
              </div>

              {/* View Toggle */}
              <div className="flex rounded-lg bg-slate-900 border border-blue-950 p-1 text-xs">
                <button
                  onClick={() => setViewMode('schema')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                    viewMode === 'schema'
                      ? 'bg-blue-900 text-sky-200 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Schema Columns
                </button>
                <button
                  onClick={() => setViewMode('sample')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                    viewMode === 'sample'
                      ? 'bg-blue-900 text-sky-200 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Sample Records
                </button>
              </div>
            </div>

            {viewMode === 'schema' ? (
              <div className="rounded-xl border border-blue-950 bg-slate-900/60 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-blue-950 font-mono text-[11px] text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4">Column Name</th>
                      <th className="py-2.5 px-4">Data Type</th>
                      <th className="py-2.5 px-4">Key / Constraint</th>
                      <th className="py-2.5 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-950/60 font-mono text-slate-300">
                    {currentTableMeta.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-blue-950/30">
                        <td className="py-2.5 px-4 font-semibold text-sky-300">
                          {col.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-200 text-[10px] border border-blue-800/60 font-semibold">
                            {col.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {col.isPrimary && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/30 font-sans font-medium">
                              <Key className="w-2.5 h-2.5" /> PK (Primary)
                            </span>
                          )}
                          {col.isForeign && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-sky-300 text-[10px] border border-blue-500/30 font-sans font-medium">
                              FK &rarr; {col.references}
                            </span>
                          )}
                          {!col.isPrimary && !col.isForeign && (
                            <span className="text-slate-500 text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-sans text-xs">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs text-slate-400 font-mono">
                  Displaying 5 sample rows from mock table <code className="text-sky-300 font-bold">{currentTableMeta.table}</code>:
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
        <div className="flex items-center justify-between px-6 py-3 border-t border-blue-950 bg-slate-900/80 text-xs text-slate-400">
          <span>Tip: You can join these tables directly using standard SQL syntax.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
