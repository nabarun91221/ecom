export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash("error", "Please log in to continue.");
    return res.redirect(`/web/auth/login?next=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.session.user) return res.redirect("/web/auth/login");
  if (req.session.user.role !== "ADMIN") return res.status(403).send("Admin access required");
  next();
};

export const requireUser = (req, res, next) => {
  if (!req.session.user) return res.redirect("/web/auth/login");
  if (req.session.user.role !== "USER") return res.status(403).send("Cart and checkout are only available to customer accounts.");
  next();
};
