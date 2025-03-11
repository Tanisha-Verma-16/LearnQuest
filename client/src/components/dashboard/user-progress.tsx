import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { Star } from 'lucide-react';

export function UserProgress() {
  const { user } = useAuth();
  if (!user) return null;

  const nextLevel = user.level + 1;
  const pointsForNextLevel = nextLevel * 1000;
  const progress = ((user.points % 1000) / 1000) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{user.displayName}</h2>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Level {user.level}</span>
          </div>
        </div>

        <Badge variant="secondary" className="text-lg">
          {user.points} points
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress to Level {nextLevel}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground text-right">
          {pointsForNextLevel - user.points} points needed
        </div>
      </div>
    </Card>
  );
}
