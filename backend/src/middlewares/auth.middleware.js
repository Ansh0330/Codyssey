import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized , Token not found" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized , Invalid token - Wrong Token",
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unauthorized , User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in middleware",error);
    res.status(500).json({
      success: false,
      message: "Error authenticating the user by jwt token",
      error: error.message,
    });
  }
};
