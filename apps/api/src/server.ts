import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app";

const port = parseInt(process.env.PORT || "4000", 10);
const server = http.createServer(app);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`);
});
