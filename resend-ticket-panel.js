const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const config = require("./config/config.json");
const list = require("./Schema/list.js");
const mongoose = require("mongoose");
const { COLOR, imageUrl, RedFinger } = require("./config/configEmoji.json");

async function resendTicketPanel() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MongoURL);
        console.log("✅ MongoDB connected\n");

        const client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });

        client.on("ready", async () => {
            console.log(`✅ Bot logged in as ${client.user.tag}\n`);

            try {
                const channelId = "1455805734934548481";
                const channel = await client.channels.fetch(channelId);

                if (!channel) {
                    console.error("❌ Channel tidak ditemukan!");
                    process.exit(1);
                }

                console.log(`📤 Mengirim panel ticket ke: ${channel.name}\n`);

                // Get all products
                const products = await list.find({}).sort({ product_id: 1 });

                // Build product list description
                let productDescription = `${RedFinger} DAFTAR PRODUK KAMI ${RedFinger}\n\n`;
                
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
                        
                        productDescription += `${id}│ ${name}│ ${price}\n`;
                    });
                    productDescription += "```\n\n";
                }

                productDescription += `📊 **Total Produk:** ${products.length}\n\n`;
                productDescription += `**Tertarik?** Klik tombol di bawah untuk membuat ticket dan konsultasi dengan tim support kami! 💬`;

                // Create embed
                const embed = new EmbedBuilder()
                    .setTitle(`${RedFinger} BUAT TICKET SUPPORT ${RedFinger}`)
                    .setDescription(productDescription)
                    .setColor(COLOR)
                    .setImage(imageUrl)
                    .setTimestamp();

                // Create button
                const button = new ButtonBuilder()
                    .setCustomId("create_ticket")
                    .setLabel("📮 Create Ticket")
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(button);

                // Send message
                await channel.send({
                    embeds: [embed],
                    components: [row],
                });

                console.log(`✅ Panel ticket berhasil dikirim!\n`);
                console.log(`📊 Detail Panel:`);
                console.log(`   - Total Produk: ${products.length}`);
                products.forEach((product) => {
                    console.log(`   - ${product.product_name} (Rp${product.product_price.toLocaleString()})`);
                });

                process.exit(0);

            } catch (error) {
                console.error("❌ Error:", error.message);
                process.exit(1);
            }
        });

        client.login(config.TOKEN);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

resendTicketPanel();
