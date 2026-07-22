import { Router } from "express";
import { renderProducts,renderProductFormToAdd,renderRecoverPage,submitProductForm,renderFilteredProducts,renderProductFormToEdit,updateProduct,deleteProduct,renderSearchedProducts,hardDeleteProduct,recoverProduct,deteleSingleImageFromAProduct,exportProductsAsCsv,importProductFromCsv } from "../../controllers/web/product.controller.js";
import upload from "../../utils/multer.js";
import {upload as upload_csv} from "../../utils/multer-csv.js"
import { requireAdmin } from "../../middlewares/auth.middleware.js";
const router = Router();
router.get("/products", renderProducts);
router.get("/product/add", requireAdmin, renderProductFormToAdd);
router.post("/product/add", requireAdmin, upload.array("images", 5), submitProductForm)
router.get("/product/edit/:id", requireAdmin, renderProductFormToEdit)
router.post("/product/edit/:id", requireAdmin, upload.array("images",5), updateProduct)
router.post("/product/delete/:id", requireAdmin, deleteProduct)
router.get("/products/filter", renderFilteredProducts)
router.get("/products/search",renderSearchedProducts)
router.get("/products/recover", requireAdmin, renderRecoverPage)
router.delete("/products/delete/:id", requireAdmin, hardDeleteProduct)
router.post("/products/recover/:id", requireAdmin, recoverProduct)
router.delete("/products/delete/image/:productId/",requireAdmin,deteleSingleImageFromAProduct)
router.post("/products/generate-csv", requireAdmin, exportProductsAsCsv)
router.post("/products/import-csv",requireAdmin,upload_csv.single("csv"),importProductFromCsv)
export default router;
