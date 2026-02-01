let {
    Client,
    CommandInteraction,
    EmbedBuilder,
} = require("discord.js");
let list = require("../Schema/list.js");
let { COLOR, imageUrl, RedFinger } = require("../config/configEmoji.json");

module.exports = {
    name: 'stok',
    description: "Check product stock/inventory",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            // Get all products from database
            const products = await list.find({});

            if (!products || products.length === 0) {
                return await interaction.editReply({
                    content: "❌ Tidak ada produk di database!",
                    ephemeral: true
                });
            }

            // Create embed
            let embed = new EmbedBuilder()
                .setTitle(`${RedFinger} INVENTORY STOK ${RedFinger}`)
                .setColor(COLOR)
                .setImage(imageUrl)
                .setTimestamp();

            // Add products to embed
            let description = "";
            let totalSold = 0;

            products.forEach((product, index) => {
                description += `\n**${index + 1}. ${product.product_name}**`;
                description += `\n   💰 Harga: Rp ${product.product_price.toLocaleString('id-ID')}`;
                description += `\n   📦 Terjual: ${product.sold || 0} unit`;
                description += `\n   📝 ID Produk: ${product.product_id}`;
                description += `\n`;
                
                totalSold += product.sold || 0;
            });

            embed.setDescription(description);
            embed.addFields({
                name: "📊 SUMMARY",
                value: `Total Produk: ${products.length}\nTotal Terjual: ${totalSold} unit`,
                inline: false
            });

            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error("Error checking stock:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
