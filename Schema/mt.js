let { Schema, model } = require("mongoose")

let schema = new Schema({
    mt: Boolean
})

let mt = model("mt", schema)

module.exports = mt