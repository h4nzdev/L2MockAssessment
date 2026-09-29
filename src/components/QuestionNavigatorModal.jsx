import { useState } from 'react';
import { X, CheckCircle2, Circle, Layers, Filter } from 'lucide-react';
import { questionBank, difficultyColors } from '../data/questionBank';

export default function QuestionNavigatorModal({
  isOpen,
  onClose,
  currentIndex,
  onSelectQuestion,
  completedMap,
  questions = questionBank
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  if (!isOpen) return null;

  const activeQuestions = questions || questionBank;

  // Available filters
  const hasCategories = activeQuestions.some(q => q.category);
  const filterOptions = hasCategories
    ? ['ALL', 'SQL', 'PowerShell', 'Network Troubleshooting']
    : ['ALL', 'Basic', 'Medium', 'Intermediate', 'Advanced'];

  const filteredQuestions = activeFilter === 'ALL'
    ? activeQuestions
    : activeQuestions.filter(q => (q.category === activeFilter || q.difficulty === activeFilter));

  const completedCount = Object.keys(completedMap).filter(k => completedMap[k]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-blue-900/60 bg-slate-950 shadow-2xl shadow-blue-950/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-950 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/60 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Assessment Question Bank
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-950 text-sky-300 border border-blue-800/60">
                  {completedCount} / {activeQuestions.length} Solved
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Jump directly to any troubleshooting scenario in this session
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-blue-950 bg-slate-900/40 overflow-x-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-mono shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-sky-400" /> Filter:
          </span>
          {filterOptions.map((lvl) => {
            const isSelected = activeFilter === lvl;
            return (
              <button
                key={lvl}
                onClick={() => setActiveFilter(lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-sky-200 border border-blue-600/60 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>

        {/* Grid of Questions */}
        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950">
          {filteredQuestions.map((q) => {
            const isCurrent = currentIndex === q.id - 1;
            const isSolved = !!completedMap[q.id];
            const colors = difficultyColors[q.difficulty] || difficultyColors.Basic;

            return (
              <button
                key={q.id}
                onClick={() => {
                  onSelectQuestion(q.id - 1);
                  onClose();
                }}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/50 shadow-md shadow-blue-950/40'
                    : isSolved
                    ? 'border-blue-700/40 bg-blue-950/20 hover:border-blue-600/50'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-blue-900/60 hover:bg-slate-900/70'
                }`}
              >
                <div className="mt-0.5">
                  {isSolved ? (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : isCurrent ? (
                    <Circle className="w-4 h-4 text-blue-400 fill-blue-400 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                      {q.id}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${colors.badge}`}>
                      {q.category || q.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {q.ticketId}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 truncate">
                    {q.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-blue-950 bg-slate-900/80 text-xs text-slate-400">
          <span>Click any card to load that question in the assessment workspace.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
