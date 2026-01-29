let { Schema, model } = require("mongoose")

let schema = new Schema({
    ChanelTesti: String,
    ChannelAutoStock: String,
    ChannelStock: String,
    MessageID: String,
    Delay: String,
    type: String,
    ChannelLeaderboard: String,
    MessagIDLeaderboard: String,
    DelayLeaderboard: String
});

let channel = model("Channel", schema)

module.exports = channel