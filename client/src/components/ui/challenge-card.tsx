import { useMutation } from '@tanstack/react-query';
import { Challenge } from '@shared/schema';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAIAdaptation } from '@/hooks/use-ai-adaptation';
import React from 'react';

interface ChallengeCardProps {
  challenge: Challenge;
  userLevel: number;
}

export function ChallengeCard({ challenge, userLevel }: ChallengeCardProps) {
  const { toast } = useToast();
  const { addCompletionTime, updateSuccessRate, performance } = useAIAdaptation();
  const isLocked = userLevel < challenge.requiredLevel;

  const startTime = React.useRef<number>();

  const completeMutation = useMutation({
    mutationFn: async () => {
      // Simulate random completion time between 30-90 seconds
      const completionTime = startTime.current 
        ? (Date.now() - startTime.current) / 1000
        : Math.random() * 60 + 30;

      // Simulate success rate based on difficulty
      const success = Math.random() > (performance.lastDifficulty * 0.2);

      addCompletionTime(completionTime);
      updateSuccessRate(success);

      if (!success) {
        throw new Error("Challenge incomplete. Try again!");
      }

      await apiRequest('POST', `/api/challenges/${challenge.id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/challenges'] });
      toast({
        title: 'Challenge completed!',
        description: `You earned ${challenge.points} points!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Challenge failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleStart = () => {
    startTime.current = Date.now();
    completeMutation.mutate();
  };

  const adjustedPoints = Math.round(challenge.points * performance.lastDifficulty);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{challenge.title}</h3>
          <Badge variant={isLocked ? 'secondary' : 'default'}>
            {adjustedPoints} points
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6">{challenge.description}</p>

        <Button
          className="w-full"
          disabled={isLocked || completeMutation.isPending}
          onClick={handleStart}
        >
          {isLocked
            ? `Unlock at Level ${challenge.requiredLevel}`
            : completeMutation.isPending
            ? 'Working...'
            : 'Start Challenge'}
        </Button>
      </Card>
    </motion.div>
  );
}