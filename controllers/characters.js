const cloudinary = require("../middleware/cloudinary");
const Character = require("../models/Character");
const Post = require("../models/Post");

module.exports = {
  createCharacter: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      await Character.create({
        name: req.body.name,
        class: req.body.class,
        age: req.body.age,
        race: req.body.race,
        lvl: req.body.lvl,
        gender: req.body.gender,

        abilities: {
          str: req.body.str,
          dex: req.body.dex,
          int: req.body.int,
          wis: req.body.wis,
          char: req.body.char,
          con: req.body.con,
        },

        skillProficiencies: {
          acrobatics: req.body.acrobatics ? true : false,
          animalHandling: req.body.animalHandling ? true : false,
          arcana: req.body.arcana ? true : false,
          athletics: req.body.athletics ? true : false,
          deception: req.body.deception ? true : false,
          history: req.body.history ? true : false,
          insight: req.body.insight ? true : false,
          intimidation: req.body.intimidation ? true : false,
          investigation: req.body.investigation ? true : false, 
          medicine: req.body.medicine ? true : false,
          nature: req.body.nature ? true : false,
          perception: req.body.perception ? true : false,
          performance: req.body.performance ? true : false,
          persuasion: req.body.persuasion ? true : false,
          religion: req.body.religion ? true : false,
          sleightOfHand: req.body.sleightOfHand ? true : false,
          stealth: req.body.stealth ? true : false,
          survival: req.body.survival ? true : false,
        },

        skillModifiers: {
          acrobatics: req.body.acrobatics ? ablMod(req.body.dex) + 2 : ablMod(req.body.dex),
          animalHandling: req.body.animalHandling ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
          arcana: req.body.arcana ? ablMod(req.body.int) + 2 : ablMod(req.body.int),
          athletics: req.body.athletics ? ablMod(req.body.str) + 2 : ablMod(req.body.str),
          deception: req.body.deception ? ablMod(req.body.char) + 2 : ablMod(req.body.char),
          history: req.body.history ? ablMod(req.body.int) + 2 : ablMod(req.body.int),
          insight: req.body.insight ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
          intimidation: req.body.intimidation ? ablMod(req.body.char) + 2 : ablMod(req.body.char),
          investigation: req.body.investigation ? ablMod(req.body.int) + 2 : ablMod(req.body.int), 
          medicine: req.body.medicine ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
          nature: req.body.nature ? ablMod(req.body.int) + 2 : ablMod(req.body.int),
          perception: req.body.perception ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
          performance: req.body.performance ? ablMod(req.body.char) + 2 : ablMod(req.body.char),
          persuasion: req.body.persuasion ? ablMod(req.body.char) + 2 : ablMod(req.body.char),
          religion: req.body.religion ? ablMod(req.body.int) + 2 : ablMod(req.body.int),
          sleightOfHand: req.body.sleightOfHand ? ablMod(req.body.dex) + 2 : ablMod(req.body.dex),
          stealth: req.body.stealth ? ablMod(req.body.dex) + 2 : ablMod(req.body.dex),
          survival: req.body.survival ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
        },
        
        saveProficiencies: {
          str: req.body.strSave ? true : false,
          dex: req.body.dexSave ? true : false,
          con: req.body.conSave ? true : false,
          int: req.body.intSave ? true : false,
          wis: req.body.wisSave ? true : false,
          char: req.body.charSave ? true : false,
        },

        saveModifiers: {
          str: req.body.strSave ? ablMod(req.body.str) + 2 : ablMod(req.body.str),
          dex: req.body.dexSave ? ablMod(req.body.dex) + 2 : ablMod(req.body.dex),
          con: req.body.conSave ? ablMod(req.body.con) + 2 : ablMod(req.body.con),
          int: req.body.intSave ? ablMod(req.body.int) + 2 : ablMod(req.body.int),
          wis: req.body.wisSave ? ablMod(req.body.wis) + 2 : ablMod(req.body.wis),
          char: req.body.charSave ? ablMod(req.body.char) + 2 : ablMod(req.body.char),
        },

        checkModifiers: {
          str: ablMod(req.body.str),
          dex: ablMod(req.body.dex),
          con: ablMod(req.body.con),
          int: ablMod(req.body.int),
          wis: ablMod(req.body.wis),
          char: ablMod(req.body.char),
        },

        ac: req.body.ac,

        user: req.user.id,

        image: result.secure_url,
        cloudinaryId: result.public_id,
      });
      console.log("Character has been added!");
      res.redirect("/userProfile/own");
    } catch (err) {
      console.log(err);
    }
  },
  getCharacter: async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      res.json(
        {
          user: req.user,
          character: character,
        });
    } catch (err) {
      console.log(err);
    }
  },
  addGame: async (req, res) => {
    try {
      const game = await Post.findById(req.params.id);
      const character = await Character.findById(req.body.characterId);
      console.log(character)
      if (character.game != game.id) {
        await Character.findOneAndUpdate(
          { _id: req.body.characterId },
          {
            game: game,
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

function ablMod(val) {
  let value;
  switch (true) {
    case (val == 1):
      value = -5;
      break;
    case (val == 2 || val == 3):
      value = -4;
      break;
    case (val == 4 || val == 5):
      value = -3;
      break;
    case (val == 6 || val == 7):
      value = -2;
      break;
    case (val == 8 || val == 9):
      value = -1;
      break;
    case (val == 10 || val == 11):
      value = 0;
      break;
    case (val == 12 || val == 13):
      value = 1;
      break;
    case (val == 14 || val == 15):
      value = 2;
      break;
    case (val == 16 || val == 17):
      value = 3;
      break;
    case (val == 18 || val == 19):
      value = 4;
      break;
    case (val == 20 || val == 21):
      value = 5;
      break;
    case (val == 22 || val == 23):
      value = 6;
      break;
    case (val == 24 || val == 25):
      value = 7;
      break;
    case (val == 26 || val == 27):
      value = 8;
      break;
    case (val == 28 || val == 29):
      value = 9;
    break;
    case (val == 30):
      value = 10;
      break;
  }
  return value
}