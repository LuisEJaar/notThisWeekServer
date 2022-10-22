module.exports = {
  getIndex: (req, res) => {
    // res.render("index.ejs");
    res.redirect(`https://notthisweek.vercel.app/`);
  },
};
