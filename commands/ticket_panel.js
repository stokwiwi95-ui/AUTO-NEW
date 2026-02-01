let {
    Client,
    CommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
} = require("discord.js");
let ticket = require("../Schema/ticket.js");
let list = require("../Schema/list.js");
let { COLOR, imageUrl, RedFinger } = require("../config/configEmoji.json");

module.exports = {
    name: 'ticket_panel',
    description: "Send ticket panel to channel for buyers",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            // Check if ticket is setup
            const ticketConfig = await ticket.findOne({});
            if (!ticketConfig || !ticketConfig.category) {
                return await interaction.editReply({
                    content: "❌ Ticket belum di-setup! Gunakan `/setup-ticket` terlebih dahulu.",
                    ephemeral: true
                });
            }

            // Get all products
            const products = await list.find({}).sort({ product_id: 1 });

            // Build product list description
            let productDescription = `DAFTAR PRODUK\n\n`;
            
            if (products.length === 0) {
                productDescription += "❌ Belum ada produk tersedia.\n\n";
            } else {
                productDescription += "```\n";
                productDescription += "ID │ NAMA PRODUK          │ HARGA\n";
                productDescription += "───┼──────────────────────┼────────────────\n";
                
                products.forEach((product) => {
                    const id = String(product.product_id).padEnd(3);
                    const name = (product.product_name || "N/A").substring(0, 20).padEnd(22);
                    const price = `Rp${product.product_price?.toLocaleString() || 0}`;
                    const stock = product.sold || 0;
                    
                    productDescription += `${id}│ ${name}│ ${price}\n`;
                });
                productDescription += "```\n\n";
            }

            productDescription += `📊 **Total Produk:** ${products.length}\n\n`;
            productDescription += `**Tertarik?** Klik tombol di bawah untuk membuat ticket dan konsultasi dengan tim support kami! 💬`;

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(`WELCOME TO FAZZRI STORE`)
                .setDescription(productDescription)
                .setColor(COLOR)
                .setImage(imageUrl)
                .setTimestamp();

            // Create button
            const button = new ButtonBuilder()
                .setCustomId("create_ticket")
                .setLabel("🎫 Buat Ticket")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🎫");

            const row = new ActionRowBuilder().addComponents(button);

            // Send to current channel
            await interaction.channel.send({
                embeds: [embed],
                components: [row]
            });

            await interaction.editReply({
                content: "✅ Panel ticket berhasil dikirim ke channel ini!",
                ephemeral: true
            });

        } catch (error) {
            console.error("Error sending ticket panel:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
