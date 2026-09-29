import { useState } from 'react';
import { Database, AlertCircle, Clock, Hash, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ResultTable({ data, error, executionTimeMs, title = "Query Result", maxHeight = "max-h-[360px]" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  if (error) {
    return (
      <div className="rounded-xl border border-rose-400/40 dark:border-rose-500/40 bg-rose-50/80 dark:bg-rose-950/30 p-4 text-rose-700 dark:text-rose-300 font-mono text-xs overflow-auto max-h-[300px]">
        <div className="flex items-center gap-2 mb-2 font-semibold text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Execution Syntax Error</span>
        </div>
        <pre className="whitespace-pre-wrap break-words leading-relaxed bg-rose-100/80 dark:bg-black/50 p-3 rounded-lg border border-rose-300/60 dark:border-rose-500/30 text-rose-800 dark:text-rose-200">
          {error}
        </pre>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed theme-border bg-[var(--bg-surface2)]">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900/60 flex items-center justify-center text-blue-600 dark:text-sky-400 mb-3 shadow-md">
          <Database className="w-6 h-6" />
        </div>
        <h4 className="theme-text font-medium text-sm mb-1">Awaiting Query Execution</h4>
        <p className="theme-text-muted text-xs max-w-sm">
          Write your command in the editor and click <span className="text-blue-600 dark:text-sky-300 font-semibold">Check Answer</span> or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 theme-text-sec border theme-border font-mono text-[10px]">Ctrl + Enter</kbd> to inspect the database output.
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border theme-border bg-[var(--bg-card)]">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 dark:bg-amber-950/50 border border-amber-400/30 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-2">
          <Database className="w-5 h-5" />
        </div>
        <h4 className="theme-text font-medium text-sm mb-1">0 Rows Returned</h4>
        <p className="theme-text-muted text-xs">
          The query executed successfully in {executionTimeMs || 0}ms, but returned no matching records.
        </p>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col rounded-xl border theme-border bg-[var(--bg-surface)] overflow-hidden shadow-xl">
      {/* Table Subheader */}
      <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface2)] border-b theme-border-m text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold theme-text flex items-center gap-1.5 font-mono">
            <Database className="w-3.5 h-3.5 text-blue-500 dark:text-sky-400" />
            {title}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-sky-300 font-mono text-[11px] border border-blue-200 dark:border-blue-800/60 font-medium">
            <Hash className="w-3 h-3" />
            {data.length} row{data.length === 1 ? '' : 's'}
          </span>
        </div>
        {executionTimeMs !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] theme-text-muted font-mono">
            <Clock className="w-3 h-3 text-blue-500 dark:text-sky-400" />
            {executionTimeMs}ms
          </span>
        )}
      </div>

      {/* Responsive Table Container */}
      <div className={`overflow-x-auto ${maxHeight} scrollbar-thin scrollbar-thumb-blue-200 dark:scrollbar-thumb-blue-900`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 z-10 bg-[var(--bg-surface2)] backdrop-blur border-b theme-border-m">
            <tr>
              <th className="py-2.5 px-3 text-[11px] font-semibold theme-text-muted uppercase tracking-wider font-mono w-12 border-r theme-border-m text-center">
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-2.5 px-3 text-[11px] font-semibold font-mono tracking-wider border-r theme-border-m last:border-r-0 whitespace-nowrap"
                >
                  <span className="text-blue-700 dark:text-sky-300 font-mono font-semibold">{col}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-muted)] font-mono">
            {currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-[var(--bg-surface2)] transition-colors duration-100 group"
              >
                <td className="py-2 px-3 text-center theme-text-muted border-r theme-border-m text-[11px] bg-[var(--bg-surface2)]">
                  {(currentPage - 1) * pageSize + idx + 1}
                </td>
                {columns.map((col) => {
                  const val = row[col];
                  const isNull = val === null || val === undefined;
                  const isNum = typeof val === 'number';
                  const isStatus = typeof val === 'string' && ['ONLINE', 'OFFLINE', 'DEGRADED', 'COMPLETED', 'FAILED', 'PENDING_SYNC', 'CRITICAL', 'FATAL', 'VALID', 'INCOMPLETE', 'ACCEPTED', 'NEEDS_REVIEW'].includes(val);

                  let badgeColor = '';
                  // Blue for positive/healthy states
                  if (val === 'ONLINE' || val === 'COMPLETED' || val === 'VALID' || val === 'ACCEPTED') {
                    badgeColor = 'text-blue-700 dark:text-sky-300 bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-700/60';
                  } 
                  // RED for errors and failures
                  else if (val === 'OFFLINE' || val === 'FAILED' || val === 'FATAL' || val === 'INCOMPLETE') {
                    badgeColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/40';
                  } 
                  // ORANGE/AMBER for warnings and pending procedures
                  else if (val === 'DEGRADED' || val === 'PENDING_SYNC' || val === 'CRITICAL' || val === 'WARN' || val === 'NEEDS_REVIEW') {
                    badgeColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/40';
                  }

                  return (
                    <td
                      key={col}
                      className="py-2 px-3 theme-text-sec border-r theme-border-m last:border-r-0 whitespace-nowrap group-hover:theme-text"
                    >
                      {isNull ? (
                        <span className="theme-text-muted italic">NULL</span>
                      ) : isStatus ? (
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeColor}`}>
                          {val}
                        </span>
                      ) : isNum ? (
                        <span className="text-blue-600 dark:text-sky-200 font-mono">{val}</span>
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
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface2)] border-t theme-border-m text-xs theme-text-muted">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:cursor-not-allowed theme-text-sec"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] px-2 text-blue-600 dark:text-sky-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-[var(--bg-surface)] disabled:opacity-30 disabled:cursor-not-allowed theme-text-sec"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
