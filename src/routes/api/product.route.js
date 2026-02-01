import { Router } from "express";
import { addProduct } from "../../controllers/api/product.controller.js";
const router = Router();

router.post("/product", addProduct)
export default router;