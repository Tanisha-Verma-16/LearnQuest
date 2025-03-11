import { IStorage } from "./types";
import { User, InsertUser, Badge, Challenge, UserBadge, UserChallenge } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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
