let {
    Client,
    CommandInteraction,
    EmbedBuilder,
} = require("discord.js");
let axios = require("axios");
let { API_ID, API_KEY, SECRET_KEY } = require("../config/configGrowTech.json");
let { RedFinger, COLOR, imageUrl } = require("../config/configEmoji.json");
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
        let response = await axios.post("https://growtechcentral.site/api/services",
            new URLSearchParams({
                api_id: API_ID,
                api_key: API_KEY,
                secret_key: SECRET_KEY
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );
        let embed = new EmbedBuilder()
            .setTitle(`Daftar Produk`)
            .setColor(COLOR)
            .setImage(imageUrl);
        let products = Array.isArray(response.data.data) ? response.data.data : [];
        let activeProducts = products.filter(p => p.product_status === "Active" && p.sub_category === "RedFinger");
        //console.log(activeProducts);
        if (activeProducts.length > 0) {
            for (let p of activeProducts) {
                try {
                    embed.addFields({
                        name: `${RedFinger} ${p.product_name}`,
                        value: `╰┈➤ product_id: **${String(p.id)}**`,
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
    }
}