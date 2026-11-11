import { Farm, Department, JobTitle, StaffMember, DocumentSource, TrainingCourse, Exam, ExamAttempt, SystemSettings, FarmScenario } from '../types';

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'Tập đoàn Nông nghiệp & Chăn nuôi Xanh (GreenAgri Farm)',
  appTitle: 'Trợ lý Đào tạo Online - An Toàn Sinh Học (ATSH)',
  passScoreThreshold: 80,
  quarantineHoursStandard: 48,
  enableVoiceNarration: true,
  allowSelfTest: true,
  notificationEmail: 'quanlytrangtraiheo@gmail.com',
};

export const INITIAL_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    code: 'GF-BP01',
    location: 'Huyện Hớn Quản, Tỉnh Bình Phước',
    pigCount: 2800,
    managerName: 'Kỹ sư Nguyễn Văn Thắng',
    contactPhone: '0918 345 678',
    status: 'active',
  },
  {
    id: 'farm-2',
    name: 'Trang trại Heo Hậu Bị & Nái Đẻ Mekong Farm 2',
    code: 'MK-DN02',
    location: 'Huyện Cẩm Mỹ, Tỉnh Đồng Nai',
    pigCount: 5200,
    managerName: 'ThS. Trần Đình Hùng',
    contactPhone: '0903 889 123',
    status: 'active',
  },
  {
    id: 'farm-3',
    name: 'Trang trại Heo Thịt Thương Phẩm Agro 3',
    code: 'AG-TN03',
    location: 'Huyện Tân Châu, Tỉnh Tây Ninh',
    pigCount: 16500,
    managerName: 'Kỹ sư Lê Minh Trí',
    contactPhone: '0972 554 991',
    status: 'active',
  },
  {
    id: 'farm-4',
    name: 'Trại Nuôi Thí Nghiệm & Khảo Nghiệm Giống 4',
    code: 'LD-EXP04',
    location: 'Huyện Đơn Dương, Tỉnh Lâm Đồng',
    pigCount: 1200,
    managerName: 'Bác sĩ Thú y Phạm Hải Yến',
    contactPhone: '0988 231 445',
    status: 'quarantine',
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Ban Quản Lý & Điều Hành Trại',
    code: 'BQL',
    description: 'Chỉ đạo toàn diện hoạt động trại và giám sát tuân thủ an toàn sinh học',
    memberCount: 6,
    managerTitle: 'Giám đốc Trang trại',
  },
  {
    id: 'dept-2',
    name: 'Thú Y & Kiểm Soát ATSH Dịch Bệnh',
    code: 'TY-ATSH',
    description: 'Giám sát dịch tễ, tiêm phòng vaccine, xét nghiệm ASF/PRRS và kiểm soát sát trùng',
    memberCount: 14,
    managerTitle: 'Bác sĩ Thú y Trưởng',
  },
  {
    id: 'dept-3',
    name: 'Kỹ Thuật Chuồng Nái & Heo Con',
    code: 'KT-NAI',
    description: 'Phối giống, đỡ đẻ nái, chăm sóc heo con theo mẹ và cai sữa vô trùng',
    memberCount: 28,
    managerTitle: 'Trưởng khu Chuồng Nái',
  },
  {
    id: 'dept-4',
    name: 'Kỹ Thuật Chuồng Thịt & Vỗ Béo',
    code: 'KT-THIT',
    description: 'Quy trình nuôi thịt cùng vào cùng ra (All-in All-out) và kiểm soát cám nước',
    memberCount: 35,
    managerTitle: 'Trưởng khu Chuồng Thịt',
  },
  {
    id: 'dept-5',
    name: 'Bảo Vệ, Cổng Khử Trùng & Nhà Cách Ly',
    code: 'BV-GATE',
    description: 'Vận hành hố sát trùng, nhà tắm 3 bước, buồng chiếu UV và quản lý cách ly 48h',
    memberCount: 18,
    managerTitle: 'Đội trưởng An ninh ATSH Cổng',
  },
  {
    id: 'dept-6',
    name: 'Kho Cám, Dược Phẩm & Xử Lý Phân',
    code: 'KHO-VT',
    description: 'Quản lý tiếp nhận thức ăn chăn nuôi, buồng xông ozone thuốc thú y và biogas',
    memberCount: 12,
    managerTitle: 'Quản lý Kho & Xử lý Môi trường',
  },
];

export const INITIAL_JOB_TITLES: JobTitle[] = [
  { id: 'job-1', title: 'Giám đốc Trang trại / Trưởng trại', code: 'GD-TT', departmentId: 'dept-1', level: 'Cấp 1 - Quản lý', description: 'Chịu trách nhiệm tối cao về ATSH tại trại' },
  { id: 'job-2', title: 'Bác sĩ Thú y Trưởng', code: 'BSTY-T', departmentId: 'dept-2', level: 'Cấp 2 - Chuyên gia', description: 'Điều hành phác đồ phòng dịch và xét nghiệm' },
  { id: 'job-3', title: 'Chuyên viên Giám sát ATSH Cổng & Vùng Đệm', code: 'CV-ATSH', departmentId: 'dept-2', level: 'Cấp 3 - Kỹ thuật', description: 'Kiểm tra nồng độ sát trùng và giám sát cách ly' },
  { id: 'job-4', title: 'Kỹ thuật viên Phối giống & Chuồng Nái', code: 'KTV-NAI', departmentId: 'dept-3', level: 'Cấp 3 - Kỹ thuật', description: 'Thao tác thụ tinh nhân tạo và kiểm tra nái' },
  { id: 'job-5', title: 'Công nhân Chăm sóc & Nuôi dưỡng', code: 'CN-ND', departmentId: 'dept-4', level: 'Cấp 4 - Công nhân', description: 'Cho ăn, dọn dẹp vệ sinh chuồng nuôi hàng ngày' },
  { id: 'job-6', title: 'Nhân viên Vận hành Trạm Sát Trùng Cổng', code: 'NV-GATE', departmentId: 'dept-5', level: 'Cấp 4 - Vận hành', description: 'Xịt rửa xe, hướng dẫn tắm sát trùng và kiểm tra buồng UV' },
  { id: 'job-7', title: 'Thủ kho Cám & Dược phẩm Thú y', code: 'TK-CAM', departmentId: 'dept-6', level: 'Cấp 3 - Kỹ thuật', description: 'Tiếp nhận cám rời, phun sát trùng bao bì cám' },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    code: 'NV-001',
    name: 'Nguyễn Văn Thắng',
    email: 'thang.nguyen@greenfarm.vn',
    phone: '0918 345 678',
    farmId: 'farm-1',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    departmentId: 'dept-1',
    departmentName: 'Ban Quản Lý & Điều Hành Trại',
    jobTitle: 'Giám đốc Trang trại / Trưởng trại',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'manager',
    certificateStatus: 'passed',
    certificateScore: 98,
    completedCoursesCount: 8,
    lastTrainedAt: '2026-08-01',
  },
  {
    id: 'staff-2',
    code: 'NV-002',
    name: 'Phan Thị Mai Lan',
    email: 'lan.phan@greenfarm.vn',
    phone: '0909 112 334',
    farmId: 'farm-1',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    departmentId: 'dept-2',
    departmentName: 'Thú Y & Kiểm Soát ATSH Dịch Bệnh',
    jobTitle: 'Bác sĩ Thú y Trưởng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    certificateStatus: 'passed',
    certificateScore: 100,
    completedCoursesCount: 10,
    lastTrainedAt: '2026-08-05',
  },
  {
    id: 'staff-3',
    code: 'NV-003',
    name: 'Lê Văn Quyết',
    email: 'quyet.le@greenfarm.vn',
    phone: '0933 445 566',
    farmId: 'farm-1',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    departmentId: 'dept-5',
    departmentName: 'Bảo Vệ, Cổng Khử Trùng & Nhà Cách Ly',
    jobTitle: 'Nhân viên Vận hành Trạm Sát Trùng Cổng',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'staff',
    certificateStatus: 'passed',
    certificateScore: 92,
    completedCoursesCount: 6,
    lastTrainedAt: '2026-08-08',
  },
  {
    id: 'staff-4',
    code: 'NV-004',
    name: 'Võ Minh Hùng',
    email: 'hung.vo@greenfarm.vn',
    phone: '0977 123 456',
    farmId: 'farm-2',
    farmName: 'Trang trại Heo Hậu Bị & Nái Đẻ Mekong Farm 2',
    departmentId: 'dept-3',
    departmentName: 'Kỹ Thuật Chuồng Nái & Heo Con',
    jobTitle: 'Kỹ thuật viên Phối giống & Chuồng Nái',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'staff',
    certificateStatus: 'passed',
    certificateScore: 86,
    completedCoursesCount: 5,
    lastTrainedAt: '2026-07-28',
  },
  {
    id: 'staff-5',
    code: 'NV-005',
    name: 'Đặng Hoàng Nam',
    email: 'nam.dang@greenfarm.vn',
    phone: '0981 999 888',
    farmId: 'farm-3',
    farmName: 'Trang trại Heo Thịt Thương Phẩm Agro 3',
    departmentId: 'dept-4',
    departmentName: 'Kỹ Thuật Chuồng Thịt & Vỗ Béo',
    jobTitle: 'Công nhân Chăm sóc & Nuôi dưỡng',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'staff',
    certificateStatus: 'pending',
    completedCoursesCount: 2,
    lastTrainedAt: '2026-08-10',
  },
  {
    id: 'staff-6',
    code: 'NV-006',
    name: 'Bùi Thị Bích Ngọc',
    email: 'ngoc.bui@greenfarm.vn',
    phone: '0912 654 321',
    farmId: 'farm-3',
    farmName: 'Trang trại Heo Thịt Thương Phẩm Agro 3',
    departmentId: 'dept-6',
    departmentName: 'Kho Cám, Dược Phẩm & Xử Lý Phân',
    jobTitle: 'Thủ kho Cám & Dược phẩm Thú y',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'staff',
    certificateStatus: 'failed',
    certificateScore: 65,
    completedCoursesCount: 3,
    lastTrainedAt: '2026-08-09',
  },
  {
    id: 'staff-7',
    code: 'NV-007',
    name: 'Hoàng Quốc Tuấn',
    email: 'tuan.hoang@greenfarm.vn',
    phone: '0938 776 543',
    farmId: 'farm-2',
    farmName: 'Trang trại Heo Hậu Bị & Nái Đẻ Mekong Farm 2',
    departmentId: 'dept-5',
    departmentName: 'Bảo Vệ, Cổng Khử Trùng & Nhà Cách Ly',
    jobTitle: 'Nhân viên Vận hành Trạm Sát Trùng Cổng',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    role: 'staff',
    certificateStatus: 'expired',
    certificateScore: 78,
    completedCoursesCount: 4,
    lastTrainedAt: '2026-05-15',
  },
];

export const INITIAL_DOCUMENTS: DocumentSource[] = [
  {
    id: 'doc-sop-01',
    title: 'SOP 01: Quy trình Sát trùng Cổng & Cách ly Bắt buộc 48 Giờ',
    fileName: 'SOP_01_Quy_trinh_Sat_trung_Cach_ly_48h.pdf',
    fileType: 'pdf',
    category: 'Sát trùng & Cách ly Cổng',
    uploadDate: '2026-08-01',
    fileSize: '3.4 MB',
    uploaderName: 'Ban Thú Y Trung Tâm',
    description: 'Quy chuẩn an ninh sinh học cấp 1: Quy định cách ly 48h, tắm sát trùng 3 bước qua buồng tắm ngăn cách, thay trang phục bảo hộ trại.',
    tags: ['Cách ly 48h', 'Tắm sát trùng', 'Virkon 1%', 'Cổng trại'],
    isOfficial: true,
    version: 'v3.2 - 2026',
    contentText: `QUY TRÌNH AN TOÀN SINH HỌC CẤP CAO - TRANG TRẠI CHĂN NUÔI HEO
MÃ HIỆU: SOP-ATSH-01 | PHIÊN BẢN: 3.2 (NĂM 2026)
MỤC ĐÍCH: Ngăn chặn triệt để nguy cơ xâm nhập của virus Dịch tả heo Châu Phi (ASF), Tai xanh (PRRS), Lở mồm long móng (FMD) qua con người.

1. ĐIỀU KIỆN TIÊN QUYẾT ĐỐI VỚI NHÂN SỰ VÀO TRẠI:
- Phải cách ly tối thiểu **48 giờ** tại Khu cách ly ngoại vi (Khu Bẩn Ngoài) trước khi được phép bước vào Khu Đệm hoặc Khu Sản Xuất.
- Tuyệt đối trong vòng **48h - 72h** không được đến chợ đầu mối bán thịt heo, lò mổ gia súc, hoặc tiếp xúc với đàn heo bệnh ngoài trại.
- Không mang bất kỳ thực phẩm chứa thịt heo (giò, chả, lạp xưởng, thịt tươi, canh thịt...) vào khuôn viên trang trại dưới mọi hình thức.

2. QUY TRÌNH TẮM GỘI SÁT TRÙNG 3 BƯỚC (NHÀ TẮM NGĂN CÁCH):
- Bước 1 (Khu Vực Đỏ - Bẩn): Cởi bỏ toàn bộ quần áo, giày dép cá nhân, tư trang để tại tủ cá nhân khu bẩn. Giày dép cá nhân ngâm chậu sát trùng cồn/formalin.
- Bước 2 (Buồng Tắm Sát Trùng - Ranh giới): Tắm gội toàn thân bằng xà phòng diệt khuẩn (Lifebuoy/Chlorhexidine) trong tối thiểu **10 phút**. Gội đầu sạch, rửa kỹ kẽ móng tay, tai và mũi.
- Bước 3 (Khu Vực Xanh - Sạch): Bước sang khu vực sạch, lau khô bằng khăn đã được hấp sấy tiệt trùng, mặc quần áo bảo hộ chuyên dụng màu xanh của trại và đi ủng màu cam/trắng đã được ngâm dung dịch sát trùng.

3. QUY TRÌNH XỬ LÝ VẬT DỤNG CÁ NHÂN VÀ ĐIỆN THOẠI:
- Điện thoại cá nhân, ví tiền, chìa khóa phải được đặt vào **Buồng chiếu tia cực tím UV-C** tối thiểu **30 phút** hoặc xông khí Ozone trước khi chuyển sang phòng nội bộ.
- Nghiêm cấm mang điện thoại cá nhân vào trực tiếp trong chuồng nuôi nái và chuồng heo con.`,
  },
  {
    id: 'doc-sop-02',
    title: 'SOP 02: Kiểm soát & Sát trùng Phương tiện Vận chuyển Xe Cám & Xe Heo',
    fileName: 'SOP_02_Kiem_soat_Phuong_tien_Xe_Cam_Heo.docx',
    fileType: 'docx',
    category: 'Kiểm soát Phương tiện & Vật tư',
    uploadDate: '2026-08-03',
    fileSize: '2.1 MB',
    uploaderName: 'Ban Thú Y Trung Tâm',
    description: 'Quy trình khử trùng 4 cấp độ đối với xe tải chở thức ăn chăn nuôi, xe chở phân và xe chuyển giao heo giống.',
    tags: ['Xe cám', 'Hố sát trùng', 'Phun áp lực', 'Xông nhiệt'],
    isOfficial: true,
    version: 'v2.8 - 2026',
    contentText: `QUY ĐỊNH KIỂM SOÁT VÀ SÁT TRÙNG PHƯƠNG TIỆN VẬN CHUYỂN
MÃ HIỆU: SOP-ATSH-02

1. QUY ĐỊNH TẠI TRẠM SÁT TRÙNG NGOẠI VI (CÁCH TRẠI 500M):
- Xe tải chở cám hoặc thiết bị phải rửa sạch toàn bộ bùn đất, phân bám trên lốp và gầm xe bằng vòi xịt nước áp lực cao (tối thiểu 150 bar).
- Phun dung dịch Cloramin B hoặc Glutaraldehyde nồng độ **2%** toàn bộ lốp và gầm. Thời gian nghỉ tối thiểu **15 phút**.

2. QUY ĐỊNH TẠI CỔNG CHÍNH TRANG TRẠI:
- Xe dừng tại hố sát trùng cổng chính (hố chứa vôi bột 5% hoặc dung dịch thuốc sát trùng ngập 2/3 bánh xe).
- Kích hoạt hệ thống phun sương tự động bao phủ 360 độ quanh thân xe, nóc cabin và thùng hàng trong vòng **5 phút**.
- Đối với xe vận chuyển heo xuất chuồng: Bắt buộc đỗ tại Cầu xuất heo ngoại vi (cách xa chuồng nuôi tối thiểu 200m), tài xế không được bước chân xuống đất trại.

3. QUY ĐỊNH CHO TÀI XẾ:
- Tài xế ngồi trong cabin trong suốt quá trình xịt khử trùng hoặc phải xuống tắm sát trùng nếu cần bàn giao giấy tờ.
- Bàn giao hóa đơn, chứng từ qua khay UV khử trùng **15 phút**.`,
  },
  {
    id: 'doc-sop-03',
    title: 'SOP 03: Vệ sinh Tiêu độc Chuồng trại & Quy trình Cùng vào Cùng ra (All-in All-out)',
    fileName: 'SOP_03_Ve_sinh_Tieu_doc_All_in_All_out.pdf',
    fileType: 'pdf',
    category: 'Kỹ thuật Chuồng nuôi',
    uploadDate: '2026-08-05',
    fileSize: '4.8 MB',
    uploaderName: 'Phòng Kỹ Thuật Chăn Nuôi',
    description: 'Quy trình làm trống chuồng, xịt rửa áp lực cao, quét vôi, phun sát trùng 3 lần và quét mẫu test PCR kiểm tra virus ASF trước khi nhập đàn mới.',
    tags: ['All-in All-out', 'Trống chuồng 14 ngày', 'Quét vôi', 'Test PCR'],
    isOfficial: true,
    version: 'v4.0 - 2026',
    contentText: `QUY TRÌNH VỆ SINH TIÊU ĐỘC CHUỒNG TRẠI VÀ THỜI GIAN TRỐNG CHUỒNG
MÃ HIỆU: SOP-ATSH-03

1. NGUYÊN TẮC CÙNG VÀO - CÙNG RA (ALL-IN ALL-OUT):
- Sau khi xuất bán toàn bộ lứa heo, dãy chuồng phải được dọn sạch phân, chất độn và thức ăn thừa trong vòng **24 giờ**.
- Ngâm nước làm mềm bề mặt sàn, tường và thanh chắn trong **12 giờ**.

2. QUY TRÌNH VỆ SINH 5 BƯỚC:
- Bước 1: Rửa xà phòng xút (NaOH 1%) để tẩy rửa màng sinh học bám trên tấm đan và máng ăn.
- Bước 2: Xịt rửa nước nóng áp lực cao (70°C) loại bỏ hoàn toàn cặn bẩn.
- Bước 3: Quét nước vôi tôi nồng độ **10-20%** toàn bộ tường chuồng và lối đi.
- Bước 4: Phun sát trùng luân phiên (Virkon S 1% hoặc Formol 2%) toàn bộ không gian chuồng, để khô tự nhiên.
- Bước 5: Niêm phong chuồng và quét mẫu môi trường gửi phòng Lab xét nghiệm Realtime PCR (ASF, PRRS, PED).

3. THỜI GIAN TRỐNG CHUỒNG BẮT BUỘC:
- Thời gian trống chuồng tối thiểu: **14 ngày** (đối với chuồng an toàn bình thường) và **21 ngày** (đối với chuồng vừa xử lý ổ dịch).`,
  },
  {
    id: 'doc-sop-04',
    title: 'SOP 04: Sổ tay Nhận biết & Ứng phó Dịch tả heo Châu Phi (ASF) & Tai xanh (PRRS)',
    fileName: 'SOP_04_Ung_pho_Dich_ASF_PRRS.docx',
    fileType: 'docx',
    category: 'Thú Y & Dịch Bệnh',
    uploadDate: '2026-08-07',
    fileSize: '1.9 MB',
    uploaderName: 'Ban Thú Y Trung Tâm',
    description: 'Cẩm nang chẩn đoán lâm sàng, sơ đồ phản ứng nhanh khi phát hiện heo sốt cao, xuất huyết tai bụng và quy trình cô lập ô chuồng.',
    tags: ['ASF', 'PRRS', 'Sốt cao', 'Xuất huyết', 'Cô lập 24h'],
    isOfficial: true,
    version: 'v3.5 - 2026',
    contentText: `CẨM NANG HƯỚNG DẪN ỨNG PHÓ DỊCH TẢ HEO CHÂU PHI (ASF)
MÃ HIỆU: SOP-ATSH-04

1. TRIỆU CHỨNG ĐẶC TRƯNG CỦA ASF:
- Heo sốt cao li bì **40.5°C - 42°C**, lười vận động, túm tụm một góc.
- Da ửng đỏ, xuất huyết dạng vết bầm tím ở tai, đuôi, bụng, ngực và 4 chân.
- Nôn mửa, tiêu chảy có lẫn máu, chết đột ngột với tỷ lệ tử vong lên đến **100%**.

2. QUY TRÌNH XỬ LÝ KHẨN CẤP KHI PHÁT HIỆN HEO BỆNH NGHI NGỜ:
- Bước 1: Lập tức bấm chuông báo động ATSH cấp độ Đỏ, dừng mọi hoạt động di chuyển heo giữa các dãy chuồng.
- Bước 2: Bác sĩ Thú y mặc bảo hộ cấp 4 lấy mẫu máu/phủ tạng để chạy PCR nhanh tại trạm kiểm định.
- Bước 3: Rắc vôi bột dày **2-3cm** xung quanh ô chuồng có heo nghi nhiễm, ngâm khay sát trùng trước cửa chuồng với dung dịch thuốc đậm đặc.
- Bước 4: Tuyệt đối không bán tháo heo, không vứt xác heo ra nguồn nước ngoài môi trường. Báo cáo Chi cục Chăn nuôi Thú y địa phương trong vòng **2 giờ**.`,
  },
];

export const INITIAL_COURSES: TrainingCourse[] = [
  {
    id: 'course-1',
    title: 'Quy trình Sát trùng Cổng & Cách ly An toàn Sinh học 48h',
    category: 'Sát trùng & Cách ly Cổng',
    description: 'Khóa học bắt buộc cho 100% nhân viên mới và định kỳ hàng tháng cho toàn bộ nhân sự trang trại heo.',
    durationMinutes: 25,
    level: 'Cơ bản',
    format: 'slides',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80',
    requiredForDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'],
    completedCount: 112,
    slides: [
      {
        id: 's1',
        title: 'Tầm quan trọng của Vành đai ATSH Cổng Trại',
        subtitle: 'Bảo vệ đàn heo trước đại dịch ASF và PRRS',
        diagramType: 'zones',
        bulletPoints: [
          'Virus ASF có thể tồn tại trong máu, thịt đông lạnh và bùn đất nhiều tháng.',
          'Con người và phương tiện là đường lây truyền cơ học nguy hiểm nhất.',
          'Vành đai cổng là chốt chặn sinh tử đầu tiên quyết định sự an toàn của đàn heo.',
        ],
        speakerNotes: 'Kính chào các anh chị. Cổng trại là phòng tuyến số 1. Chỉ cần 1 hạt bụi mang virus ASF lọt qua cổng, toàn bộ đàn heo hàng nghìn con có thể bị tiêu hủy.',
        quizQuickCheck: {
          id: 'sc-q1',
          question: 'Con đường nào sau đây là nguy cơ lây truyền mầm bệnh cơ học nguy hiểm nhất vào trại heo?',
          options: ['Qua chim di cư bay trên trời', 'Qua con người, phương tiện và đồ dùng cá nhân chưa sát trùng', 'Qua ánh sáng mặt trời', 'Qua cây xanh quanh hàng rào'],
          correctIndex: 1,
          explanation: 'Con người, giày dép và phương tiện vận chuyển mang mầm bệnh từ ngoài là nguyên nhân hàng đầu làm bùng phát dịch ASF.',
        },
      },
      {
        id: 's2',
        title: 'Quy chuẩn Cách ly Ngoại vi 48 Giờ',
        subtitle: 'Thời gian vàng làm sạch cơ thể',
        diagramType: 'barrier',
        bulletPoints: [
          'Tất cả nhân sự trước khi vào vùng lõi sản xuất phải ở phòng cách ly tối thiểu **48 giờ**.',
          'Không tiếp xúc với bất kỳ sản phẩm thịt heo nào từ bên ngoài.',
          'Kiểm tra thân nhiệt, khai báo y tế và lịch trình di chuyển trong 7 ngày qua.',
        ],
        speakerNotes: 'Thời gian 48h giúp đảm bảo bất kỳ mầm bệnh bám dính trên bề mặt da hay trang phục được đào thải và làm sạch hoàn toàn.',
        quizQuickCheck: {
          id: 'sc-q2',
          question: 'Thời gian cách ly bắt buộc tối thiểu đối với nhân viên trước khi vào vùng sản xuất là bao lâu?',
          options: ['12 giờ', '24 giờ', '48 giờ', '6 giờ'],
          correctIndex: 2,
          explanation: 'Quy định ATSH cấp cao yêu cầu cách ly tối thiểu 48 giờ tại khu cách ly ngoại vi.',
        },
      },
      {
        id: 's3',
        title: 'Quy trình Tắm Sát trùng 3 Bước Ngăn Cách',
        subtitle: 'Quy tắc một chiều không quay đầu',
        diagramType: 'disinfection',
        bulletPoints: [
          'Khu Đỏ (Bẩn): Bỏ toàn bộ tư trang, quần áo cá nhân vào tủ.',
          'Buồng Tắm: Tắm gội toàn thân bằng xà phòng diệt khuẩn trong **10 phút**.',
          'Khu Xanh (Sạch): Mặc đồ bảo hộ trang trại đã tiệt trùng và đi ủng trại.',
        ],
        speakerNotes: 'Nhà tắm được thiết kế 1 chiều. Không bao giờ được mang dép hoặc quần áo từ khu bẩn bước thẳng sang khu sạch.',
        quizQuickCheck: {
          id: 'sc-q3',
          question: 'Thời gian tắm gội xà phòng sát trùng bắt buộc trong buồng tắm ngăn cách là bao lâu?',
          options: ['1 - 2 phút', 'Tối thiểu 10 phút', '30 phút', 'Tùy ý'],
          correctIndex: 1,
          explanation: 'Nhân viên phải tắm gội kỹ lưỡng với xà phòng diệt khuẩn trong tối thiểu 10 phút để loại bỏ vi khuẩn, virus.',
        },
      },
      {
        id: 's4',
        title: 'Khử trùng Điện thoại & Vật dụng Cá nhân bằng UV-C',
        subtitle: 'Tiêu diệt 99.9% mầm bệnh vô hình',
        diagramType: 'flowchart',
        bulletPoints: [
          'Điện thoại, chìa khóa, đồng hồ phải đặt vào **Buồng chiếu UV-C tối thiểu 30 phút**.',
          'Không mang túi xách da, áo khoác ngoài từ khu dân cư vào khu chuồng nuôi.',
          'Nghiêm cấm mang thức ăn nấu chín có thịt heo vào trại.',
        ],
        speakerNotes: 'Bề mặt màn hình điện thoại là nơi tích tụ nhiều vi khuẩn nhất. Phải qua buồng UV 30 phút trước khi sử dụng.',
        quizQuickCheck: {
          id: 'sc-q4',
          question: 'Vật dụng cá nhân như điện thoại, chìa khóa phải được xử lý trong buồng chiếu UV-C bao lâu?',
          options: ['5 phút', '10 phút', 'Tối thiểu 30 phút', 'Không cần chiếu'],
          correctIndex: 2,
          explanation: 'Thời gian chiếu xạ tia cực tím UV-C tối thiểu 30 phút đảm bảo phá vỡ cấu trúc DNA/RNA của virus.',
        },
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Video Đào tạo: Kỹ thuật Sát trùng Phương tiện Xe Tải Cám & Xe Vận chuyển Heo',
    category: 'Kiểm soát Phương tiện & Vật tư',
    description: 'Video trực quan hướng dẫn kỹ thuật xịt rửa gầm xe, phun sương sát trùng áp lực cao và quy trình cầu xuất heo.',
    durationMinutes: 18,
    level: 'Cơ bản',
    format: 'video',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Demo placeholder link
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    requiredForDepartments: ['dept-2', 'dept-5', 'dept-6'],
    completedCount: 84,
    videoChapters: [
      { time: '00:00', title: 'Giới thiệu nguy cơ dịch bệnh từ xe tải', note: 'Phân tích các ổ dịch bắt nguồn từ xe mua bán heo thương lái' },
      { time: '04:15', title: 'Quy trình xịt rửa gầm và bánh xe áp lực 150 bar', note: 'Tẩy sạch bùn đất trước khi phun hóa chất sát trùng' },
      { time: '09:30', title: 'Tỷ lệ pha dung dịch Cloramin B và Virkon 2%', note: 'Hướng dẫn đo đếm và kiểm tra nồng độ pH dung dịch' },
      { time: '14:20', title: 'Quy định cầu xuất bán heo một chiều', note: 'Tài xế tuyệt đối không bước qua vạch sơn đỏ ranh giới' },
    ],
    quickQuizzes: [
      {
        id: 'vq-1',
        question: 'Áp lực nước tối thiểu khi xịt rửa bùn đất bám ở bánh và gầm xe tải là bao nhiêu?',
        options: ['20 bar', '50 bar', '150 bar', '500 bar'],
        correctIndex: 2,
        explanation: 'Áp lực 150 bar giúp bóc tách các mảng bùn đất khô cứng chứa virus bám chặt dưới gầm xe.',
      },
      {
        id: 'vq-2',
        question: 'Tại khu vực cầu xuất heo, tài xế xe tải bên ngoài có được phép bước vào khuôn viên trại không?',
        options: ['Được vào nếu có đeo khẩu trang', 'Tuyệt đối không được bước qua vạch sơn ranh giới an toàn', 'Được vào nếu tắm sơ qua', 'Được vào tự do'],
        correctIndex: 1,
        explanation: 'Tài xế bên ngoài tuyệt đối không được bước vào đất trại; heo được lùa 1 chiều qua cầu xuất trung gian.',
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Thực hành Tình huống: Xử lý Khẩn cấp khi Phát hiện Nghi ngờ Dịch bệnh trong Chuồng',
    category: 'Thú Y & Dịch Bệnh',
    description: 'Rèn luyện phản xạ và quy trình cô lập ô chuồng, lấy mẫu PCR, phun khử trùng khẩn cấp.',
    durationMinutes: 30,
    level: 'Nâng cao',
    format: 'interactive_scenario',
    thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80',
    requiredForDepartments: ['dept-2', 'dept-3', 'dept-4'],
    completedCount: 65,
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'Bài thi Chứng chỉ ATSH Cấp 1: Tiêu chuẩn Sát trùng & Kiểm soát Cổng',
    description: 'Kỳ thi đánh giá năng lực bắt buộc trước khi nhận ca làm việc tại trang trại heo. Đạt từ 80/100 điểm để được cấp chứng nhận ATSH.',
    category: 'Sát trùng & Cách ly Cổng',
    durationMinutes: 15,
    passingScore: 80,
    targetFarms: ['farm-1', 'farm-2', 'farm-3', 'farm-4'],
    targetDepartments: ['dept-1', 'dept-2', 'dept-3', 'dept-4', 'dept-5', 'dept-6'],
    totalAttempts: 142,
    averageScore: 88.5,
    questions: [
      {
        id: 'ex-q1',
        question: 'Thời gian cách ly bắt buộc tối thiểu đối với người trước khi vào vùng sản xuất là bao lâu?',
        options: ['12 giờ', '24 giờ', '48 giờ', '8 giờ'],
        correctIndex: 2,
        explanation: 'Quy định ATSH cấp cao yêu cầu cách ly tối thiểu 48 giờ và không tiếp xúc với heo hoặc nguồn thịt heo ngoài trại.',
      },
      {
        id: 'ex-q2',
        question: 'Quy trình tắm sát trùng 3 bước tại nhà tắm ngăn cách yêu cầu thời gian tắm xà phòng tối thiểu là bao nhiêu?',
        options: ['2 phút', '5 phút', '10 phút', '20 phút'],
        correctIndex: 2,
        explanation: 'Nhân viên phải tắm gội kỹ lưỡng với xà phòng diệt khuẩn tối thiểu 10 phút.',
      },
      {
        id: 'ex-q3',
        question: 'Vật dụng cá nhân, tài liệu được phép mang vào trại phải qua buồng xử lý nào?',
        options: ['Buồng rửa nước lạnh', 'Buồng chiếu tia UV-C tối thiểu 30 phút', 'Để khô ngoài trời 15 phút', 'Phun cồn sơ qua'],
        correctIndex: 1,
        explanation: 'Tia UV-C hoặc khí Ozone trong 30-45 phút có tác dụng phá hủy màng virus bám trên bề mặt thiết bị.',
      },
      {
        id: 'ex-q4',
        question: 'Nồng độ dung dịch thuốc sát trùng Virkon S thường được sử dụng để phun phòng chuồng trại là bao nhiêu?',
        options: ['0.1%', '1%', '10%', '20%'],
        correctIndex: 1,
        explanation: 'Nồng độ chuẩn của Virkon S là 1% (100g pha với 10 lít nước) cho hiệu quả diệt khuẩn tối ưu.',
      },
      {
        id: 'ex-q5',
        question: 'Phương tiện vận chuyển cám/heo trước khi vào khu đệm của trang trại phải đáp ứng yêu cầu nào?',
        options: ['Chỉ cần rửa sạch bùn đất', 'Chạy qua hố sát trùng và phun sát trùng áp lực cao toàn bộ thân vỏ, gầm xe', 'Không cần sát trùng nếu xe mới', 'Chỉ cần sát trùng nóc xe'],
        correctIndex: 1,
        explanation: 'Xe vận chuyển phải dừng tại cổng ngoài, rửa sạch bụi đất, phun khử trùng toàn diện thân vỏ, gầm xe và lưu lại buồng sát trùng 15-30 phút.',
      },
      {
        id: 'ex-q6',
        question: 'Theo nguyên tắc Cùng vào Cùng ra (All-in All-out), thời gian trống chuồng tối thiểu sau khi vệ sinh tiêu độc là bao lâu?',
        options: ['3 ngày', '7 ngày', '14 ngày', '30 ngày'],
        correctIndex: 2,
        explanation: 'Thời gian trống chuồng tiêu chuẩn là 14 ngày để đảm bảo chuồng khô ráo và tiêu diệt hoàn toàn mầm bệnh còn sót lại.',
      },
      {
        id: 'ex-q7',
        question: 'Khi phát hiện heo có dấu hiệu sốt cao 41°C, xuất huyết tím ở tai và bụng, hành động đầu tiên cần làm là gì?',
        options: ['Tự ý tiêm kháng sinh liều cao', 'Báo động ATSH, cô lập ô chuồng và báo ngay cho Bác sĩ Thú y', 'Bán tháo các con heo xung quanh', 'Đưa heo ra khỏi chuồng tắm nước lạnh'],
        correctIndex: 1,
        explanation: 'Lập tức báo động và cô lập ô chuồng để ngăn chặn mầm bệnh lây lan qua giọt bắn và người chăm sóc.',
      },
      {
        id: 'ex-q8',
        question: 'Thực phẩm nào sau đây TUYỆT ĐỐI BỊ CẤM mang vào khu vực trang trại chăn nuôi?',
        options: ['Rau củ quả tươi đã rửa sạch', 'Thịt heo, giò chả, lạp xưởng và tất cả các sản phẩm chế biến từ heo', 'Gạo và mì gói', 'Sữa chua và phô mai'],
        correctIndex: 1,
        explanation: 'Thịt heo bên ngoài có thể mang virus ASF sống sót qua nhiều tháng đông lạnh hoặc ướp muối, tuyệt đối cấm mang vào trại.',
      },
    ],
  },
  {
    id: 'exam-2',
    title: 'Khảo sát & Kiểm tra Trực tuyến qua Google Form (Mẫu Đánh giá Định kỳ)',
    description: 'Biểu mẫu Google Form tích hợp trực tiếp để đánh giá nhận thức an toàn sinh học của công nhân tại các trại.',
    category: 'Đánh giá Nhận thức & Tuân thủ',
    isGoogleForm: true,
    googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfD_demo_form_atsh_pigfarm/viewform?embedded=true',
    durationMinutes: 20,
    passingScore: 80,
    targetFarms: ['farm-1', 'farm-2', 'farm-3'],
    targetDepartments: ['dept-3', 'dept-4', 'dept-5'],
    totalAttempts: 76,
    averageScore: 91.2,
    questions: [],
  },
];

export const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: 'att-1',
    examId: 'exam-1',
    examTitle: 'Bài thi Chứng chỉ ATSH Cấp 1',
    staffId: 'staff-1',
    staffName: 'Nguyễn Văn Thắng',
    staffCode: 'NV-001',
    departmentName: 'Ban Quản Lý & Điều Hành Trại',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    score: 8,
    maxScore: 8,
    percentage: 100,
    passed: true,
    completedAt: '2026-08-01 14:30',
    certificateId: 'CERT-ATSH-2026-001',
    answers: [],
  },
  {
    id: 'att-2',
    examId: 'exam-1',
    examTitle: 'Bài thi Chứng chỉ ATSH Cấp 1',
    staffId: 'staff-2',
    staffName: 'Phan Thị Mai Lan',
    staffCode: 'NV-002',
    departmentName: 'Thú Y & Kiểm Soát ATSH Dịch Bệnh',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    score: 8,
    maxScore: 8,
    percentage: 100,
    passed: true,
    completedAt: '2026-08-05 09:15',
    certificateId: 'CERT-ATSH-2026-002',
    answers: [],
  },
  {
    id: 'att-3',
    examId: 'exam-1',
    examTitle: 'Bài thi Chứng chỉ ATSH Cấp 1',
    staffId: 'staff-3',
    staffName: 'Lê Văn Quyết',
    staffCode: 'NV-003',
    departmentName: 'Bảo Vệ, Cổng Khử Trùng & Nhà Cách Ly',
    farmName: 'Trang trại Heo Giống Cụ Kỵ GreenFarm 1',
    score: 7,
    maxScore: 8,
    percentage: 87.5,
    passed: true,
    completedAt: '2026-08-08 16:40',
    certificateId: 'CERT-ATSH-2026-003',
    answers: [],
  },
  {
    id: 'att-4',
    examId: 'exam-1',
    examTitle: 'Bài thi Chứng chỉ ATSH Cấp 1',
    staffId: 'staff-6',
    staffName: 'Bùi Thị Bích Ngọc',
    staffCode: 'NV-006',
    departmentName: 'Kho Cám, Dược Phẩm & Xử Lý Phân',
    farmName: 'Trang trại Heo Thịt Thương Phẩm Agro 3',
    score: 5,
    maxScore: 8,
    percentage: 62.5,
    passed: false,
    completedAt: '2026-08-09 11:20',
    answers: [],
  },
];

export const INITIAL_SCENARIOS: FarmScenario[] = [
  {
    id: 'scen-1',
    title: 'Tình huống 1: Xe chở cám vượt quy trình sát trùng gầm xe',
    description: 'Vào lúc 09:30 sáng, một xe tải chở 15 tấn cám đến cổng trại Mekong Farm 2. Do trời sắp mưa và tài xế vội giao hàng, tài xế chỉ rửa qua 4 bánh xe và xin nhân viên bảo vệ cho vào thẳng khu đệm hạ hàng mà chưa thực hiện phun sát trùng áp lực cao toàn bộ thân vỏ và gầm xe trong 15 phút.',
    department: 'Bảo Vệ, Cổng Khử Trùng & Nhà Cách Ly',
    riskLevel: 'Rất cao',
    violations: [
      'Bỏ qua bước phun sát trùng áp lực cao toàn bộ gầm và thùng xe',
      'Không tuân thủ thời gian chờ thuốc sát trùng ngấm tối thiểu 15-30 phút',
      'Bảo vệ lỏng lẻo trong giám sát cổng an ninh sinh học',
    ],
    correctSteps: [
      '1. Yêu cầu xe dừng lại tại hố sát trùng ngoại vi ngoài hàng rào trại',
      '2. Xịt rửa áp lực cao 150 bar toàn bộ bùn đất bám ở gầm bánh xe',
      '3. Phun đều dung dịch sát trùng nồng độ 2% toàn bộ bề mặt xe',
      '4. Giữ xe trong buồng sát trùng đủ thời gian quy định (tối thiểu 15 phút)',
      '5. Tài xế phải thay ủng và đồ bảo hộ của trại trước khi bước xuống xe',
    ],
    question: 'Nếu là Quản lý trang trại trực ca, bạn sẽ xử lý tình huống này và xử phạt/đào tạo lại nhân sự liên quan như thế nào?',
  },
  {
    id: 'scen-2',
    title: 'Tình huống 2: Công nhân mang đồ ăn cá nhân có thịt nguội vào khu chuồng nái',
    description: 'Trong giờ nghỉ trưa, một công nhân chuồng nái mang theo một ổ bánh mì kẹp chả lụa mua ở chợ dân sinh bên ngoài vào phòng nghỉ nội bộ của dãy chuồng để ăn cùng đồng nghiệp.',
    department: 'Kỹ Thuật Chuồng Nái & Heo Con',
    riskLevel: 'Cực kỳ nghiêm trọng',
    violations: [
      'Mang thực phẩm chế biến từ thịt heo từ ngoài vào khuôn viên chăn nuôi',
      'Ăn uống trực tiếp tại phòng đệm tiếp giáp dãy chuồng nái',
      'Vi phạm nghiêm trọng cam kết ATSH và lệnh cấm nguồn thịt bên ngoài',
    ],
    correctSteps: [
      '1. Lập tức thu hồi và tiêu hủy toàn bộ thực phẩm bằng lò đốt tiệt trùng hoặc hóa chất',
      '2. Phun khử trùng Cloramin B toàn bộ khu vực phòng nghỉ và hành lang chuồng',
      '3. Yêu cầu công nhân tắm sát trùng lại toàn thân và thay đồ bảo hộ mới',
      '4. Lập biên bản đình chỉ tạm thời để xét nghiệm PCR và tái đào tạo ATSH',
    ],
    question: 'Tại sao việc mang thịt heo bên ngoài vào trại bị xếp vào mức độ Rủi ro Cực kỳ nghiêm trọng?',
  },
];
