import React, { useState, useEffect, useRef } from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Sliders, 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Play, 
  Sparkles, 
  Info, 
  CheckCircle2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { PREDEFINED_ROLES, INTERVIEWER_PERSONAS } from '../../data/rolesData';
import { SeniorityLevel, InterviewType, InterviewerPersona } from '../../types/interview';
import { AudioVisualizer } from '../AudioVisualizer';

interface SetupViewProps {
  onStartSimulation: (config: {
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
  }) => void;
  isLoading: boolean;
}

export const SetupView: React.FC<SetupViewProps> = ({ onStartSimulation, isLoading }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('software-engineer');
  const [customRole, setCustomRole] = useState<string>('');
  const [seniority, setSeniority] = useState<SeniorityLevel>('Mid-Level');
  const [interviewType, setInterviewType] = useState<InterviewType>('Mixed (Behavioral & Technical)');
  const [interviewerId, setInterviewerId] = useState<string>('sarah-chen');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Device permissions & preview state
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const seniorityOptions: SeniorityLevel[] = [
    'Entry / Junior',
    'Mid-Level',
    'Senior',
    'Staff / Principal',
    'Executive / Director'
  ];

  const interviewTypeOptions: InterviewType[] = [
    'Mixed (Behavioral & Technical)',
    'Behavioral (STAR Method)',
    'System Design & Architecture',
    'Technical & Domain Knowledge',
    'Product Sense & Strategy',
    'Leadership & Culture Fit'
  ];

  // Request camera and microphone stream for setup testing
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        activeStream = stream;
        setMediaStream(stream);
        setCameraError(null);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.warn('Camera/mic access warning:', err);
        setCameraError('Microphone or Camera access optional. You can continue with typing.');
        // Try audio only
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true });
          activeStream = audioOnly;
          setMediaStream(audioOnly);
        } catch (e) {
          // both blocked
        }
      }
    }

    initMedia();

    return () => {
      // Don't stop tracks here if we want to pass them to room, or handle clean unmount
    };
  }, []);

  // Update video element when stream or videoEnabled changes
  useEffect(() => {
    if (videoPreviewRef.current && mediaStream) {
      videoPreviewRef.current.srcObject = mediaStream;
    }
    if (mediaStream) {
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = videoEnabled;
      });
      mediaStream.getAudioTracks().forEach(track => {
        track.enabled = audioEnabled;
      });
    }
  }, [mediaStream, videoEnabled, audioEnabled]);

  const handleStart = () => {
    const selectedPreset = PREDEFINED_ROLES.find(r => r.id === selectedRoleId);
    const finalRole = customRole.trim() || selectedPreset?.name || 'Software Engineer';
    const finalInterviewer = INTERVIEWER_PERSONAS.find(p => p.id === interviewerId) || INTERVIEWER_PERSONAS[0];

    onStartSimulation({
      role: finalRole,
      seniority,
      interviewType,
      interviewer: finalInterviewer,
      questionCount,
      stream: mediaStream,
      videoEnabled,
      audioEnabled
    });
  };

  const selectedInterviewer = INTERVIEWER_PERSONAS.find(p => p.id === interviewerId) || INTERVIEWER_PERSONAS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      {/* Hero Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive AI Simulation Booth
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          Configure Your Mock Interview
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Experience hyper-realistic interview conditions with dynamic questioning, voice synthesis, real-time speech analytics, and STAR scorecard evaluations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Role & Interviewer Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Target Role */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                1
              </span>
              <h2 className="text-lg font-semibold text-white">Select Your Target Role</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              {PREDEFINED_ROLES.slice(0, 8).map(role => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.id);
                    setCustomRole('');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRoleId === role.id && !customRole
                      ? 'bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <p className="font-semibold text-xs leading-snug line-clamp-2">{role.name}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{role.category}</span>
                </button>
              ))}
            </div>

            {/* Custom Role Input */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                Or type a specific role / title:
              </label>
              <input
                type="text"
                placeholder="e.g. Senior iOS Engineer, Cloud FinOps Specialist, Growth Product Lead..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Step 2: Seniority & Interview Track */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                2
              </span>
              <h2 className="text-lg font-semibold text-white">Experience Level & Interview Track</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Seniority Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {seniorityOptions.map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setSeniority(level)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        seniority === level
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-2 block">
                  Interview Focus Track
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {interviewTypeOptions.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInterviewType(type)}
                      className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                        interviewType === type
                          ? 'bg-blue-600/15 border-blue-500 text-white font-medium'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">
                  Session Length
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuestionCount(3)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      questionCount === 3
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ⚡ Quick Drill (3 Questions · ~10 mins)
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuestionCount(5)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      questionCount === 5
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    🎯 Full Simulation (5 Questions · ~18 mins)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Interviewer Persona */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center border border-blue-500/30">
                3
              </span>
              <h2 className="text-lg font-semibold text-white">Choose Your AI Interviewer</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTERVIEWER_PERSONAS.map(persona => (
                <div
                  key={persona.id}
                  onClick={() => setInterviewerId(persona.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    interviewerId === persona.id
                      ? 'bg-blue-600/15 border-blue-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
                  }`}
                >
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-white truncate">{persona.name}</p>
                      {interviewerId === persona.id && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-blue-400 font-medium truncate">{persona.role}</p>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {persona.tagline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Test & Launch Action */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-400" />
              Interview Booth Preview & Audio Check
            </h3>

            {/* Video Booth Test Viewport */}
            <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center mb-4">
              {videoEnabled && mediaStream ? (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <CameraOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Camera is off or audio-only mode</p>
                </div>
              )}

              {/* Overlay controls on camera */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`p-1.5 rounded-md transition-colors ${
                      videoEnabled ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
                    }`}
                    title={videoEnabled ? "Turn Off Camera" : "Turn On Camera"}
                  >
                    {videoEnabled ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                    className={`p-1.5 rounded-md transition-colors ${
                      audioEnabled ? 'text-blue-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
                    }`}
                    title={audioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* Audio visualizer bar */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Mic Test:</span>
                  <AudioVisualizer
                    stream={mediaStream}
                    isActive={audioEnabled && !!mediaStream}
                    color="#38bdf8"
                    height={20}
                  />
                </div>
              </div>
            </div>

            {cameraError && (
              <div className="p-3 mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Config Summary Card */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Interviewer:</span>
                <span className="font-semibold text-white">{selectedInterviewer.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Target Level:</span>
                <span className="font-semibold text-white">{seniority}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Focus Track:</span>
                <span className="font-semibold text-white">{interviewType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Speech Input:</span>
                <span className="font-semibold text-emerald-400">Live Speech-to-Text + Typing</span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing AI Interviewer & Questions...</span>
                </>
              ) : (
                <>
                  <span>Enter Simulation Room</span>
                  <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
