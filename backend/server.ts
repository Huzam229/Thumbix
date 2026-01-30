import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import AuthRouter from "./routes/authRoutes.js";
import ThumbnailRoutes from "./routes/thumbnailRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
    userId?: string;
  }
}

await connectDB(); // define in db.js file
// Configure Cloudinary
connectCloudinary();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://thumbix-client.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 24 * 7,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
    },

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL as string,
      collectionName: "session",
    }),
  }),
);
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});
app.use("/api/auth", AuthRouter);
app.use("/api/thumbnail", ThumbnailRoutes);
app.use("/api/user", UserRouter);
const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
