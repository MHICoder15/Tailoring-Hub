import app from "./src/app.ts";
import { config } from "./src/config/config.ts";

const startServer = () => {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();