import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';
import { STAR_GUIDE } from '../../data/rolesData';

export const StarGuideModal: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = STAR_GUIDE.steps[activeStepIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          Master the Framework
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          The STAR Behavioral Technique
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          {STAR_GUIDE.subtitle}
        </p>
      </div>

      {/* Step Tabs: S - T - A - R */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAR_GUIDE.steps.map((step, idx) => (
          <button
            key={step.step}
            onClick={() => setActiveStepIndex(idx)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeStepIndex === idx
                ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/15 text-white'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-black font-mono text-blue-400">{step.step}</span>
              <span className="text-[11px] font-mono text-slate-500">{step.targetPercent}</span>
            </div>
            <p className="font-bold text-sm text-white">{step.name}</p>
          </button>
        ))}
      </div>

      {/* Detailed Card for Active Step */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono text-blue-400 font-bold">
                Step {activeStepIndex + 1} of 4
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">
                Recommended Response Time: {activeStep.targetPercent}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {activeStep.step} - {activeStep.name}
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {activeStep.description}
        </p>

        {/* Before & After: Bad vs Good Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Weak Example */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Weak / Vague Answer:</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed italic">
              {activeStep.exampleBad}
            </p>
          </div>

          {/* Strong Example */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strong High-Signal Benchmark:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {activeStep.exampleGood}
            </p>
          </div>
        </div>
      </div>

      {/* Pro Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <span className="font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Use "I" instead of "We"
          </span>
          <p className="text-slate-400 leading-relaxed">
            Hiring committees want to know what YOU personally contributed. Avoid cloaking your actions behind the team's generalized achievements.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <span className="font-bold text-sm text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Quantify Every Result
          </span>
          <p className="text-slate-400 leading-relaxed">
            Numbers stick. Mention latency in milliseconds, cost savings in dollars, revenue in percentages, or downtime prevented in hours.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
          <span className="font-bold text-sm text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Mind the 90-120s Rule
          </span>
          <p className="text-slate-400 leading-relaxed">
            Aim for concise delivery. Spending more than 3 minutes on a single answer leads to rambling and reduces interviewer engagement.
          </p>
        </div>
      </div>
    </div>
  );
};
