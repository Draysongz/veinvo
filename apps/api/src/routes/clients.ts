import { Router } from "express";

export const clientsRouter = Router();

clientsRouter.get("/", (_req, res) => res.json({ clients: [] }));
