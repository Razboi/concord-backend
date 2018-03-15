const express = require("express");
const router = express.Router();
const passport = require("passport");


router.get("/google", passport.authenticate("google", {
	scope: [ "profile", "email" ]
}) );

router.get("/google/redirect", passport.authenticate("google", { session: false }),
(req, res) => {
	res.send("12345Token");
});

module.exports = router;
