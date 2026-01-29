let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let list = require("../Schema/list.js");
let { Owner } = require("../config/config.json");
module.exports = {
    name: 'setproduk',
    description: "Setup For Product",
    accessableby: "admin",
    options: [
        {
            name: "id_product",
            description: "id_product Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "price",
            description: "Howmany Price To Add In Product?",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "role",
            description: "role pembeli untuk produk ini",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let id = interaction.options.getString("id_product");
        let price = interaction.options.getString("price");
        let productRoles = interaction.options.getRole("role");
        let productRole = productRoles.id;
        let prices = parseInt(price);
        let user = await client.users.fetch(Owner);

        if (!isNaN(price)) {
            await list.findOneAndUpdate(
                { product_id: id },
                { role_id: productRole, product_price: prices },
                { upsert: true, new: true }
            )
                .then(async (res) => {
                    await interaction.reply({
                        content: `Berhasil Membuat **${id}** Dengan Harga **Rp ${new Intl.NumberFormat().format(prices)}**\nBerhasil Setting role Buyer pada **${productRoles}**`,
                        ephemeral: true
                    });
                    let sendToOwner = new EmbedBuilder()
                        .setTitle("Price History")
                        .setDescription(`- id_product: **${id}**\n- New Price: *Rp ${new Intl.NumberFormat().format(prices)}*\n- role buyer: **${productRoles}**`)
                        .setTimestamp();
                    user.send({ embeds: [sendToOwner] });
                })
                .catch(console.error);
        }
    }
}