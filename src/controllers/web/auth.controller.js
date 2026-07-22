import User from "../../models/user.model.js";

export const signupPage = (req, res) => res.render("auth/signup.ejs");
export const loginPage = (req, res) => res.render("auth/login.ejs", { next: req.query.next || "/web/products" });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) throw new Error("Name, email, and an 8-character password are required.");
    const user = new User({ name, email });
    user.setPassword(password);
    await user.save();
    req.session.user = { id: user.id, name: user.name, role: user.role };
    req.flash("success", "Account created. Welcome!");
    res.redirect("/web/products");
  } catch (error) {
    req.flash("error", error.code === 11000 ? "That email is already registered." : error.message);
    res.redirect("/web/auth/signup");
  }
};

export const login = async (req, res) => {
  const { email, password, next = "/web/products" } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !user.verifyPassword(password || "")) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/web/auth/login");
  }
  req.session.user = { id: user.id, name: user.name, role: user.role };
  req.flash("success", "Logged in successfully.");
  res.redirect(user.role === "ADMIN" && next === "/web/products" ? "/web/admin/products" : next);
};

export const logout = (req, res) => req.session.destroy(() => res.redirect("/web/products"));
