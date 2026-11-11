import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Search, 
  Filter, 
  Download, 
  BellRing, 
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Farm, Department, StaffMember, ExamAttempt } from '../../types';

interface DashboardTabProps {
  farms: Farm[];
  departments: Department[];
  staff: StaffMember[];
  examAttempts: ExamAttempt[];
  selectedFarmId: string;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  farms,
  departments,
  staff,
  examAttempts,
  selectedFarmId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter staff by farm filter from header
  const farmFilteredStaff = selectedFarmId === 'all' 
    ? staff 
    : staff.filter(s => s.farmId === selectedFarmId);

  // Filter by search & local filters
  const displayedStaff = farmFilteredStaff.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === 'all' || s.departmentId === filterDept;
    const matchesStatus = filterStatus === 'all' || s.certificateStatus === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Calculate Metrics
  const totalStaff = farmFilteredStaff.length;
  const passedStaff = farmFilteredStaff.filter(s => s.certificateStatus === 'passed').length;
  const failedStaff = farmFilteredStaff.filter(s => s.certificateStatus === 'failed' || s.certificateStatus === 'expired').length;
  const pendingStaff = farmFilteredStaff.filter(s => s.certificateStatus === 'pending').length;

  const complianceRate = totalStaff > 0 ? Math.round((passedStaff / totalStaff) * 100) : 0;
  const averageScore = examAttempts.length > 0 
    ? Math.round(examAttempts.reduce((acc, a) => acc + a.percentage, 0) / examAttempts.length)
    : 85;

  // Farm-by-Farm Data for BarChart
  const farmChartData = farms.map((f) => {
    const fStaff = staff.filter(s => s.farmId === f.id);
    const fPassed = fStaff.filter(s => s.certificateStatus === 'passed').length;
    const rate = fStaff.length > 0 ? Math.round((fPassed / fStaff.length) * 100) : 0;
    return {
      name: f.code,
      fullName: f.name,
      'Tỷ lệ Đạt Chuẩn (%)': rate,
      'Tổng Nhân sự': fStaff.length,
      'Đã có Chứng chỉ': fPassed,
    };
  });

  // Department Performance Data
  const deptChartData = departments.map((d) => {
    const dStaff = farmFilteredStaff.filter(s => s.departmentId === d.id);
    const dPassed = dStaff.filter(s => s.certificateStatus === 'passed').length;
    const rate = dStaff.length > 0 ? Math.round((dPassed / dStaff.length) * 100) : 0;
    return {
      name: d.code,
      fullName: d.name,
      'Tuân thủ (%)': rate,
      'Nhân viên': dStaff.length,
    };
  });

  // Pie Chart Data
  const pieData = [
    { name: 'Đạt chuẩn ATSH', value: passedStaff, color: '#10b981' },
    { name: 'Cần đào tạo lại', value: failedStaff, color: '#f43f5e' },
    { name: 'Chưa thi / Chờ duyệt', value: pendingStaff, color: '#f59e0b' },
  ];

  const handleExportCSV = () => {
    const headers = ['Mã NV', 'Họ Tên', 'Trang Trại', 'Bộ Phận', 'Chức Vụ', 'Trạng Thái ATSH', 'Điểm Số', 'Khóa Hoàn Thành'];
    const rows = displayedStaff.map(s => [
      s.code,
      `"${s.name}"`,
      `"${s.farmName}"`,
      `"${s.departmentName}"`,
      `"${s.jobTitle}"`,
      s.certificateStatus === 'passed' ? 'Đạt chuẩn' : s.certificateStatus === 'failed' ? 'Chưa đạt' : 'Chờ thi',
      s.certificateScore || 0,
      s.completedCoursesCount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_ATSH_Nhan_Su_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Bento Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/50">
              Tổng quan giám sát ATSH
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bảng điều khiển Báo cáo Nhân sự
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Theo dõi tỷ lệ tuân thủ quy trình, điểm thi chứng chỉ và cảnh báo dịch tễ theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TRANG TRẠI:</span>
            <span className="text-xs font-bold text-slate-800">
              {selectedFarmId === 'all' ? 'Toàn bộ hệ thống' : farms.find(f => f.id === selectedFarmId)?.name || selectedFarmId}
            </span>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo cáo CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Nhân sự đã học</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-blue-600 tracking-tight">{totalStaff}</div>
            <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-100">
              <span>↑ 12% so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Tỷ lệ hoàn thành ATSH</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-indigo-600 tracking-tight">{complianceRate}%</div>
            <div className="inline-flex items-center gap-1 text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full mt-1.5 border border-indigo-100">
              <span>Mục tiêu an toàn: ≥ 90%</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Điểm TB kiểm tra</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-orange-500 tracking-tight">{averageScore}/100</div>
            <div className="text-[10px] text-slate-400 font-medium mt-1.5">
              Dựa trên {examAttempts.length} bài thi sát hạch
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cần đào tạo lại</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-rose-600 tracking-tight">{failedStaff + pendingStaff}</div>
            <div className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full mt-1.5 border border-rose-100">
              <span>{failedStaff} trượt • {pendingStaff} chưa thi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Main Grid Row: Interactive Showcase + Department Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Bento Card 1: Featured Course / Interactive SOP Showcase (Col 6) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">Khóa học tiêu biểu</span>
              <h3 className="font-extrabold text-slate-800 text-base">Quy trình Khử trùng & Tắm 3 Ngăn ATSH</h3>
            </div>
            <span className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">SOP 2026</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-900 h-44 group cursor-pointer border border-slate-100">
            <img 
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80" 
              alt="Chuồng heo an toàn sinh học" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-emerald-500 text-[10px] font-extrabold rounded-md uppercase">Bắt buộc</span>
                <span className="text-xs text-slate-300">Thời lượng: 15 phút • Slide + Audio TTS</span>
              </div>
              <p className="text-sm font-bold leading-tight">Quy định Vùng Đỏ (Ô nhiễm) - Vàng (Tắm xà phòng 10p) - Xanh (Vô trùng)</p>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 group-hover:bg-white text-blue-600 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
              <div className="w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-10 border-l-blue-600 ml-1"></div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">80% Đã hoàn thành</span>
          </div>
        </div>

        {/* Bento Card 2: Department Performance Bento Tile (Col 6) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Đánh giá theo bộ phận</span>
              <h3 className="font-extrabold text-slate-800 text-base">Tỷ lệ Tuân thủ ATSH Khu vực</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">4 bộ phận trọng điểm</span>
          </div>

          <div className="space-y-3.5 my-2">
            {departments.slice(0, 4).map((dept, idx) => {
              const dStaff = farmFilteredStaff.filter(s => s.departmentId === dept.id);
              const dPassed = dStaff.filter(s => s.certificateStatus === 'passed').length;
              const rate = dStaff.length > 0 ? Math.round((dPassed / dStaff.length) * 100) : 85;
              
              const colors = [
                { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500', code: 'BP1' },
                { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-600', code: 'BP2' },
                { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-500', code: 'BP3' },
                { bg: 'bg-purple-50', text: 'text-purple-700', bar: 'bg-purple-600', code: 'BP4' },
              ][idx % 4];

              return (
                <div key={dept.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-2xl flex items-center justify-center text-xs font-black shrink-0`}>
                    {dept.code}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-800">{dept.name}</span>
                      <span className="text-xs font-black text-slate-900">{rate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colors.bar} rounded-full`} style={{ width: `${rate}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100">
            <span>Tiêu chuẩn tối thiểu: ≥ 80%</span>
            <span className="text-emerald-600 font-bold">Trạng thái: Ổn định</span>
          </div>
        </div>
      </div>

      {/* 3 Interactive Bento Action Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bento Tile A: Vibrant Blue Quiz Action */}
        <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200">
              TRẮC NGHIỆM ATSH
            </div>
            <p className="text-sm font-bold mt-1.5 leading-snug">
              Kiểm tra nhanh: Tiêu chuẩn cách ly 48h & Thời gian tắm sát trùng
            </p>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => alert('Chuyển sang phần thi trắc nghiệm chứng chỉ!')}
              className="w-full bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-xl font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Làm Bài Kiểm Tra
            </button>
          </div>
        </div>

        {/* Bento Tile B: Recent SOP File Bento */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              TÀI LIỆU SOP MỚI NHẤT
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="bg-rose-50 text-rose-600 p-2.5 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">SOP_CachLy_SatTrung_2026.pdf</p>
                <p className="text-[10px] text-slate-400 font-medium">Quy chuẩn Dịch tễ • 2.4 MB</p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Cập nhật bởi: Ban ATSH</span>
            <span className="text-blue-600 font-bold">Đã đồng bộ</span>
          </div>
        </div>

        {/* Bento Tile C: Dark Slate System Org Bento */}
        <div className="bg-slate-900 p-5 rounded-3xl text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              HỆ THỐNG & CẢNH BÁO
            </p>
            <p className="text-sm font-bold text-white mt-1">
              Sơ đồ phân cấp ATSH đã đồng bộ
            </p>
            <p className="text-[10px] text-emerald-400 font-medium mt-1">
              • {farms.length} trang trại hoạt động bình thường
            </p>
          </div>
          <div className="flex -space-x-2 shrink-0">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
              +{totalStaff}
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-blue-500"></div>
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-500"></div>
          </div>
        </div>
      </div>

      {/* Detailed Charts Section: Farm Breakdown & Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Farm & Department Breakdown Bar Charts (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Tỷ lệ Đạt Chuẩn ATSH theo Từng Trang Trại</h3>
                <p className="text-xs text-slate-500">So sánh mức độ tuân thủ quy trình giữa các trang trại heo trong hệ thống</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={farmChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                    formatter={(value: any, name: string) => [`${value}%`, name]}
                  />
                  <Bar dataKey="Tỷ lệ Đạt Chuẩn (%)" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart & At-Risk Alert Box (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Phân bố Xếp loại Nhân sự</h3>
            <p className="text-xs text-slate-500 mb-2">Tỷ lệ chứng chỉ an toàn sinh học</p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-3.5 space-y-2 mt-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-900 uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Cảnh báo An toàn Nhân sự</span>
            </div>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Có <strong>{failedStaff + pendingStaff} nhân sự</strong> chưa hoàn thành bài thi chứng chỉ ATSH hợp lệ trước ca làm việc.
            </p>
            <button
              onClick={() => alert('Đã gửi thông báo nhắc nhở làm bài kiểm tra ATSH!')}
              className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <BellRing className="w-3 h-3" />
              <span>Gửi nhắc nhở Đào tạo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Staff Table in Bento Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Danh sách Chi tiết Kết quả Đào tạo Nhân sự</h3>
            <p className="text-xs text-slate-500 font-medium">Tra cứu trạng thái chứng chỉ, điểm thi và lịch sử đào tạo</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm nhân sự, mã NV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả bộ phận</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 font-medium text-slate-700 cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="passed">Đạt chuẩn ATSH</option>
              <option value="failed">Chưa đạt</option>
              <option value="pending">Chờ thi</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Nhân viên</th>
                <th className="p-4">Mã NV</th>
                <th className="p-4">Trang Trại</th>
                <th className="p-4">Bộ Phận / Chức Vụ</th>
                <th className="p-4 text-center">Khóa Học</th>
                <th className="p-4 text-center">Điểm Thi</th>
                <th className="p-4 text-center">Trạng Thái ATSH</th>
                <th className="p-4 text-right">Ngày cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {displayedStaff.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-blue-700 text-xs">{s.code}</td>
                  <td className="p-4 font-medium">{s.farmName}</td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{s.departmentName}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{s.jobTitle}</div>
                  </td>
                  <td className="p-4 text-center font-extrabold text-slate-900">
                    {s.completedCoursesCount} bài
                  </td>
                  <td className="p-4 text-center font-bold">
                    {s.certificateScore !== undefined ? (
                      <span className={s.certificateScore >= 80 ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'}>
                        {s.certificateScore}/100
                      </span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      s.certificateStatus === 'passed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : s.certificateStatus === 'failed'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                        : s.certificateStatus === 'expired'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}>
                      {s.certificateStatus === 'passed' ? 'Đạt Chuẩn' : s.certificateStatus === 'failed' ? 'Chưa Đạt' : s.certificateStatus === 'expired' ? 'Hết Hạn' : 'Chờ Thi'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-500 font-medium">{s.lastTrainedAt || 'Chưa học'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
