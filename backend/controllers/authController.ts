import User from "../models/user.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

// Controller for user registeration

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User is already Exits", success: false });
    }
    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPasswored = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPasswored });
    await newUser.save();
    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;
    return res.status(200).json({
      message: "Account Created SuccessFully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.massage });
  }
};

// controller for user login

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid Email or Password ", success: false });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid Email or Password ", success: false });
    }
    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    return res.status(200).json({
      message: "Login SuccessFully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// controller for user logout

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy((error: any) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ message: "Logout Successfully" });
  });
};

// controller for user verify

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }
    return res.json({ user });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.massage });
  }
};
