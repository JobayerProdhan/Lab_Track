import { Router } from "express";
import { equipmentController} from "../controllers/euipment.controller.js";



const  router= Router();

router.post("/",equipmentController.createEquipment);

router.get("/",equipmentController.getAllEquipment);

router.get("/:id",equipmentController.get_equipment_by_id);

export default router;