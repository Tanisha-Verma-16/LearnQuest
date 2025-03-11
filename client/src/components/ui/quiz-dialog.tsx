import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './button';
import { Progress } from './progress';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_QUESTIONS = [
  {
    question: "What is the primary purpose of version control?",
    options: [
      "Code collaboration and history tracking",
      "Code formatting",
      "Code execution",
      "Code deletion"
    ],
    correct: 0
  },
  {
    question: "Which HTTP method is used to retrieve data?",
    options: ["POST", "GET", "PUT", "DELETE"],
    correct: 1
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Programming Implementation",
      "Automated Program Integration",
      "Application Process Integration"
    ],
    correct: 0
  },
  {
    question: "What is a callback function?",
    options: [
      "A function that calls itself",
      "A function passed as an argument to another function",
      "A function that returns immediately",
      "A function that never returns"
    ],
    correct: 1
  },
  {
    question: "What is the purpose of useEffect in React?",
    options: [
      "To style components",
      "To handle side effects and lifecycle events",
      "To create new components",
      "To debug code"
    ],
    correct: 1
  },
  {
    question: "What is the difference between == and === in JavaScript?",
    options: [
      "No difference",
      "=== checks type and value, == only checks value",
      "== is not valid syntax",
      "=== is not valid syntax"
    ],
    correct: 1
  },
  {
    question: "What is a Promise in JavaScript?",
    options: [
      "A guarantee of future payment",
      "A way to handle asynchronous operations",
      "A type of function",
      "A debugging tool"
    ],
    correct: 1
  },
  {
    question: "What is JSX?",
    options: [
      "A JavaScript library",
      "A syntax extension for JavaScript",
      "A programming language",
      "A database"
    ],
    correct: 1
  },
  {
    question: "What is the virtual DOM?",
    options: [
      "A fake DOM",
      "A lightweight copy of the actual DOM",
      "A browser feature",
      "A type of database"
    ],
    correct: 1
  },
  {
    question: "What is state in React?",
    options: [
      "A country's political status",
      "A component's memory",
      "A type of prop",
      "A routing mechanism"
    ],
    correct: 1
  }
];

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (score: number) => void;
  courseName: string;
}

export function QuizDialog({ open, onOpenChange, onComplete, courseName }: QuizDialogProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Reset quiz state when dialog is closed
  useEffect(() => {
    if (!open) {
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResults(false);
    }
  }, [open]);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = newAnswers.reduce((acc, answer, index) => 
        answer === QUIZ_QUESTIONS[index].correct ? acc + 1 : acc, 0);
      setShowResults(true);
      onComplete(score);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quiz: {courseName}</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <Progress 
            value={(currentQuestion / QUIZ_QUESTIONS.length) * 100} 
            className="mb-4"
          />

          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium">
                  {QUIZ_QUESTIONS[currentQuestion].question}
                </h3>

                <div className="grid gap-2">
                  {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => handleAnswer(index)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold mb-2">
                  Quiz Complete!
                </h3>
                <p className="text-muted-foreground mb-4">
                  You scored {answers.reduce((acc, answer, index) => 
                    answer === QUIZ_QUESTIONS[index].correct ? acc + 1 : acc, 0
                  )}/10
                </p>
                <Button onClick={resetQuiz}>Close</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}