const authenticateJWT = (req, res, next) => {
    
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid token" });
        }

        req.userId = decoded.userId; // Store userId from decoded token
        next(); // Pass to the next middleware or route handler
    });
};

module.exports = authenticateJWT;
