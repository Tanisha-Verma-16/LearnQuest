import { useLocalStorage } from './use-local-storage';
import confetti from 'canvas-confetti';

interface CourseProgress {
  id: number;
  name: string;
  completedAt: number;
  quizScore: number;
  lastQuizAttempt: number;
}

interface MysteryWheel {
  lastSpinDate: number;
  availableQuests: string[];
  completedQuests: string[];
}

const QUESTS = [
  'Share on LinkedIn',
  'Complete a Course',
  'Recommend to Friend',
  'Join Mentorship',
  'Bonus Points',
];

const MOCK_COURSES = [
  { id: 1, name: 'React Fundamentals', points: 100 },
  { id: 2, name: 'JavaScript Advanced', points: 150 },
  { id: 3, name: 'Node.js Basics', points: 120 },
  { id: 4, name: 'TypeScript Essentials', points: 130 },
];

export function useCourseProgress() {
  const [completedCourses, setCompletedCourses] = useLocalStorage<CourseProgress[]>('completed-courses', []);
  const [mysteryWheel, setMysteryWheel] = useLocalStorage<MysteryWheel>('mystery-wheel', {
    lastSpinDate: 0,
    availableQuests: QUESTS,
    completedQuests: [],
  });
  const [totalPoints, setTotalPoints] = useLocalStorage<number>('total-points', 0);

  const completeCourse = (courseId: number) => {
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (!course) return;

    const newProgress: CourseProgress = {
      id: courseId,
      name: course.name,
      completedAt: Date.now(),
      quizScore: 0,
      lastQuizAttempt: 0,
    };

    setCompletedCourses([...completedCourses, newProgress]);
    addPoints(course.points, `Completed ${course.name}`);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const takeQuiz = (courseId: number) => {
    const score = Math.floor(Math.random() * 5) + 6; // Random score between 6-10
    const points = score * 10;

    setCompletedCourses(courses =>
      courses.map(course =>
        course.id === courseId
          ? { ...course, quizScore: score, lastQuizAttempt: Date.now() }
          : course
      )
    );

    addPoints(points, `Quiz Score: ${score}/10`);
  };

  const spinWheel = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (mysteryWheel.lastSpinDate === today) {
      return null;
    }

    const randomQuest = QUESTS[Math.floor(Math.random() * QUESTS.length)];
    setMysteryWheel({
      lastSpinDate: today,
      availableQuests: [...mysteryWheel.availableQuests, randomQuest],
      completedQuests: mysteryWheel.completedQuests,
    });

    return randomQuest;
  };

  const completeQuest = (quest: string) => {
    setMysteryWheel(wheel => ({
      ...wheel,
      availableQuests: wheel.availableQuests.filter(q => q !== quest),
      completedQuests: [...wheel.completedQuests, quest],
    }));

    const points = quest === 'Bonus Points' ? 500 : 100;
    addPoints(points, `Completed Quest: ${quest}`);
  };

  const addPoints = (points: number, reason: string) => {
    setTotalPoints(current => current + points);
    // Show toast notification
    const toast = document.createElement('div');
    toast.textContent = `+${points} points: ${reason}`;
    toast.className = 'fixed top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded shadow-lg animate-in slide-in-from-top-2';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const getRecommendedCourse = () => {
    const incomplete = MOCK_COURSES.filter(
      course => !completedCourses.find(c => c.id === course.id)
    );
    return incomplete[Math.floor(Math.random() * incomplete.length)];
  };

  return {
    completedCourses,
    mysteryWheel,
    totalPoints,
    completeCourse,
    takeQuiz,
    spinWheel,
    completeQuest,
    getRecommendedCourse,
  };
}
