import { useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { Card } from './card';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock leaderboard data for demonstration
const MOCK_USERS: User[] = [
  { id: 1, username: "sarah_dev", displayName: "Sarah Dev", avatarUrl: "https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3", points: 2500, level: 3, password: "" },
  { id: 2, username: "tech_master", displayName: "Tech Master", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80", points: 2200, level: 3, password: "" },
  { id: 3, username: "code_ninja", displayName: "Code Ninja", avatarUrl: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f", points: 1800, level: 2, password: "" },
  { id: 4, username: "web_wizard", displayName: "Web Wizard", avatarUrl: "https://images.unsplash.com/photo-1715615685666-882710b534f9", points: 1500, level: 2, password: "" },
  { id: 5, username: "data_guru", displayName: "Data Guru", avatarUrl: "https://images.unsplash.com/photo-1633267379178-b0c2078e321e", points: 1200, level: 2, password: "" },
  { id: 6, username: "ai_explorer", displayName: "AI Explorer", avatarUrl: "https://images.unsplash.com/photo-1664464168739-676285e4bf89", points: 1100, level: 2, password: "" },
  { id: 7, username: "cloud_master", displayName: "Cloud Master", avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", points: 950, level: 1, password: "" },
  { id: 8, username: "ui_designer", displayName: "UI Designer", avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", points: 850, level: 1, password: "" },
  { id: 9, username: "security_pro", displayName: "Security Pro", avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", points: 800, level: 1, password: "" },
  { id: 10, username: "mobile_dev", displayName: "Mobile Dev", avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d", points: 750, level: 1, password: "" },
];

export function Leaderboard() {
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/leaderboard'],
    placeholderData: MOCK_USERS,
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