import express, { type Request, type Response, type NextFunction } from 'express';
const router = express.Router();

interface Template {
  id: string;
  name: string;
  description: string;
}

interface TemplateApiResponse {
  success: boolean;
  count: number;
  data: Template[];
}

router.get("/templates", (req: Request, res: Response<TemplateApiResponse>) => {
  const templates: Template[] = [
    {
      "id": "ubuntu-vm",
      "name": "Ubuntu EC2 Instance",
      "description": "Provision an Ubuntu VM on AWS"
    },
    {
      "id": "postgres-rds",
      "name": "PostgreSQL Database",
      "description": "Provision a managed PostgreSQL database on AWS RDS"
    }
  ];

  res.json({
      success: true,
      count: templates.length,
      data: templates
    });
})

export default router;
