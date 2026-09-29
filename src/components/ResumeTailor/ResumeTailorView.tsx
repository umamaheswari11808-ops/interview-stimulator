import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Building2, 
  Send, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Play,
  RotateCcw
} from 'lucide-react';
import { SeniorityLevel, InterviewType, InterviewerPersona } from '../../types/interview';
import { INTERVIEWER_PERSONAS } from '../../data/rolesData';

interface ResumeTailorViewProps {
  onLaunchTailoredSimulation: (config: {
    role: string;
    seniority: SeniorityLevel;
    interviewType: InterviewType;
    interviewer: InterviewerPersona;
    questionCount: number;
    jobDescription: string;
    resumeText: string;
    stream: MediaStream | null;
    videoEnabled: boolean;
    audioEnabled: boolean;
  }) => void;
}

export const ResumeTailorView: React.FC<ResumeTailorViewProps> = ({ onLaunchTailoredSimulation }) => {
  const [companyName, setCompanyName] = useState<string>('Google');
  const [targetRole, setTargetRole] = useState<string>('Senior Full Stack Engineer');
  const [jobDescription, setJobDescription] = useState<string>(
    `We are looking for a Senior Full Stack Engineer to lead our core enterprise cloud platform.
Responsibilities:
- Architect high-throughput distributed microservices in TypeScript, Go, and React.
- Lead system migration from monolithic architecture to event-driven Kafka pipelines.
- Mentor junior engineers and collaborate with Product Managers on quarterly roadmaps.
- Maintain 99.99% uptime SLAs under peak load.`
  );
  const [resumeText, setResumeText] = useState<string>(
    `Experience:
- Staff Engineer at TechCorp (3 years): Led migration of payments service to Go microservices, reducing latency by 45%. Managed a team of 4 engineers.
- Software Engineer at DataStartup (2 years): Built real-time analytics dashboard in React & Node.js handling 10k concurrent users.
Skills: TypeScript, React, Go, Docker, Kubernetes, Kafka, System Design, CI/CD pipelines.`
  );

  const [seniority, setSeniority] = useState<SeniorityLevel>('Senior');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedAnalysis, setGeneratedAnalysis] = useState<{
    keyFocusAreas: string[];
    potentialBlindspots: string[];
    sampleQuestions: string[];
  } | null>(null);

  const handleAnalyzeAndPreview = async () => {
    setIsGenerating(true);

    // Provide intelligent tailoring analysis
    setTimeout(() => {
      setGeneratedAnalysis({
        keyFocusAreas: [
          `Distributed microservices and event-driven Kafka architecture (matching ${companyName}'s scale)`,
          "Leadership and mentoring junior engineers during architectural shifts",
          "High availability uptime SLAs and incident triage methodology"
        ],
        potentialBlindspots: [
          "Be prepared for deep system design questions on data consistency with eventual consistency pipelines",
          "Ensure STAR stories emphasize cross-functional alignment with Product Management"
        ],
        sampleQuestions: [
          `At ${companyName}, we operate at massive scale. Walk me through how you designed your payment microservices migration, specifically how you guaranteed zero data loss during zero-downtime cutover.`,
          "Tell me about a time you mentored an engineer who was struggling with architectural quality. How did you diagnose the issue and measure improvement?",
          "How do you design an event-driven system with Kafka where consumers fail intermittently without blocking partition lag?"
        ]
      });
      setIsGenerating(false);
    }, 1000);
  };

  const handleStartSim = () => {
    const persona = INTERVIEWER_PERSONAS[0]; // Sarah Chen
    onLaunchTailoredSimulation({
      role: targetRole || 'Senior Engineer',
      seniority,
      interviewType: 'Mixed (Behavioral & Technical)',
      interviewer: persona,
      questionCount: 5,
      jobDescription,
      resumeText,
      stream: null,
      videoEnabled: true,
      audioEnabled: true
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <FileText className="w-3.5 h-3.5" />
          Job Description & Resume Customizer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Tailor-Made Interview Simulation
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Paste the actual job description and your resume bullets. The AI interviewer will analyze both to probe your exact experience and specific company requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              Target Company & Role Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Stripe, Google, Meta"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Target Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Staff Backend Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Paste Job Description (JD)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job requirements, responsibilities, or tech stack..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Paste Your Resume / Experience Summary
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste key resume bullet points, projects, and tech competencies..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleAnalyzeAndPreview}
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing Match...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Analyze Alignment & Preview Tailored Questions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Analysis & Launch */}
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-5">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Tailored Interview Strategy Preview
            </h2>

            {generatedAnalysis ? (
              <div className="space-y-5 text-xs text-slate-300">
                {/* Focus areas */}
                <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                  <p className="font-bold text-blue-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    High-Priority Interviewer Probing Angles:
                  </p>
                  <ul className="space-y-1.5 text-slate-300">
                    {generatedAnalysis.keyFocusAreas.map((f, i) => (
                      <li key={i}>• {f}</li>
                    ))}
                  </ul>
                </div>

                {/* Blindspots */}
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <p className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Strategic Blindspots to Address:
                  </p>
                  <ul className="space-y-1.5 text-slate-300">
                    {generatedAnalysis.potentialBlindspots.map((b, i) => (
                      <li key={i}>• {b}</li>
                    ))}
                  </ul>
                </div>

                {/* Sample custom questions */}
                <div>
                  <p className="font-bold text-slate-200 mb-2">Sample Generated Questions for this JD:</p>
                  <div className="space-y-2">
                    {generatedAnalysis.sampleQuestions.map((q, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 italic leading-snug">
                        "{q}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Launch CTA */}
                <button
                  onClick={handleStartSim}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Launch Tailored {companyName} Simulation</span>
                </button>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <FileText className="w-12 h-12 mx-auto opacity-30" />
                <p className="text-xs">
                  Click "Analyze Alignment" to generate targeted questions for your target company and job description.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
