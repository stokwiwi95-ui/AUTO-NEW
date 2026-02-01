let {
    Client,
    CommandInteraction,
    EmbedBuilder,
} = require("discord.js");
let list = require("../Schema/list.js");
let { COLOR, imageUrl, RedFinger } = require("../config/configEmoji.json");

module.exports = {
    name: 'show_stok',
    description: "Tampilkan daftar produk beserta stok di channel",
    accessableby: "admin",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply();

            // Get all products
            const products = await list.find({}).sort({ product_id: 1 });

            if (!products || products.length === 0) {
                return await interaction.editReply({
                    content: "❌ Belum ada produk dalam daftar!",
                });
            }

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(`${RedFinger} DAFTAR PRODUK & STOK ${RedFinger}`)
                .setColor(COLOR)
                .setImage(imageUrl)
                .setDescription("Berikut adalah daftar lengkap produk yang tersedia")
                .setTimestamp();

            // Add products to embed
            let description = "```\n";
            description += "ID | NAMA PRODUK        | HARGA       | STOK TERJUAL\n";
            description += "───┼───────────────────┼─────────────┼──────────────\n";

            let totalProducts = 0;
            let totalSold = 0;

            products.forEach((product) => {
                const id = String(product.product_id).padEnd(3);
                const name = (product.product_name || "N/A").substring(0, 18).padEnd(19);
                const price = `Rp${product.product_price?.toLocaleString() || 0}`.padEnd(13);
                const sold = (product.sold || 0);
                
                description += `${id}| ${name}| ${price}| ${sold}\n`;
                
                totalProducts++;
                totalSold += sold || 0;
            });

            description += "```";

            embed.addFields(
                {
                    name: "📊 Detail Produk",
                    value: description,
                    inline: false
                },
                {
                    name: "📈 Statistik",
                    value: `**Total Produk:** ${totalProducts}\n**Total Terjual:** ${totalSold} unit`,
                    inline: false
                }
            );

            await interaction.editReply({
                embeds: [embed],
            });

        } catch (error) {
            console.error("Error showing stock:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
            });
        }
    }
};
