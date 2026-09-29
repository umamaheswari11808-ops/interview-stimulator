import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  ArrowRight,
  LogOut,
  Sparkles,
  BarChart2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { InterviewerPersona, QuestionItem, TurnFeedback, FinalEvaluation } from '../../types/interview';
import { AudioVisualizer } from '../AudioVisualizer';
import { 
  speakText, 
  stopSpeaking, 
  countFillerWords, 
  calculateWPM, 
  SpeechRecognitionService 
} from '../../utils/speechUtils';

interface InterviewRoomProps {
  role: string;
  seniority: string;
  interviewType: string;
  interviewer: InterviewerPersona;
  questions: QuestionItem[];
  mediaStream: MediaStream | null;
  ttsEnabled: boolean;
  onFinishInterview: (sessionData: {
    questions: string[];
    answers: string[];
    durations: number[];
    fillerWordCounts: Record<string, number>;
  }) => void;
  onExit: () => void;
}

export const InterviewRoom: React.FC<InterviewRoomProps> = ({
  role,
  seniority,
  interviewType,
  interviewer,
  questions,
  mediaStream,
  ttsEnabled,
  onFinishInterview,
  onExit
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [durations, setDurations] = useState<number[]>(new Array(questions.length).fill(0));
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  
  // Video and audio controls
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Question & Session Timers
  const [questionTimer, setQuestionTimer] = useState<number>(0);
  const [totalTimer, setTotalTimer] = useState<number>(0);

  // Status & AI Feedback
  const [interviewerStatus, setInterviewerStatus] = useState<'speaking' | 'listening' | 'evaluating'>('speaking');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentTurnFeedback, setCurrentTurnFeedback] = useState<TurnFeedback | null>(null);
  const [showTurnModal, setShowTurnModal] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showStarGuide, setShowStarGuide] = useState<boolean>(false);

  // Speech Recognition
  const [isSpeechListening, setIsSpeechListening] = useState<boolean>(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState<boolean>(true);
  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

  // Cumulative filler word tracker
  const [accumulatedFillerWords, setAccumulatedFillerWords] = useState<Record<string, number>>({});

  const currentQuestionObj = questions[currentIndex] || questions[0];

  // Set up webcam stream
  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  // Handle video/audio track mute toggles
  useEffect(() => {
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(t => { t.enabled = videoEnabled; });
      mediaStream.getAudioTracks().forEach(t => { t.enabled = audioEnabled; });
    }
  }, [videoEnabled, audioEnabled, mediaStream]);

  // Session and Question Timers
  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionTimer(prev => prev + 1);
      setTotalTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const speechService = new SpeechRecognitionService();
    speechServiceRef.current = speechService;
    setSpeechRecognitionSupported(speechService.isSupported());

    speechService.onTranscriptChange = (text) => {
      setCurrentAnswer(prev => {
        // If candidate already typed something, append or replace smoothly
        if (!prev) return text;
        return prev + ' ' + text;
      });
    };

    speechService.onStateChange = (listening) => {
      setIsSpeechListening(listening);
    };

    // Auto-start listening if audio is enabled
    if (speechService.isSupported() && audioEnabled) {
      speechService.start();
    }

    return () => {
      speechService.stop();
      stopSpeaking();
    };
  }, []);

  // Speak question when current index changes
  useEffect(() => {
    setQuestionTimer(0);
    setCurrentAnswer('');
    setShowTurnModal(false);
    setCurrentTurnFeedback(null);
    setShowHint(false);

    if (currentQuestionObj) {
      setInterviewerStatus('speaking');
      if (ttsEnabled) {
        speakText(
          currentQuestionObj.question,
          {
            pitch: interviewer.voiceGender === 'female' ? 1.05 : 0.95,
            rate: 0.98,
            volume: 1.0,
            voiceGender: interviewer.voiceGender
          },
          () => {
            setInterviewerStatus('listening');
            // Resume speech recognition
            if (speechServiceRef.current && audioEnabled) {
              speechServiceRef.current.start();
            }
          }
        );
      } else {
        setInterviewerStatus('listening');
      }
    }

    return () => {
      stopSpeaking();
    };
  }, [currentIndex, ttsEnabled]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Replay question audio
  const handleReplayQuestion = () => {
    if (!currentQuestionObj) return;
    setInterviewerStatus('speaking');
    speakText(
      currentQuestionObj.question,
      {
        pitch: interviewer.voiceGender === 'female' ? 1.05 : 0.95,
        rate: 0.98,
        volume: 1.0,
        voiceGender: interviewer.voiceGender
      },
      () => setInterviewerStatus('listening')
    );
  };

  // Toggle microphone
  const handleToggleMic = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (!nextState) {
      speechServiceRef.current?.stop();
    } else {
      speechServiceRef.current?.start();
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setInterviewerStatus('evaluating');
    speechServiceRef.current?.stop();
    stopSpeaking();

    // Record answer and duration
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = currentAnswer;
    setAnswers(updatedAnswers);

    const updatedDurations = [...durations];
    updatedDurations[currentIndex] = questionTimer;
    setDurations(updatedDurations);

    // Track filler words
    const fillerStats = countFillerWords(currentAnswer);
    setAccumulatedFillerWords(prev => {
      const merged = { ...prev };
      for (const [word, count] of Object.entries(fillerStats.breakdown)) {
        merged[word] = (merged[word] || 0) + count;
      }
      return merged;
    });

    try {
      const res = await fetch('/api/interview/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          question: currentQuestionObj.question,
          candidateAnswer: currentAnswer,
          questionIndex: currentIndex,
          totalQuestions: questions.length,
          interviewerPersona: interviewer.name
        })
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setCurrentTurnFeedback(data.feedback);
        setShowTurnModal(true);

        if (ttsEnabled && data.feedback.suggestedTransition) {
          speakText(
            data.feedback.suggestedTransition,
            {
              pitch: interviewer.voiceGender === 'female' ? 1.05 : 0.95,
              rate: 1.0,
              volume: 1.0,
              voiceGender: interviewer.voiceGender
            }
          );
        }
      } else {
        // Fallback to next question directly
        advanceToNextQuestion(updatedAnswers, updatedDurations);
      }
    } catch (err) {
      console.warn('Turn evaluation error:', err);
      advanceToNextQuestion(updatedAnswers, updatedDurations);
    } finally {
      setIsSubmitting(false);
    }
  };

  const advanceToNextQuestion = (
    currentAnswersList = answers,
    currentDurationsList = durations
  ) => {
    setShowTurnModal(false);
    stopSpeaking();

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Completed all questions -> Final evaluation
      onFinishInterview({
        questions: questions.map(q => q.question),
        answers: currentAnswersList,
        durations: currentDurationsList,
        fillerWordCounts: accumulatedFillerWords
      });
    }
  };

  const handleEndEarly = () => {
    if (confirm('End this interview now and generate your comprehensive evaluation report?')) {
      stopSpeaking();
      speechServiceRef.current?.stop();
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = currentAnswer;
      const updatedDurations = [...durations];
      updatedDurations[currentIndex] = questionTimer;

      onFinishInterview({
        questions: questions.slice(0, currentIndex + 1).map(q => q.question),
        answers: updatedAnswers.slice(0, currentIndex + 1),
        durations: updatedDurations.slice(0, currentIndex + 1),
        fillerWordCounts: accumulatedFillerWords
      });
    }
  };

  // Metrics for current answer
  const currentFillerStats = countFillerWords(currentAnswer);
  const currentWPM = calculateWPM(currentAnswer, questionTimer);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 text-white min-h-[calc(100vh-5rem)] flex flex-col justify-between">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-5 py-3.5 mb-4 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Role & Interviewer Info */}
        <div className="flex items-center gap-3">
          <img
            src={interviewer.avatar}
            alt={interviewer.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-white">{interviewer.name}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                {seniority} {role}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {interviewType}
            </p>
          </div>
        </div>

        {/* Progress & Question Tracker */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Question</span>
            <span className="text-sm font-bold text-blue-400 font-mono">
              {currentIndex + 1} <span className="text-slate-500 font-normal">/ {questions.length}</span>
            </span>
          </div>

          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Question Time</span>
            <span className={`text-sm font-bold font-mono ${questionTimer > 150 ? 'text-amber-400' : 'text-slate-200'}`}>
              {formatTime(questionTimer)}
            </span>
          </div>

          <div className="text-center hidden sm:block">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Session</span>
            <span className="text-sm font-bold text-slate-300 font-mono">
              {formatTime(totalTimer)}
            </span>
          </div>

          {/* End Early CTA */}
          <button
            onClick={handleEndEarly}
            className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Finish & Score</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-4 border border-slate-800">
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Dual Stage: Interviewer Screen (Left) vs Candidate Booth (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
        {/* Left Column: Interviewer & Question Screen (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Interviewer Virtual Screen Tile */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
            {/* Visualizer backdrop ring */}
            <div className={`relative mb-4 transition-all duration-500 ${
              interviewerStatus === 'speaking' ? 'scale-105' : 'scale-100'
            }`}>
              {interviewerStatus === 'speaking' && (
                <div className="absolute -inset-2 rounded-full bg-blue-500/30 animate-ping opacity-75" />
              )}
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/50 shadow-lg shadow-blue-500/20">
                <img
                  src={interviewer.avatar}
                  alt={interviewer.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status pill badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-semibold text-blue-400 uppercase tracking-wider whitespace-nowrap shadow-md">
                {interviewerStatus === 'speaking' ? '🗣️ Speaking' : interviewerStatus === 'evaluating' ? '🤔 Analyzing' : '👂 Listening'}
              </div>
            </div>

            <h3 className="font-bold text-base text-white">{interviewer.name}</h3>
            <p className="text-xs text-slate-400">{interviewer.role} · {interviewer.companyStyle}</p>

            {/* Speaking audio wave */}
            <div className="mt-3">
              <AudioVisualizer
                stream={null}
                isActive={interviewerStatus === 'speaking'}
                simulated={true}
                color="#60a5fa"
                height={24}
              />
            </div>
          </div>

          {/* Question Display Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {currentQuestionObj.category}
                </span>

                <button
                  onClick={handleReplayQuestion}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
                  title="Replay Audio Question"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Audio</span>
                </button>
              </div>

              <h1 className="text-lg sm:text-xl font-semibold text-white leading-relaxed tracking-tight">
                "{currentQuestionObj.question}"
              </h1>
            </div>

            {/* Collapsible Key Points & Hints */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <button
                onClick={() => setShowHint(!showHint)}
                className="w-full text-left text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center justify-between py-1 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Interviewer Evaluation Target</span>
                </span>
                {showHint ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showHint && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-medium">Key indicators looked for:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {currentQuestionObj.keyPoints.map((pt, i) => (
                      <li key={i} className="leading-snug">{pt}</li>
                    ))}
                  </ul>
                  {currentQuestionObj.interviewerThought && (
                    <p className="text-[11px] text-blue-400 italic pt-1 border-t border-slate-800/60 mt-1.5">
                      💡 {currentQuestionObj.interviewerThought}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Video Booth & Answer Engine (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Candidate Webcam & Mic Strip */}
          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl aspect-[16/9] max-h-[300px] flex items-center justify-center">
            {videoEnabled && mediaStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="text-center p-6 text-slate-500">
                <CameraOff className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs">Camera is disabled · Audio mode active</p>
              </div>
            )}

            {/* Candidate stream bottom HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/75 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    videoEnabled
                      ? 'bg-slate-800 border-slate-700 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                  title={videoEnabled ? "Turn Off Video" : "Turn On Video"}
                >
                  {videoEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleMic}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    audioEnabled
                      ? 'bg-slate-800 border-slate-700 text-blue-400'
                      : 'bg-red-500/20 border-red-500/40 text-red-400'
                  }`}
                  title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                {isSpeechListening && (
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Transcribing
                  </span>
                )}
              </div>

              {/* Real-time mic wave */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono hidden sm:inline">Voice Level</span>
                <AudioVisualizer
                  stream={mediaStream}
                  isActive={audioEnabled && !!mediaStream}
                  color="#38bdf8"
                  height={22}
                />
              </div>
            </div>
          </div>

          {/* Live Transcript / Response Workspace */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex-1 flex flex-col justify-between backdrop-blur-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Your Response Transcript</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    (Speak into microphone or type freely)
                  </span>
                </div>

                {/* STAR Guide Helper CTA */}
                <button
                  onClick={() => setShowStarGuide(!showStarGuide)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>STAR Cheat Sheet</span>
                </button>
              </div>

              {/* Collapsible STAR reminder */}
              {showStarGuide && (
                <div className="p-3 mb-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 space-y-1">
                  <p className="font-semibold text-blue-300">STAR Quick Structure:</p>
                  <p><strong className="text-white">S</strong>ituation: Set the scene & problem (~20s)</p>
                  <p><strong className="text-white">T</strong>ask: What was YOUR specific responsibility? (~15s)</p>
                  <p><strong className="text-white">A</strong>ction: What concrete steps did you take? (~60s)</p>
                  <p><strong className="text-white">R</strong>esult: Quantified metric outcome (e.g. latency, $$, uptime) (~25s)</p>
                </div>
              )}

              {/* Text Area for Live Spoken Words or Typing */}
              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Start speaking into your microphone, or type your answer here... Aim for a clear Situation, Task, Action, and measurable Result."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Answer Metrics Bar & Submit CTA */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              {/* Real-time Metrics */}
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500 font-mono">Words: </span>
                  <span className="font-semibold text-slate-200">{currentAnswer.trim().split(/\s+/).filter(Boolean).length}</span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono">Pace: </span>
                  <span className={`font-semibold ${currentWPM > 165 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {currentWPM} WPM
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 font-mono">Filler Words: </span>
                  <span className={`font-semibold ${currentFillerStats.total > 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {currentFillerStats.total}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentAnswer('')}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !currentAnswer.trim()}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate Turn Feedback Modal Overlay */}
      {showTurnModal && currentTurnFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  {currentTurnFeedback.score}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Turn Evaluation</h3>
                  <span className="text-xs text-slate-400">
                    Question {currentIndex + 1} of {questions.length} Complete
                  </span>
                </div>
              </div>

              {currentTurnFeedback.starAdherence && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  STAR Adherence: {currentTurnFeedback.starAdherence}
                </span>
              )}
            </div>

            {/* Quick Feedback Quote */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed mb-4">
              "{currentTurnFeedback.quickFeedback}"
            </div>

            {/* Strengths & Missing Elements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <p className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths
                </p>
                <ul className="text-xs text-slate-300 space-y-1">
                  {currentTurnFeedback.strengths.slice(0, 2).map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  To Elevate in Next Answer
                </p>
                <ul className="text-xs text-slate-300 space-y-1">
                  {currentTurnFeedback.missingElements.slice(0, 2).map((m, idx) => (
                    <li key={idx}>• {m}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggested transition statement by interviewer */}
            {currentTurnFeedback.suggestedTransition && (
              <p className="text-xs text-slate-400 italic mb-5">
                "{currentTurnFeedback.suggestedTransition}"
              </p>
            )}

            {/* Next Action Button */}
            <button
              onClick={() => advanceToNextQuestion()}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <span>{currentIndex + 1 < questions.length ? 'Continue to Next Question' : 'View Full Scorecard & Report'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
