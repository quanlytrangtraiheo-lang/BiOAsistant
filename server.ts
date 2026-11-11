import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy/safe initialization for Gemini
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. AI features will fallback to smart template engine.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ATSH_SYSTEM_INSTRUCTION = `
VAI TRÒ VÀ MỤC TIÊU:
Bạn là ATSH Assistant – Chuyên gia giảng dạy và kiểm tra quy trình An toàn Sinh học (ATSH) trong chăn nuôi heo và gia súc. Nhiệm vụ của bạn là hỗ trợ người dùng học tập, tra cứu và tự kiểm tra kiến thức dựa trên tài liệu quy trình ATSH.

NGUYÊN TẮC HOẠT ĐỘNG (GROUNDING RULES):
1. Trung thực với tài liệu ATSH chuẩn:
   - Các quy định sát trùng, khử trùng (nồng độ Virkon 1%, Cloramin B 2%, Formalin, Cồn 70%...).
   - Thời gian cách ly bắt buộc đối với người trước khi vào trại (tối thiểu 48h - 72h không tiếp xúc heo/thịt heo bên ngoài).
   - Quy trình tắm gội sát trùng 3 bước qua nhà tắm ngăn cách (Khu vực bẩn -> Tắm gội xà phòng/nước ấm 10 phút -> Khu vực sạch thay đồ bảo hộ trại).
   - Quy trình sát trùng phương tiện (xe cám, xe phân, xe chở heo): Dừng tại hố sát trùng ngoài cổng, phun thuốc sát trùng áp lực cao toàn bộ thân vỏ và gầm xe, sấy nhiệt buồng sát trùng 15-30 phút.
   - Kiểm soát vật tư, thực phẩm mang vào trại: Phải qua buồng chiếu tia cực tím (UV-C) tối thiểu 30-45 phút hoặc buồng xông khí Ozone, tuyệt đối cấm mang thịt heo và các sản phẩm từ heo từ ngoài vào.
   - Quản lý dịch bệnh nguy hiểm: Dịch tả heo Châu Phi (ASF), PRRS (Tai xanh), Lở mồm long móng (FMD), Dịch tả cổ điển (CSF), Tiêu chảy cấp (PED).
   - Quy trình vùng đệm: Hàng rào 2 lớp, rãnh vôi bột, bẫy ruồi muỗi chuột bọ, hố rải vôi sát trùng trước cửa mỗi dãy chuồng.
2. Tránh mơ hồ: Nếu câu hỏi không liên quan hoặc không có trong quy trình ATSH, hãy trả lời rõ ràng: "Nội dung này chưa được quy định trong tài liệu ATSH hiện tại."
3. Thái độ: Chuyên nghiệp, nghiêm túc, khuyến khích tính tuân thủ tuyệt đối quy trình để bảo vệ đàn heo.

CÁC CHẾ ĐỘ HOẠT ĐỘNG:
- Chế độ Tra cứu & Giải đáp (Query Mode): Tóm tắt ngắn gọn, các bước (1, 2, 3...), bôi đậm các thông số quan trọng (ví dụ: **thời gian cách ly 48h**, **nồng độ pha 2%**, **chiếu UV 30 phút**).
- Chế độ Kiểm tra Trắc nghiệm (Quiz Mode): Đưa câu hỏi gồm 4 lựa chọn (A, B, C, D), đợi người học trả lời xong mới đưa ra đáp án và giải thích chi tiết.
- Chế độ Tình huống Thực tế (Scenario Mode): Đưa ra tình huống vi phạm quy trình ATSH thực tế, yêu cầu chỉ ra điểm sai, mức độ rủi ro (Cao/Nghiêm trọng/Trung bình) và các bước khắc phục đúng quy trình.

ĐỊNH DẠNG ĐẦU RA:
- Tiếng Việt chuẩn mực, rõ ràng, gạch đầu dòng hoặc bảng biểu.
- Cuối mỗi phản hồi, chủ động gợi ý bước tiếp theo (Ví dụ: "Bạn có muốn làm thử câu hỏi tình huống về quy trình này không?").
`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 1. Chat with ATSH Assistant
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], mode = 'query', documentContext = '' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `[Chế độ Cố vấn ATSH Offline]
Dựa trên quy trình An toàn Sinh học (ATSH) chăn nuôi:
1. **Quy tắc cách ly**: Tất cả nhân sự và khách thăm bắt buộc cách ly tối thiểu **48 giờ** và không tiếp xúc với heo/thịt heo bên ngoài.
2. **Quy trình qua cổng**: Thay dép, tắm sát trùng 3 bước với xà phòng trong **10 phút**, mặc quần áo bảo hộ chuyên dụng của trại.
3. **Sát trùng vật tư**: Toàn bộ đồ dùng cá nhân, điện thoại phải để lại phòng cách ly hoặc qua buồng khử trùng tia cực tím **UV-C trong 30 phút**.
4. **Kiểm soát phương tiện**: Phun sát trùng thuốc nồng độ **2%** toàn bộ xe và gầm xe, thời gian nghỉ tối thiểu **15 phút** trước khi vào khu đệm.

*Gợi ý tiếp theo:* Bạn có muốn làm bài trắc nghiệm nhanh 3 câu về quy trình sát trùng cổng không?`,
      });
    }

    let modePrompt = '';
    if (mode === 'quiz') {
      modePrompt = '\nNgười dùng đang ở CHẾ ĐỘ KIỂM TRA TRẮC NGHIỆM. Hãy kiểm tra kiến thức của họ qua câu hỏi hoặc chấm câu trả lời trước đó kèm giải thích theo tài liệu.';
    } else if (mode === 'scenario') {
      modePrompt = '\nNgười dùng đang ở CHẾ ĐỘ TÌNH HUỐNG THỰC TẾ. Hãy đưa ra hoặc phân tích tình huống vi phạm ATSH, chỉ rõ nguy cơ lây nhiễm mầm bệnh (ASF/PRRS/FMD) và giải pháp khắc phục triệt để.';
    } else {
      modePrompt = '\nNgười dùng đang ở CHẾ ĐỘ TRA CỨU & GIẢI ĐÁP. Hãy giải đáp theo các bước 1, 2, 3 và bôi đậm thông số kỹ thuật quan trọng.';
    }

    const contextAddition = documentContext 
      ? `\n\nNỘI DUNG TÀI LIỆU ATSH THAM CHIẾU TỪ TRẠI:\n${documentContext.slice(0, 10000)}` 
      : '';

    const systemInstruction = ATSH_SYSTEM_INSTRUCTION + modePrompt + contextAddition;

    const formattedContents = [];
    for (const h of history) {
      formattedContents.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text || 'Không có phản hồi từ trợ lý.' });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý yêu cầu AI' });
  }
});

// 2. Generate Quiz Questions from Document or Topic
app.post('/api/gemini/generate-quiz', async (req, res) => {
  try {
    const { topic, documentText, count = 3 } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        questions: [
          {
            id: 'q-default-1',
            question: 'Thời gian cách ly bắt buộc tối thiểu đối với công nhân, chuyên gia trước khi vào khu vực chăn nuôi heo là bao lâu?',
            options: ['12 giờ', '24 giờ', '48 giờ', '8 giờ'],
            correctIndex: 2,
            explanation: 'Theo quy định ATSH cấp độ cao, nhân sự phải cách ly tối thiểu 48 giờ và không tiếp xúc với heo hoặc nguồn thịt heo ngoài trại.',
            topic: topic || 'Quy trình Cách ly & Vào trại',
          },
          {
            id: 'q-default-2',
            question: 'Vật dụng cá nhân, tài liệu mang từ ngoài vào trại bắt buộc phải xử lý qua buồng nào?',
            options: ['Rửa xà phòng thông thường', 'Buồng chiếu tia cực tím UV-C tối thiểu 30 phút', 'Phun nước muối sinh lý', 'Để khô tự nhiên 10 phút'],
            correctIndex: 1,
            explanation: 'Mọi vật dụng cá nhân được phép mang vào phải qua buồng khử trùng chiếu tia cực tím UV-C hoặc xông Ozone tối thiểu 30-45 phút.',
            topic: topic || 'Kiểm soát Vật tư',
          },
          {
            id: 'q-default-3',
            question: 'Phương tiện vận chuyển cám/heo trước khi vào khu đệm của trang trại phải đáp ứng yêu cầu nào?',
            options: ['Chỉ cần rửa sạch bùn đất', 'Chạy qua hố sát trùng và phun sát trùng áp lực cao toàn bộ thân vỏ, gầm xe', 'Không cần sát trùng nếu xe mới mua', 'Chỉ cần sát trùng 4 bánh xe'],
            correctIndex: 1,
            explanation: 'Xe vận chuyển phải dừng tại cổng ngoài, rửa sạch bụi đất, phun khử trùng toàn diện thân vỏ, gầm xe và lưu lại buồng sát trùng 15-30 phút.',
            topic: topic || 'Kiểm soát Phương tiện',
          },
        ],
      });
    }

    const prompt = `Bạn là chuyên gia thẩm định An toàn sinh học (ATSH) trang trại chăn nuôi heo.
Hãy tạo ${count} câu hỏi trắc nghiệm chất lượng cao dựa trên chủ đề "${topic || 'Quy trình ATSH Trang trại'}" ${documentText ? `và tài liệu sau: ${documentText.slice(0, 8000)}` : ''}.
Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D), chỉ 1 đáp án đúng (correctIndex từ 0 đến 3), và kèm giải thích chi tiết trích dẫn quy trình.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              topic: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctIndex', 'explanation', 'topic'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ questions: parsed });
  } catch (error: any) {
    console.error('Quiz Gen Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Generate Interactive Farm Scenario
app.post('/api/gemini/generate-scenario', async (req, res) => {
  try {
    const { topic = 'An toàn sinh học cổng trại' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        scenario: {
          title: 'Tình huống xe chở cám vượt quy trình sát trùng gầm xe',
          description: 'Vào lúc 09:30 sáng, một xe tải chở 15 tấn cám đến cổng trại. Tài xế vội giao hàng nên chỉ rửa qua bánh xe và xin bảo vệ cho vào thẳng khu đệm hạ hàng mà chưa thực hiện phun sát trùng áp lực cao toàn bộ thân vỏ và gầm xe trong 15 phút.',
          department: 'Bảo vệ & Cổng khử trùng',
          riskLevel: 'Rất cao (Nguy cơ mang mầm virus Dịch tả heo Châu Phi ASF vào vùng đệm)',
          violations: [
            'Bỏ qua bước phun sát trùng áp lực cao toàn bộ gầm và thùng xe',
            'Không tuân thủ thời gian chờ thuốc sát trùng ngấm tối thiểu 15-30 phút',
            'Bảo vệ lỏng lẻo trong giám sát cổng an ninh sinh học',
          ],
          correctSteps: [
            '1. Yêu cầu xe dừng lại tại hố sát trùng ngoại vi ngoài hàng rào trại',
            '2. Xịt rửa áp lực cao toàn bộ bùn đất bám ở gầm bánh xe',
            '3. Phun đều dung dịch sát trùng nồng độ 1-2% toàn bộ bề mặt xe',
            '4. Giữ xe trong buồng sát trùng đủ thời gian quy định (tối thiểu 15 phút)',
            '5. Tài xế phải thay ủng và đồ bảo hộ của trại trước khi bước xuống xe',
          ],
          question: 'Nếu là Quản lý trang trại trực ca, bạn sẽ xử lý tình huống này và xử phạt/đào tạo lại nhân sự liên quan như thế nào?',
        },
      });
    }

    const prompt = `Tạo một tình huống thực tế về vi phạm quy trình An toàn Sinh học (ATSH) chăn nuôi heo theo chủ đề "${topic}".
Phân tích điểm sai, mức độ rủi ro đối với đàn heo và đưa ra các bước khắc phục chuẩn xác.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            department: { type: Type.STRING },
            riskLevel: { type: Type.STRING },
            violations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            question: { type: Type.STRING },
          },
          required: ['title', 'description', 'department', 'riskLevel', 'violations', 'correctSteps', 'question'],
        },
      },
    });

    const scenario = JSON.parse(response.text || '{}');
    res.json({ scenario });
  } catch (error: any) {
    console.error('Scenario Gen Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Generate Interactive Slides
app.post('/api/gemini/generate-slides', async (req, res) => {
  try {
    const { topic, contentSummary } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        slides: [
          {
            title: `Quy trình Chuẩn: ${topic || 'ATSH Trang trại Heo'}`,
            subtitle: 'Nguyên tắc Vàng bảo vệ đàn vật nuôi',
            bulletPoints: [
              'Cách ly tuyệt đối 3 vòng kiểm soát sinh học',
              'Sát trùng nhiệt độ và hóa chất đúng tiêu chuẩn',
              'Tuân thủ 100% quy định tắm gội và thay đồ bảo hộ',
            ],
            speakerNotes: 'Chào các anh chị nhân viên trang trại. Hôm nay chúng ta sẽ ôn luyện quy trình ATSH cốt lõi.',
            quizQuickCheck: {
              question: 'Nguyên tắc quan trọng nhất trong ATSH là gì?',
              options: ['Phun thuốc sát trùng khi rảnh', 'Cách ly triệt để và tuân thủ quy trình 100%', 'Chỉ tắm gội khi thấy bẩn', 'Không cần thay ủng'],
              correctIndex: 1,
            },
          },
        ],
      });
    }

    const prompt = `Tạo bộ slide bài giảng đào tạo ATSH chăn nuôi heo sinh động cho chủ đề "${topic}".
Nội dung tài liệu tóm tắt: ${contentSummary || 'Quy trình phòng chống dịch và kiểm soát an toàn sinh học trang trại heo'}.
Hãy tạo từ 3 đến 5 slide bài giảng. Mỗi slide có tiêu đề, phụ đề, 3-4 điểm cốt lõi, lời giảng viên (speakerNotes) và 1 câu hỏi trắc nghiệm nhanh kiểm tra tức thì (quizQuickCheck).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              bulletPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              speakerNotes: { type: Type.STRING },
              quizQuickCheck: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctIndex: { type: Type.INTEGER },
                },
                required: ['question', 'options', 'correctIndex'],
              },
            },
            required: ['title', 'subtitle', 'bulletPoints', 'speakerNotes', 'quizQuickCheck'],
          },
        },
      },
    });

    const slides = JSON.parse(response.text || '[]');
    res.json({ slides });
  } catch (error: any) {
    console.error('Slides Gen Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware for Frontend
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ATSH Training Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
