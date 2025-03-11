import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Card } from './card';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export function Leaderboard() {
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/leaderboard'],
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold">Leaderboard</h2>
      </div>

      <div className="space-y-4">
        {users?.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-lg bg-card"
          >
            <div className="text-2xl font-bold text-muted-foreground w-8">
              #{index + 1}
            </div>

            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.displayName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="font-semibold">{user.displayName}</div>
              <div className="text-sm text-muted-foreground">
                Level {user.level}
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold">{user.points}</div>
              <div className="text-sm text-muted-foreground">points</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
