import express from "express";
import {
  deleteThumbnail,
  generateThumbnail,
} from "../controllers/thumbnailsController.js";
import protect from "../middleWares/auth.js";

const ThumbnailRoutes = express.Router();

ThumbnailRoutes.post("/generate", protect, generateThumbnail);
ThumbnailRoutes.delete("/delete/:id", protect, deleteThumbnail);

export default ThumbnailRoutes;
