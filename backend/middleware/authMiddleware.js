const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = {
      id: decoded.id,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token." });
    } else {
      console.log(err.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = authMiddleware;