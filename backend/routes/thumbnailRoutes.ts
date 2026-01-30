import express from "express";
import {
  deleteThumbnail,
  generateThumbnail,
  getAllThumbnails,
} from "../controllers/thumbnailsController.js";
import protect from "../middleWares/auth.js";

const ThumbnailRoutes = express.Router();

ThumbnailRoutes.post("/generate", protect, generateThumbnail);
ThumbnailRoutes.delete("/delete/:id", protect, deleteThumbnail);
ThumbnailRoutes.get("/getAllThumbnails", getAllThumbnails);

export default ThumbnailRoutes;
