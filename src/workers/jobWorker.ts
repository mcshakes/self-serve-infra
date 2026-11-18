import { jobsArray } from "../stores/jobsStore.ts";
import { envArray } from "../stores/environmentStore.ts";
import type { Job } from "../models/Job.ts";
import type { Environment } from "../models/Environment.ts";

export function processJob(jobId: string) {
  const job: Job | undefined = jobsArray.find((j) => j.uuid === jobId);

  if (job !== undefined && job.status == "queued") {
    console.log("Job started... running...");
    job.status = "running"

    setTimeout(() => {
      const env: Environment | undefined = envArray.find(e => e.uuid === job.environmentId);

      if (!env) {
        return;
      }

      if (job.type === "provision" && env.status === "pending") {
        env.status = "active";
        console.log("Environment switched to Active status...");
      }

      if (job.type === "destroy" && env.status === "destroy_pending") {
        env.status = "destroyed";
        console.log("Environment is Destroyed...");
      }

      console.log("Job finished...");
      job.status = "completed";
    }, 3000);
  }

}


// There are two types of jobs:
// "provision" — Creates infrastructure.
// "destroy" — Tears down infra
