import express, { type Request, type Response, type NextFunction } from 'express';
const router = express.Router();
import type { Job } from "../models/Job.ts";
import { jobsArray } from "../stores/jobsStore.ts";

router.get("/jobs/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const job: Job | undefined = jobsArray.find(j => j.uuid === id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  res.status(200).json({
    success: true,
    data: job,
  });
})

export default router;
