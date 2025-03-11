import { useLocalStorage } from './use-local-storage';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

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
  { id: 5, name: 'React Native Development', points: 180 },
  { id: 6, name: 'Web Security Fundamentals', points: 160 },
  { id: 7, name: 'GraphQL Mastery', points: 140 },
  { id: 8, name: 'AWS Cloud Services', points: 200 },
  { id: 9, name: 'Docker & Kubernetes', points: 190 },
  { id: 10, name: 'CI/CD Fundamentals', points: 170 },
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
    const isPerfect = score === 10;
    const points = isPerfect ? 50 : score * 5;

    setCompletedCourses(courses =>
      courses.map(course =>
        course.id === courseId
          ? { ...course, quizScore: score, lastQuizAttempt: Date.now() }
          : course
      )
    );

    addPoints(points, `Quiz Score: ${score}/10${isPerfect ? ' (Perfect Score!)' : ''}`);

    if (isPerfect) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  };

  const spinWheel = () => {
    const randomQuest = QUESTS[Math.floor(Math.random() * QUESTS.length)];
    setMysteryWheel({
      ...mysteryWheel,
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

  const getRecommendedCourses = () => {
    const incomplete = MOCK_COURSES.filter(
      course => !completedCourses.find(c => c.id === course.id)
    );

    // Sort by similarity to completed courses and user's level
    return incomplete.sort(() => Math.random() - 0.5).slice(0, 3);
  };

  // Reset quiz scores daily
  useEffect(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    setCompletedCourses(courses =>
      courses.map(course =>
        course.lastQuizAttempt < today
          ? { ...course, quizScore: 0, lastQuizAttempt: 0 }
          : course
      )
    );
  }, []);

  return {
    completedCourses,
    mysteryWheel,
    totalPoints,
    completeCourse,
    takeQuiz,
    spinWheel,
    completeQuest,
    getRecommendedCourses,
    allCourses: MOCK_COURSES,
  };
}