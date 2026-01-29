let { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
let client = require('../../index');
let { RedFinger, COLOR } = require("../../config/configEmoji.json");
let ctesti = require("../../Schema/Channel.js");
let getCode = require("../../Schema/getCode.js");
let list = require("../../Schema/list.js");
let { API_ID, API_KEY, SECRET_KEY } = require("../../config/configGrowTech.json");
let axios = require('axios');
let { ApiKey, Slug } = require("../../config/configQris.json");

module.exports = {
    name: "Button Menu"
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "confirm") {
        try {
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
            let products = Array.isArray(response.data.data) ? response.data.data : [];
            let menu = new StringSelectMenuBuilder().setCustomId("select_produk").setPlaceholder("🛒 Klik untuk membeli...");
            let activeProducts = products.filter(p => p.product_status === "Active" && (p.sub_category === "RedFinger" || p.id === 1929));
            //console.log(activeProducts);
            if (activeProducts.length > 0) {
                for (let p of activeProducts) {
                    try {
                        let sold = await list.findOne({ product_id: p.id }).catch(console.error);
                        let prices = sold?.product_price ? `Rp ${new Intl.NumberFormat().format(sold.product_price)}` : `Not Set`;

                        if (p.stock !== 0) {
                            menu.addOptions([{
                                label: p.product_name,
                                value: String(p.id),
                                emoji: RedFinger,
                                description: `${prices} | Stock: ${p.stock}`
                            }]);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            let rows = new ActionRowBuilder().addComponents(menu);
            await interaction.editReply({
                content: `***PILIH PRODUK YANG INGIN ANDA BELI:***`,
                embeds: [],
                components: [rows],
                ephemeral: true
            }).catch((err) => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }

    if (interaction.customId === "select_produk") {
        if (!interaction.isStringSelectMenu()) return;
        try {
            console.log(`[SYSTEM]`.bgRed.bold, `${interaction.user.username}`.bgCyan.bold, `Using Button BUY`.bgBlue.bold);
            let chaneltesti = await ctesti.findOne({}).catch((e) => console.error(e));
            let price = await list.findOne({ product_id: Number(interaction.values[0]) }).catch((e) => console.error(e));
            if (interaction.guild.channels.cache.find(channel => channel.name === `qris-${interaction.user.username}`)) {
                let tures = interaction.guild.channels.cache.find(channel => channel.name === `qris-${interaction.user.username}`);
                return interaction.reply({ content: `***❌ Hey!, Kamu masih memiliki tiket yang kebuka ${tures}***`, ephemeral: true });
            }
            if (!chaneltesti.ChanelTesti) return interaction.reply({ content: `*Owner belum setting channel testimoni! ❌*`, ephemeral: true }).catch((err) => console.error(err));
            interaction.deleteReply();
            let responses = await axios.post("https://growtechcentral.site/api/services",
                new URLSearchParams({
                    api_id: API_ID,
                    api_key: API_KEY,
                    secret_key: SECRET_KEY
                }),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                }
            );
            let products = Array.isArray(responses.data.data) ? responses.data.data : [];
            let activeProducts = products.filter(p =>  p.product_status === "Active" && p.id === Number(interaction.values[0]));
            //console.log(activeProducts)
            let buy = new ModalBuilder().setCustomId("buys").setTitle(`${activeProducts[0]?.product_name}`);
            let amount = new TextInputBuilder()
                .setCustomId("jumlah")
                .setLabel(`Jumlah Pembelian [maks: ${activeProducts[0]?.stock}]`)
                .setStyle(TextInputStyle.Short)
                .setMaxLength(4)
                .setMinLength(1)
                .setPlaceholder(`Berapa barang yang ingin di beli? [maks: ${activeProducts[0]?.stock}]`)
                .setRequired(true);
            let row2 = new ActionRowBuilder().addComponents(amount);
            buy.addComponents(row2);
            await getCode.updateOne({ DiscordID: interaction.user.id }, { SelectedProduct: interaction.values[0] }, { upsert: true }).catch((err) => console.error(err));
            await interaction.showModal(buy);
        } catch (error) {
            console.error(error);
        }
    }

    if (interaction.customId === "buyang") {
        try {
            let row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`confirm`)
                        .setLabel("Saya Sudah Paham, Lanjutkan")
                        .setEmoji("✅")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`batal`)
                        .setLabel("Batalkan")
                        .setEmoji("❌")
                        .setStyle(ButtonStyle.Danger)
                );

            let QrisEmbed = new EmbedBuilder()
                .setTitle(`⚠️ PERHATIAN SEBELUM MEMBELI ⚠️`)
                .setDescription(
                    `**❗ JADILAH PEMBELI YANG BIJAK! ❗**\n\n` +
                    `Mohon baca informasi penting berikut sebelum melanjutkan pembelian:\n\n` +
                    `❌ **KODE TIDAK BISA DI-REDEEM?**\nItu berarti server RedFinger sedang HABIS STOCK.\nBukan kesalahan bot, seller, atau kodenya.\n\n` +
                    `☑️ **SOLUSI YANG BENAR:**\n➤ Coba redeem ulang tiap 30–60 detik\n➤ RedFinger melakukan restock otomatis berkala\n➤ Sistem bersifat rebutan, bukan antrian\n\n` +
                    `⏰ **RESTOCK OFFICIAL RED FINGER (WIB):**\n➤ 09:00 WIB\n➤ 11:30 WIB\n➤ 13:00 WIB\n➤ 15:00 WIB\n➤ 17:00 WIB\n\n` +
                    `**🌘 REDEEM PALING MUDAH (Traffic Rendah):\n➤ 03:00 – 07:00 WIB**\n*Peluang sukses jauh lebih tinggi*\n\n` +
                    `⁉️ **CATATAN PENTING:**\n➤ Gagal redeem = server penuh\n➤ Coba ulang berkala, bukan menunggu\n➤ Banyak pembeli sukses redeem di jam dini hari\n\n` +
                    `⚠️ **TIDAK MENERIMA KOMPLAIN:**\n*Bang kok ga bisa redeem?" — Penjelasan sudah lengkap di atas.*\n\n` +
                    `***⁉️ Lihat gambar di bawah untuk panduan waktu redeem. ⁉️***`
                )
                .setColor(COLOR)
                .setImage(`https://cdn.discordapp.com/attachments/1026011513296797728/1446464417431814196/jam_redeem.png?ex=6934bd37&is=69336bb7&hm=8901e6ebff1d4354ee27869e1c55423a582e4e75fc512f6203c4ba96ce464dcc&`);

            await interaction.reply({
                embeds: [QrisEmbed],
                components: [row],
                ephemeral: true
            }).catch((err) => console.error(err));
        } catch (error) {
            console.error(error);
        }
    }

    if (interaction.customId === "batal") {
        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`confirm`)
                    .setLabel("Saya Sudah Paham, Lanjutkan")
                    .setEmoji("✅")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`batal`)
                    .setLabel("Batalkan")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger)
            );
        await interaction.update({
            embeds: [],
            components: [row],
            ephemeral: true
        }).catch((err) => console.error(err));
        interaction.deleteReply();
    }

    if (interaction.isButton() && interaction.customId.startsWith("btn-")) {
        let parts = interaction.customId.split("-");
        // Format: [ "btn", "KODE", "AMOUNT", "ORDERID" ]
        let order_id = parts[2];
        let amount = parts[1];
        try {
            let response = await axios.get(`https://app.pakasir.com/api/transactiondetail?project=${Slug}&amount=${amount}&order_id=${order_id}&api_key=${ApiKey}`);
            let transaksi = response.data.transaction;
            if (transaksi?.status === 'completed') {
                await interaction.update({ content: `***✅ Pembayaran Berhasil...**\nHarap menunggu sebentar hingga pesanan selesai*`, embeds: [], components: [], files: [] });
            } else if (transaksi?.status === 'canceled') {
                await interaction.update({ content: `*❌ Pembayaran Telah Dibatalkan*\nHarap menunggu sebentar hingga channel terhapus sendiri*`, embeds: [], components: [], files: []  });
                setTimeout(async () => {
                    interaction.channel.delete();
                }, 5000);
            } else {
                await interaction.reply({ content: `*🔃 Menunggu Pembayaran...*`, ephemeral: true });
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (interaction.isButton() && interaction.customId.startsWith("cancel-")) {
        let parts = interaction.customId.split("-");
        // Format: [ "btn", "KODE", "AMOUNT", "ORDERID" ]
        let order_id = parts[2];
        let amount = parts[1];
        try {
            await axios.post("https://app.pakasir.com/api/transactioncancel", {
                project: `${Slug}`,
                order_id: `${order_id}`,
                amount: parseInt(amount),
                api_key: `${ApiKey}`
            }, { headers: { "Content-Type": "application/json" } });
            await interaction.update({ content: `***✅ Berhasil Membatalkan Pembayaran**\nHarap tunggu hingga channel ini terhapus dengan sendirinya*`, embeds: [], components: [], files: [] });
            setTimeout(async () => {
                interaction.channel.delete();
            }, 5000);
        } catch (err) {
            await interaction.reply({ content: `*❌ Gagal Membatalkan Pembayaran*`, ephemeral: true });
            console.error(err);
        }
    }
})