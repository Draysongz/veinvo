import { Router } from "express";

export const expensesRouter = Router();

expensesRouter.get("/", (_req, res) => res.json({ expenses: [] }));
