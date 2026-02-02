import { error } from "node:console";
import { PRODUCT_CATEGORIES,PRODUCT_SIZES,PRODUCT_BRAND } from "../../constants/product.enums.js";
import Product from "../../models/product.model.js";
export const renderProducts = async(req, res) =>
{
  const sortType = req.query.sort;
   const sortTypes = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      latest: { createdAt: -1 }
    };
  try {
    const products = await Product.find({ isDeleted: false }).sort(sortTypes[sortType])
    res.render("products.view.ejs",{ products, categories:PRODUCT_CATEGORIES,sizes:PRODUCT_SIZES,brands:PRODUCT_BRAND })
  } catch {
    console.log(error);
    return res.end();
  }

};

export const renderProductFormToAdd = (req, res) => {
  res.render("productForm.view.ejs", { product: null, categories:PRODUCT_CATEGORIES,sizes:PRODUCT_SIZES,brands:PRODUCT_BRAND  });
};

export const renderProductFormToEdit = async(req, res) =>
{
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (product) {
      res.render("productForm.view.ejs", { product, categories:PRODUCT_CATEGORIES,sizes:PRODUCT_SIZES,brands:PRODUCT_BRAND });
    }
    
  } catch (error) {
    console.log(error);
  }
  
};

export const submitProductForm = async (req, res) =>
{
  console.log(req.files);
  const images = req.files.map(f => f.path);
  const newProductPayload = {...req.body,images}
  
  try {
    await Product.create(newProductPayload );
    
    req.flash("success", "Product added successfully!");
    return res.redirect("/web/product/add");
  } catch (error) {
    console.error("CREATE PRODUCT ERROR ", error);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors)
      .map(err => err.message)
      .join(", ");
    req.flash("error", messages);
    return res.redirect("/web/product/add");
  }

  req.flash("error", error.message);
  return res.redirect("/web/product/add");
  }
}
export const updateProduct = async (req, res) =>
{
  const images = req.files.map(f => f.path);
  const productId = req.params.id;
  const toBeUpdateProductPayload={...req.body,images}
  try {
    const updateProduct = await Product.findByIdAndUpdate(productId, toBeUpdateProductPayload)
    if (updateProduct) {
      req.flash("success", "Product updated successfully!");
      return res.redirect("/web/products");
    }
    
  } catch (error) {
    console.log(error)
    req.flash("error", "Something went wrong");
    return;
  }
  
}
export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const redirectUrl = req.get("referer") || "/web/products";

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      req.flash("error", "Product not found");
      return res.redirect(redirectUrl);
    }

    req.flash("success", "Product deleted successfully!");
    return res.redirect(redirectUrl);

  } catch (error) {
    console.error("DELETE ERROR:", error);
    req.flash("error", "Something went wrong");
    return res.redirect(redirectUrl);
  }
};
export const hardDeleteProduct = async (req, res) => {
  const productId = req.params.id;
  console.log("hard delete controller hits", productId);

  try {
    const deleted = await Product.findByIdAndDelete(productId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    req.flash("success", "Product permanently deleted");

    return res.status(200).json({
      success: true,
      message: "Product deleted"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting product"
    });
  }
};

export const recoverProduct = async (req, res) => {
  try {
    const recoveredProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    if (!recoveredProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    req.flash("success", "Product recovered");

    return res.json({
      success: true,
      product: recoveredProduct
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Failed to recover product"
    });
  }
};


export const renderFilteredProducts = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    

    const { minPrice, maxPrice, sort:sortType } = queryObj;
    delete queryObj.minPrice;
    delete queryObj.maxPrice;
    delete queryObj.sort;

    const filter = { ...queryObj };

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    filter.isDeleted = false;
    const sortTypes = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      latest: { createdAt: -1 }
    };

    const products = await Product.find(filter).sort(sortTypes[sortType])
    console.log(sortTypes[sortType],products)

    return res.render("products.view.ejs", {
      products,
      categories: PRODUCT_CATEGORIES,
      sizes: PRODUCT_SIZES,
      brands: PRODUCT_BRAND
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send("Something went wrong");
  }
};
export const renderSearchedProducts = async (req, res) =>
{ 
  const searchstring = req.query.searchstring?.toLowerCase();
  const sortType = req.query.sort;
   const sortTypes = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      latest: { createdAt: -1 }
   };
  
  try {
    const searchedProducts = await Product.find({
      searchTokens: searchstring,
      isDeleted: false
    }).sort(sortTypes[sortType]);
    return res.render("products.view.ejs", {
      products: searchedProducts,
      categories: PRODUCT_CATEGORIES,
      sizes: PRODUCT_SIZES,
      brands: PRODUCT_BRAND
    })
  } catch (error) {
    console.log(error)
    return res.status(400).send({msg:"something went wrong"})
  }
}

export const renderRecoverPage = async(req,res) =>
{
  const sortType = req.query.sort;
   const sortTypes = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      latest: { createdAt: -1 }
    };
  try {
    const products = await Product.find({ isDeleted: true }).sort(sortTypes[sortType])
    res.render("recover.view.ejs",{products})
  } catch {
    console.log(error);
    return res.end();
  }
}

