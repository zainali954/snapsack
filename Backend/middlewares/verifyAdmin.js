import apiError from "../utils/apiError.js";

const verifyAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new apiError(401, "Unauthorized. Please log in."));
    }

    if (req.user.role !== "admin") {
        return next(new apiError(403, "Access denied. You must be an admin to perform this action."));
    }

    next();
};

export default verifyAdmin;
