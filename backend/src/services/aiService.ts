import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import prisma from '../config/db';

export interface AIProvider {
  askQuestion(query: string): Promise<string>;
}

export class GeminiProvider implements AIProvider {
  private ai: GoogleGenerativeAI | null = null;
  
  constructor() {
    if (env.GEMINI_API_KEY) {
      this.ai = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    }
  }

  async askQuestion(query: string): Promise<string> {
    if (!this.ai) {
      return "**Setup Required**: The AI Assistant requires a `GEMINI_API_KEY` environment variable. Please generate an API key from Google AI Studio and add it to your environment variables to enable this feature.";
    }

    const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // RAG approach: fetch DB stats to provide context so it doesn't hallucinate
    const [totalStudents, totalCourses, allocatedCount, unallocatedCount] = await Promise.all([
      prisma.student.count(),
      prisma.course.count(),
      prisma.student.count({ where: { status: 'ALLOCATED' } }),
      prisma.student.count({ where: { status: 'REJECTED' } })
    ]);

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
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

// Factory or DI for easy swapping to OpenAI later
export const getAIProvider = (): AIProvider => {
  return new GeminiProvider();
};
