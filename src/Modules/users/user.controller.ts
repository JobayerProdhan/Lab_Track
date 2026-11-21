import type { Request, Response } from "express";
import { equipmentController } from "../controllers/euipment.controller.js";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db.js";

export const registration = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body ?? {};

    // 1. validate  input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name , email and password are required",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "invalid input types",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLocaleLowerCase();

    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid name and email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // 2. Hash Password
    const hashed_password = await bcrypt.hash(password, 10);

    // 3. Insert user into database
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role, created_at`,
      [cleanName, cleanEmail, hashed_password],
    );

    //4. send response

    return res.status(200).json({
      success: true,
      message: "User registered  successfully",
      data: result.rows[0],
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return res.status(400).json({
        success: false,
        message: "Email alrady exists",
      });
    }

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
