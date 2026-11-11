import express, { type Request, type Response } from 'express';
const router = express.Router();


interface Environment {
  uuid: string;
  name: string;
  template: string;
  region: string;
  instanceType: string;
  instanceCount: number;
  status: string;
  created_at: string;
};

interface EnvironmentApiResponse {
  success: boolean;
  data: Environment;
}

interface ApiError {
  error: string;
}

interface AllEnvironmentsResponse {
  success: boolean;
  count: number;
  data: Environment[]
}

const envArray: Environment[] = [];

router.post("/environments", (req: Request, res: Response<EnvironmentApiResponse | ApiError>) => {
  console.log(req.body)

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

  const env: Environment = {
    uuid: crypto.randomUUID(),
    name,
    template,
    region,
    instanceType,
    instanceCount,
    status: "pending",
    created_at: new Date().toISOString()
  };

  envArray.push(env);

  res.status(201).json({
    success: true,
    data: env
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
    data: enviro
  });
})

export default router;
