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
import { CheckCircle, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    question: "What is the primary purpose of React's useEffect hook?",
    options: [
      "To handle side effects and lifecycle events",
      "To create global state",
      "To define component styles",
      "To handle form submissions"
    ],
    correct: 0,
    explanation: "useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations."
  },
  {
    question: "What is the difference between props and state in React?",
    options: [
      "Props are internal, state is external",
      "Props are read-only and passed from parent, state is internal and mutable",
      "Props are mutable, state is immutable",
      "There is no difference"
    ],
    correct: 1,
    explanation: "Props are passed down from parent components and are read-only, while state is managed internally by the component."
  },
  {
    question: "Which hook would you use to cache expensive calculations?",
    options: [
      "useEffect",
      "useState",
      "useMemo",
      "useContext"
    ],
    correct: 2,
    explanation: "useMemo is used to memoize expensive calculations and prevent unnecessary re-computations."
  },
  {
    question: "What is the Virtual DOM in React?",
    options: [
      "A direct copy of the browser's DOM",
      "A lightweight copy of the actual DOM used for performance optimization",
      "A database for storing component state",
      "A tool for writing CSS"
    ],
    correct: 1,
    explanation: "The Virtual DOM is a lightweight representation of the actual DOM that React uses to optimize rendering performance."
  },
  {
    question: "What is the purpose of key prop in React lists?",
    options: [
      "To style list items",
      "To make items clickable",
      "To help React track items for efficient updates",
      "To set the order of items"
    ],
    correct: 2,
    explanation: "Keys help React identify which items have changed, been added, or been removed in lists."
  },
  {
    question: "What is a Pure Component in React?",
    options: [
      "A component written in pure JavaScript",
      "A component that only renders once",
      "A component that doesn't use hooks",
      "A component that re-renders only when props or state actually change"
    ],
    correct: 3,
    explanation: "Pure Components implement shouldComponentUpdate with a shallow prop and state comparison."
  },
  {
    question: "What is the purpose of React.lazy()?",
    options: [
      "To delay component rendering",
      "To implement code splitting",
      "To optimize state updates",
      "To handle errors"
    ],
    correct: 1,
    explanation: "React.lazy() enables code splitting by allowing components to be loaded dynamically."
  },
  {
    question: "What is the Context API used for?",
    options: [
      "State management across component tree",
      "API calls",
      "Form validation",
      "Animation handling"
    ],
    correct: 0,
    explanation: "Context provides a way to pass data through the component tree without passing props manually."
  },
  {
    question: "What are React Hooks?",
    options: [
      "External plugins",
      "Class components",
      "Functions that let you use state and lifecycle features in functional components",
      "Debugging tools"
    ],
    correct: 2,
    explanation: "Hooks allow you to use state and other React features without writing a class component."
  },
  {
    question: "What is the useCallback hook used for?",
    options: [
      "To memoize values",
      "To memoize functions",
      "To handle side effects",
      "To manage state"
    ],
    correct: 1,
    explanation: "useCallback memoizes functions to prevent unnecessary re-renders in child components."
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResults(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [open]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    setTimeout(() => {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);

      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        const score = newAnswers.reduce((acc, answer, index) => 
          answer === QUIZ_QUESTIONS[index].correct ? acc + 1 : acc, 0);
        setShowResults(true);
        onComplete(score);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
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
                      variant={
                        selectedAnswer === null ? "outline" :
                        index === QUIZ_QUESTIONS[currentQuestion].correct ? "default" :
                        selectedAnswer === index ? "destructive" : "outline"
                      }
                      className={`justify-start h-auto py-3 px-4 ${
                        selectedAnswer !== null ? 'cursor-default' : ''
                      }`}
                      onClick={() => selectedAnswer === null && handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="flex-1">{option}</span>
                        {selectedAnswer !== null && index === QUIZ_QUESTIONS[currentQuestion].correct && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {selectedAnswer === index && index !== QUIZ_QUESTIONS[currentQuestion].correct && (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>

                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-muted rounded-lg"
                  >
                    <p className="text-sm">{QUIZ_QUESTIONS[currentQuestion].explanation}</p>
                  </motion.div>
                )}
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
                  Score: {answers.reduce((acc, answer, index) => 
                    answer === QUIZ_QUESTIONS[index].correct ? acc + 1 : acc, 0
                  )}/10
                  {answers.reduce((acc, answer, index) => 
                    answer === QUIZ_QUESTIONS[index].correct ? acc + 1 : acc, 0
                  ) === 10 && (
                    <span className="ml-2 text-yellow-500">★ Perfect Score!</span>
                  )}
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