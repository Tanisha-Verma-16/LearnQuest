import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { Trophy, BookOpen, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CompletedCourses() {
  const { 
    completedCourses, 
    takeQuiz, 
    getRecommendedCourses,
    allCourses,
    completeCourse,
    totalPoints 
  } = useCourseProgress();

  const recommendedCourses = getRecommendedCourses();

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

      <div className="space-y-8">
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
                    <div className="font-medium mb-2">
                      Quiz Score: {course.quizScore}/10
                      {course.quizScore === 10 && (
                        <span className="ml-2 text-yellow-500">★</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => takeQuiz(course.id)}
                    >
                      {course.quizScore > 0 ? 'Retake Quiz' : 'Take Quiz'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {completedCourses.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No completed courses yet. Start learning!
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recommended Courses
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="p-4">
                <h4 className="font-medium mb-2">{course.name}</h4>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">
                    {course.points} points
                  </span>
                  <Button 
                    size="sm"
                    className="w-24"
                    onClick={() => completeCourse(course.id)}
                  >
                    Start <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}