const cloudinary = require("../middleware/cloudinary");
const Players = require("../models/UserNTW");
const Encounter = require("../models/Encounter");
const Rounds = require("../models/Round");
const Character = require("../models/Character");

module.exports = {
  createRound: async (req, res) => {
    try {
      const encounter = await Encounter.findById(req.params.encounterId)
      const dm = await Players.findById(encounter.dm)
      const player = await Players.findById(req.params.playerId);
      const playerCharacter = await Character.findById(req.params.characterId);
      const playerName = player.id == dm.id ? "DM" : player.userName;

      if (req.body.type == "textRound") {
        await Rounds.create({
          description: req.body.description,
          encounter: encounter,
          player: playerName,
          playerCharacter: playerCharacter.name,
          dm: dm,
          type: "textRound",
        });
      } else {
        await Rounds.create({
          description: "Player roll",
          encounter: encounter,
          player: "DM",
          dm: dm,
          type: "rollRound",
          rollFor: req.body.rollFor,
          target: req.body.target,
          playerToRoll: player,
          rollCategory: req.body.rollCategory,
          playerCharacter: playerCharacter.name,
        });
      }

      if (encounter.dm == req.params.playerId) {
        console.log("God has spoken")
        encounter.dmTurn = false;
        await encounter.save()
      } else {
        encounter.dmTurn = true;
        await encounter.save()
      }
      const rounds = await Rounds.find({encounter: req.params.encounterId}).sort({ createdAt: "desc" }).lean();
      res.json(rounds)
    } catch (err) {
      console.log(err);
    }
  },
  likeRound: async (req, res) => {
    try {
      await Rounds.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
    } catch (err) {
      console.log(err);
    }
  },
  editRound: async (req, res) => {
    try {
      await Rounds.findOneAndUpdate(
        { _id: req.params.id },
        {
          description: req.body.description,
        },
      )
    } catch (err) {
      console.log(err)
    }
  },
  makeRoll: async (req, res) => {
    try {
      const character = await Character.findById(req.params.characterId);
      const d20 = Math.ceil(Math.random() * 20)
      const round = await Rounds.findById(req.params.roundId);
      let characterModifier = character[round.rollCategory][round.rollFor]

      await Rounds.findOneAndUpdate(
        { _id: req.params.roundId },
        {
          playerRoll: characterModifier + d20,
          rolled: true,
          nat20: d20 == 20,
        },
      )
      const rounds = await Rounds.find({encounter: round.encounter}).sort({ createdAt: "desc" }).lean();
      res.json({rounds})
    } catch (err) {
      console.log(err)
    }
  },
  deleteRound: async (req, res) => {
    try {
      await Rounds.remove({ _id: req.params.id });
      console.log()
      const rounds = await Rounds.find({encounter: req.params.encounterId}).sort({ createdAt: "desc" }).lean();
      console.log(rounds)
      res.json({ rounds })
    } catch (err) {
      res.redirect("back");
    }
  },
};
