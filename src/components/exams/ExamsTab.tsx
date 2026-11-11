import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Plus, 
  Play, 
  ShieldCheck, 
  Printer, 
  Download, 
  Sparkles, 
  RotateCcw,
  Check,
  X,
  Building,
  User,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exam, ExamAttempt, StaffMember, UserRole, QuizQuestion } from '../../types';

interface ExamsTabProps {
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  examAttempts: ExamAttempt[];
  setExamAttempts: React.Dispatch<React.SetStateAction<ExamAttempt[]>>;
  currentUser: StaffMember;
  currentRole: UserRole;
  onCertificateIssued?: (staffId: string, score: number) => void;
}

export const ExamsTab: React.FC<ExamsTabProps> = ({
  exams,
  setExams,
  examAttempts,
  setExamAttempts,
  currentUser,
  currentRole,
  onCertificateIssued,
}) => {
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<ExamAttempt | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Exam Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sát trùng & Cách ly Cổng');
  const [isGoogleForm, setIsGoogleForm] = useState(false);
  const [googleFormUrl, setGoogleFormUrl] = useState('');
  const [duration, setDuration] = useState(15);
  const [passingScore, setPassingScore] = useState(80);

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager';

  // Timer countdown
  useEffect(() => {
    if (!activeExam || isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, isSubmitted, timeLeft]);

  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setIsSubmitted(false);
    setLastAttempt(null);
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    let correctCount = 0;
    const answersRecord = activeExam.questions.map((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedIndex: selected !== undefined ? selected : -1,
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / activeExam.questions.length) * 100);
    const passed = percentage >= activeExam.passingScore;
    const certId = passed ? `CERT-ATSH-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const attempt: ExamAttempt = {
      id: `att-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      staffId: currentUser.id,
      staffName: currentUser.name,
      staffCode: currentUser.code,
      departmentName: currentUser.departmentName,
      farmName: currentUser.farmName,
      score: correctCount,
      maxScore: activeExam.questions.length,
      percentage,
      passed,
      completedAt: new Date().toLocaleString('vi-VN'),
      answers: answersRecord,
      certificateId: certId,
    };

    setExamAttempts([attempt, ...examAttempts]);
    setLastAttempt(attempt);
    setIsSubmitted(true);

    if (passed) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onCertificateIssued) {
        onCertificateIssued(currentUser.id, percentage);
      }
    }
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEx: Exam = {
      id: `exam-${Date.now()}`,
      title: newTitle,
      description: isGoogleForm
        ? 'Bài kiểm tra khảo sát tích hợp Google Form trực tiếp.'
        : 'Bài thi đánh giá năng lực an toàn sinh học trang trại.',
      category: newCategory,
      isGoogleForm,
      googleFormUrl: isGoogleForm ? googleFormUrl : undefined,
      durationMinutes: duration,
      passingScore,
      targetFarms: ['farm-1', 'farm-2', 'farm-3'],
      targetDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'],
      questions: isGoogleForm
        ? []
        : [
            {
              id: `q-${Date.now()}-1`,
              question: 'Thời gian cách ly bắt buộc tối thiểu đối với người trước khi vào vùng sản xuất là bao lâu?',
              options: ['12 giờ', '24 giờ', '48 giờ', '8 giờ'],
              correctIndex: 2,
              explanation: 'Quy chuẩn ATSH yêu cầu cách ly tối thiểu 48h.',
            },
            {
              id: `q-${Date.now()}-2`,
              question: 'Dung dịch sát trùng khử khuẩn xe vận chuyển thường dùng ở nồng độ bao nhiêu?',
              options: ['0.1%', '1 - 2%', '15%', '50%'],
              correctIndex: 1,
              explanation: 'Nồng độ 1-2% Cloramin B hoặc Virkon S là tiêu chuẩn.',
            },
          ],
    };

    setExams([newEx, ...exams]);
    setShowCreateModal(false);
    setNewTitle('');
    setGoogleFormUrl('');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Bento Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              Khảo thí & Đánh giá năng lực
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Kỳ thi Chứng chỉ & Biểu mẫu Kiểm tra Online
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            Tổ chức thi trắc nghiệm chứng chỉ An toàn Sinh học bắt buộc trước ca làm việc và tích hợp Google Form khảo sát định kỳ theo từng trang trại.
          </p>
        </div>

        {isManagerOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Tạo đề thi / Nhúng Google Form</span>
          </button>
        )}
      </div>

      {/* Exam List Grid in Bento Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-3xl border border-slate-100 p-5.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                  {exam.category}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {exam.durationMinutes} phút
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-base leading-snug mt-1.5">
                {exam.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                {exam.description}
              </p>

              <div className="flex items-center gap-4 mt-3.5 text-xs text-slate-500 font-medium">
                <div>
                  Chuẩn đạt: <strong className="text-emerald-600 font-bold">{exam.passingScore}%</strong>
                </div>
                <div>
                  Số câu: <strong className="text-slate-800 font-bold">{exam.isGoogleForm ? 'Google Form' : `${exam.questions.length} câu`}</strong>
                </div>
                {exam.totalAttempts !== undefined && (
                  <div>
                    Lượt thi: <strong className="text-slate-800 font-bold">{exam.totalAttempts}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {exam.isGoogleForm ? 'Biểu mẫu trực tuyến' : 'Bài thi có cấp chứng chỉ'}
              </span>

              {exam.isGoogleForm ? (
                <a
                  href={exam.googleFormUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Google Form</span>
                </a>
              ) : (
                <button
                  onClick={() => handleStartExam(exam)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Bắt đầu Làm bài thi</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE EXAM TAKING MODAL */}
      {/* ========================================================================= */}
      {activeExam && !activeExam.isGoogleForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
            {/* Header with Timer */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold bg-blue-800 text-blue-200 px-2 py-0.5 rounded uppercase">
                  Bài thi Đánh giá Năng lực
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {activeExam.title}
                </h3>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {formatTimer(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            {/* Exam Content Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {!isSubmitted ? (
                <>
                  {/* Question Navigator */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {activeExam.questions.map((q, qIdx) => (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(qIdx)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                          currentQuestionIdx === qIdx
                            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : userAnswers[q.id] !== undefined
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {qIdx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Active Question Box */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                      <span>Câu hỏi {currentQuestionIdx + 1} / {activeExam.questions.length}</span>
                      <span>Điểm chuẩn đạt: {activeExam.passingScore}%</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      {activeExam.questions[currentQuestionIdx].question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2.5 mt-4">
                      {activeExam.questions[currentQuestionIdx].options.map((opt, oIdx) => {
                        const isSelected = userAnswers[activeExam.questions[currentQuestionIdx].id] === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(activeExam.questions[currentQuestionIdx].id, oIdx)}
                            className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium border transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                /* EXAM RESULT & OFFICIAL CERTIFICATE */
                <div className="space-y-6">
                  {lastAttempt && (
                    <>
                      {/* Result Banner */}
                      <div className={`rounded-2xl p-6 text-center border ${
                        lastAttempt.passed
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                          : 'bg-rose-50 border-rose-300 text-rose-900'
                      }`}>
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 shadow-md">
                          {lastAttempt.passed ? (
                            <div className="bg-emerald-600 text-white w-full h-full rounded-full flex items-center justify-center">
                              <Award className="w-9 h-9" />
                            </div>
                          ) : (
                            <div className="bg-rose-600 text-white w-full h-full rounded-full flex items-center justify-center">
                              <XCircle className="w-9 h-9" />
                            </div>
                          )}
                        </div>

                        <h3 className="text-2xl font-black">
                          {lastAttempt.passed ? 'CHÚC MỪNG BẠN ĐÃ ĐẠT CHUẨN ATSH!' : 'CHƯA ĐẠT ĐIỂM CHUẨN!'}
                        </h3>
                        <p className="text-sm mt-1">
                          Bạn đạt được <strong>{lastAttempt.score}/{lastAttempt.maxScore}</strong> câu đúng ({lastAttempt.percentage}%) - Chuẩn đạt tối thiểu: {activeExam.passingScore}%.
                        </p>
                      </div>

                      {/* OFFICIAL ATSH CERTIFICATE CARD (If Passed) */}
                      {lastAttempt.passed && (
                        <div className="border-4 border-amber-400/80 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/40 rounded-2xl p-6 text-slate-900 shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl"></div>

                          <div className="flex items-center justify-between border-b border-amber-200 pb-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-md">
                                <ShieldCheck className="w-7 h-7" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                                  CHỨNG NHẬN HOÀN THÀNH ĐÀO TẠO ATSH
                                </div>
                                <div className="text-xs text-slate-500">Mã số chứng chỉ: {lastAttempt.certificateId}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full">
                                XÁC THỰC HỢP LỆ
                              </span>
                            </div>
                          </div>

                          <div className="text-center my-4 space-y-2">
                            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                              Chứng nhận học viên
                            </div>
                            <div className="text-2xl font-black text-slate-900 tracking-tight">
                              {lastAttempt.staffName}
                            </div>
                            <div className="text-xs text-slate-600 font-medium">
                              Mã NV: <strong>{lastAttempt.staffCode}</strong> • Bộ phận: <strong>{lastAttempt.departmentName}</strong>
                            </div>
                            <div className="text-xs text-emerald-800 font-semibold bg-emerald-100/80 inline-block px-3 py-1 rounded-full">
                              Đơn vị: {lastAttempt.farmName}
                            </div>
                          </div>

                          <div className="border-t border-amber-200 pt-3 flex items-center justify-between text-xs text-slate-500">
                            <div>Ngày cấp: {lastAttempt.completedAt}</div>
                            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                              <QrCode className="w-4 h-4 text-slate-600" />
                              <span>QR-VERIFIED</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detailed Question Review */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 text-sm">Chi tiết đáp án & Giải thích SOP:</h4>
                        {activeExam.questions.map((q, idx) => {
                          const ans = lastAttempt.answers.find((a) => a.questionId === q.id);
                          const isCorrect = ans?.isCorrect;
                          return (
                            <div
                              key={q.id}
                              className={`p-4 rounded-xl border text-xs ${
                                isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/60 border-rose-200'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="font-bold text-slate-900">
                                  Câu {idx + 1}: {q.question}
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                                }`}>
                                  {isCorrect ? 'ĐÚNG' : 'SAI'}
                                </span>
                              </div>

                              <div className="mt-2 space-y-1 text-slate-700">
                                <div>
                                  Lựa chọn của bạn: <strong>{ans && ans.selectedIndex >= 0 ? q.options[ans.selectedIndex] : 'Chưa chọn'}</strong>
                                </div>
                                {!isCorrect && (
                                  <div className="text-emerald-700 font-semibold">
                                    Đáp án chính xác: <strong>{q.options[q.correctIndex]}</strong>
                                  </div>
                                )}
                                <p className="text-slate-500 italic mt-1 bg-white p-2 rounded border border-slate-200">
                                  <strong>Căn cứ SOP:</strong> {q.explanation}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Exam Footer Controls */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              {!isSubmitted ? (
                <>
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                    disabled={currentQuestionIdx === 0}
                    className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                  >
                    Câu trước
                  </button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIdx < activeExam.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIdx((p) => Math.min(activeExam.questions.length - 1, p + 1))}
                        className="px-5 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                      >
                        Câu tiếp theo
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitExam}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md cursor-pointer"
                      >
                        Nộp bài thi ngay
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <button
                    onClick={() => {
                      if (lastAttempt?.passed) {
                        alert(`Đã chuẩn bị chứng chỉ ${lastAttempt.certificateId} để in ấn.`);
                      }
                    }}
                    className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>In chứng chỉ</span>
                  </button>
                  <button
                    onClick={() => setActiveExam(null)}
                    className="px-6 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700"
                  >
                    Đóng & Hoàn tất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Exam / Google Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tạo Kỳ thi / Khảo sát Mới</h3>
                  <p className="text-xs text-slate-500">Đánh giá nhân sự theo từng trang trại</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên bài thi / khảo sát</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kiểm tra Định kỳ An toàn Sinh học Tháng 8/2026..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chủ đề đánh giá</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Sát trùng & Cách ly Cổng">Sát trùng & Cách ly Cổng</option>
                    <option value="Kiểm soát Phương tiện & Vật tư">Kiểm soát Phương tiện & Vật tư</option>
                    <option value="Kỹ thuật Chuồng nuôi">Kỹ thuật Chuồng nuôi</option>
                    <option value="Thú Y & Dịch Bệnh">Thú Y & Dịch Bệnh</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thời gian làm bài (Phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isGoogleForm}
                    onChange={(e) => setIsGoogleForm(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>Tích hợp biểu mẫu Google Form bên ngoài</span>
                </label>

                {isGoogleForm && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Đường dẫn Google Form (URL)</label>
                    <input
                      type="url"
                      placeholder="https://docs.google.com/forms/d/e/.../viewform"
                      value={googleFormUrl}
                      onChange={(e) => setGoogleFormUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md"
                >
                  Tạo Đề Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
