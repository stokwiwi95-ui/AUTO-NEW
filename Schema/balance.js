let { Schema, model } = require("mongoose");

let schema = new Schema({
    DiscordID: {
        type: String,
        required: true,
    },
    TotalBuying: {
        type: Number,
        default: 0,
        required: true,
    }
});

let Bal = model("Bal", schema);

module.exports = Bal;