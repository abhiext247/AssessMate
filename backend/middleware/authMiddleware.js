import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// // Middleware to check if the user is authenticated
// export const protect = async (req, res, next) => {
//   let token = req.headers.authorization;
//   if (token && token.startsWith("Bearer")) {
//     try {
//       token = token.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       next();
//     } catch (error) {
//       res.status(401).json({ message: "Not authorized, invalid token" });
//     }
//   } else {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

export const protect = async (req, res, next) => {
  // console.log("Received headers:", req.headers); // Debugging
  
  let token = req.headers.authorization;
  // console.log(object)

  if (!token) {
    console.error("No token received in request");
    return res.status(401).json({ message: "Not authorized, no token received" });
  }
  console.log(token)

  if (token.startsWith("Bearer")) {
    token = token.split(" ")[1];
  } else {
    console.error("Invalid token format:", token);
    return res.status(401).json({ message: "Not authorized, invalid token format" });
  }

  // console.log("token::",token)
  // let decoded;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded::",decoded)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    // console.log(decoded);
    res.status(401).json({ message: "Not authorized, token verification failed" });
  }
};


// Middleware to check user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// Define `verifyAdmin` middleware using `authorizeRoles`
export const verifyAdmin = authorizeRoles("admin");
