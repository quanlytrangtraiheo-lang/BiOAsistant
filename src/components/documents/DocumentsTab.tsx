import React, { useState } from 'react';
import { 
  FolderOpen, 
  UploadCloud, 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Lock, 
  Sparkles, 
  Eye, 
  Trash2, 
  Download, 
  BookOpen, 
  AlertCircle,
  Tag,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { DocumentSource, UserRole } from '../../types';

interface DocumentsTabProps {
  documents: DocumentSource[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentSource[]>>;
  currentRole: UserRole;
  onGenerateCourseFromDoc?: (doc: DocumentSource) => void;
  onGenerateQuizFromDoc?: (doc: DocumentSource) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  setDocuments,
  currentRole,
  onGenerateCourseFromDoc,
  onGenerateQuizFromDoc,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDoc, setActiveDoc] = useState<DocumentSource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New doc form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sát trùng & Cách ly Cổng');
  const [newDesc, setNewDesc] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Cách ly, Sát trùng');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager';

  const categories = [
    'all',
    'Sát trùng & Cách ly Cổng',
    'Kiểm soát Phương tiện & Vật tư',
    'Kỹ thuật Chuồng nuôi',
    'Thú Y & Dịch Bệnh',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!newTitle) {
      setNewTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    // Try reading text if it's text-based
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && typeof content === 'string') {
        setNewContent(content.slice(0, 15000));
      }
    };
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      // Simulate rich parsed SOP text for PDF/Docx
      setNewContent(`TÀI LIỆU QUY TRÌNH AN TOÀN SINH HỌC: ${file.name}
Được tải lên bởi Quản lý Trang trại vào ${new Date().toLocaleDateString('vi-VN')}
Dung lượng: ${(file.size / (1024 * 1024)).toFixed(2)} MB

1. MỤC TIÊU VÀ PHẠM VI ÁP DỤNG:
- Áp dụng cho toàn bộ nhân sự và nhà thầu tại các trang trại chăn nuôi heo.
- Mục tiêu duy trì tình trạng an toàn dịch tễ 100% không để virus ASF và PRRS xâm nhập.

2. CÁC QUY ĐỊNH BẮT BUỘC:
- Cách ly tối thiểu 48 giờ trước khi vào trại.
- Tắm sát trùng 3 bước với xà phòng diệt khuẩn trong 10 phút.
- Khử trùng phương tiện xe cám bằng dung dịch 2% và sấy nhiệt 15-30 phút.
- Khử trùng vật tư bằng tia UV-C tối thiểu 30 phút.

3. XỬ LÝ VI PHẠM:
- Mọi trường hợp vi phạm quy trình sẽ bị lập biên bản, đình chỉ công tác để xét nghiệm PCR và tái đào tạo ATSH.`);
    }
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: DocumentSource = {
        id: `doc-${Date.now()}`,
        title: newTitle,
        fileName: uploadedFileName || `${newTitle.replace(/\s+/g, '_')}.pdf`,
        fileType: uploadedFileName.endsWith('.docx') ? 'docx' : 'pdf',
        category: newCategory,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        uploaderName: currentRole === 'admin' ? 'Ban Quản Trị Hệ Thống' : 'Quản Lý Trang Trại',
        description: newDesc || 'Tài liệu quy trình chuẩn vận hành an toàn sinh học trang trại heo.',
        contentText: newContent || `Quy trình hướng dẫn thực hiện ${newTitle} tại trang trại heo.`,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
        isOfficial: true,
        version: 'v1.0 - 2026',
      };

      setDocuments([newDoc, ...documents]);
      setIsUploading(false);
      setShowUploadModal(false);
      // Reset form
      setNewTitle('');
      setNewDesc('');
      setNewContent('');
      setUploadedFileName('');
    }, 600);
  };

  const handleDeleteDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isManagerOrAdmin) return;
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này khỏi cơ sở dữ liệu?')) {
      setDocuments(documents.filter(d => d.id !== id));
      if (activeDoc?.id === id) setActiveDoc(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bento Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              SOP Knowledge Base
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Thư viện Tài liệu & Quy trình Chuẩn ATSH
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
            Kho lưu trữ các văn bản quy phạm, quy trình thao tác chuẩn (SOP), hướng dẫn khử trùng, cách ly và phòng dịch Dịch tả lợn Châu Phi (ASF). Dữ liệu là căn cứ cho Trợ lý AI và các bài đào tạo trắc nghiệm.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {isManagerOrAdmin ? (
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-white" />
                <span>Tải lên File Tài liệu (PDF / Docx)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-xl border border-slate-200">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">Chế độ Nhân viên: Quyền tra cứu & đọc tài liệu (Chỉ Quản lý/Admin có quyền tải lên)</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80 shrink-0">
          <div className="text-center px-4 py-1">
            <div className="text-xl font-black text-blue-600">{documents.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Tài liệu SOP</div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Category filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu, quy trình, từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả chủ đề' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid in Bento Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setActiveDoc(doc)}
            className="bg-white rounded-3xl border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group cursor-pointer relative"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2.5 rounded-2xl ${doc.fileType === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                      {doc.category}
                    </span>
                    {doc.version && (
                      <span className="text-[10px] text-slate-400 ml-2 font-mono font-medium">
                        {doc.version}
                      </span>
                    )}
                  </div>
                </div>

                {isManagerOrAdmin && (
                  <button
                    onClick={(e) => handleDeleteDoc(doc.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="font-black text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2 mt-2">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1.5 line-clamp-2 leading-relaxed">
                {doc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span>{doc.uploadDate}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-blue-600 text-xs group-hover:translate-x-0.5 transition-transform">
                <span>Đọc & Học tập</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reader Modal */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded font-medium">
                      {activeDoc.category}
                    </span>
                    <span className="text-xs text-slate-400">{activeDoc.fileName}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {activeDoc.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveDoc(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-sm leading-relaxed">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-900 uppercase">Tài liệu Kiểm soát Chính thức</div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    Ban hành bởi: {activeDoc.uploaderName} • Cập nhật: {activeDoc.uploadDate}
                  </div>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm bg-slate-50 p-5 rounded-xl border border-slate-200 whitespace-pre-wrap font-sans">
                {activeDoc.contentText}
              </div>

              {/* Fast Action generation */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Chuyển đổi AI sang Nội dung Đào tạo
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Tự động tạo bài giảng slide & bộ câu hỏi trắc nghiệm từ tài liệu này
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {onGenerateCourseFromDoc && (
                    <button
                      onClick={() => {
                        onGenerateCourseFromDoc(activeDoc);
                        setActiveDoc(null);
                      }}
                      className="flex-1 sm:flex-none px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Tạo Slide Bài Giảng
                    </button>
                  )}
                  {onGenerateQuizFromDoc && (
                    <button
                      onClick={() => {
                        onGenerateQuizFromDoc(activeDoc);
                        setActiveDoc(null);
                      }}
                      className="flex-1 sm:flex-none px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Tạo Trắc Nghiệm
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Mã tài liệu: {activeDoc.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Đã chuẩn bị file ${activeDoc.fileName} để tải về.`)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file gốc
                </button>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Admin & Manager only) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tải lên Tài liệu ATSH mới</h3>
                  <p className="text-xs text-slate-500">Định dạng hỗ trợ: PDF, DOCX, TXT</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-4 mt-4 text-xs sm:text-sm">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl p-5 text-center relative hover:bg-emerald-50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold text-slate-800">
                  {uploadedFileName ? (
                    <span className="text-emerald-700 font-semibold">{uploadedFileName}</span>
                  ) : (
                    'Kéo thả file vào đây hoặc nhấp để duyệt file'
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Hỗ trợ tài liệu SOP quy trình, tiêu chuẩn thú y, cẩm nang dịch tễ
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề tài liệu</label>
                <input
                  type="text"
                  required
                  placeholder="VD: SOP 05: Quy trình Kiểm soát Nhập Heo Hậu Bị Cách Ly..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chủ đề đào tạo</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="Sát trùng & Cách ly Cổng">Sát trùng & Cách ly Cổng</option>
                    <option value="Kiểm soát Phương tiện & Vật tư">Kiểm soát Phương tiện & Vật tư</option>
                    <option value="Kỹ thuật Chuồng nuôi">Kỹ thuật Chuồng nuôi</option>
                    <option value="Thú Y & Dịch Bệnh">Thú Y & Dịch Bệnh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thẻ từ khóa (Tags)</label>
                  <input
                    type="text"
                    placeholder="Cách ly, Sát trùng, ASF..."
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  placeholder="Tóm tắt ngắn về phạm vi áp dụng và đối tượng bắt buộc thực hiện..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết quy trình (Trích xuất text)</label>
                <textarea
                  rows={4}
                  placeholder="Dán hoặc chỉnh sửa nội dung chi tiết các điều khoản quy định ATSH..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isUploading ? (
                    <span>Đang lưu trữ...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Lưu vào Thư viện</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
