module.exports = {
  getIndex: (req, res) => {
    // res.render("index.ejs");
    res.render(`https://notthisweek.vercel.app/`);
  },
};
