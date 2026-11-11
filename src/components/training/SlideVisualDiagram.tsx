import React from 'react';
import { ShieldCheck, Truck, Sparkles, UserCheck, AlertTriangle, ArrowRight, CheckCircle2, Lock, Flame } from 'lucide-react';

interface SlideVisualDiagramProps {
  type?: 'barrier' | 'disinfection' | 'zones' | 'flowchart' | 'pigs';
}

export const SlideVisualDiagram: React.FC<SlideVisualDiagramProps> = ({ type = 'zones' }) => {
  if (type === 'zones') {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-inner">
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Sơ đồ 3 Vành đai Phòng thủ An toàn Sinh học (Biosafety Zones)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Vùng Đỏ */}
          <div className="bg-rose-950/40 border border-rose-600/40 rounded-lg p-3 text-center">
            <div className="inline-block px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded-full mb-1">
              VÙNG ĐỎ (KHU VỰC BẨN)
            </div>
            <p className="text-xs text-rose-200 mt-1 font-medium">Bên ngoài hàng rào trại</p>
            <p className="text-[11px] text-slate-400 mt-1">Đường dân sinh, chợ, xe thu mua heo, người chưa cách ly</p>
            <div className="mt-2 text-[11px] text-rose-300 font-semibold bg-rose-900/40 py-1 rounded">
              Nguy cơ mầm bệnh ASF: 100%
            </div>
          </div>

          {/* Vùng Vàng */}
          <div className="bg-amber-950/40 border border-amber-600/40 rounded-lg p-3 text-center relative">
            <div className="inline-block px-2 py-0.5 bg-amber-600 text-white text-[11px] font-bold rounded-full mb-1">
              VÙNG VÀNG (KHU VỰC ĐỆM)
            </div>
            <p className="text-xs text-amber-200 mt-1 font-medium">Nhà tắm 3 bước & Trạm UV</p>
            <p className="text-[11px] text-slate-400 mt-1">Cách ly 48h, tắm sát trùng 10 phút, sấy khử khuẩn vật tư</p>
            <div className="mt-2 text-[11px] text-amber-300 font-semibold bg-amber-900/40 py-1 rounded">
              Chốt chặn trung hòa mầm bệnh
            </div>
          </div>

          {/* Vùng Xanh */}
          <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-lg p-3 text-center">
            <div className="inline-block px-2 py-0.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full mb-1">
              VÙNG XANH (KHU SẢN XUẤT)
            </div>
            <p className="text-xs text-emerald-200 mt-1 font-medium">Chuồng Nái, Chuồng Thịt</p>
            <p className="text-[11px] text-slate-400 mt-1">Đồ bảo hộ chuyên dụng, ủng tiệt trùng, vô trùng tuyệt đối</p>
            <div className="mt-2 text-[11px] text-emerald-300 font-semibold bg-emerald-900/40 py-1 rounded">
              Vùng lõi an toàn dịch tễ
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'disinfection') {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-inner">
        <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          Quy trình Tắm Sát Trùng 3 Bước Một Chiều (Shower-in)
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex-1 bg-slate-800/70 border border-slate-700 p-3 rounded-lg text-center w-full">
            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 font-bold mx-auto flex items-center justify-center text-xs mb-1">
              01
            </div>
            <div className="text-xs font-bold text-slate-200">Khu vực Đỏ (Bẩn)</div>
            <p className="text-[11px] text-slate-400 mt-1">Cởi bỏ toàn bộ quần áo ngoài, giày dép cá nhân vào tủ riêng</p>
          </div>

          <ArrowRight className="w-5 h-5 text-sky-400 shrink-0 hidden md:block" />

          <div className="flex-1 bg-sky-950/40 border border-sky-600/40 p-3 rounded-lg text-center w-full">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 font-bold mx-auto flex items-center justify-center text-xs mb-1">
              02
            </div>
            <div className="text-xs font-bold text-sky-200">Buồng Tắm Sát Trùng</div>
            <p className="text-[11px] text-sky-300 mt-1">Tắm gội xà phòng diệt khuẩn tối thiểu <strong>10 phút</strong></p>
          </div>

          <ArrowRight className="w-5 h-5 text-sky-400 shrink-0 hidden md:block" />

          <div className="flex-1 bg-emerald-950/40 border border-emerald-600/40 p-3 rounded-lg text-center w-full">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold mx-auto flex items-center justify-center text-xs mb-1">
              03
            </div>
            <div className="text-xs font-bold text-emerald-200">Khu vực Xanh (Sạch)</div>
            <p className="text-[11px] text-emerald-300 mt-1">Lau khô khăn sấy, mặc đồ bảo hộ trại & ủng đã ngâm thuốc</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'barrier') {
    return (
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-inner">
        <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4" />
          Quy trình Sát trùng Xe Cám & Phương tiện 4 Cấp độ
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-center">
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">Cấp 1</span>
            <div className="text-xs font-bold text-slate-200 mt-1">Rửa nước áp lực</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Xịt 150 bar sạch bùn đất gầm lốp xe</p>
          </div>
          <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-center">
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">Cấp 2</span>
            <div className="text-xs font-bold text-slate-200 mt-1">Phun hóa chất 2%</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Virkon/Cloramin B phủ kín 360 độ</p>
          </div>
          <div className="bg-slate-800 p-2.5 rounded border border-slate-700 text-center">
            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">Cấp 3</span>
            <div className="text-xs font-bold text-slate-200 mt-1">Nghỉ ngấm 15-30p</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Lưu buồng sấy nhiệt/sát trùng</p>
          </div>
          <div className="bg-emerald-950/40 p-2.5 rounded border border-emerald-600/40 text-center">
            <span className="text-[10px] bg-emerald-700 text-emerald-200 px-1.5 py-0.5 rounded font-mono">Cấp 4</span>
            <div className="text-xs font-bold text-emerald-300 mt-1">Cầu giao nhận 1 chiều</div>
            <p className="text-[10px] text-emerald-400 mt-0.5">Tài xế không bước xuống đất trại</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-inner flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs font-bold text-emerald-400">Nguyên Tắc Vàng An Toàn Sinh Học</div>
          <p className="text-xs text-slate-300 mt-0.5">Cách ly 48h • Sát trùng 100% • All-in All-out</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-emerald-900/40 border border-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-full">
        Chuẩn GlobalGAP / VietGAHP
      </div>
    </div>
  );
};
