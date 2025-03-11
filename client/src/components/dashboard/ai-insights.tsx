import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { useAIAdaptation } from '@/hooks/use-ai-adaptation';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export function AIInsights() {
  const { performance, insights } = useAIAdaptation();

  const getBestStudyTime = () => {
    const { studyPattern } = performance;
    const times = [
      { time: 'morning', rate: studyPattern.morningRate },
      { time: 'afternoon', rate: studyPattern.afternoonRate },
      { time: 'evening', rate: studyPattern.eveningRate },
    ];
    return times.sort((a, b) => b.rate - a.rate)[0].time;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Learning Analytics</h2>
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

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Best Study Time</h3>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="capitalize">{getBestStudyTime()}</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Challenge Level</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{Math.round(performance.lastDifficulty * 10) / 10}x</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <h3 className="text-sm font-medium mb-2">Recent Success</h3>
            <Badge variant={performance.successRate > 0.7 ? "default" : "secondary"}>
              {performance.successRate > 0.7 ? "High" : "Improving"}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            AI Insights
          </h3>

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
                    insight.type === 'success' ? 'bg-emerald-50 text-emerald-900' :
                    insight.type === 'warning' ? 'bg-amber-50 text-amber-900' :
                    'bg-blue-50 text-blue-900'
                  }`}
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{insight.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}