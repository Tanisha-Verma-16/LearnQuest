import { useMutation } from '@tanstack/react-query';
import { Challenge } from '@shared/schema';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface ChallengeCardProps {
  challenge: Challenge;
  userLevel: number;
}

export function ChallengeCard({ challenge, userLevel }: ChallengeCardProps) {
  const { toast } = useToast();
  const isLocked = userLevel < challenge.requiredLevel;

  const completeMutation = useMutation({
    mutationFn: async () => {
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
  });

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
            {challenge.points} points
          </Badge>
        </div>

        <p className="text-muted-foreground mb-6">{challenge.description}</p>

        <Button
          className="w-full"
          disabled={isLocked || completeMutation.isPending}
          onClick={() => completeMutation.mutate()}
        >
          {isLocked
            ? `Unlock at Level ${challenge.requiredLevel}`
            : 'Complete Challenge'}
        </Button>
      </Card>
    </motion.div>
  );
}
