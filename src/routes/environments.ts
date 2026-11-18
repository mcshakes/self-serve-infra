import express, { type Request, type Response } from 'express';
const router = express.Router();
import type { Job } from "../models/Job.ts";
import type { Environment } from "../models/Environment.ts";
import { jobsArray } from "../stores/jobsStore.ts";
import { envArray } from "../stores/environmentStore.ts";
import { processJob } from '../workers/jobWorker.ts';

interface EnvironmentApiResponse {
  success: boolean;
  data: Environment;
  jobId?: string;
}

interface ApiError {
  error: string;
}

interface AllEnvironmentsResponse {
  success: boolean;
  count: number;
  data: Environment[]
}

interface AssociatedEnvironmentJobsResponse {
  success: boolean;
  count: number;
  data: Job[]
}

router.post("/environments", (req: Request, res: Response<EnvironmentApiResponse | ApiError>) => {
  const { name, template, region, instanceType, instanceCount } = req.body;

  if (!name || !template || !region || !instanceType || !instanceCount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!Number.isInteger(instanceCount)) {
     return res.status(400).json({ error: 'instanceCount must be an integer' });
  }

  if (instanceCount < 1 || instanceCount > 5) {
    return res.status(400).json({ error: 'Wrong number of instances' });
  }

  const createdAt = new Date().toISOString();

  const env: Environment = {
    uuid: crypto.randomUUID(),
    name,
    template,
    region,
    instanceType,
    instanceCount,
    status: "pending",
    createdAt
  };

  const newJob: Job = {
    uuid: crypto.randomUUID(),
    environmentId: env.uuid,
    type: "provision",
    status: "queued",
    createdAt
  }

  envArray.push(env);
  jobsArray.push(newJob);

  processJob(newJob.uuid);

  res.status(201).json({
    success: true,
    data: env,
    jobId: newJob.uuid
  });
});

router.get("/environments", (req: Request, res: Response<AllEnvironmentsResponse>) => {
  res.status(200).json({
    success: true,
    count: envArray.length,
    data: envArray
  });
})

router.get("/environments/:id", (req: Request, res: Response<EnvironmentApiResponse | ApiError>) => {
  const { id } = req.params;

  const enviro: Environment | undefined = envArray.find(env => env.uuid === id);

  if (!enviro) {
    return res.status(404).json({ error: "Environment not found" });
  }

  res.status(200).json({
    success: true,
    data: enviro,
  });
})

router.get("/environments/:id/jobs", (req: Request, res: Response<AssociatedEnvironmentJobsResponse | ApiError>) => {
  const { id } = req.params;

  const enviro: Environment | undefined = envArray.find(env => env.uuid === id);

  if (!enviro) {
    return res.status(404).json({ error: "Environment not found" });
  }

  const filteredJobs: Job[] = jobsArray.filter(job => job.environmentId === id);

  res.status(200).json({
    success: true,
    count: filteredJobs.length,
    data: filteredJobs,
  });
})


router.delete("/environments/:id", (req: Request, res: Response<EnvironmentApiResponse | ApiError>) => {
  const { id } = req.params;

  const enviro: Environment | undefined = envArray.find(env => env.uuid === id);

  if (!enviro) {
    return res.status(404).json({ error: "Environment not found" });
  }

  if (enviro && ["destroy_pending", "destroyed"].includes(enviro.status)) {
    return res.status(409).json({ error: "Environment already in process of being destroyed or destroyed" });
  }

  const activeJob = jobsArray.find(job =>
    job.environmentId === id &&
    ["queued", "running"].includes(job.status)
  );

  if (activeJob) {
    return res.status(409).json({
      error: "Environment has an active job"
    });
  }

  const newJob: Job = {
    uuid: crypto.randomUUID(),
    environmentId: enviro.uuid,
    type: "destroy",
    status: "queued",
    createdAt: new Date().toISOString()
  }

  jobsArray.push(newJob);
  processJob(newJob.uuid);
  enviro.status = "destroy_pending";


  res.status(202).json({
    success: true,
    data: enviro,
    jobId: newJob.uuid
  });
})

export default router;
