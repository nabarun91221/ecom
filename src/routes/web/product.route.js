import { Router } from "express";
import { renderProducts,renderProductFormToAdd,renderRecoverPage,submitProductForm,renderFilteredProducts,renderProductFormToEdit,updateProduct,deleteProduct,renderSearchedProducts,hardDeleteProduct,recoverProduct } from "../../controllers/web/product.controller.js";
const router = Router();
router.get("/products", renderProducts);
router.get("/product/add", renderProductFormToAdd);
router.post("/product/add", submitProductForm)
router.get("/product/edit/:id", renderProductFormToEdit)
router.post("/product/edit/:id", updateProduct)
router.post("/product/edit/:id", updateProduct)
router.post("/product/delete/:id", deleteProduct)
router.get("/products/filter", renderFilteredProducts)
router.get("/products/search",renderSearchedProducts)
router.get("/products/recover", renderRecoverPage)
router.delete("/products/delete/:id", hardDeleteProduct)
router.post("/products/recover/:id",recoverProduct)


export default router;