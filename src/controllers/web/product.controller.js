import { error } from "node:console";
import { PRODUCT_CATEGORIES,PRODUCT_SIZES,PRODUCT_BRAND } from "../../constants/product.enums.js";
import Product from "../../models/product.model.js";
import cloudinary from "../../configs/clodinery.config.js";
import { Parser } from "json2csv";
import { createReadStream } from "fs";
import { unlink } from "fs/promises";
import csvParser from "csv-parser";
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
  const images = req.files.map(f =>
  ({
    url: f.path,
    public_id: f.filename  
   })
  );
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
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/web/products");
    }

    const newImages = req.files?.map(f => ({
      url: f.path,
      public_id: f.filename
    })) || [];

    const images = [...product.images, ...newImages];

    const updatePayload = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      images
    };

    await Product.findByIdAndUpdate(productId, updatePayload, {
      runValidators: true
    });

    req.flash("success", "Product updated successfully!");
    return res.redirect("/web/products");

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    req.flash("error", "Something went wrong");
    return res.redirect("back");
  }
};

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
export const deteleSingleImageFromAProduct = async(req,res) =>
{
  const { productId } = req.params
  const { imageId } =req.body
  console.log({ productId: productId, imageId: imageId })
  try {
    let product = await Product.findById(productId)
    const remainingProducImages = product.images.filter(image => image.public_id != imageId)
    product.images = remainingProducImages;
    await Product.findByIdAndUpdate(productId,product)
    await cloudinary.uploader.destroy(imageId)
    req.flash("success", "image deleted");
    return res.status(200).send("the image has successfully deleted")
  } catch (err) {
    console.error(err);
    return res.status(400).send({msg:"something went wrong",error:err})
   }
}

export const exportProductsAsCsv = (req,res) =>
{
  const products = req.body;
  try {
      const formatted = products.map(p => ({
      name: p.name,
      price: p.price,
      desc: p.desc,
      brand: p.brand,
      category: p.category,
      size: p.size,
      stock: p.stock,
      color: p.color,
      status: p.status,
      images: JSON.stringify(p.images || []), 
      isDeleted: p.isDeleted
  }));
  const parser = new Parser({ fields: Object.keys(formatted[0]) })
  const csvData = parser.parse(formatted)
  res.header("Content-Type", "text/csv");
    res.attachment(`products-${Date.now()}.csv`);
    console.log(csvData)
    return res.send(csvData);
    
  }catch(err){
    console.log(err)
    res.status(500).send("server error! generating csv")
  }

}


export const importProductFromCsv = async (req, res) => {

  const filePath = req.file.path;
  const newProductsPayload = [];

  createReadStream(filePath)
    .pipe(csvParser())

    .on("data", (data) => {

      let images = [];
      try {
        if (data.images) {
          images = JSON.parse(data.images);
        }
      } catch {
        images = [];
      }

      newProductsPayload.push({
        name: data.name,
        price: Number(data.price),
        desc: data.desc,
        brand: data.brand,
        category: data.category,
        size: data.size,
        stock: Number(data.stock),
        color: data.color,
        status: (data.status || "active").toLowerCase(),
        images,
        isDeleted: data.isDeleted === "true"
      });

    })

    .on("end", async () => {
      try {
        await Product.insertMany(newProductsPayload);

        await unlink(filePath);

        req.flash("success", "Products imported successfully");
        return res.redirect("/web/products");

      } catch (err) {
        console.error(err);

        req.flash("error", "CSV import failed");
        return res.status(500).send("CSV import failed");
      }
    })

    .on("error", (err) => {
      console.error(err);
      return res.status(400).send("Invalid CSV file");
    });

};


