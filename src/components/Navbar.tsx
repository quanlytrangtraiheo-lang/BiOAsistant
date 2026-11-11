import React from 'react';
import { 
  FolderOpen, 
  GraduationCap, 
  FileCheck2, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  Building2, 
  User, 
  Lock, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserRole, Farm, StaffMember } from '../types';

interface NavbarProps {
  activeTab: 'documents' | 'training' | 'exams' | 'dashboard' | 'settings';
  setActiveTab: (tab: 'documents' | 'training' | 'exams' | 'dashboard' | 'settings') => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedFarmId: string;
  setSelectedFarmId: (farmId: string) => void;
  farms: Farm[];
  currentUser?: StaffMember;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  selectedFarmId,
  setSelectedFarmId,
  farms,
  currentUser,
}) => {
  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager';

  const navItems = [
    {
      id: 'documents',
      label: 'Nguồn tài liệu',
      icon: FolderOpen,
      restricted: false, // staff can view, but cannot edit
      desc: 'Quản lý file PDF, Docx SOP',
    },
    {
      id: 'training',
      label: 'Học tập & Đào tạo',
      icon: GraduationCap,
      restricted: false,
      desc: 'Video, Slide tương tác & Trợ lý AI',
    },
    {
      id: 'exams',
      label: 'Kiểm tra & Đánh giá',
      icon: FileCheck2,
      restricted: false,
      desc: 'Thi chứng chỉ & Google Form',
    },
    {
      id: 'dashboard',
      label: 'Báo cáo Nhân sự',
      icon: BarChart3,
      restricted: false,
      desc: 'Thống kê theo trại & bộ phận',
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: Settings,
      restricted: !isManagerOrAdmin,
      desc: 'Sơ đồ tổ chức & Danh mục',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Farm selector & Role switch */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold tracking-tight">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-4 h-4" />
            <span className="uppercase text-[11px] sm:text-xs">HỆ THỐNG AN TOÀN SINH HỌC CHĂN NUÔI HEO (ATSH 4.0)</span>
          </div>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300 text-[11px]">
            Tiêu chuẩn cách ly 48h & Khử trùng 3 cấp độ (Đỏ - Vàng - Xanh)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Farm filter */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1 rounded-xl border border-slate-700/80">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">Trang trại:</span>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              aria-label="Chọn trang trại áp dụng"
              className="bg-transparent text-white text-xs font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">Toàn bộ Trang trại ({farms.length})</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-800 text-white">
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
          </div>

          {/* Role switcher for quick test & demonstration */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-xl border border-slate-700/80">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Quyền:</span>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              aria-label="Chọn quyền hạn tài khoản"
              className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2 py-0.5 rounded-lg border border-blue-500/40 focus:outline-hidden cursor-pointer"
            >
              <option value="admin" className="bg-slate-800 text-emerald-400 font-bold">Admin (Toàn quyền)</option>
              <option value="manager" className="bg-slate-800 text-sky-400 font-bold">Quản lý / Trưởng trại</option>
              <option value="staff" className="bg-slate-800 text-amber-400 font-bold">Nhân viên / Học viên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title in Bento Grid Style */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">
                  TRỢ LÝ ĐÀO TẠO
                </h1>
                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full border border-blue-200/60 uppercase tracking-wide">
                  ATSH BENTO
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Cơ sở Tri thức & Đánh giá Năng lực An toàn Sinh học Heo
              </p>
            </div>
          </div>

          {/* User Profile display */}
          {currentUser && (
            <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-2xl border border-slate-200/70 shadow-2xs">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-blue-500/40 ring-2 ring-white"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <span>{currentUser.jobTitle}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bento-styled Navigation Bar Tabs */}
        <nav className="flex space-x-2 border-t border-slate-100 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-btn-${item.id}`}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'settings' && !isManagerOrAdmin && (
                  <span className="flex items-center text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold">
                    <Lock className="w-2.5 h-2.5 mr-0.5" /> Chỉ xem
                  </span>
                )}
                {item.id === 'documents' && !isManagerOrAdmin && (
                  <span className="flex items-center text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold">
                    Chỉ xem
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
