import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  RotateCcw,
  BookOpen,
  Filter,
  Send
} from 'lucide-react';
import { DRILL_QUESTIONS_BANK } from '../../data/rolesData';
import { DrillItem } from '../../types/interview';
import { SpeechRecognitionService, countFillerWords } from '../../utils/speechUtils';

export const DrillView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDrill, setActiveDrill] = useState<DrillItem | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<{
    score: number;
    grade: string;
    strengths: string[];
    improvements: string[];
    goldStandardResponse: string;
  } | null>(null);

  const speechRef = useRef<SpeechRecognitionService | null>(null);

  const categories = ['All', 'Behavioral (STAR)', 'System Design', 'Communication', 'Career Narrative & Fit'];

  const filteredDrills = selectedCategory === 'All'
    ? DRILL_QUESTIONS_BANK
    : DRILL_QUESTIONS_BANK.filter(d => d.category === selectedCategory);

  useEffect(() => {
    const service = new SpeechRecognitionService();
    speechRef.current = service;

    service.onTranscriptChange = (text) => {
      setUserAnswer(prev => prev ? prev + ' ' + text : text);
    };

    service.onStateChange = (listening) => {
      setIsRecording(listening);
    };

    return () => {
      service.stop();
    };
  }, []);

  const handleStartPractice = (drill: DrillItem) => {
    setActiveDrill(drill);
    setUserAnswer('');
    setGradeResult(null);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      speechRef.current?.stop();
    } else {
      speechRef.current?.start();
    }
  };

  const handleGradeAnswer = async () => {
    if (!activeDrill || !userAnswer.trim() || isGrading) return;
    setIsGrading(true);
    speechRef.current?.stop();

    try {
      const res = await fetch('/api/interview/drill-grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeDrill.question,
          answer: userAnswer,
          category: activeDrill.category
        })
      });

      const data = await res.json();
      if (data.success && data.result) {
        setGradeResult(data.result);
      }
    } catch (err) {
      console.warn('Drill grade error:', err);
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Target className="w-3.5 h-3.5" />
          Rapid-Fire Question Drills
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Targeted Practice & Instant Grading
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Pick tough behavioral or system design questions, speak or type your answer, and receive an instant AI grade with gold-standard STAR comparisons.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid: Question Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrills.map(drill => (
          <div
            key={drill.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all backdrop-blur-sm group"
          >
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                  {drill.category}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  drill.difficulty === 'Hard' ? 'text-red-400 bg-red-500/10' :
                  drill.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10' :
                  'text-emerald-400 bg-emerald-500/10'
                }`}>
                  {drill.difficulty}
                </span>
              </div>

              <h3 className="font-semibold text-sm sm:text-base text-white leading-snug group-hover:text-blue-300 transition-colors">
                "{drill.question}"
              </h3>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 font-medium block mb-1">Look for:</span>
                <ul className="text-xs text-slate-400 space-y-1">
                  {drill.keyPointsToCover.slice(0, 2).map((pt, i) => (
                    <li key={i} className="line-clamp-1">• {pt}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleStartPractice(drill)}
              className="mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Practice This Question</span>
            </button>
          </div>
        ))}
      </div>

      {/* Drill Interactive Practice Modal */}
      {activeDrill && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {activeDrill.category} · {activeDrill.difficulty}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-2 leading-snug">
                  "{activeDrill.question}"
                </h2>
              </div>
              <button
                onClick={() => setActiveDrill(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Answer Input Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Speak or type your response:</span>
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Stop Recording' : 'Start Mic Recording'}</span>
                </button>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer using STAR: Situation, Task, Action, and quantified Result..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Words: {userAnswer.trim().split(/\s+/).filter(Boolean).length}</span>
                <button
                  onClick={handleGradeAnswer}
                  disabled={isGrading || !userAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGrading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Grading Response...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Grade with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Grade Result */}
            {gradeResult && (
              <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-mono">Performance Grade</span>
                    <div className="text-3xl font-black text-white mt-0.5">
                      {gradeResult.grade} <span className="text-sm font-normal text-blue-400">({gradeResult.score}/100)</span>
                    </div>
                  </div>
                  <Award className="w-10 h-10 text-blue-400" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                    <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      What Was Strong:
                    </p>
                    <ul className="text-slate-300 space-y-1">
                      {gradeResult.strengths.map((s, idx) => (
                        <li key={idx}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                    <p className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      To Level Up:
                    </p>
                    <ul className="text-slate-300 space-y-1">
                      {gradeResult.improvements.map((imp, idx) => (
                        <li key={idx}>• {imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Gold standard answer */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs space-y-1.5">
                  <p className="font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    Gold Standard Benchmark Answer:
                  </p>
                  <p className="text-blue-100 leading-relaxed">
                    {gradeResult.goldStandardResponse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
