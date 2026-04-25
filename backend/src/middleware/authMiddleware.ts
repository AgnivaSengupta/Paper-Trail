import type { Request, Response, NextFunction } from "express";
import { auth, getSession } from "../lib/auth";

declare global {
  namespace Express {
    interface Request{
      user?: typeof auth.$Infer.Session.user; 
      session?: typeof auth.$Infer.Session.session;
    }
  }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionContext = await getSession(req);
    
    if (!sessionContext) {
      return res.status(401).json({message: "Not authorized"})
    }
    
    req.user = sessionContext.user;
    req.session = sessionContext.session;
    next(); // ← was missing — without this, the request hangs
  } catch (error) {
      console.error("Auth Middleware Error:", error);
      // Better Auth handles standard auth failures by returning null above. 
      // If it hits this catch block, it's likely a DB connection issue or server error.
      return res.status(500).json({ message: "Internal server error during authentication" });
  }
}

export default protect;