import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json("No token");

  //  HANDLE BOTH: Bearer + raw token
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  GET FULL USER FROM DB
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json("User not found");

    //  SET BOTH ID + NAME
    req.user = user._id;
    req.userName = user.name;

    next();
  } catch (err) {
    return res.status(401).json("Invalid token");
  }
};
