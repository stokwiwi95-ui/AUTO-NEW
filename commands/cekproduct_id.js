let {
    Client,
    CommandInteraction,
    EmbedBuilder,
} = require("discord.js");
let axios = require("axios");
let { ApiKey, Slug } = require("../config/configQris.json");
let { RedFinger, COLOR, imageUrl } = require("../config/configEmoji.json");
let list = require("../Schema/list.js");
module.exports = {
    name: 'cek_product_id',
    description: "Check Product ID",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: true });
        try {
            let products = await list.find({});
            let embed = new EmbedBuilder()
                .setTitle(`Daftar Produk`)
                .setColor(COLOR)
                .setImage(imageUrl);
            
            if (products.length > 0) {
                for (let p of products) {
                    try {
                        embed.addFields({
                            name: `${RedFinger} ${p.product_name}`,
                            value: `╰┈➤ product_id: **${String(p.product_id)}**`,
                            inline: false
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            }).catch((err) => console.error(err));
        } catch (err) {
            console.error("Error fetching products:", err.message);
            await interaction.editReply({
                content: "❌ Error mengambil daftar produk!",
                ephemeral: true
            }).catch((err) => console.error(err));
        }
    }
}