import express from "express";
import {
  getThumbnailById,
  getUserThumbnail,
} from "../controllers/userController.js";
import protect from "../middleWares/auth.js";

const UserRouter = express.Router();

UserRouter.get("/thumbnails", protect, getUserThumbnail);
UserRouter.get("/thumbnails/:id", protect, getThumbnailById);

export default UserRouter;
