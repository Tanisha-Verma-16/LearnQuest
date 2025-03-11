import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Gift, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export function MysteryWheel() {
  const { mysteryWheel, spinWheel, completeQuest } = useCourseProgress();
  const canSpin = new Date().setHours(0, 0, 0, 0) !== mysteryWheel.lastSpinDate;

  const handleSpin = () => {
    const quest = spinWheel();
    if (quest) {
      // Simulate auto-completion for demo
      setTimeout(() => completeQuest(quest), 2000);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gift className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Mystery Quest</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <Button
            size="lg"
            className="w-full h-32 rounded-full transition-transform hover:scale-105 hover:shadow-lg"
            disabled={!canSpin}
            onClick={handleSpin}
          >
            {canSpin ? 'Spin the Wheel!' : 'Come back tomorrow!'}
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Quests
          </h3>
          <div className="space-y-2">
            {mysteryWheel.completedQuests.slice(-3).map((quest, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-muted/50 p-3 rounded-lg flex items-center gap-2"
              >
                <div className="h-2 w-2 bg-primary rounded-full" />
                <span>{quest}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}