import jwt from "jsonwebtoken";

// jwt verification
const authenticateToken=(req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token." });
    }
};

const authorizeRole= (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
        next();
    };
};

export {authenticateToken,authorizeRole};

