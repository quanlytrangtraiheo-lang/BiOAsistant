import { QuizQuestion, FarmScenario, SlideData } from '../types';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
  mode: 'query' | 'quiz' | 'scenario' = 'query',
  documentContext: string = ''
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, mode, documentContext }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Lỗi từ máy chủ AI');
    }
    const data = await res.json();
    return data.reply;
  } catch (error: any) {
    console.error('Chat error:', error);
    throw error;
  }
}

export async function generateQuizFromAI(
  topic: string,
  documentText?: string,
  count: number = 3
): Promise<QuizQuestion[]> {
  try {
    const res = await fetch('/api/gemini/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, documentText, count }),
    });
    if (!res.ok) {
      throw new Error('Không thể tạo câu hỏi trắc nghiệm');
    }
    const data = await res.json();
    return data.questions || [];
  } catch (error: any) {
    console.error('Gen Quiz error:', error);
    throw error;
  }
}

export async function generateScenarioFromAI(topic?: string): Promise<FarmScenario> {
  try {
    const res = await fetch('/api/gemini/generate-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) {
      throw new Error('Không thể tạo tình huống thực tế');
    }
    const data = await res.json();
    return data.scenario;
  } catch (error: any) {
    console.error('Gen Scenario error:', error);
    throw error;
  }
}

export async function generateSlidesFromAI(
  topic: string,
  contentSummary?: string
): Promise<SlideData[]> {
  try {
    const res = await fetch('/api/gemini/generate-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, contentSummary }),
    });
    if (!res.ok) {
      throw new Error('Không thể tạo slide bài giảng');
    }
    const data = await res.json();
    return data.slides || [];
  } catch (error: any) {
    console.error('Gen Slides error:', error);
    throw error;
  }
}
