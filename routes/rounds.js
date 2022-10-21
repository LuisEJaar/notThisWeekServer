const express = require("express");
const router = express.Router();
const roundsController = require("../controllers/rounds");

//Encounter Routes
router.post("/createRound/:encounterId/:playerId/:characterId", roundsController.createRound);

router.put("/makeRoll/:roundId/:characterId", roundsController.makeRoll);

router.put("/likeRound/:id", roundsController.likeRound);

router.put("/editRound/:id", roundsController.editRound);
 
router.delete("/deleteRound/:id/:encounterId", roundsController.deleteRound);

module.exports = router;
