import { useLocalStorage } from './use-local-storage';

interface PerformanceData {
  completionTimes: number[];
  successRate: number;
  lastDifficulty: number;
  studyPattern: {
    morningRate: number;
    afternoonRate: number;
    eveningRate: number;
  };
}

interface AIInsight {
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: number;
  category: 'performance' | 'pattern' | 'suggestion';
}

const INITIAL_PERFORMANCE: PerformanceData = {
  completionTimes: [],
  successRate: 0.8,
  lastDifficulty: 1,
  studyPattern: {
    morningRate: 0.3,
    afternoonRate: 0.4,
    eveningRate: 0.3,
  }
};

const INSIGHT_MESSAGES = {
  performance: {
    excellent: [
      "Your quick grasp of concepts suggests you're ready for advanced material!",
      "Outstanding progress! Consider taking on more challenging courses.",
      "Your learning efficiency is remarkably high - great work!",
    ],
    good: [
      "You're maintaining a steady and effective learning pace.",
      "Your consistent effort is showing great results!",
      "Keep up this balanced approach to learning.",
    ],
    needs_improvement: [
      "Taking more time with fundamentals might help build confidence.",
      "Consider reviewing prerequisites before moving forward.",
      "Breaking down complex topics into smaller parts could help.",
    ],
  },
  pattern: {
    morning: "You show peak performance in morning sessions. Schedule challenging topics then!",
    afternoon: "Afternoon study sessions seem most productive for you.",
    evening: "Your evening learning sessions show great focus.",
  },
  suggestion: [
    "Based on your pace, try completing the next course within 3 days.",
    "Your learning style suggests you'd excel in project-based courses.",
    "Consider taking short breaks between modules to maintain high performance.",
  ],
};

export function useAIAdaptation() {
  const [performance, setPerformance] = useLocalStorage<PerformanceData>(
    'ai-performance',
    INITIAL_PERFORMANCE
  );
  const [insights, setInsights] = useLocalStorage<AIInsight[]>('ai-insights', []);

  const addCompletionTime = (time: number) => {
    const newTimes = [...performance.completionTimes, time].slice(-10);
    const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;

    let newDifficulty = performance.lastDifficulty;
    if (avgTime < 30 && performance.successRate > 0.8) {
      newDifficulty = Math.min(3, newDifficulty + 0.2);
    } else if (avgTime > 90 || performance.successRate < 0.6) {
      newDifficulty = Math.max(0.5, newDifficulty - 0.2);
    }

    // Update study pattern based on current time
    const hour = new Date().getHours();
    const newPattern = { ...performance.studyPattern };
    if (hour < 12) newPattern.morningRate += 0.1;
    else if (hour < 18) newPattern.afternoonRate += 0.1;
    else newPattern.eveningRate += 0.1;

    const total = Object.values(newPattern).reduce((a, b) => a + b, 0);
    Object.keys(newPattern).forEach(key => {
      newPattern[key as keyof typeof newPattern] /= total;
    });

    const newInsight: AIInsight = {
      message: avgTime < 45
        ? INSIGHT_MESSAGES.performance.excellent[Math.floor(Math.random() * 3)]
        : avgTime > 75
        ? INSIGHT_MESSAGES.performance.needs_improvement[Math.floor(Math.random() * 3)]
        : INSIGHT_MESSAGES.performance.good[Math.floor(Math.random() * 3)],
      type: avgTime < 45 ? 'success' : avgTime > 75 ? 'warning' : 'info',
      timestamp: Date.now(),
      category: 'performance'
    };

    setPerformance({
      completionTimes: newTimes,
      successRate: performance.successRate,
      lastDifficulty: newDifficulty,
      studyPattern: newPattern
    });

    setInsights([...insights.slice(-4), newInsight]);
  };

  const updateSuccessRate = (success: boolean) => {
    const newRate = performance.successRate * 0.8 + (success ? 0.2 : 0);
    setPerformance({ ...performance, successRate: newRate });
  };

  return {
    performance,
    insights,
    addCompletionTime,
    updateSuccessRate,
  };
}