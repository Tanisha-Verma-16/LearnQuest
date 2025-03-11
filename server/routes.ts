import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/leaderboard", async (_req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  app.get("/api/challenges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const challenges = await storage.getUserChallenges(req.user.id);
    res.json(challenges);
  });

  app.post("/api/challenges/:id/complete", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.completeChallenge(req.user.id, parseInt(req.params.id));
    res.sendStatus(200);
  });

  app.get("/api/badges", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const badges = await storage.getUserBadges(req.user.id);
    res.json(badges);
  });

  const httpServer = createServer(app);
  return httpServer;
}
