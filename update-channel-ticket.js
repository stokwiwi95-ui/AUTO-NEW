const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ChannelType } = require("discord.js");
const config = require("./config/config.json");
const list = require("./Schema/list.js");
const ticket = require("./Schema/ticket.js");
const mongoose = require("mongoose");
const { COLOR, imageUrl, RedFinger } = require("./config/configEmoji.json");

async function updateAndSendPanel() {
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
                const newChannelId = "1447942052875862100";
                const channel = await client.channels.fetch(newChannelId);

                if (!channel) {
                    console.error("❌ Channel tidak ditemukan!");
                    process.exit(1);
                }

                console.log(`🔧 Update channel ticket ke: ${channel.name}\n`);

                // Get guild for category creation
                const guild = client.guilds.cache.first();
                if (!guild) {
                    console.error("❌ Bot tidak ada dalam server apapun!");
                    process.exit(1);
                }

                // Check if ticket category exists
                let ticketCategory = guild.channels.cache.find(
                    (c) => c.type === ChannelType.GuildCategory && c.name === "🎫-tickets"
                );

                if (!ticketCategory) {
                    console.log("📁 Membuat category 🎫-tickets...");
                    ticketCategory = await guild.channels.create({
                        name: "🎫-tickets",
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: ["ViewChannel"],
                            },
                        ],
                    });
                    console.log(`✅ Category berhasil dibuat!\n`);
                } else {
                    console.log(`✅ Category sudah ada!\n`);
                }

                // Update database with new category
                await ticket.findOneAndUpdate(
                    {},
                    { $set: { category: ticketCategory.id } },
                    { upsert: true, new: true }
                );

                console.log(`✅ Database updated dengan category ID: ${ticketCategory.id}\n`);

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
                    .setLabel("📮 Create Ticket")
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(button);

                // Send message to new channel
                await channel.send({
                    embeds: [embed],
                    components: [row],
                });

                console.log(`✅ Panel ticket berhasil dikirim ke channel baru!\n`);
                console.log(`📊 Ringkasan:`);
                console.log(`   - Channel: ${channel.name} (${newChannelId})`);
                console.log(`   - Ticket Category: ${ticketCategory.name}`);
                console.log(`   - Total Produk: ${products.length}`);
                products.forEach((product) => {
                    console.log(`     • ${product.product_name} - Rp${product.product_price.toLocaleString()}`);
                });
                console.log(`\n✅ Siap digunakan!\n`);

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

updateAndSendPanel();
