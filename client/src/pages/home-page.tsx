import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Challenge } from '@shared/schema';
import { UserProgress } from '@/components/dashboard/user-progress';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { Leaderboard } from '@/components/ui/leaderboard';
import { ChallengeCard } from '@/components/ui/challenge-card';
import { Chatbot } from '@/components/ui/chatbot';

export default function HomePage() {
  const { user } = useAuth();
  const { data: challenges } = useQuery<Challenge[]>({
    queryKey: ['/api/challenges'],
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="space-y-8">
          <UserProgress />
          <AIInsights />

          <div>
            <h2 className="text-3xl font-bold mb-6">Challenges</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {challenges?.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  userLevel={user.level}
                />
              ))}
            </div>
          </div>
        </div>

        <Leaderboard />
      </div>

      <Chatbot />
    </div>
  );
}