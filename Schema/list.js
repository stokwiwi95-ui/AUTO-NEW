let { Schema, model } = require("mongoose")

let sche = new  Schema({
	product_id: Number,
	product_name: String,
	role_id: String,
	product_price: Number,
	sold: {
		type: Number,
		default: 0,
		required: true,
	},
})

let list = model("list", sche)

module.exports = list