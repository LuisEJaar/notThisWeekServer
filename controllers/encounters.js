const cloudinary = require("../middleware/cloudinary");
const Encounter = require("../models/Encounter");
const Rounds = require("../models/Round");
const Character = require("../models/Character");

module.exports = {
  getEncounter: async (req, res) => {
    try {
      const encounter = await Encounter.findById(req.params.id);
      const potentialParty = await Character.find({ game: encounter.post });
      const party = await potentialParty.filter((member) => {
        if (encounter.characters.indexOf(member._id) != -1) {
          return true;
        }
      });
      const characterTurn = party[encounter.initiative % party.length];
      const rounds = await Rounds.find({ encounter: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.json({ encounter: encounter, user: req.user, party: party, characterTurn: characterTurn, rounds: rounds});
    } catch (err) {
      console.log(err);
    }
  },
  createEncounter: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
      }

      const characters = await shuffle(req.body.characters);

      await Encounter.create({
        title: req.body.title,
        location: req.body.location,
        description: req.body.description,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        likes: 0,
        post: req.params.id,
        dm: req.user.id,
        characters: characters,
        initiative: 0,
      });
      console.log("Encounter has been added!");
      res.redirect('back');
    } catch (err) {
      console.log(err);
    }
  },
  likeEncounter: async (req, res) => {
    try {
      await Encounter.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  progressEncounter: async (req, res) => {
    try {
      await Encounter.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { initiative: 1 },
        }
      );
      const encounter = await Encounter.findById(req.params.id);
      const potentialParty = await Character.find({ game: encounter.post });
      const party = await potentialParty.filter((member) => {
        if (encounter.characters.indexOf(member._id) != -1) {
          return true;
        }
      });
      const characterTurn = await party[encounter.initiative % party.length];
      res.json({characterTurn: characterTurn})
    } catch (err) {
      console.log(err);
    }
  },
  toggleEncounter: async (req, res) => {
    try {
      let encounter = await Encounter.findOne({ _id: req.params.id })
      encounter.active = !encounter.active;
      
      await encounter.save()
      res.json({encounter})
    } catch (err) {
      console.log(err);
    }
  },
  toggleDm: async (req, res) => {
    try {
      let encounter = await Encounter.findOne({ _id: req.params.id })
      encounter.dmTurn = !encounter.dmTurn;

      await encounter.save()
      res.json({ encounter })
    } catch (err) {
      console.log(err);
    }
  },
  deleteEncounter: async (req, res) => {
    try {
      // Find encounter by id
      let encounter = await Encounter.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(encounter.cloudinaryId);
      // Delete post from db
      await Encounter.remove({ _id: req.params.id });
      console.log("Deleted Encounter");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
