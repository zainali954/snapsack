import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";

const verifyAuth = (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', "");

        if (!accessToken) {
            return next(new apiError(401, "Session expired. Please login again."));
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return next(new apiError(401, "Unauthorized. Token has expired."));
            }


            return next(new apiError(403, "Invalid access token. Please log in again."));
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        return next(new apiError(401, "Authentication failed. Please log in again."));
    }
};

export default verifyAuth;
