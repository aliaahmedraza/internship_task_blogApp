import jwt from "jsonwebtoken";
import userModel from "../../models/userModel.js";

const AuthenticationMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: "Authorization token missing or invalid format. Please provide a Bearer token."
            });
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findById(decodedToken?.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found or no longer exists"
            });
        }

        if (user.email !== decodedToken.email) {
            return res.status(401).json({
                message: "Invalid token credentials"
            });
        }

        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
            , name: user.name
        };
        console.log("Auth Header:", authHeader);
        console.log("Extracted Token:", token);
        console.log(req.user);

        next();
    } catch (error) {
        console.error('Authentication Error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Token has expired. Please login again"
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid token format. Please login again"
            });
        }

        return res.status(500).json({
            message: "Authentication error occurred"
        });
    }
};

export default AuthenticationMiddleware;