import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Trophy, BookOpen, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export function CompletedCourses() {
  const { 
    completedCourses, 
    takeQuiz, 
    getRecommendedCourse,
    totalPoints 
  } = useCourseProgress();

  const recommendedCourse = getRecommendedCourse();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">My Learning Journey</h2>
        </div>
        <div className="text-xl font-bold text-primary">
          {totalPoints} Total Points
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Completed Courses
          </h3>
          <div className="space-y-4">
            {completedCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-4 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{course.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Completed {new Date(course.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      Quiz Score: {course.quizScore}/10
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => takeQuiz(course.id)}
                    >
                      Retake Quiz
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {recommendedCourse && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recommended Next Course
            </h3>
            <Card className="p-4 bg-primary/5">
              <h4 className="font-medium">{recommendedCourse.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your completed courses
              </p>
              <Button>Start Course</Button>
            </Card>
          </div>
        )}
      </div>
    </Card>
  );
}
