import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../jwtUtils';


interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token is required' });
    return; 
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next(); 
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    return; 
  }
};