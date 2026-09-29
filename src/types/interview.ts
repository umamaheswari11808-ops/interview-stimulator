export type SeniorityLevel = 'Entry / Junior' | 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Executive / Director';

export type InterviewType = 
  | 'Mixed (Behavioral & Technical)'
  | 'Behavioral (STAR Method)'
  | 'System Design & Architecture'
  | 'Technical & Domain Knowledge'
  | 'Product Sense & Strategy'
  | 'Leadership & Culture Fit';

export interface InterviewerPersona {
  id: string;
  name: string;
  role: string;
  companyStyle: string;
  avatar: string;
  tone: string;
  voiceGender: 'female' | 'male';
  tagline: string;
}

export interface QuestionItem {
  question: string;
  category: string;
  keyPoints: string[];
  interviewerThought?: string;
}

export interface QuestionBreakdown {
  question: string;
  score: number;
  candidateAnswerSummary: string;
  strengths: string[];
  missedOpportunities: string[];
  modelIdealAnswer: string;
}

export interface FinalEvaluation {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Leaning Hire' | 'Needs Practice';
  starMethodScore: number;
  technicalDepthScore: number;
  communicationScore: number;
  confidencePacingScore: number;
  executiveSummary: string;
  topStrengths: string[];
  criticalImprovementAreas: string[];
  questionBreakdowns: QuestionBreakdown[];
  pacingFeedback: string;
  actionPlan: string[];
}

export interface TurnFeedback {
  score: number;
  quickFeedback: string;
  strengths: string[];
  missingElements: string[];
  starAdherence?: string;
  suggestedTransition?: string;
}

export interface SessionHistoryItem {
  id: string;
  timestamp: string;
  role: string;
  seniority: string;
  overallScore: number;
  verdict: string;
  totalDurationSeconds: number;
  questionsCount: number;
  fillerWordsTotal: number;
  evaluation: FinalEvaluation;
}

export interface DrillItem {
  id: string;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  roleTag: string;
  keyPointsToCover: string[];
  sampleModelAnswer: string;
}
