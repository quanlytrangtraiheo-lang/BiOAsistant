import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Network, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { Farm, Department, JobTitle, StaffMember, UserRole, SystemSettings } from '../../types';

interface SettingsTabProps {
  farms: Farm[];
  setFarms: React.Dispatch<React.SetStateAction<Farm[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  jobTitles: JobTitle[];
  setJobTitles: React.Dispatch<React.SetStateAction<JobTitle[]>>;
  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  settings: SystemSettings;
  setSettings: React.Dispatch<React.SetStateAction<SystemSettings>>;
  currentRole: UserRole;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  farms,
  setFarms,
  departments,
  setDepartments,
  jobTitles,
  setJobTitles,
  staff,
  setStaff,
  settings,
  setSettings,
  currentRole,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'farms' | 'departments' | 'jobs' | 'staff' | 'orgchart' | 'standards'>('orgchart');
  const isManagerOrAdmin = currentRole === 'admin' || currentRole === 'manager';

  // Add Farm Modal State
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [farmName, setFarmName] = useState('');
  const [farmCode, setFarmCode] = useState('');
  const [farmLoc, setFarmLoc] = useState('');
  const [farmPigs, setFarmPigs] = useState(3000);
  const [farmManager, setFarmManager] = useState('');
  const [farmPhone, setFarmPhone] = useState('');

  // Add Department State
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptManagerTitle, setDeptManagerTitle] = useState('');

  // Add Staff State
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffFarmId, setStaffFarmId] = useState(farms[0]?.id || '');
  const [staffDeptId, setStaffDeptId] = useState(departments[0]?.id || '');
  const [staffJobTitle, setStaffJobTitle] = useState(jobTitles[0]?.title || '');

  // Add Job Title State
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobName, setJobName] = useState('');
  const [jobCode, setJobCode] = useState('');
  const [jobDeptId, setJobDeptId] = useState(departments[0]?.id || '');
  const [jobLevel, setJobLevel] = useState('Cấp 3 - Kỹ thuật');

  // Org Chart Expanded state
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>({
    'dept-1': true,
    'dept-2': true,
    'dept-3': true,
    'dept-5': true,
  });

  const toggleDept = (deptId: string) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmName.trim()) return;

    const newF: Farm = {
      id: `farm-${Date.now()}`,
      name: farmName,
      code: farmCode || `GF-${Math.floor(10 + Math.random() * 90)}`,
      location: farmLoc || 'Bình Phước',
      pigCount: Number(farmPigs) || 2000,
      managerName: farmManager || 'Trưởng trại',
      contactPhone: farmPhone || '0900 000 000',
      status: 'active',
    };

    setFarms([...farms, newF]);
    setShowAddFarm(false);
    setFarmName('');
    setFarmCode('');
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) return;

    const newD: Department = {
      id: `dept-${Date.now()}`,
      name: deptName,
      code: deptCode || `DP-${Math.floor(10 + Math.random() * 90)}`,
      description: deptDesc || 'Bộ phận quản lý vận hành',
      memberCount: 1,
      managerTitle: deptManagerTitle || 'Trưởng bộ phận',
    };

    setDepartments([...departments, newD]);
    setShowAddDept(false);
    setDeptName('');
    setDeptCode('');
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    const selectedFarm = farms.find(f => f.id === staffFarmId);
    const selectedDept = departments.find(d => d.id === staffDeptId);

    const newS: StaffMember = {
      id: `staff-${Date.now()}`,
      code: staffCode || `NV-${Math.floor(100 + Math.random() * 900)}`,
      name: staffName,
      email: staffEmail || `${staffName.toLowerCase().replace(/\s+/g, '.')}@greenfarm.vn`,
      phone: staffPhone || '0912 345 678',
      farmId: staffFarmId,
      farmName: selectedFarm?.name || 'Trang trại GreenFarm 1',
      departmentId: staffDeptId,
      departmentName: selectedDept?.name || 'Thú Y & ATSH',
      jobTitle: staffJobTitle || 'Kỹ thuật viên',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: 'staff',
      certificateStatus: 'pending',
      completedCoursesCount: 0,
    };

    setStaff([newS, ...staff]);
    setShowAddStaff(false);
    setStaffName('');
    setStaffCode('');
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobName.trim()) return;

    const newJ: JobTitle = {
      id: `job-${Date.now()}`,
      title: jobName,
      code: jobCode || `JOB-${Math.floor(10 + Math.random() * 90)}`,
      departmentId: jobDeptId,
      level: jobLevel,
      description: 'Mô tả vị trí công việc theo tiêu chuẩn ATSH',
    };

    setJobTitles([...jobTitles, newJ]);
    setShowAddJob(false);
    setJobName('');
    setJobCode('');
  };

  return (
    <div className="space-y-6">
      {/* Access Restriction Notice if Staff */}
      {!isManagerOrAdmin ? (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-amber-900 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-200 text-amber-900 rounded-xl shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base">Phân Quyền: Chế độ Chỉ Xem (View-Only)</h3>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Bạn đang đăng nhập với vai trò <strong>Nhân viên</strong>. Tab Cài đặt hệ thống (Quản lý Trang trại, Bộ phận, Chức danh và Nhân sự) chỉ cho phép cấp Quản lý / Admin chỉnh sửa.
              Bạn vẫn có thể xem Sơ đồ tổ chức nhân sự bên dưới. Để trải nghiệm tính năng chỉnh sửa, vui lòng chuyển phân quyền sang <strong>"Admin"</strong> hoặc <strong>"Quản lý"</strong> ở thanh tiêu đề.
            </p>
          </div>
        </div>
      ) : null}

      {/* Top Bento Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              Cấu hình hệ thống & Sơ đồ tổ chức
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Quản trị Trang Trại & Sơ đồ Nhân sự
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 max-w-2xl">
            Thiết lập danh mục trang trại chăn nuôi heo, các phòng ban chuyên môn, phân bổ nhân sự và sơ đồ tổ chức cây phân cấp.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80 shrink-0 text-xs text-slate-600 font-bold">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>{farms.length} Trại • {departments.length} Bộ phận • {staff.length} Nhân sự</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex space-x-1.5 bg-white p-2 rounded-3xl border border-slate-100 shadow-xs overflow-x-auto">
        {[
          { id: 'orgchart', label: 'Sơ đồ Tổ chức (Org Chart)', icon: Network },
          { id: 'farms', label: 'Trang trại', icon: Building2 },
          { id: 'departments', label: 'Bộ phận', icon: Users },
          { id: 'jobs', label: 'Chức danh', icon: Briefcase },
          { id: 'staff', label: 'Danh sách Nhân sự', icon: UserCheck },
          { id: 'standards', label: 'Tiêu chuẩn ATSH', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. VISUAL ORG CHART HIERARCHY TREE */}
      {/* ========================================================================= */}
      {activeSubTab === 'orgchart' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sơ đồ Cây Tổ chức Nhân sự ATSH</h3>
              <p className="text-xs text-slate-500">Cấu trúc phân quyền và trách nhiệm an toàn sinh học theo từng đơn vị</p>
            </div>
          </div>

          {/* Root Company Node */}
          <div className="max-w-md mx-auto bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-4 rounded-2xl text-center shadow-md border border-emerald-600 relative">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-200">
              Tổng Chỉ Huy An Toàn Sinh Học
            </span>
            <h4 className="text-base font-black mt-1">{settings.companyName}</h4>
            <p className="text-xs text-emerald-100 mt-0.5">Hệ thống {farms.length} Trang trại Chăn nuôi Chuẩn Quốc tế</p>
          </div>

          {/* Farm Level Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {farms.map((farm) => {
              const farmStaffCount = staff.filter(s => s.farmId === farm.id).length;
              return (
                <div
                  key={farm.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center hover:border-emerald-400 transition-all shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{farm.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{farm.code} • {farm.pigCount.toLocaleString()} heo</div>
                  <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 py-1 rounded-lg">
                    Phụ trách: {farm.managerName}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{farmStaffCount} nhân sự</div>
                </div>
              );
            })}
          </div>

          {/* Department Level Branches */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Chi tiết Phân bổ Nhân sự theo Bộ phận Chức năng:
            </h4>

            <div className="space-y-3">
              {departments.map((dept) => {
                const isExpanded = !!expandedDepts[dept.id];
                const deptStaff = staff.filter(s => s.departmentId === dept.id);

                return (
                  <div key={dept.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    <div
                      onClick={() => toggleDept(dept.id)}
                      className="p-3.5 bg-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {dept.code}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{dept.name}</h5>
                          <p className="text-[11px] text-slate-500">{dept.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                          {deptStaff.length} nhân viên
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Member list when expanded */}
                    {isExpanded && (
                      <div className="p-4 bg-slate-50/70 border-t border-slate-200">
                        {deptStaff.length === 0 ? (
                          <div className="text-xs text-slate-400 italic">Chưa có nhân sự được phân bổ vào bộ phận này.</div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {deptStaff.map((member) => (
                              <div
                                key={member.id}
                                className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs"
                              >
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-slate-900 text-xs truncate">{member.name}</div>
                                  <div className="text-[11px] text-emerald-700 font-medium truncate">{member.jobTitle}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{member.code} • {member.farmName.split(' ')[0]}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FARMS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'farms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Danh sách Trang trại Chăn nuôi Heo</h3>
              <p className="text-xs text-slate-500">Quản lý các cơ sở chăn nuôi trực thuộc tập đoàn</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setShowAddFarm(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Trang Trại Mới</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {farms.map((farm) => (
              <div key={farm.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{farm.name}</h4>
                  </div>
                  <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">
                    {farm.code}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{farm.location}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-2 border-t border-slate-200">
                  <div>Quy mô: <strong className="text-slate-800">{farm.pigCount.toLocaleString()} nái/heo</strong></div>
                  <div>Quản lý: <strong className="text-slate-800">{farm.managerName}</strong></div>
                  <div>Liên hệ: <strong className="text-slate-800">{farm.contactPhone}</strong></div>
                  <div>Trạng thái: <span className="text-emerald-600 font-bold">An toàn dịch</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEPARTMENTS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'departments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Danh mục Bộ phận Chuồng trại</h3>
              <p className="text-xs text-slate-500">Các khu vực phân vùng kỹ thuật và an toàn sinh học</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setShowAddDept(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Bộ Phận</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {departments.map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{d.name}</h4>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {d.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{d.description}</p>
                <div className="text-[11px] text-slate-400 pt-1">
                  Chức vụ phụ trách: <strong className="text-slate-700">{d.managerTitle}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. JOB TITLES MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Danh mục Chức danh & Vị trí Công việc</h3>
              <p className="text-xs text-slate-500">Tiêu chuẩn phân cấp trách nhiệm ATSH</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setShowAddJob(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Chức Danh</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {jobTitles.map((j) => (
              <div key={j.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900 text-xs sm:text-sm">{j.title}</div>
                <div className="text-[11px] text-indigo-600 font-mono font-semibold">{j.code} • {j.level}</div>
                <p className="text-[11px] text-slate-500">{j.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STAFF MEMBERS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeSubTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Danh sách Nhân sự Toàn hệ thống</h3>
              <p className="text-xs text-slate-500">Quản lý hồ sơ nhân viên, phân trại và cấp chứng chỉ ATSH</p>
            </div>
            {isManagerOrAdmin && (
              <button
                onClick={() => setShowAddStaff(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Nhân Viên Mới</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {staff.map((s) => (
              <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{s.name}</div>
                    <div className="text-xs text-emerald-700 font-medium">{s.jobTitle}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{s.code} • {s.farmName.split(' ')[0]}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.certificateStatus === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {s.certificateStatus === 'passed' ? 'Đạt Chuẩn' : 'Chưa Đạt'}
                  </span>
                  <div className="text-[11px] text-slate-400 mt-1">{s.completedCoursesCount} khóa học</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SOP STANDARDS CONFIG */}
      {/* ========================================================================= */}
      {activeSubTab === 'standards' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Cấu hình Tiêu chuẩn An Toàn Sinh Học</h3>
            <p className="text-xs text-slate-500">Các tham số bắt buộc kiểm soát trên toàn bộ trang trại heo</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thời gian cách ly bắt buộc (Giờ)</label>
              <input
                type="number"
                value={settings.quarantineHoursStandard}
                onChange={(e) => setSettings({ ...settings, quarantineHoursStandard: Number(e.target.value) })}
                disabled={!isManagerOrAdmin}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500">Chuẩn khuyến nghị: 48 giờ đối với công nhân và 72 giờ đối với khách chuyên gia.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Điểm chuẩn Đạt bài thi Chứng chỉ ATSH (%)</label>
              <input
                type="number"
                value={settings.passScoreThreshold}
                onChange={(e) => setSettings({ ...settings, passScoreThreshold: Number(e.target.value) })}
                disabled={!isManagerOrAdmin}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500">Học viên đạt từ 80% trở lên mới được cấp chứng nhận vào ca làm việc.</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email nhận Báo cáo Vi phạm ATSH & Nhân sự</label>
              <input
                type="email"
                value={settings.notificationEmail}
                onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                disabled={!isManagerOrAdmin}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {isManagerOrAdmin && (
              <button
                onClick={() => alert('Đã lưu cấu hình tiêu chuẩn ATSH thành công!')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Lưu Cấu Hình
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddFarm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Thêm Trang Trại Heo Mới</h3>
            <form onSubmit={handleSaveFarm} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên trang trại</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trang trại Heo Nái GreenFarm 5..."
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã trang trại</label>
                <input
                  type="text"
                  placeholder="VD: GF-BP05"
                  value={farmCode}
                  onChange={(e) => setFarmCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Địa chỉ / Vị trí</label>
                <input
                  type="text"
                  placeholder="Huyện Chơn Thành, Tỉnh Bình Phước"
                  value={farmLoc}
                  onChange={(e) => setFarmLoc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quy mô đàn (con)</label>
                <input
                  type="number"
                  value={farmPigs}
                  onChange={(e) => setFarmPigs(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddFarm(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Lưu Trại</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Thêm Nhân Sự Mới</h3>
            <form onSubmit={handleSaveStaff} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Văn Bình"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã nhân viên</label>
                <input
                  type="text"
                  placeholder="VD: NV-015"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trang trại</label>
                  <select
                    value={staffFarmId}
                    onChange={(e) => setStaffFarmId(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bộ phận</label>
                  <select
                    value={staffDeptId}
                    onChange={(e) => setStaffDeptId(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chức danh</label>
                <input
                  type="text"
                  placeholder="Kỹ thuật viên / Công nhân nuôi"
                  value={staffJobTitle}
                  onChange={(e) => setStaffJobTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddStaff(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Lưu Nhân Viên</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Thêm Bộ Phận Mới</h3>
            <form onSubmit={handleSaveDept} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên bộ phận</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng Khử Trùng & Xử Lý Biogas..."
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã bộ phận</label>
                <input
                  type="text"
                  placeholder="VD: KT-BIOGAS"
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả nhiệm vụ</label>
                <textarea
                  rows={2}
                  placeholder="Nhiệm vụ kiểm soát xử lý chất thải và an toàn sinh học..."
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddDept(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Lưu Bộ Phận</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Modal */}
      {showAddJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Thêm Chức Danh Mới</h3>
            <form onSubmit={handleSaveJob} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên chức danh</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nhân viên Kiểm dịch Vùng đệm..."
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã chức danh</label>
                <input
                  type="text"
                  placeholder="VD: NV-KD"
                  value={jobCode}
                  onChange={(e) => setJobCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phân cấp bậc</label>
                <select
                  value={jobLevel}
                  onChange={(e) => setJobLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Cấp 1 - Quản lý">Cấp 1 - Quản lý</option>
                  <option value="Cấp 2 - Chuyên gia">Cấp 2 - Chuyên gia</option>
                  <option value="Cấp 3 - Kỹ thuật">Cấp 3 - Kỹ thuật</option>
                  <option value="Cấp 4 - Công nhân">Cấp 4 - Công nhân</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddJob(false)} className="px-4 py-2 border rounded-lg">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Lưu Chức Danh</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
