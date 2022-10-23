module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("Authenticated")
      return next();
    } else {
      // res.redirect("/");
      res.redirect(`https://notthisweek.vercel.app/`);
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
