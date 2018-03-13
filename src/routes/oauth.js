const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/google", passport.authenticate("google", {
	scope: [ "profile", "email" ]
}) );

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
	res.send("Sup bro");
});

module.exports = router;
