const Post = require("../models/Post");
const Players = require("../models/UserNTW");

module.exports = {
  addGameToPlayer: async (req, res) => {
    try {
      const game = await Post.findById(req.params.id);
      const player = await Players.findById(req.body.playerId);
      if (player.games.indexOf(req.params.id) == -1) {
        await Players.findOneAndUpdate(
          { _id: req.body.playerId },
          {
            $push: { games: game, }
          }
        );
        console.log("Game Added");
      } else {
        console.log("Already playing this game")
      }
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
}