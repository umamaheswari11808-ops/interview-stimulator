import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Layers, 
  Target, 
  FileText, 
  BarChart3, 
  BookOpen, 
  Play,
  Video
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'simulator' | 'drills' | 'tailor' | 'analytics' | 'guide';
  setCurrentTab: (tab: 'simulator' | 'drills' | 'tailor' | 'analytics' | 'guide') => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  onStartNewMock: () => void;
  isSimulating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  ttsEnabled,
  setTtsEnabled,
  onStartNewMock,
  isSimulating
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setCurrentTab('simulator')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                InterviewPulse
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Interactive Mock Simulator & STAR Evaluation
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 text-sm">
          <button
            onClick={() => setCurrentTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentTab === 'simulator'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Simulator</span>
            {isSimulating && (
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('drills')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentTab === 'drills'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Question Drills</span>
          </button>

          <button
            onClick={() => setCurrentTab('tailor')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentTab === 'tailor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>JD & Resume Tailor</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setCurrentTab('guide')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentTab === 'guide'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>STAR Guide</span>
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* TTS Audio Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            title={ttsEnabled ? "Interviewer Voice Enabled (Click to Mute)" : "Interviewer Voice Muted (Click to Enable)"}
            className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
              ttsEnabled
                ? 'bg-slate-800 text-blue-400 border-blue-500/30 hover:bg-slate-700'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden xl:inline text-xs font-medium">
              {ttsEnabled ? 'Voice On' : 'Voice Off'}
            </span>
          </button>

          {/* New Simulation CTA */}
          <button
            onClick={onStartNewMock}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">New Interview</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 bg-slate-950 px-2 text-xs">
        <button
          onClick={() => setCurrentTab('simulator')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            currentTab === 'simulator' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Sim</span>
        </button>
        <button
          onClick={() => setCurrentTab('drills')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            currentTab === 'drills' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Drills</span>
        </button>
        <button
          onClick={() => setCurrentTab('tailor')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            currentTab === 'tailor' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tailor</span>
        </button>
        <button
          onClick={() => setCurrentTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            currentTab === 'analytics' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Stats</span>
        </button>
        <button
          onClick={() => setCurrentTab('guide')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
            currentTab === 'guide' ? 'text-blue-400 font-semibold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Guide</span>
        </button>
      </div>
    </header>
  );
};
