import { Router } from "express";
import { submitApplication } from "../controllers/application.controller";

const router = Router();

// POST /api/applications
router.post("/", submitApplication);

export default router;
