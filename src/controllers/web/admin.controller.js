import Category from "../../models/category.model.js";
import Brand from "../../models/brand.model.js";

const modelFor = type => type === "categories" ? Category : type === "brands" ? Brand : null;
export const catalogPage = async (req, res) => {
  const Model = modelFor(req.params.type); if (!Model) return res.status(404).send("Not found");
  const records = await Model.find().sort({ isDeleted: 1, name: 1 });
  res.render("admin/catalog.ejs", { type: req.params.type, records });
};
export const createCatalog = async (req, res) => {
  const Model = modelFor(req.params.type); if (!Model) return res.status(404).send("Not found");
  try { await Model.create({ name: req.body.name, status: req.body.status || "active" }); req.flash("success", "Created successfully."); }
  catch (error) { req.flash("error", error.code === 11000 ? "That name already exists." : error.message); }
  const returnTo = req.body.returnTo?.startsWith("/web/product") ? req.body.returnTo : `/web/admin/${req.params.type}`;
  res.redirect(returnTo);
};
export const updateCatalog = async (req, res) => {
  const Model = modelFor(req.params.type); if (!Model) return res.status(404).send("Not found");
  await Model.findByIdAndUpdate(req.params.id, { name: req.body.name, status: req.body.status });
  req.flash("success", "Updated successfully."); res.redirect(`/web/admin/${req.params.type}`);
};
export const toggleCatalogDelete = async (req, res) => {
  const Model = modelFor(req.params.type); if (!Model) return res.status(404).send("Not found");
  await Model.findByIdAndUpdate(req.params.id, { isDeleted: req.body.deleted === "true" });
  req.flash("success", "Record updated."); res.redirect(`/web/admin/${req.params.type}`);
};
export const hardDeleteCatalog = async (req, res) => {
  const Model = modelFor(req.params.type); if (!Model) return res.status(404).send("Not found");
  await Model.findByIdAndDelete(req.params.id); req.flash("success", "Record permanently deleted."); res.redirect(`/web/admin/${req.params.type}`);
};
