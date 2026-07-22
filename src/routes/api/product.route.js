import { Router } from "express";
import { addProduct } from "../../controllers/api/product.controller.js";
import { requireAdmin } from "../../middlewares/auth.middleware.js";
const router = Router();

router.post("/product", requireAdmin, addProduct)
export default router;
