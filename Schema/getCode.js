let { Schema, model } = require("mongoose")

let schema = new Schema({
	DiscordID: String,
	SelectedProduct: String
})

let Discount = model("Codela", schema)

module.exports = Discount