import { useLocalStorage } from './use-local-storage';

interface PerformanceData {
  completionTimes: number[];
  successRate: number;
  lastDifficulty: number;
}

interface AIInsight {
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: number;
}

const INITIAL_PERFORMANCE: PerformanceData = {
  completionTimes: [],
  successRate: 0.8,
  lastDifficulty: 1,
};

const INSIGHT_MESSAGES = {
  fast: [
    "You're showing exceptional speed in completing challenges!",
    "Your quick problem-solving skills are impressive!",
    "You're ready for more advanced challenges!",
  ],
  slow: [
    "Take your time to understand the concepts better.",
    "Practice makes perfect! Keep going at your pace.",
    "Let's try some focused practice on these topics.",
  ],
  consistent: [
    "You're maintaining a steady learning pace!",
    "Your consistent effort is paying off!",
    "You're building a strong foundation!",
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

    const messages = avgTime < 45 ? INSIGHT_MESSAGES.fast :
                    avgTime > 75 ? INSIGHT_MESSAGES.slow :
                    INSIGHT_MESSAGES.consistent;

    const newInsight: AIInsight = {
      message: messages[Math.floor(Math.random() * messages.length)],
      type: avgTime < 45 ? 'success' : avgTime > 75 ? 'warning' : 'info',
      timestamp: Date.now(),
    };

    setPerformance({
      completionTimes: newTimes,
      successRate: performance.successRate,
      lastDifficulty: newDifficulty,
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
