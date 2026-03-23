import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

// when we authenticate the user with the token we insert its detail in the req itself as this is a middleware

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: `jwt verifying error ${error.message}`,
        });
    }
};
