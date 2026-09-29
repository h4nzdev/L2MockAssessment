import { useState } from 'react';
import { Database, AlertCircle, Clock, Hash, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResultTable({ data, error, executionTimeMs, title = "Query Result", maxHeight = "max-h-[360px]" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-rose-300 font-mono text-xs overflow-auto max-h-[300px]">
        <div className="flex items-center gap-2 mb-2 font-semibold text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Execution Syntax Error</span>
        </div>
        <pre className="whitespace-pre-wrap break-words leading-relaxed bg-black/50 p-3 rounded-lg border border-rose-500/30 text-rose-200">
          {error}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-blue-950 bg-slate-950/60">
        <div className="w-12 h-12 rounded-xl bg-blue-950 border border-blue-900/60 flex items-center justify-center text-sky-400 mb-3 shadow-md">
          <Database className="w-6 h-6" />
        </div>
        <h4 className="text-slate-200 font-medium text-sm mb-1">Awaiting Query Execution</h4>
        <p className="text-slate-400 text-xs max-w-sm">
          Write your command in the editor and click <span className="text-sky-300 font-semibold">Check Answer</span> or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-[10px]">Ctrl + Enter</kbd> to inspect the database output.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-blue-950 bg-slate-900/40">
        <div className="w-10 h-10 rounded-lg bg-amber-950/50 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-2">
          <Database className="w-5 h-5" />
        </div>
        <h4 className="text-slate-200 font-medium text-sm mb-1">0 Rows Returned</h4>
        <p className="text-slate-400 text-xs">
          The query executed successfully in {executionTimeMs || 0}ms, but returned no matching records.
        </p>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col rounded-xl border border-blue-950 bg-slate-900/80 overflow-hidden shadow-xl">
      {/* Table Subheader */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-blue-950 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-sky-400" />
            {title}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-950 text-sky-300 font-mono text-[11px] border border-blue-800/60 font-medium">
            <Hash className="w-3 h-3 text-sky-400" />
            {data.length} row{data.length === 1 ? '' : 's'}
          </span>
        </div>
        {executionTimeMs !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
            <Clock className="w-3 h-3 text-sky-400" />
            {executionTimeMs}ms
          </span>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className={`overflow-x-auto ${maxHeight} scrollbar-thin scrollbar-thumb-blue-900`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-blue-950">
            <tr>
              <th className="py-2.5 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono w-12 border-r border-blue-950 text-center">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-2.5 px-3 text-[11px] font-semibold font-mono tracking-wider border-r border-blue-950/60 last:border-r-0 whitespace-nowrap"
                >
                  <span className="text-sky-300 font-mono font-semibold">{col}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-950/60 font-mono">
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-blue-950/30 transition-colors duration-100 group"
              >
                <td className="py-2 px-3 text-center text-slate-400 border-r border-blue-950 text-[11px] bg-slate-950/50">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col];
                  const isNull = val === null || val === undefined;
                  const isNum = typeof val === 'number';
                  const isStatus = typeof val === 'string' && ['ONLINE', 'OFFLINE', 'DEGRADED', 'COMPLETED', 'FAILED', 'PENDING_SYNC', 'CRITICAL', 'FATAL', 'VALID', 'INCOMPLETE', 'ACCEPTED', 'NEEDS_REVIEW'].includes(val);

                  let badgeColor = '';
                  // Blue/Navy for positive/healthy states
                  if (val === 'ONLINE' || val === 'COMPLETED' || val === 'VALID' || val === 'ACCEPTED') {
                    badgeColor = 'text-sky-300 bg-blue-950/70 border-blue-700/60';
                  } 
                  // RED for errors and failures
                  else if (val === 'OFFLINE' || val === 'FAILED' || val === 'FATAL' || val === 'INCOMPLETE') {
                    badgeColor = 'text-rose-400 bg-rose-950/40 border-rose-800/40';
                  } 
                  // ORANGE/AMBER for warnings and pending procedures
                  else if (val === 'DEGRADED' || val === 'PENDING_SYNC' || val === 'CRITICAL' || val === 'WARN' || val === 'NEEDS_REVIEW') {
                    badgeColor = 'text-amber-400 bg-amber-950/40 border-amber-800/40';
                  }

                  return (
                    <td
                      key={col}
                      className="py-2 px-3 text-slate-200 border-r border-blue-950/60 last:border-r-0 whitespace-nowrap group-hover:text-white"
                    >
                      {isNull ? (
                        <span className="text-slate-400 italic">NULL</span>
                      ) : isStatus ? (
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeColor}`}>
                          {val}
                        </span>
                      ) : isNum ? (
                        <span className="text-sky-200 font-mono">{val}</span>
                      ) : (
                        <span>{String(val)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-t border-blue-950 text-xs text-slate-400">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-2 text-sky-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
