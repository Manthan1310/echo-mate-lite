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

// Updated CORS configuration
const corsOptions = {
    origin: ["http://65.1.248.203:3000", "http://localhost:3000"], // Allow both EC2 and local frontend
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" });
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening at port ${process.env.PORT}`);
});
