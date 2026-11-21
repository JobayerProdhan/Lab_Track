import { defaultMaxListeners } from "events";
import type { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorizd access",
    });
  }
};

export default auth;
