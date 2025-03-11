import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { useAIAdaptation } from '@/hooks/use-ai-adaptation';
import { motion, AnimatePresence } from 'framer-motion';

export function AIInsights() {
  const { performance, insights } = useAIAdaptation();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Learning Assistant</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Learning Efficiency</span>
            <span>{Math.round(performance.successRate * 100)}%</span>
          </div>
          <Progress 
            value={performance.successRate * 100} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Insights</span>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence>
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    insight.type === 'success' ? 'bg-green-50 text-green-700' :
                    insight.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{insight.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Current Challenge Difficulty: Level {Math.round(performance.lastDifficulty * 10) / 10}
        </div>
      </div>
    </Card>
  );
}
