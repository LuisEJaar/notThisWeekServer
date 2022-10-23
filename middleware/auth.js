module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("Authenticated")
      return next();
    } else {
      // res.redirect("/");
      console.log("redirected")
      console.log(req.user)
      // res.redirect(`https://notthisweek.vercel.app/`);
      res.redirect(`back`);
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/dashboard");
    }
  },
};
