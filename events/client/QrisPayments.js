let {
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ChannelType,
    AttachmentBuilder,
    InteractionType
} = require("discord.js");
let client = require('../../index.js');
let QRCode = require("qrcode");
let { Owner } = require("../../config/config.json");
let Bal = require("../../Schema/balance.js");
let axios = require('axios');
let list = require("../../Schema/list.js");
let ctesti = require("../../Schema/Channel.js");
let { API_ID, API_KEY, SECRET_KEY } = require("../../config/configGrowTech.json");
let getCodei = require("../../Schema/getCode.js");
let { COLOR, imageUrl, RedFinger } = require("../../config/configEmoji.json");
let { ApiKey, Slug } = require("../../config/configQris.json");
const ticket = require("../../Schema/ticket.js");

module.exports = {
    name: "QrisPayments"
};

async function checkDM(interaction) {
    try {
        let dm = await interaction.user.createDM();
        let msg = await dm.send(`***Checking Direct Message... 🔃***`);
        await msg.delete();
        return true;
    } catch {
        return false;
    }
}

async function sendDM(user, embed, sending) {
    await user.send({
        content: `*THIS IS YOUR ORDER FOR PRODUCT*`,
        embeds: [embed],
        files: [{
            attachment: Buffer.from(sending),
            name: `${user.username} Order.txt`
        }]
    });
}

client.on("interactionCreate", async (interaction) => {
    function GenerateCodeUnik() {
        let character = "0123456789abcdefghijklmnopqrstuvwxyz"
        let result = "RF"
        let characterlengeth = character.length;

        for (let i = 0; i < 12; i++) {
            let randomString = Math.floor(Math.random() * characterlengeth);
            result += character[randomString];
        }
        return result
    }
    let koderefe = GenerateCodeUnik();
    let selesai = false;
    let ended = false
    async function cekPembayaranOtomatis(res, mess, product_name, itemCode, total, amount, order_id) {
        let userars = await client.users.fetch(Owner);
        let user = interaction.user;
        let member = interaction.guild.members.cache.get(user.id);
        let chaneltesti = await ctesti.findOne({}).catch((e) => console.error(e));
        let testimoni = interaction.guild.channels.cache.get(chaneltesti.ChanelTesti);
        let url = `https://app.pakasir.com/api/transactiondetail?project=${Slug}&amount=${amount}&order_id=${order_id}&api_key=${ApiKey}`;
        let timeout = setTimeout(async () => {
            if (!selesai) {
                try {
                    ended = true
                } catch (err) {
                    console.error('❌ Gagal hapus channel:', err.message);
                }
            }
        }, 5 * 60 * 1000); // 15 menit

        let interval = setInterval(async () => {
            if (ended) {
                await axios.post("https://app.pakasir.com/api/transactioncancel", {
                    project: `${Slug}`,
                    order_id: `${order_id}`,
                    amount: parseInt(amount),
                    api_key: `${ApiKey}`
                }, { headers: { "Content-Type": "application/json" } });
                await user.send({ content: `***❌ Pembayaran Kadaluarsa....***`, ephemeral: true });
                clearInterval(interval);
                clearTimeout(timeout);
                res.delete();
                return;
            }
            try {
                let response = await axios.get(url);
                let transaksi = response.data.transaction;
                if (transaksi?.status === 'completed') {
                    await mess.edit({ content: `***✅ Berhasil Membayar: ${transaksi.completed_at}***`, embeds: [], components: [], files: []});
                    selesai = true;
                    clearInterval(interval);
                    clearTimeout(timeout);

                    let response = await axios.post("https://growtechcentral.site/api/order",
                        new URLSearchParams({
                            api_id: API_ID,
                            api_key: API_KEY,
                            secret_key: SECRET_KEY,
                            service: itemCode,
                            target: "-",
                            qty: total,
                        }),
                        {
                            headers: { "Content-Type": "application/x-www-form-urlencoded" }
                        }
                    ).catch((e) => console.error(e));
                    let products = response.data;
                    console.log(products);
                    if (products?.response === true) {
                        let id_payment = products.data.id;
                        await mess.edit({ content: `***🔃 Proccessing Order: ${products.data.status}***`});
                        let intervals = setInterval(async () => {
                            let response = await axios.post("https://growtechcentral.site/api/status",
                                new URLSearchParams({
                                    api_id: API_ID,
                                    api_key: API_KEY,
                                    secret_key: SECRET_KEY,
                                    id: id_payment
                                }),
                                {
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                }
                            ).catch((e) => console.error(e));
                            console.log(response.data);
                            let products = response.data;
                            if (products?.data.status === "Completed") {
                                clearInterval(intervals);
                                let sending = products.data.sn;
                                let role = await list.findOne({ product_id: itemCode }).catch((e) => console.error(e))
                                if (!member.roles.cache.has(role.role_id)) {
                                    member.roles.add(role.role_id).catch(console.error);
                                }
                                let orderEmbed = new EmbedBuilder()
                                    .setTitle(`${RedFinger} Pembelian Produk ${RedFinger}`)
                                    .setDescription(`*<@${user.id}> Membeli **${product_name}** x${total}\nTotal: Rp ${amount.toLocaleString()}*`)
                                    .setTimestamp()
                                    .setImage(imageUrl)
                                    .setColor(COLOR);

                                await sendDM(user, orderEmbed, sending).catch(async (res) => {
                                    console.error(res);
                                    await userars.send({
                                        content: `<@${user.id}>'s Order`,
                                        files: [{ attachment: Buffer.from(sending), name: `${user.username} Order.txt` }]
                                    });
                                });
                                await testimoni.send({ embeds: [orderEmbed] }).catch((err) => console.error(err));
                                await Bal.findOneAndUpdate({ DiscordID: user.id }, { $inc: { TotalBuying: amount } });
                                await mess.edit({ content: `***Pembelian Berhasil! Periksa DM Kamu ✅***`, ephemeral: true });
                                await list.findOneAndUpdate({ product_id: itemCode }, { $inc: { sold: total }}, { new: true, upsert: true });
                                await userars.send({
                                    content: `This Is <@${user.id}>'s Order`,
                                    files: [{ attachment: Buffer.from(sending), name: `${user.username} Order.txt` }]
                                });
                                setTimeout(async () => {
                                    res.delete();
                                }, 10000);
                                return;
                            }
                        }, 5000);
                    } else {
                        await user.send({ content: `***❌ Gagal Order RedFinger: ${response.data.data.msg} **\nSilahkan mengabarkan owner bahwa orderan gagal.*` });
                        await mess.edit({ content: `***❌ Gagal Order RedFinger: ${response.data.data.msg}***`});
                        setTimeout(async () => {
                            res.delete();
                        }, 5000);
                        return;
                    }
                } else if (transaksi?.status === 'canceled') {
                    selesai = true;
                    clearInterval(interval);
                    clearTimeout(timeout);
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }, 30000);
    }

    async function handleBuy(interaction, itemCode, amount) {
        let [prices, handler] = await Promise.all([
            list.findOne({ product_id: itemCode }),
            ticket.findOne()
        ]);
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
        let activeProducts = products.filter(p => p.id === Number(itemCode));
        if (isNaN(amount) || amount < 1) return `*Gunakanlah angka positif! ❌*`;
        if (Number(amount) > Number(activeProducts[0]?.stock)) return `*Pembelian maksimal adalah **${activeProducts[0]?.stock}** ❌*`;
        if (!prices?.product_price) return `*Tag owner untuk setting harga terlebih dahulu! ❌*`;
        if (!handler?.category) return "Category belum di setting!";
        let price = prices.product_price;
        let totalPrice = price * amount;
        await interaction.editReply({ content: `***Memeriksa Direct Message... 🔃***`, ephemeral: true });
        if (!(await checkDM(interaction))) return `***Your DM is Disabled. Enable it and Try Again! ❌***`;
        await interaction.editReply({ content: `***Membuat Pembayaran QRIS... 🔃***`, ephemeral: true });
        let response = await axios.post("https://app.pakasir.com/api/transactioncreate/qris", {
            project: `${Slug}`,
            order_id: `${koderefe}`,
            amount: parseInt(totalPrice),
            api_key: `${ApiKey}`
        }, { headers: { "Content-Type": "application/json" } });
        console.log(response.data.payment.fee);
        let totalfee = response.data.payment.fee;
        let qrisString = response.data.payment.payment_number;
        let buffer = await QRCode.toBuffer(qrisString, {
            width: 600
        });
        let attachment = new AttachmentBuilder(buffer, { name: "qris.png" });
        await interaction.editReply({ content: `***Membuat Ruangan Ticket... 🔃***`, ephemeral: true });
        await interaction.guild.channels.create({
            parent: handler.category,
            name: `qris-${interaction.user.username}`,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: ['SendMessages', 'ViewChannel'],
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: ['ViewChannel'],
                },
                {
                    id: client.user.id,
                    allow: ['ManageChannels']
                }
            ],
            type: ChannelType.GuildText,
        })
            .then(async (res) => {
                await interaction.editReply({
                    content: `***✅ Berhasil Membuat Pembayaran ${res}***`,
                    ephemeral: true
                });

                let row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`btn-${totalPrice}-${koderefe}`)
                            .setLabel("Memeriksa Pembayaran")
                            .setEmoji("✅")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId(`cancel-${totalPrice}-${koderefe}`)
                            .setLabel("Batalkan Pembayaran")
                            .setEmoji("❌")
                            .setStyle(ButtonStyle.Danger)
                    )

                let expiredAt = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);
                let product_name = activeProducts[0]?.product_name;
                let embed = new EmbedBuilder()
                    .setTitle(`Pembayaran QRIS`)
                    .setDescription([
                        `*➤ Transaksi ID: ${koderefe}*`,
                        `*➤ Produk: ${product_name}*`,
                        `*➤ Berapa: ${amount}*`,
                        `*➤ Harga/Unit: Rp ${price.toLocaleString()}*`,
                        `*➤ Biaya Admin: Rp ${totalfee.toLocaleString()}*`,
                        `*➤ Total: Rp ${(totalPrice + totalfee).toLocaleString()}*\n`,
                        `***🔃 Kadaluwarsa: <t:${expiredAt}:R>** (5 minutes)*`,
                        `***⁉️ Scan QRIS dibawah ini! ⁉️***`,
                    ].filter(Boolean).join("\n"))
                    .setColor(COLOR)
                    .setImage('attachment://qris.png');

                let mess = await res.send({
                    files: [attachment],
                    embeds: [embed],
                    components: [row],
                    ephemeral: true
                });

                cekPembayaranOtomatis(res, mess, product_name, itemCode, amount, totalPrice, koderefe);
            });
        return;
    }

    // Main listener
    if (interaction.type !== InteractionType.ModalSubmit) return;
    let amount, item;
    if (interaction.customId === "buys") {
        let tako = await getCodei.findOne({ DiscordID: interaction.user.id });
        item = tako?.SelectedProduct || "Unknown Product";
        amount = Number(interaction.fields.getTextInputValue("jumlah"));
    }

    try {
        await interaction.deferReply({ ephemeral: true });
        let result = await handleBuy(interaction, item, amount);
        await interaction.editReply({ content: result, ephemeral: true });

        setTimeout(async () => {
            await interaction.deleteReply().catch(error => {
                if (error.code !== 10008) {
                    console.error("Failed to delete success message:", error);
                }
            });
        }, 20000);
    } catch (err) {
        console.error(err);
        await interaction.editReply({ content: `**Error processing order!** Contact the owner!`, ephemeral: true });
    }
});