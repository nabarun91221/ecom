import { Router } from "express";
import { requireUser } from "../../middlewares/auth.middleware.js";
import { addToCart, cartPage, checkout, removeItem, saveForLater, updateQuantity } from "../../controllers/web/cart.controller.js";
const router = Router(); router.use(requireUser);
router.get("/", cartPage).post("/add/:productId", addToCart).post("/item/:itemId/save", saveForLater).post("/item/:itemId/quantity", updateQuantity).post("/item/:itemId/remove", removeItem).post("/checkout", checkout);
export default router;
