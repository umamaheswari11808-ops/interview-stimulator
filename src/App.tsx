import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SetupView } from './components/Simulator/SetupView';
import { InterviewRoom } from './components/Simulator/InterviewRoom';
import { ScorecardView } from './components/Scorecard/ScorecardView';
import { DrillView } from './components/DrillMode/DrillView';
import { ResumeTailorView } from './components/ResumeTailor/ResumeTailorView';
import { AnalyticsView } from './components/Analytics/AnalyticsView';
import { StarGuideModal } from './components/Guide/StarGuideModal';
import { 
  SeniorityLevel, 
  InterviewType, 
  InterviewerPersona, 
  QuestionItem, 
  FinalEvaluation, 
  SessionHistoryItem 
} from './types/interview';
import { INTERVIEWER_PERSONAS, PREDEFINED_ROLES } from './data/rolesData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'simulator' | 'drills' | 'tailor' | 'analytics' | 'guide'>('simulator');
  const [simState, setSimState] = useState<'setup' | 'room' | 'scorecard'>('setup');
  
  // Settings
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Active Simulation Config
  const [role, setRole] = useState<string>('Software Engineer');
  const [seniority, setSeniority] = useState<SeniorityLevel>('Mid-Level');
  const [interviewType, setInterviewType] = useState<InterviewType>('Mixed (Behavioral & Technical)');
  const [interviewer, setInterviewer] = useState<InterviewerPersona>(INTERVIEWER_PERSONAS[0]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Active Simulation Results
  const [currentEvaluation, setCurrentEvaluation] = useState<FinalEvaluation | null>(null);
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [sessionFillerWords, setSessionFillerWords] = useState<Record<string, number>>({});
  const [isSessionSaved, setIsSessionSaved] = useState<boolean>(false);

  // Saved Session History (localStorage)
  const [history, setHistory] = useState<SessionHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('interviewpulse_history');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to load history from localStorage', e);
      }
    }
    return [];
  });

  const saveHistoryToStorage = (updated: SessionHistoryItem[]) => {
    setHistory(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('interviewpulse_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history', e);
      }
    }
  };

  // Start Simulation from Setup or Custom Tailor
  const handleStartSimulation = async (config: {
    role: string;
    seniority: SeniorityLevel;
    interviewType: InterviewType;
    interviewer: InterviewerPersona;
    questionCount: number;
    jobDescription?: string;
    resumeText?: string;
    stream: MediaStream | null;
    videoEnabled: boolean;
    audioEnabled: boolean;
  }) => {
    setIsLoadingQuestions(true);
    setRole(config.role);
    setSeniority(config.seniority);
    setInterviewType(config.interviewType);
    setInterviewer(config.interviewer);
    setMediaStream(config.stream);

    try {
      const res = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: config.role,
          seniority: config.seniority,
          interviewType: config.interviewType,
          interviewerPersona: config.interviewer.name,
          jobDescription: config.jobDescription,
          resumeText: config.resumeText,
          questionCount: config.questionCount
        })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        // Fallback default questions
        const fallback = PREDEFINED_ROLES[0].defaultQuestions.map(q => ({
          question: q,
          category: 'Technical Architecture & Behavioral',
          keyPoints: ['STAR structure', 'Tradeoffs', 'Outcome']
        }));
        setQuestions(fallback);
      }

      setSimState('room');
      setCurrentTab('simulator');
    } catch (err) {
      console.warn('Start interview error:', err);
      // Fallback
      setQuestions(PREDEFINED_ROLES[0].defaultQuestions.map(q => ({
        question: q,
        category: 'General',
        keyPoints: ['Clear context', 'Actionable steps']
      })));
      setSimState('room');
      setCurrentTab('simulator');
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Finish Interview & Run Final Evaluation
  const handleFinishInterview = async (sessionData: {
    questions: string[];
    answers: string[];
    durations: number[];
    fillerWordCounts: Record<string, number>;
  }) => {
    setIsEvaluating(true);
    const totalSecs = sessionData.durations.reduce((a, b) => a + b, 0);
    setSessionDuration(totalSecs);
    setSessionFillerWords(sessionData.fillerWordCounts);
    setIsSessionSaved(false);

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          seniority,
          interviewType,
          questions: sessionData.questions,
          answers: sessionData.answers,
          durations: sessionData.durations,
          fillerWordCounts: sessionData.fillerWordCounts
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        setCurrentEvaluation(data.evaluation);
        setSimState('scorecard');
      }
    } catch (err) {
      console.warn('Final evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Save current scorecard to history
  const handleSaveSession = () => {
    if (!currentEvaluation || isSessionSaved) return;

    const totalFillers = Object.values(sessionFillerWords).reduce((a, b) => a + b, 0);
    const newItem: SessionHistoryItem = {
      id: 'session-' + Date.now(),
      timestamp: new Date().toISOString(),
      role,
      seniority,
      overallScore: currentEvaluation.overallScore,
      verdict: currentEvaluation.verdict,
      totalDurationSeconds: sessionDuration,
      questionsCount: currentEvaluation.questionBreakdowns.length,
      fillerWordsTotal: totalFillers,
      evaluation: currentEvaluation
    };

    saveHistoryToStorage([newItem, ...history]);
    setIsSessionSaved(true);
  };

  // View historical scorecard
  const handleViewHistoricalSession = (session: SessionHistoryItem) => {
    setRole(session.role);
    setSeniority(session.seniority as SeniorityLevel);
    setCurrentEvaluation(session.evaluation);
    setSessionDuration(session.totalDurationSeconds);
    setSessionFillerWords({});
    setIsSessionSaved(true);
    setSimState('scorecard');
    setCurrentTab('simulator');
  };

  const handleClearHistory = () => {
    if (confirm('Clear all historical interview reports?')) {
      saveHistoryToStorage([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        onStartNewMock={() => {
          setSimState('setup');
          setCurrentTab('simulator');
        }}
        isSimulating={simState === 'room'}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Loading Overlay when evaluating final scorecard */}
        {isEvaluating && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white">Synthesizing Bar Raiser Scorecard</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-md">
              Analyzing candidate STAR structure, evaluating technical accuracy, pacing, and generating benchmark model answers...
            </p>
          </div>
        )}

        {/* Tab 1: Simulator */}
        {currentTab === 'simulator' && (
          <>
            {simState === 'setup' && (
              <SetupView
                onStartSimulation={handleStartSimulation}
                isLoading={isLoadingQuestions}
              />
            )}

            {simState === 'room' && questions.length > 0 && (
              <InterviewRoom
                role={role}
                seniority={seniority}
                interviewType={interviewType}
                interviewer={interviewer}
                questions={questions}
                mediaStream={mediaStream}
                ttsEnabled={ttsEnabled}
                onFinishInterview={handleFinishInterview}
                onExit={() => setSimState('setup')}
              />
            )}

            {simState === 'scorecard' && currentEvaluation && (
              <ScorecardView
                role={role}
                seniority={seniority}
                interviewType={interviewType}
                evaluation={currentEvaluation}
                totalDurationSeconds={sessionDuration}
                fillerWordCounts={sessionFillerWords}
                onStartNew={() => setSimState('setup')}
                onSaveSession={handleSaveSession}
                isSaved={isSessionSaved}
              />
            )}
          </>
        )}

        {/* Tab 2: Question Drills */}
        {currentTab === 'drills' && <DrillView />}

        {/* Tab 3: Resume & JD Tailor */}
        {currentTab === 'tailor' && (
          <ResumeTailorView
            onLaunchTailoredSimulation={handleStartSimulation}
          />
        )}

        {/* Tab 4: Analytics & History */}
        {currentTab === 'analytics' && (
          <AnalyticsView
            sessions={history}
            onClearHistory={handleClearHistory}
            onViewSession={handleViewHistoricalSession}
            onStartNew={() => {
              setSimState('setup');
              setCurrentTab('simulator');
            }}
          />
        )}

        {/* Tab 5: STAR Framework Guide */}
        {currentTab === 'guide' && <StarGuideModal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} InterviewPulse · Interactive AI Interview Simulator & STAR Scoring.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini AI</span>
            <span>·</span>
            <span>Real-time Voice & Audio</span>
            <span>·</span>
            <span>Zero Data Stored Remotely</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
