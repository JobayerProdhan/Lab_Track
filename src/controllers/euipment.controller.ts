import { json, response, type Request, type Response } from "express";
import { pool } from "../config/db.js";

const createEquipment = async (req: Request, res: Response) => {
  try {
    const { name, category, serial_number, status, purchase_date } = req.body;

    const result = await pool.query(
      `INSERT INTO equipment
        (name,category,serial_number,status,purchase_date)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *`,
      [
        name,
        category,
        serial_number,
        status || "available",
        purchase_date || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create equipment",
    });
  }
};

const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM equipment ORDER BY id ASC`);

    res.status(200).json({
      success: true,
      message: "Equipment Retrived successfully",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

const get_equipment_by_id = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(`SELECT * FROM equipment WHERE id = $1`, [
    id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Equipment  No found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Equipment retrieved successfully",
    data: result.rows[0],
  });
};

const updateEquipment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, serial_number, status, purchase_date } = req.body;

    const result = await pool.query(
      `UPDATE equipment
       SET name = $1,
           category = $2,
           serial_number = $3,
           status = $4,
           purchase_date = $5
       WHERE id = $6
       RETURNING *`,
      [name, category, serial_number, status, purchase_date || null, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to updata equipment",
    });
  }
};

const delete_Equipment_by_id = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM equipment  WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error founded",
    });
  }
};

export const equipmentController = {
  createEquipment,
  getAllEquipment,
  get_equipment_by_id,
  updateEquipment,
  delete_Equipment_by_id
};
