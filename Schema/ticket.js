let { Schema, model } = require("mongoose")

let schema = new Schema({
    channel: String,
    category: String
});

let ticket = model("ticket", schema)

module.exports = ticket