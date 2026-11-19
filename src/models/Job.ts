export interface Job {
  uuid: string;
  environmentId: string;
  type: string;
  status: string;
  createdAt: string;
};


// There are two types of jobs:
// "provision" — Creates infrastructure.
// "destroy" — Tears down infra
