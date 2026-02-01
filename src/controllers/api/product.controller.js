import Product from "../../models/product.model.js";

export const getProducts = (req, res) =>
{
    try {
        const products = ProductSchema.find({ status: "active" });
        res.send(products);
    } catch (error) {
        console.log({ msg: "some error occurred while getting products", error: error });
    }
}
export const getProductById = (req,res) =>
{
    const id = req.id;
    try {
        const products = ProductSchema.findById(id);
        res.send(products);
    } catch (error) {
        console.log({ msg: `some error occurred while getting product:${id}`, error: error });
    }
}
export const addProduct = (req, res) =>
{
    let newProduct = req.body;
    console.log(newProduct);
    try {
        newProduct = ProductSchema.create(newProduct);
        res.send(newProduct);
    } catch (error) {
        console.log({ msg: "some error occurred while creating product", error: error });
    }
}