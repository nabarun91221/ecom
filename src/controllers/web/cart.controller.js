import Cart from "../../models/cart.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";

const cartFor = user => Cart.findOneAndUpdate({ user }, { $setOnInsert: { user } }, { new: true, upsert: true });
export const cartPage = async (req, res) => {
  const cart = await cartFor(req.session.user.id);
  await cart.populate({ path: "items.product", populate: ["brand", "category"] });
  res.render("cart/index.ejs", { cart });
};
export const addToCart = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, isDeleted: false, status: "active", stock: { $gt: 0 } });
  if (!product) { req.flash("error", "This product is unavailable."); return res.redirect("/web/products"); }
  const cart = await cartFor(req.session.user.id);
  const item = cart.items.find(i => i.product.equals(product._id));
  if (item) { item.quantity = Math.min(item.quantity + 1, product.stock); item.savedForLater = false; } else cart.items.push({ product: product._id });
  await cart.save(); req.flash("success", "Added to cart."); res.redirect(req.get("referer") || "/web/products");
};
export const saveForLater = async (req, res) => {
  const cart = await cartFor(req.session.user.id); const item = cart.items.id(req.params.itemId);
  if (item) { item.savedForLater = req.body.saved === "true"; await cart.save(); }
  res.redirect("/web/cart");
};
export const updateQuantity = async (req, res) => {
  const cart = await cartFor(req.session.user.id); const item = cart.items.id(req.params.itemId);
  if (item) { item.quantity = Math.max(1, Number(req.body.quantity) || 1); await cart.save(); }
  res.redirect("/web/cart");
};
export const removeItem = async (req, res) => {
  const cart = await cartFor(req.session.user.id); cart.items.pull({ _id: req.params.itemId }); await cart.save(); res.redirect("/web/cart");
};
export const checkout = async (req, res) => {
  const cart = await cartFor(req.session.user.id);
  const items = cart.items.filter(i => !i.savedForLater);
  if (!items.length) { req.flash("error", "Your cart is empty."); return res.redirect("/web/cart"); }
  const products = await Product.find({ _id: { $in: items.map(i => i.product) }, isDeleted: false, status: "active" });
  const lines = items.map(item => ({ item, product: products.find(p => p.id === item.product.toString()) }));
  if (lines.some(({ item, product }) => !product || product.stock < item.quantity)) { req.flash("error", "One or more products no longer have enough stock."); return res.redirect("/web/cart"); }
  const result = await Product.bulkWrite(lines.map(({ item, product }) => ({ updateOne: { filter: { _id: product._id, stock: { $gte: item.quantity } }, update: { $inc: { stock: -item.quantity } } } })));
  if (result.modifiedCount !== lines.length) { req.flash("error", "Stock changed while checking out. Please retry."); return res.redirect("/web/cart"); }
  const order = await Order.create({ user: req.session.user.id, items: lines.map(({ item, product }) => ({ product: product._id, name: product.name, price: product.price, quantity: item.quantity })), total: lines.reduce((sum, l) => sum + l.product.price * l.item.quantity, 0) });
  cart.items = cart.items.filter(i => i.savedForLater); await cart.save();
  res.render("orders/confirmation.ejs", { order });
};
