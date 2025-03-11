import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Gift, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function MysteryWheel() {
  const { mysteryWheel, spinWheel, completeQuest } = useCourseProgress();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const quest = spinWheel();

    // Simulate wheel spinning animation
    setTimeout(() => {
      setIsSpinning(false);
      if (quest) {
        // Auto-complete quest after a delay
        setTimeout(() => completeQuest(quest), 1000);
      }
    }, 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Gift className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Mystery Quest</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <motion.div
            animate={isSpinning ? { rotate: 360 * 5 } : {}}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <Button
              size="lg"
              className="w-full h-32 rounded-full transition-transform hover:scale-105 hover:shadow-lg"
              onClick={handleSpin}
              disabled={isSpinning}
            >
              {isSpinning ? "Spinning..." : "Spin the Wheel!"}
            </Button>
          </motion.div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Quests
          </h3>
          <div className="space-y-2">
            <AnimatePresence>
              {mysteryWheel.completedQuests.slice(-3).map((quest, index) => (
                <motion.div
                  key={quest + index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-muted/50 p-3 rounded-lg flex items-center gap-2"
                >
                  <div className="h-2 w-2 bg-primary rounded-full" />
                  <span>{quest}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}