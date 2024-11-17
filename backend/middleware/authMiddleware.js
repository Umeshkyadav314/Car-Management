import jwt from 'jsonwebtoken';


// Middleware to verify JWT and extract user ID
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token from Bearer

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user data to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

