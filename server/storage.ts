import { IStorage } from "./types";
import { User, InsertUser, Badge, Challenge, UserBadge, UserChallenge } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Example challenges data
const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "React Components Basics",
    description: "Create a reusable button component with customizable styles",
    points: 100,
    requiredLevel: 1,
  },
  {
    id: 2,
    title: "State Management",
    description: "Implement a counter using React useState hook",
    points: 150,
    requiredLevel: 1,
  },
  {
    id: 3,
    title: "API Integration",
    description: "Fetch and display data from a REST API",
    points: 200,
    requiredLevel: 2,
  },
  {
    id: 4,
    title: "Form Validation",
    description: "Create a form with custom validation logic",
    points: 250,
    requiredLevel: 2,
  },
  {
    id: 5,
    title: "Authentication Flow",
    description: "Implement a complete login/register system",
    points: 300,
    requiredLevel: 3,
  },
  {
    id: 6,
    title: "Real-time Updates",
    description: "Build a real-time chat interface using WebSocket",
    points: 350,
    requiredLevel: 3,
  },
  {
    id: 7,
    title: "Performance Optimization",
    description: "Optimize a slow-rendering component using useMemo and useCallback",
    points: 400,
    requiredLevel: 4,
  },
  {
    id: 8,
    title: "Custom Hook Creation",
    description: "Create a custom hook for handling form state",
    points: 450,
    requiredLevel: 4,
  },
  {
    id: 9,
    title: "Animation Implementation",
    description: "Add smooth transitions and animations to a component",
    points: 500,
    requiredLevel: 5,
  },
  {
    id: 10,
    title: "Testing Mastery",
    description: "Write comprehensive tests for a React component",
    points: 550,
    requiredLevel: 5,
  }
];

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private badges: Map<number, Badge>;
  private challenges: Map<number, Challenge>;
  private userBadges: Map<number, UserBadge>;
  private userChallenges: Map<number, UserChallenge>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.badges = new Map();
    this.challenges = new Map();
    this.userBadges = new Map();
    this.userChallenges = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize challenges
    initialChallenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, points: 0, level: 1 };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    user.points += points;
    user.level = Math.floor(user.points / 1000) + 1;
    this.users.set(userId, user);
    return user;
  }

  async getUserBadges(userId: number): Promise<Badge[]> {
    const userBadges = Array.from(this.userBadges.values())
      .filter(ub => ub.userId === userId);
    return userBadges.map(ub => this.badges.get(ub.badgeId)!);
  }

  async getUserChallenges(userId: number): Promise<Challenge[]> {
    const userChallenges = Array.from(this.userChallenges.values())
      .filter(uc => uc.userId === userId);
    return userChallenges.map(uc => this.challenges.get(uc.challengeId)!);
  }

  async completeChallenge(userId: number, challengeId: number): Promise<void> {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) throw new Error("Challenge not found");

    const ucId = this.currentId++;
    this.userChallenges.set(ucId, {
      id: ucId,
      userId,
      challengeId,
      completed: true,
      completedAt: new Date(),
    });

    await this.updateUserPoints(userId, challenge.points);
  }

  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
  }
}

export const storage = new MemStorage();