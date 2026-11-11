export type UserRole = 'admin' | 'manager' | 'staff';
export type TabType = 'documents' | 'training' | 'exams' | 'dashboard' | 'settings';

export interface Farm {
  id: string;
  name: string;
  code: string;
  location: string;
  pigCount: number;
  managerName: string;
  contactPhone: string;
  status: 'active' | 'quarantine' | 'maintenance';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  farmId?: string; // Optional if company-wide
  memberCount: number;
  managerTitle: string;
}

export interface JobTitle {
  id: string;
  title: string;
  code: string;
  departmentId: string;
  level: string;
  description: string;
}

export interface StaffMember {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  farmId: string;
  farmName: string;
  departmentId: string;
  departmentName: string;
  jobTitle: string;
  avatar: string;
  role: UserRole;
  certificateStatus: 'passed' | 'pending' | 'failed' | 'expired';
  certificateScore?: number;
  completedCoursesCount: number;
  lastTrainedAt?: string;
}

export interface DocumentSource {
  id: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'doc';
  category: string;
  uploadDate: string;
  fileSize: string;
  uploaderName: string;
  description: string;
  contentText: string;
  tags: string[];
  isOfficial?: boolean;
  version?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic?: string;
}

export interface SlideData {
  id: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  speakerNotes: string;
  imageUrl?: string;
  diagramType?: 'barrier' | 'disinfection' | 'zones' | 'flowchart' | 'pigs';
  quizQuickCheck?: QuizQuestion;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  durationMinutes: number;
  level: 'Cơ bản' | 'Nâng cao' | 'Chuyên sâu';
  sourceDocId?: string;
  format: 'video' | 'slides' | 'interactive_scenario';
  youtubeUrl?: string;
  videoChapters?: { time: string; title: string; note: string }[];
  slides?: SlideData[];
  quickQuizzes?: QuizQuestion[];
  requiredForDepartments?: string[];
  thumbnailUrl?: string;
  completedCount?: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: string;
  isGoogleForm?: boolean;
  googleFormUrl?: string;
  durationMinutes: number;
  passingScore: number;
  questions: QuizQuestion[];
  targetFarms: string[];
  targetDepartments: string[];
  totalAttempts?: number;
  averageScore?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  staffId: string;
  staffName: string;
  staffCode: string;
  departmentName: string;
  farmName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  completedAt: string;
  answers: {
    questionId: string;
    selectedIndex: number;
    isCorrect: boolean;
  }[];
  certificateId?: string;
}

export interface FarmScenario {
  id: string;
  title: string;
  description: string;
  department: string;
  riskLevel: 'Cực kỳ nghiêm trọng' | 'Rất cao' | 'Cao' | 'Trung bình';
  violations: string[];
  correctSteps: string[];
  question: string;
  userAnalysis?: string;
  aiFeedback?: string;
}

export interface SystemSettings {
  companyName: string;
  appTitle: string;
  passScoreThreshold: number;
  quarantineHoursStandard: number;
  enableVoiceNarration: boolean;
  allowSelfTest: boolean;
  notificationEmail: string;
}
