const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const encountersController = require("../controllers/encounters");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Encounter Routes
router.get("/:id", ensureAuth, encountersController.getEncounter);

router.post("/createEncounter/:id", upload.single("file"), encountersController.createEncounter);

router.put("/likeEncounter/:id", encountersController.likeEncounter);

router.put("/progressEncounter/:id", encountersController.progressEncounter);

router.put("/toggleEncounter/:id", encountersController.toggleEncounter);

router.put("/toggleDm/:id", encountersController.toggleDm);

router.delete("/deleteEncounter/:id", encountersController.deleteEncounter);

module.exports = router;
