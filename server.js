import bodyParser from "body-parser";
import express from "express";
import { getEnv } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = getEnv("PORT");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
