import React from 'react';
import { 
  BarChart3, 
  Award, 
  Clock, 
  Mic, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Play,
  RotateCcw
} from 'lucide-react';
import { SessionHistoryItem } from '../../types/interview';

interface AnalyticsViewProps {
  sessions: SessionHistoryItem[];
  onClearHistory: () => void;
  onViewSession: (session: SessionHistoryItem) => void;
  onStartNew: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  sessions,
  onClearHistory,
  onViewSession,
  onStartNew
}) => {
  const totalCompleted = sessions.length;
  const avgScore = totalCompleted > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.overallScore, 0) / totalCompleted)
    : 0;

  const totalDurationMinutes = totalCompleted > 0
    ? Math.round(sessions.reduce((acc, s) => acc + s.totalDurationSeconds, 0) / 60)
    : 0;

  const totalFillers = sessions.reduce((acc, s) => acc + (s.fillerWordsTotal || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            Performance & Interview Analytics
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Interview Readiness & History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your scoring trajectory, communication pacing, and historical scorecards across practice sessions.
          </p>
        </div>

        {totalCompleted > 0 && (
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Completed Mocks</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalCompleted}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Full simulation sessions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Average Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {avgScore} <span className="text-sm text-slate-500 font-normal">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {avgScore >= 80 ? 'Competitive Ready' : avgScore >= 70 ? 'Approaching Benchmark' : 'Practice Recommended'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Practice Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalDurationMinutes} <span className="text-sm text-slate-500 font-normal">min</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Total spoken practice</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Filler Words Flagged</span>
            <Mic className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalFillers}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cumulative "um", "like", "actually"</span>
        </div>
      </div>

      {/* History Table or Empty State */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h2 className="text-base font-semibold text-white mb-4">
          Session Log & Detailed Scorecards
        </h2>

        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Role & Seniority</th>
                  <th className="pb-3 font-semibold">Score</th>
                  <th className="pb-3 font-semibold">Verdict</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {sessions.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 font-medium text-white">
                      {item.seniority} {item.role}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-sm text-blue-400 font-mono">
                        {item.overallScore}
                      </span>
                      <span className="text-slate-500 font-normal">/100</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        item.verdict === 'Strong Hire' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        item.verdict === 'Hire' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.verdict}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {Math.round(item.totalDurationSeconds / 60)} mins
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => onViewSession(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Scorecard</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 space-y-3">
            <BarChart3 className="w-12 h-12 mx-auto opacity-30" />
            <p className="text-sm">No saved interview sessions yet.</p>
            <button
              onClick={onStartNew}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Your First Simulation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
