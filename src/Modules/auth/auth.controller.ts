import type { Request, Response } from "express";
import { pool } from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login_user = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};

    // 1. validate input
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 2.Find user by emal
    const result = await pool.query(`SELECT * FROM  users WHERE email = $1`, [
      email.trim().toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // 3 Compare password with hashed password

    const is_Hashed_Mached = await bcrypt.compare(password, user.password);

    if (!is_Hashed_Mached) {
      return res.status(401).json({
        success: false,
        message: "Invalid password or email",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is  not configured ");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    //5. Send response
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
