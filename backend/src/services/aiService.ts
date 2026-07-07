import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import prisma from '../config/db';

export interface AIProvider {
  askQuestion(query: string): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenerativeAI | null = null;
  
  constructor() {
    const key = env.GEMINI_API_KEY;
    if (key) {
      console.log(`[AI] Gemini API key detected (${key.substring(0, 6)}...${key.substring(key.length - 4)})`);
      this.ai = new GoogleGenerativeAI(key);
    } else {
      console.warn('[AI] WARNING: No GEMINI_API_KEY found in environment. AI Assistant will not work.');
    }
  }

  async askQuestion(query: string): Promise<string> {
    if (!this.ai) {
      throw new Error('MISSING_API_KEY: The GEMINI_API_KEY environment variable is not set. Please add it to your .env file or Vercel environment variables.');
    }

    // Use gemini-2.0-flash — the current recommended fast model
    const model = this.ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // RAG approach: fetch DB stats to provide context so it doesn't hallucinate
    let totalStudents = 0, totalCourses = 0, allocatedCount = 0, unallocatedCount = 0;
    try {
      [totalStudents, totalCourses, allocatedCount, unallocatedCount] = await Promise.all([
        prisma.student.count(),
        prisma.course.count(),
        prisma.student.count({ where: { status: 'ALLOCATED' } }),
        prisma.student.count({ where: { status: 'REJECTED' } })
      ]);
    } catch (dbErr) {
      console.warn('[AI] Could not fetch DB stats for context:', dbErr);
    }

    const context = `
    You are an AI Assistant for a University Course Allocation System.
    Current Database Statistics:
    - Total Students: ${totalStudents}
    - Total Courses: ${totalCourses}
    - Allocated Students: ${allocatedCount}
    - Unallocated (Rejected) Students: ${unallocatedCount}
    
    Answer the user's question accurately based on this context. Do not hallucinate.
    `;

    const prompt = `${context}\n\nUser Question: ${query}`;
    
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error('[AI] Generation Error:', error?.status, error?.message);
      
      const status = error?.status || error?.response?.status || error?.code;
      
      if (status === 401 || error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('401')) {
        throw new Error('INVALID_API_KEY: The provided Gemini API key is invalid. Please check your API key in Settings.');
      }
      if (status === 403 || error?.message?.includes('PERMISSION_DENIED') || error?.message?.includes('403')) {
        throw new Error('PERMISSION_DENIED: The API key does not have permission to use this model. Check your Google Cloud project settings.');
      }
      if (status === 404 || error?.message?.includes('not found') || error?.message?.includes('404')) {
        throw new Error('MODEL_NOT_FOUND: The AI model "gemini-2.0-flash" is not available. This may be a regional restriction.');
      }
      if (status === 429 || error?.message?.includes('RATE_LIMIT') || error?.message?.includes('429')) {
        throw new Error('RATE_LIMITED: Too many AI requests. Please wait a moment and try again.');
      }
      
      throw new Error(`AI_ERROR: ${error?.message || 'Unknown error occurred while generating response.'}`);
    }
  }
}

// Factory for easy swapping to OpenAI later
export const getAIProvider = (): AIProvider => {
  return new GeminiProvider();
};
