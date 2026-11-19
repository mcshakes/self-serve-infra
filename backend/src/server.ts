import app from "./app.ts";

const PORT = 8000;

app.listen(PORT, (): void => {
  console.log(`App listening on port ${PORT}`);
});
