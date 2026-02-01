const mongoose = require("mongoose");
const config = require("./config/config.json");
const list = require("./Schema/list.js");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (prompt) =>
    new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongourl);
        console.log("✅ Terhubung ke MongoDB\n");

        // Show existing products
        const products = await list.find({});
        console.log("📦 DAFTAR PRODUK YANG ADA:\n");
        
        if (products.length === 0) {
            console.log("❌ Belum ada produk. Silakan tambah produk terlebih dahulu.\n");
        } else {
            products.forEach((product) => {
                console.log(`ID: ${product.product_id} | Nama: ${product.product_name} | Harga: Rp${product.product_price.toLocaleString()} | Stok Terjual: ${product.sold}`);
            });
        }

        console.log("\n" + "=".repeat(60));
        console.log("OPSI:");
        console.log("1. Update stok produk yang ada");
        console.log("2. Tambah produk baru");
        console.log("3. Exit");
        console.log("=".repeat(60) + "\n");

        const choice = await question("Pilih opsi (1/2/3): ");

        if (choice === "1") {
            // Update existing product
            const productId = await question("Masukkan Product ID: ");
            const product = await list.findOne({ product_id: parseInt(productId) });

            if (!product) {
                console.log("❌ Produk tidak ditemukan!");
                rl.close();
                process.exit(1);
            }

            console.log(`\nProduk: ${product.product_name}`);
            console.log(`Stok Terjual saat ini: ${product.sold}`);
            console.log("\nPilih aksi:");
            console.log("a. Tambah stok");
            console.log("b. Kurang stok");
            console.log("c. Set stok ke angka tertentu");

            const action = await question("Pilih aksi (a/b/c): ");
            const amount = parseInt(await question("Masukkan jumlah: "));

            if (isNaN(amount) || amount < 0) {
                console.log("❌ Input tidak valid!");
                rl.close();
                process.exit(1);
            }

            let newStok = product.sold;
            if (action === "a") {
                newStok += amount;
                console.log(`\n➕ Menambah ${amount} stok`);
            } else if (action === "b") {
                if (product.sold - amount < 0) {
                    console.log(`❌ Stok tidak cukup! Stok saat ini: ${product.sold}`);
                    rl.close();
                    process.exit(1);
                }
                newStok -= amount;
                console.log(`\n➖ Mengurangi ${amount} stok`);
            } else if (action === "c") {
                newStok = amount;
                console.log(`\n🔢 Set stok ke ${amount}`);
            } else {
                console.log("❌ Aksi tidak valid!");
                rl.close();
                process.exit(1);
            }

            await list.findOneAndUpdate(
                { product_id: parseInt(productId) },
                { $set: { sold: newStok } }
            );

            console.log(`✅ Stok berhasil diupdate!`);
            console.log(`Stok lama: ${product.sold} → Stok baru: ${newStok}\n`);

        } else if (choice === "2") {
            // Add new product
            const productId = await question("Masukkan Product ID (angka): ");
            const productName = await question("Masukkan Nama Produk: ");
            const price = await question("Masukkan Harga: ");
            const roleId = await question("Masukkan Role ID (biarkan kosong jika tidak ada): ");

            // Check if product ID already exists
            const existing = await list.findOne({ product_id: parseInt(productId) });
            if (existing) {
                console.log("❌ Product ID sudah ada!");
                rl.close();
                process.exit(1);
            }

            const newProduct = await list.create({
                product_id: parseInt(productId),
                product_name: productName,
                product_price: parseInt(price),
                role_id: roleId || null,
                sold: 0,
            });

            console.log(`\n✅ Produk berhasil ditambahkan!`);
            console.log(`ID: ${newProduct.product_id}`);
            console.log(`Nama: ${newProduct.product_name}`);
            console.log(`Harga: Rp${newProduct.product_price.toLocaleString()}`);
            console.log(`Stok Awal: ${newProduct.sold}\n`);

        } else if (choice === "3") {
            console.log("Sampai jumpa!");
        } else {
            console.log("❌ Opsi tidak valid!");
        }

        rl.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        rl.close();
        process.exit(1);
    }
}

main();
