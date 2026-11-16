import express from "express";
import type { Express } from "express";

const app:Express = express();
app.use(express.json());


import templates from "./routes/templates.ts";
import environments from "./routes/environments.ts";
import jobs from "./routes/jobs.ts";

app.use('/api', templates);
app.use('/api', environments);
app.use('/api', jobs);

export default app;
