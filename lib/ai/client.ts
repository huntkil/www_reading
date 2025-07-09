// AIClient 비활성화: 실제 OpenAI 코드 제거

interface AnalysisResult {
  summary: string;
  keywords: string[];
  [key: string]: unknown;
}

interface PlanResult {
  title: string;
  steps: string[];
  [key: string]: unknown;
}

interface RecommendationResult {
  items: { title: string }[];
  [key: string]: unknown;
}

export const aiClient = {
  analyze: async (): Promise<AnalysisResult> => {

    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    return { summary: 'Analysis complete.', keywords: ['test', 'analysis'] };
  },
  personalize: async (): Promise<PlanResult> => {

    await new Promise(res => setTimeout(res, 500));
    return { title: 'Personalized Plan', steps: ['Step 1', 'Step 2'] };
  },
  recommend: async (): Promise<RecommendationResult> => {

    await new Promise(res => setTimeout(res, 500));
    return { items: [{ title: 'Recommended Article' }, { title: 'Another one' }] };
  },
}; 