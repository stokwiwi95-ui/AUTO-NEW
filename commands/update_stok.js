let {
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
    EmbedBuilder,
} = require("discord.js");
let list = require("../Schema/list.js");
let { COLOR, imageUrl, RedFinger } = require("../config/configEmoji.json");

module.exports = {
    name: 'update_stok',
    description: "Update product stock (add/remove/set)",
    accessableby: "admin",
    options: [
        {
            name: "product_id",
            description: "Product ID",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "action",
            description: "Action: add, remove, atau set",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "➕ Tambah", value: "add" },
                { name: "➖ Kurang", value: "remove" },
                { name: "🔢 Set", value: "set" },
            ],
            required: true,
        },
        {
            name: "amount",
            description: "Jumlah untuk ditambah/dikurang/diset",
            type: ApplicationCommandOptionType.Number,
            required: true,
        },
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            const productId = interaction.options.getNumber("product_id");
            const action = interaction.options.getString("action");
            const amount = interaction.options.getNumber("amount");

            // Validate amount
            if (amount < 0) {
                return await interaction.editReply({
                    content: "❌ Jumlah tidak boleh negatif!",
                    ephemeral: true
                });
            }

            // Find product
            const product = await list.findOne({ product_id: productId });
            if (!product) {
                return await interaction.editReply({
                    content: `❌ Produk dengan ID ${productId} tidak ditemukan!`,
                    ephemeral: true
                });
            }

            let newSold = product.sold || 0;
            let actionText = "";

            // Update based on action
            if (action === "add") {
                newSold += amount;
                actionText = `➕ Menambah ${amount} unit`;
            } else if (action === "remove") {
                if (newSold - amount < 0) {
                    return await interaction.editReply({
                        content: `❌ Stok tidak cukup! Stok saat ini: ${newSold}`,
                        ephemeral: true
                    });
                }
                newSold -= amount;
                actionText = `➖ Mengurangi ${amount} unit`;
            } else if (action === "set") {
                newSold = amount;
                actionText = `🔢 Set ke ${amount} unit`;
            }

            // Update database
            const updated = await list.findOneAndUpdate(
                { product_id: productId },
                { $set: { sold: newSold } },
                { new: true }
            );

            // Create success embed
            const embed = new EmbedBuilder()
                .setTitle(`${RedFinger} STOK BERHASIL DIUPDATE ${RedFinger}`)
                .setColor(COLOR)
                .setImage(imageUrl)
                .addFields(
                    {
                        name: "📦 Produk",
                        value: `${product.product_name}`,
                        inline: false
                    },
                    {
                        name: "🎯 Aksi",
                        value: actionText,
                        inline: true
                    },
                    {
                        name: "📊 Stok Lama",
                        value: `${product.sold || 0} unit`,
                        inline: true
                    },
                    {
                        name: "📊 Stok Baru",
                        value: `${newSold} unit`,
                        inline: true
                    }
                )
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error("Error updating stock:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
