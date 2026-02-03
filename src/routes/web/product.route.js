import { Router } from "express";
import { renderProducts,renderProductFormToAdd,renderRecoverPage,submitProductForm,renderFilteredProducts,renderProductFormToEdit,updateProduct,deleteProduct,renderSearchedProducts,hardDeleteProduct,recoverProduct,deteleSingleImageFromAProduct,exportProductsAsCsv,importProductFromCsv } from "../../controllers/web/product.controller.js";
import upload from "../../utils/multer.js";
import {upload as upload_csv} from "../../utils/multer-csv.js"
const router = Router();
router.get("/products", renderProducts);
router.get("/product/add", renderProductFormToAdd);
router.post("/product/add", upload.array("images", 5), submitProductForm)
router.get("/product/edit/:id", renderProductFormToEdit)
router.post("/product/edit/:id", upload.array("images",5), updateProduct)
router.post("/product/delete/:id", deleteProduct)
router.get("/products/filter", renderFilteredProducts)
router.get("/products/search",renderSearchedProducts)
router.get("/products/recover", renderRecoverPage)
router.delete("/products/delete/:id", hardDeleteProduct)
router.post("/products/recover/:id", recoverProduct)
router.delete("/products/delete/image/:productId/",deteleSingleImageFromAProduct)
router.post("/products/generate-csv", exportProductsAsCsv)
router.post("/products/import-csv",upload_csv.single("csv"),importProductFromCsv)
export default router;