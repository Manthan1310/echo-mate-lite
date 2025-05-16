// index.js
import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: ".env" });
databaseConnection();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
