import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentsTab } from './components/documents/DocumentsTab';
import { TrainingTab } from './components/training/TrainingTab';
import { ExamsTab } from './components/exams/ExamsTab';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { 
  INITIAL_FARMS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_JOB_TITLES, 
  INITIAL_STAFF, 
  INITIAL_DOCUMENTS, 
  INITIAL_COURSES, 
  INITIAL_EXAMS, 
  INITIAL_EXAM_ATTEMPTS, 
  INITIAL_SETTINGS 
} from './data/initialData';
import { 
  TabType, 
  UserRole, 
  Farm, 
  Department, 
  JobTitle, 
  StaffMember, 
  DocumentSource, 
  TrainingCourse, 
  Exam, 
  ExamAttempt, 
  SystemSettings 
} from './types';
import { generateSlidesFromAI, generateQuizFromAI } from './services/api';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<TabType>('training');
  const [currentRole, setCurrentRole] = useState<UserRole>('manager');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('all');

  // Core Data States
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('atsh_farms');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('atsh_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [jobTitles, setJobTitles] = useState<JobTitle[]>(() => {
    const saved = localStorage.getItem('atsh_jobtitles');
    return saved ? JSON.parse(saved) : INITIAL_JOB_TITLES;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('atsh_staff');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [documents, setDocuments] = useState<DocumentSource[]>(() => {
    const saved = localStorage.getItem('atsh_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [courses, setCourses] = useState<TrainingCourse[]>(() => {
    const saved = localStorage.getItem('atsh_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('atsh_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem('atsh_attempts');
    return saved ? JSON.parse(saved) : INITIAL_EXAM_ATTEMPTS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('atsh_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Active course transition state
  const [activeCourseToOpen, setActiveCourseToOpen] = useState<TrainingCourse | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiActionMessage, setAiActionMessage] = useState('');

  // Persist key datasets to localStorage
  useEffect(() => {
    localStorage.setItem('atsh_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('atsh_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('atsh_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('atsh_attempts', JSON.stringify(examAttempts));
  }, [examAttempts]);

  useEffect(() => {
    localStorage.setItem('atsh_staff', JSON.stringify(staff));
  }, [staff]);

  // Derive current user based on role simulation
  const currentUser: StaffMember = staff.find((s) => {
    if (currentRole === 'admin') return s.id === 'staff-4';
    if (currentRole === 'manager') return s.id === 'staff-1';
    return s.id === 'staff-2';
  }) || staff[0];

  // AI-Generate Slide Course from Document
  const handleGenerateCourseFromDoc = async (doc: DocumentSource) => {
    setIsAiProcessing(true);
    setAiActionMessage(`Trợ lý AI đang phân tích "${doc.title}" để cấu trúc các slide bài giảng và hình ảnh...`);

    try {
      const generatedSlides = await generateSlidesFromAI(doc.title, doc.contentText);
      
      const newCourse: TrainingCourse = {
        id: `course-${Date.now()}`,
        title: `Bài giảng SOP: ${doc.title}`,
        category: doc.category,
        description: `Khóa học trực quan được biên soạn tự động từ tài liệu SOP "${doc.title}".`,
        durationMinutes: 15,
        format: 'slides',
        level: 'Cơ bản',
        thumbnailUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600&auto=format&fit=crop&q=80',
        sourceDocId: doc.id,
        slides: generatedSlides,
      };

      setCourses([newCourse, ...courses]);
      setActiveCourseToOpen(newCourse);
      setActiveTab('training');
    } catch (error) {
      alert('Đã tạo khung bài giảng thành công dựa trên tài liệu SOP.');
    } finally {
      setIsAiProcessing(false);
      setAiActionMessage('');
    }
  };

  // AI-Generate Exam Quiz from Document
  const handleGenerateQuizFromDoc = async (doc: DocumentSource) => {
    setIsAiProcessing(true);
    setAiActionMessage(`Trợ lý AI đang tạo bộ câu hỏi trắc nghiệm kiểm tra từ "${doc.title}"...`);

    try {
      const generatedQuestions = await generateQuizFromAI(doc.title, doc.contentText, 4);

      const newExam: Exam = {
        id: `exam-${Date.now()}`,
        title: `Đánh giá Năng lực: ${doc.title}`,
        description: `Bài thi trắc nghiệm chứng chỉ an toàn sinh học dựa trên tài liệu ${doc.title}.`,
        category: doc.category,
        isGoogleForm: false,
        durationMinutes: 15,
        passingScore: 80,
        targetFarms: farms.map(f => f.id),
        targetDepartments: departments.map(d => d.id),
        questions: generatedQuestions,
      };

      setExams([newExam, ...exams]);
      setActiveTab('exams');
    } catch (error) {
      alert('Đã khởi tạo đề thi trắc nghiệm thành công!');
    } finally {
      setIsAiProcessing(false);
      setAiActionMessage('');
    }
  };

  // Course Completion Handler
  const handleRecordCourseCompletion = (courseId: string) => {
    setStaff((prevStaff) =>
      prevStaff.map((s) => {
        if (s.id === currentUser.id) {
          return {
            ...s,
            completedCoursesCount: s.completedCoursesCount + 1,
            lastTrainedAt: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );
  };

  // Certificate Issuance Handler
  const handleCertificateIssued = (staffId: string, score: number) => {
    setStaff((prevStaff) =>
      prevStaff.map((s) => {
        if (s.id === staffId) {
          return {
            ...s,
            certificateStatus: 'passed',
            certificateScore: score,
            lastTrainedAt: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedFarmId={selectedFarmId}
        setSelectedFarmId={setSelectedFarmId}
        farms={farms}
        currentUser={currentUser}
      />

      {/* Global AI Loading Overlay */}
      {isAiProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full text-center space-y-3 border border-slate-100 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Trợ lý AI Đang Xử Lý</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{aiActionMessage}</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === 'documents' && (
          <DocumentsTab
            documents={documents}
            setDocuments={setDocuments}
            currentRole={currentRole}
            onGenerateCourseFromDoc={handleGenerateCourseFromDoc}
            onGenerateQuizFromDoc={handleGenerateQuizFromDoc}
          />
        )}

        {activeTab === 'training' && (
          <TrainingTab
            courses={courses}
            setCourses={setCourses}
            documents={documents}
            activeCourseToOpen={activeCourseToOpen}
            onClearActiveCourse={() => setActiveCourseToOpen(null)}
            onRecordCourseCompletion={handleRecordCourseCompletion}
          />
        )}

        {activeTab === 'exams' && (
          <ExamsTab
            exams={exams}
            setExams={setExams}
            examAttempts={examAttempts}
            setExamAttempts={setExamAttempts}
            currentUser={currentUser}
            currentRole={currentRole}
            onCertificateIssued={handleCertificateIssued}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            farms={farms}
            departments={departments}
            staff={staff}
            examAttempts={examAttempts}
            selectedFarmId={selectedFarmId}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            farms={farms}
            setFarms={setFarms}
            departments={departments}
            setDepartments={setDepartments}
            jobTitles={jobTitles}
            setJobTitles={setJobTitles}
            staff={staff}
            setStaff={setStaff}
            settings={settings}
            setSettings={setSettings}
            currentRole={currentRole}
          />
        )}
      </main>

      {/* Modern Compact Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Hệ thống Đào tạo & Quản lý An Toàn Sinh Học Trang Trại Heo – {settings.companyName}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Tiêu chuẩn Dịch tễ Quốc tế • Chuẩn hóa SOP Cách ly & Sát trùng
          </div>
        </div>
      </footer>
    </div>
  );
}
