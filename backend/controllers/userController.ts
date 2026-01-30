import { Request, Response } from "express";
import Thumbnail from "../models/thumbnailModel.js";

// Controller to get All User Thumbnails

export const getUserThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });

    res.json({ thumbnails });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// controller to get the single thumbnail of the user

export const getThumbnailById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const { id } = req.params;

    const thumbnail = await Thumbnail.findOne({ userId, _id: id });

    res.json({ thumbnail });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
