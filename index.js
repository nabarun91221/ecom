import express from "express";
import { configDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productRouter_web from "./src/routes/web/product.route.js";
import productRouter_api from "./src/routes/api/product.route.js";
import { connectMongoClient } from "./src/configs/mongoDB.config.js";
import session from "express-session";
import flash from "connect-flash"
import { options } from "./src/configs/session.config.js";
import productModel from "./src/models/product.model.js";

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

(async () => {
  try {
    await connectMongoClient();
    await productModel.syncIndexes();
    console.log("Indexes are synced")
  } catch (error) {
    console.error("Unable to connect to MongoDB or creating index", error);
    process.exit(1);
  }
})();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session(options));
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).send(err.message);
});

// routes
app.use("/web", productRouter_web);
app.use("/api", productRouter_api);

app.listen(PORT,"0.0.0.0", () =>
{
  console.log(`ENV:${process.env.NODE_ENV}`)
  if (!process.env.NODE_ENV == "production") console.log("http://localhost:", PORT);
  else console.log(`http://${process.env.VPS_IP}:${PORT}`)
});
