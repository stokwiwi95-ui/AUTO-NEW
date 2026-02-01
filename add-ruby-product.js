const mongoose = require("mongoose");
const config = require("./config/config.json");
const list = require("./Schema/list.js");

async function addProduct() {
    try {
        await mongoose.connect(config.MongoURL);
        console.log("✅ MongoDB connected\n");

        // Check for existing product ID
        const maxProduct = await list.findOne().sort({ product_id: -1 });
        const newProductId = (maxProduct?.product_id || 0) + 1;

        // Add new product
        const newProduct = await list.create({
            product_id: newProductId,
            product_name: "RUBY GEMSTONE",
            product_price: 30000,
            role_id: null,
            sold: 0,
        });

        console.log("✅ Produk berhasil ditambahkan!\n");
        console.log("📊 Detail Produk:");
        console.log(`   - ID: ${newProduct.product_id}`);
        console.log(`   - Nama: ${newProduct.product_name}`);
        console.log(`   - Harga: Rp${newProduct.product_price.toLocaleString()}`);
        console.log(`   - Stok Awal: ${newProduct.sold}\n`);

        // Show all products
        const allProducts = await list.find({}).sort({ product_id: 1 });
        console.log("📦 Daftar Produk Saat Ini:");
        allProducts.forEach((product) => {
            console.log(`   ${product.product_id}. ${product.product_name} - Rp${product.product_price.toLocaleString()}`);
        });

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

addProduct();
