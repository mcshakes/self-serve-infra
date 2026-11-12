import express from "express";
import type { Express } from "express";
import templates from "./routes/templates.ts";
import environments from "./routes/environments.ts";
import jobs from "./routes/jobs.ts";



const PORT = 8000;
const app:Express = express();
app.use(express.json());

app.use('/api', templates);
app.use('/api', environments);
app.use('/api', jobs);



app.listen(PORT, (): void => {
  console.log(`App listening on port ${PORT}`);
});
