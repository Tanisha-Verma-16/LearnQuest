import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Star, BarChart, Clock } from 'lucide-react';

export function UserProgress() {
  const { user } = useAuth();
  const { completedCourses, totalPoints } = useCourseProgress();
  if (!user) return null;

  const nextLevel = user.level + 1;
  const pointsForNextLevel = nextLevel * 1000;
  const progress = ((user.points % 1000) / 1000) * 100;

  const totalCourses = 10; // Example total number of courses
  const courseProgress = (completedCourses.length / totalCourses) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">{user.displayName}</h2>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="text-muted-foreground">Level {user.level}</span>
          </div>
        </div>

        <Badge variant="outline" className="text-lg flex gap-2 items-center">
          <BarChart className="h-4 w-4" />
          {totalPoints} Total Points
        </Badge>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Level Progress</h3>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Level {user.level}</span>
            <span>{pointsForNextLevel - user.points} points to Level {nextLevel}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Course Completion</h3>
          <Progress value={courseProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedCourses.length} of {totalCourses} Courses</span>
            <span>{Math.round(courseProgress)}% Complete</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Average completion time: {Math.round(completedCourses.reduce((acc, course) => 
            acc + (course.completedAt - course.lastQuizAttempt), 0) / (completedCourses.length || 1) / 60000)} minutes</span>
        </div>
      </div>
    </Card>
  );
}