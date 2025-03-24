import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { getEnv } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import merchantGoodsRoutes from "./routes/merchantGoodsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = getEnv("PORT");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(
  session({
    name: "my-session",
    secret: getEnv("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/merchant/goods", merchantGoodsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
