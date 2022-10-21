const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Players = require("../models/UserNTW");
const Character = require("../models/Character");
const Encounter = require("../models/Encounter");

module.exports = {
  getUserProfile: async (req, res) => {
    try {
      let targetUser
      console.log(req.params.id)
      console.log(req.user.id)
      if (req.params.id != "own") {
        targetUser = await Players.findById({ _id: req.params.id });
      } else {
        targetUser = await Players.findById({ _id: req.user.id });
      }
      if (targetUser.type == "dm") {
        
        const posts = await Post.find({ user: targetUser.id });
        res.json({ visitor: req.user, targetUser: targetUser, posts: posts });

      } else {
        let posts = []
        for (i = 0; i < targetUser.games.length; i++){
          const post = await Post.findById({ _id: targetUser.games[0] })
          posts.push(post)
        }
        const characters = await Character.find({user: targetUser.id})
        res.json({ visitor: req.user, targetUser: targetUser, posts: posts, characters: characters});
      }
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.json({ posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getCharacterFeed: async (req, res) => {
    try {
      const characters = await Character.find().sort({ createdAt: "desc" }).lean();
      res.json({ characters: characters });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const players = await Players.find({ type: "player" });
      const party = await Players.find({ games: req.params.id });
      const encounters = await Encounter.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      const characters = await Character.find({ game: req.params.id })
      const visitorCharacters = await Character.find({user: req.user.id})

      res.json(
        {
          post: post,
          user: req.user,
          players: players,
          party: party,
          encounters: encounters,
          characters: characters,
          visitorCharacters: visitorCharacters,
        });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/userProfile/own");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    console.log("likeRoute")
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/userProfile/own");
    } catch (err) {
      res.redirect("/userProfile/own");
    }
  },
};
