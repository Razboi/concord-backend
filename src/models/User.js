const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	googleID: String
});

const User = mongoose.model("User", UserSchema );
module.exports = User;
