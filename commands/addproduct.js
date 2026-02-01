let {
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let list = require("../Schema/list.js");

module.exports = {
    name: 'add_product',
    description: "Add new product to database",
    accessableby: "admin",
    options: [
        {
            name: "product_id",
            description: "Product ID (number)",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "product_name",
            description: "Product name",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "product_price",
            description: "Product price in Rp",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "role_id",
            description: "Discord Role ID",
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const product_id = interaction.options.getNumber("product_id");
            const product_name = interaction.options.getString("product_name");
            const product_price = interaction.options.getNumber("product_price");
            const role_id = interaction.options.getString("role_id") || "default_role";

            // Check if product already exists
            const existing = await list.findOne({ product_id });
            if (existing) {
                return await interaction.editReply({
                    content: `❌ Product dengan ID ${product_id} sudah ada!`,
                    ephemeral: true
                });
            }

            // Add product
            const newProduct = await list.create({
                product_id,
                product_name,
                product_price,
                role_id,
                sold: 0
            });

            await interaction.editReply({
                content: `✅ Produk berhasil ditambahkan:\n\n` +
                        `📦 Nama: ${newProduct.product_name}\n` +
                        `💰 Harga: Rp ${newProduct.product_price.toLocaleString('id-ID')}\n` +
                        `📝 ID: ${newProduct.product_id}`,
                ephemeral: true
            });

        } catch (error) {
            console.error("Error adding product:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
