import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Play, 
  Layers, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Bot, 
  User, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  RotateCcw,
  Check,
  X,
  Radio,
  FileQuestion,
  ListFilter,
  Plus
} from 'lucide-react';
import { TrainingCourse, SlideData, QuizQuestion, FarmScenario, DocumentSource } from '../../types';
import { SlideVisualDiagram } from './SlideVisualDiagram';
import { SpeechService } from '../../utils/speech';
import { sendChatMessage, generateQuizFromAI, generateScenarioFromAI, generateSlidesFromAI, ChatMessage } from '../../services/api';

interface TrainingTabProps {
  courses: TrainingCourse[];
  setCourses: React.Dispatch<React.SetStateAction<TrainingCourse[]>>;
  documents: DocumentSource[];
  activeCourseToOpen?: TrainingCourse | null;
  onClearActiveCourse?: () => void;
  onRecordCourseCompletion?: (courseId: string) => void;
}

export const TrainingTab: React.FC<TrainingTabProps> = ({
  courses,
  setCourses,
  documents,
  activeCourseToOpen,
  onClearActiveCourse,
  onRecordCourseCompletion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCourse, setActiveCourse] = useState<TrainingCourse | null>(null);

  // Active Slide Player State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [slideQuizAnswer, setSlideQuizAnswer] = useState<number | null>(null);
  const [showSlideQuizFeedback, setShowSlideQuizFeedback] = useState(false);

  // Video Course Player State
  const [videoQuizAnswer, setVideoQuizAnswer] = useState<number | null>(null);
  const [showVideoQuizFeedback, setShowVideoQuizFeedback] = useState(false);

  // AI ATSH Assistant Chat State
  const [chatMode, setChatMode] = useState<'query' | 'quiz' | 'scenario'>('query');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: `Xin chào! Tôi là **ATSH Assistant** – Chuyên gia giảng dạy và kiểm tra quy trình An toàn Sinh học chăn nuôi heo.
Mọi thông tin tôi cung cấp đều được grounding chuẩn mực theo tài liệu SOP của trang trại.

Tôi có 3 chế độ hỗ trợ:
1. **Tra cứu & Giải đáp**: Hỏi bất kỳ quy trình nào (Cách ly 48h, tắm 3 bước, sát trùng xe cám...).
2. **Kiểm tra Trắc nghiệm**: Làm bài tập 1-1 với giải thích chi tiết.
3. **Tình huống Thực tế**: Phân tích vi phạm ATSH và biện pháp khắc phục.

*Bạn muốn bắt đầu với nội dung nào hôm nay?*`,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedDocContext, setSelectedDocContext] = useState<string>('');

  // Auto open course if triggered from external
  useEffect(() => {
    if (activeCourseToOpen) {
      setActiveCourse(activeCourseToOpen);
      setCurrentSlideIndex(0);
      setSlideQuizAnswer(null);
      setShowSlideQuizFeedback(false);
      if (onClearActiveCourse) onClearActiveCourse();
    }
  }, [activeCourseToOpen, onClearActiveCourse]);

  // Clean up speech on unmount or slide change
  useEffect(() => {
    return () => {
      SpeechService.stop();
    };
  }, []);

  const categories = [
    'all',
    'Sát trùng & Cách ly Cổng',
    'Kiểm soát Phương tiện & Vật tư',
    'Thú Y & Dịch Bệnh',
    'Kỹ thuật Chuồng nuôi',
  ];

  const filteredCourses = courses.filter((c) => {
    return selectedCategory === 'all' || c.category === selectedCategory;
  });

  const handleStartCourse = (course: TrainingCourse) => {
    setActiveCourse(course);
    setCurrentSlideIndex(0);
    setSlideQuizAnswer(null);
    setShowSlideQuizFeedback(false);
    SpeechService.stop();
    setIsSpeaking(false);
  };

  const handlePlayVoice = (text: string) => {
    if (isSpeaking) {
      SpeechService.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speak(
        text,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    }
  };

  const handleNextSlide = () => {
    SpeechService.stop();
    setIsSpeaking(false);
    setSlideQuizAnswer(null);
    setShowSlideQuizFeedback(false);
    if (activeCourse?.slides && currentSlideIndex < activeCourse.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Completed course!
      if (activeCourse && onRecordCourseCompletion) {
        onRecordCourseCompletion(activeCourse.id);
      }
      alert('Chúc mừng! Bạn đã hoàn thành toàn bộ bài giảng này.');
      setActiveCourse(null);
    }
  };

  const handlePrevSlide = () => {
    SpeechService.stop();
    setIsSpeaking(false);
    setSlideQuizAnswer(null);
    setShowSlideQuizFeedback(false);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // AI Chat submission
  const handleSendChat = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isChatLoading) return;

    const newHistory: ChatMessage[] = [...chatMessages, { role: 'user', text: textToSend }];
    setChatMessages(newHistory);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      // Find relevant document text if any selected
      const docContext = selectedDocContext || documents.map(d => `${d.title}:\n${d.contentText}`).join('\n\n');
      const reply = await sendChatMessage(textToSend, chatMessages, chatMode, docContext);
      setChatMessages([...newHistory, { role: 'model', text: reply }]);
    } catch (err: any) {
      setChatMessages([
        ...newHistory,
        {
          role: 'model',
          text: `⚠️ [Lỗi kết nối]: Không thể kết nối với máy chủ AI. Tuy nhiên, theo quy định SOP tiêu chuẩn: Thời gian cách ly bắt buộc là **48 giờ**, tắm sát trùng **10 phút** và dung dịch sát trùng nồng độ **1-2%**.`,
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = [
    { label: 'Quy trình cách ly 48h', prompt: 'Hãy nêu chi tiết các bước trong quy trình cách ly 48h trước khi vào trại heo.' },
    { label: 'Quy trình tắm 3 bước', prompt: 'Quy trình tắm sát trùng 3 bước qua nhà tắm ngăn cách gồm những bước nào?' },
    { label: 'Sát trùng xe cám', prompt: 'Xe chở cám và xe chở heo phải được sát trùng như thế nào trước khi vào cổng?' },
    { label: 'Dấu hiệu dịch ASF', prompt: 'Các triệu chứng nhận biết bệnh Dịch tả lợn Châu Phi (ASF) và cách xử lý khẩn cấp?' },
    { label: 'Tạo 1 câu trắc nghiệm', prompt: 'Hãy tạo cho tôi 1 câu hỏi trắc nghiệm kiểm tra về an toàn sinh học vùng đệm.' },
  ];

  return (
    <div className="space-y-6">
      {/* Bento Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              Đào tạo trực tuyến & Cố vấn AI
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Học tập Trực quan & Luyện tập Tình huống
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            Các bài đào tạo đa định dạng: Video Youtube, Slide tương tác kết hợp giọng đọc AI, câu hỏi kiểm tra nhanh trong bài giảng và Cố vấn ATSH thông minh.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
          <div className="text-center px-4 py-1 border-r border-slate-200">
            <div className="text-xl font-black text-blue-600">{courses.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Khóa học</div>
          </div>
          <div className="text-center px-4 py-1">
            <div className="text-xl font-black text-emerald-600">100%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">SOP Chuẩn</div>
          </div>
        </div>
      </div>

      {/* Main Bento Grid: 2 Columns (Course List & Interactive AI Assistant) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Danh mục Bài đào tạo</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'Tất cả' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl border border-slate-100 p-4.5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center group"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 relative border border-slate-200 shadow-2xs">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=150'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center text-white">
                      {course.format === 'video' ? (
                        <Play className="w-5 h-5 fill-white" />
                      ) : (
                        <Layers className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                        {course.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {course.durationMinutes} phút
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                        {course.level}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm mt-1.5 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 font-medium">
                      {course.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartCourse(course)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Vào học</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI ATSH Assistant & Practice Hub (5 Cols) in Bento Style */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden min-h-[580px]">
          {/* Header */}
          <div className="p-4.5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">Trợ lý ATSH Thông Minh</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Grounding 100% tài liệu SOP trang trại</p>
              </div>
            </div>

            <button
              onClick={() => {
                setChatMessages([
                  {
                    role: 'model',
                    text: 'Đã làm mới phiên học. Bạn muốn tra cứu quy trình, làm bài tập trắc nghiệm hay giải quyết tình huống thực tế?',
                  },
                ]);
              }}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              title="Làm mới trò chuyện"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 bg-slate-50 p-1 text-center border-b border-slate-100 text-xs font-bold">
            <button
              onClick={() => setChatMode('query')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                chatMode === 'query' ? 'bg-white text-blue-700 shadow-xs font-extrabold border border-slate-200/60' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              1. Tra cứu SOP
            </button>
            <button
              onClick={() => setChatMode('quiz')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                chatMode === 'quiz' ? 'bg-white text-blue-700 shadow-xs font-extrabold border border-slate-200/60' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              2. Trắc nghiệm
            </button>
            <button
              onClick={() => setChatMode('scenario')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                chatMode === 'scenario' ? 'bg-white text-blue-700 shadow-xs font-extrabold border border-slate-200/60' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              3. Tình huống
            </button>
          </div>

          {/* Preset Prompts Chips */}
          <div className="p-2.5 bg-slate-50/70 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(undefined, qp.prompt)}
                className="px-2.5 py-1 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[380px] bg-slate-50/30">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold shadow-xs">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-100 shadow-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {isChatLoading && (
              <div className="flex gap-2 items-center text-xs text-slate-500 italic p-2.5 bg-white rounded-2xl border border-slate-100 w-fit shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span>Trợ lý ATSH đang tra cứu tài liệu & phản hồi...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder={
                chatMode === 'quiz'
                  ? 'Nhập câu trả lời A/B/C/D hoặc yêu cầu câu hỏi mới...'
                  : chatMode === 'scenario'
                  ? 'Phân tích lỗi sai và đề xuất giải pháp xử lý...'
                  : 'Hỏi về quy trình cách ly, sát trùng, nhiệt độ sấy, ASF...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputMessage.trim()}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE COURSE PLAYER MODAL (Slide Deck or Video Lecture) */}
      {/* ========================================================================= */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 overflow-hidden animate-in zoom-in-95">
            {/* Player Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  {activeCourse.format === 'video' ? <Play className="w-5 h-5 fill-white" /> : <Layers className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded uppercase">
                      {activeCourse.format === 'video' ? 'Video Bài Giảng' : 'Slide Tương Tác'}
                    </span>
                    <span className="text-xs text-slate-400">{activeCourse.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {activeCourse.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => {
                  SpeechService.stop();
                  setIsSpeaking(false);
                  setActiveCourse(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Player Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* FORMAT 1: SLIDE DECK WITH DIAGRAM, VOICE & QUICK QUIZ */}
              {activeCourse.format === 'slides' && activeCourse.slides && (
                <div className="space-y-4">
                  {/* Slide Progress & Voice Narration Bar */}
                  <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">
                        Slide {currentSlideIndex + 1} / {activeCourse.slides.length}
                      </span>
                      <div className="flex gap-1">
                        {activeCourse.slides.map((_, idx) => (
                          <span
                            key={idx}
                            className={`w-5 h-1.5 rounded-full transition-all ${
                              idx === currentSlideIndex
                                ? 'bg-emerald-600 w-8'
                                : idx < currentSlideIndex
                                ? 'bg-emerald-300'
                                : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlayVoice(activeCourse.slides![currentSlideIndex].speakerNotes || activeCourse.slides![currentSlideIndex].title)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Dừng đọc' : 'Giọng đọc Giảng viên (AI)'}</span>
                    </button>
                  </div>

                  {/* Active Slide Card */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900">
                        {activeCourse.slides[currentSlideIndex].title}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        {activeCourse.slides[currentSlideIndex].subtitle}
                      </p>
                    </div>

                    {/* Visual Diagram */}
                    <SlideVisualDiagram type={activeCourse.slides[currentSlideIndex].diagramType || 'zones'} />

                    {/* Bullet points */}
                    <div className="space-y-2 mt-3">
                      {activeCourse.slides[currentSlideIndex].bulletPoints.map((bp, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>

                    {/* Speaker Notes Box */}
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 mt-3">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800 mb-1">
                        <Volume2 className="w-3.5 h-3.5" />
                        Lời giảng viên / Hướng dẫn thao tác chuẩn:
                      </div>
                      <p className="italic leading-relaxed">
                        "{activeCourse.slides[currentSlideIndex].speakerNotes}"
                      </p>
                    </div>

                    {/* IN-SLIDE QUICK QUIZ (FLASH KNOWLEDGE CHECK) */}
                    {activeCourse.slides[currentSlideIndex].quizQuickCheck && (
                      <div className="mt-4 bg-white rounded-xl p-4 border-2 border-emerald-200 shadow-xs space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase">
                          <FileQuestion className="w-4 h-4 text-emerald-600" />
                          <span>Kiểm tra nhanh kiến thức trước khi qua Slide tiếp theo</span>
                        </div>

                        <div className="text-xs sm:text-sm font-semibold text-slate-800">
                          {activeCourse.slides[currentSlideIndex].quizQuickCheck.question}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeCourse.slides[currentSlideIndex].quizQuickCheck.options.map((opt, optIdx) => {
                            const isSelected = slideQuizAnswer === optIdx;
                            const isCorrect = activeCourse.slides![currentSlideIndex].quizQuickCheck!.correctIndex === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => {
                                  setSlideQuizAnswer(optIdx);
                                  setShowSlideQuizFeedback(true);
                                }}
                                className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                                  showSlideQuizFeedback
                                    ? isCorrect
                                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                                      : isSelected
                                      ? 'bg-rose-100 border-rose-500 text-rose-900'
                                      : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                                    : isSelected
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {showSlideQuizFeedback && (
                          <div className={`p-3 rounded-lg text-xs ${
                            slideQuizAnswer === activeCourse.slides[currentSlideIndex].quizQuickCheck.correctIndex
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                              : 'bg-rose-50 text-rose-900 border border-rose-200'
                          }`}>
                            <div className="font-bold flex items-center gap-1.5">
                              {slideQuizAnswer === activeCourse.slides[currentSlideIndex].quizQuickCheck.correctIndex ? (
                                <>
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  <span>Chính xác!</span>
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 text-rose-600" />
                                  <span>Chưa chính xác!</span>
                                </>
                              )}
                            </div>
                            <p className="mt-1 text-[11px]">
                              {activeCourse.slides[currentSlideIndex].quizQuickCheck.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FORMAT 2: YOUTUBE VIDEO LECTURE WITH CHAPTERS */}
              {activeCourse.format === 'video' && (
                <div className="space-y-4">
                  {/* Responsive YouTube Player Simulation / Frame */}
                  <div className="aspect-video w-full rounded-2xl bg-slate-900 overflow-hidden shadow-lg border border-slate-800 relative">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0"
                      title={activeCourse.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>

                  {/* Chapters & Key Takeaways */}
                  {activeCourse.videoChapters && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Các mốc thời gian bài giảng (Chapters)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCourse.videoChapters.map((ch, chIdx) => (
                          <div key={chIdx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{ch.time}</span> - <span>{ch.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1">{ch.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Quick Quiz */}
                  {activeCourse.quickQuizzes && activeCourse.quickQuizzes.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                      <div className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1.5">
                        <FileQuestion className="w-4 h-4 text-emerald-600" />
                        <span>Trắc nghiệm kiểm tra sau khi xem video</span>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-800">
                        {activeCourse.quickQuizzes[0].question}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCourse.quickQuizzes[0].options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => {
                              setVideoQuizAnswer(oIdx);
                              setShowVideoQuizFeedback(true);
                            }}
                            className={`p-2.5 rounded-lg text-left text-xs font-medium border transition-all cursor-pointer ${
                              showVideoQuizFeedback
                                ? activeCourse.quickQuizzes![0].correctIndex === oIdx
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                                  : videoQuizAnswer === oIdx
                                  ? 'bg-rose-100 border-rose-500 text-rose-900'
                                  : 'bg-slate-50 text-slate-400 opacity-60'
                                : videoQuizAnswer === oIdx
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                          </button>
                        ))}
                      </div>
                      {showVideoQuizFeedback && (
                        <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-xs">
                          <strong>Giải thích:</strong> {activeCourse.quickQuizzes[0].explanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Player Footer Controls */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              {activeCourse.format === 'slides' && activeCourse.slides ? (
                <>
                  <button
                    onClick={handlePrevSlide}
                    disabled={currentSlideIndex === 0}
                    className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Slide trước</span>
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {currentSlideIndex === activeCourse.slides.length - 1 ? 'Hoàn thành bài học' : 'Slide tiếp theo'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-500">Đã xem hết video bài giảng</span>
                  <button
                    onClick={() => {
                      if (onRecordCourseCompletion) onRecordCourseCompletion(activeCourse.id);
                      alert('Đã ghi nhận hoàn thành khóa học video!');
                      setActiveCourse(null);
                    }}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm cursor-pointer"
                  >
                    Xác nhận Hoàn thành
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
