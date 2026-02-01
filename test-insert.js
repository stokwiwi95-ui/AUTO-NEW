const mongoose = require("mongoose");
const config = require("./config/config.json");

// Direct connection dan insert
async function test() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        
        // Connect dengan real URL dari config
        await mongoose.connect(config.MongoURL);
        
        console.log("✅ Connected to MongoDB");
        
        const listSchema = new mongoose.Schema({
            product_id: Number,
            product_name: String,
            role_id: String,
            product_price: Number,
            sold: { type: Number, default: 0 }
        });
        
        const List = mongoose.model("list", listSchema);
        
        // Clear old products
        const deleted = await List.deleteMany({});
        console.log(`✅ Cleared ${deleted.deletedCount} old products`);
        
        // Products to insert
        const products = [
            { 
                product_id: 1, 
                product_name: "SC TUMBAL", 
                product_price: 800, 
                role_id: "1335934070500364380", 
                sold: 0 
            },
            { 
                product_id: 2, 
                product_name: "MAJA", 
                product_price: 2000, 
                role_id: "1335934070500364380", 
                sold: 0 
            }
        ];
        
        // Insert
        const result = await List.insertMany(products);
        console.log(`\n✅ Inserted ${result.length} products:\n`);
        
        result.forEach((p, i) => {
            console.log(`${i+1}. ${p.product_name}`);
            console.log(`   Harga: Rp ${p.product_price.toLocaleString('id-ID')}`);
            console.log(`   ID: ${p.product_id}`);
            console.log();
        });
        
        // Verify
        const count = await List.countDocuments({});
        console.log(`📊 Total products in DB: ${count}`);
        
        await mongoose.disconnect();
        console.log("\n✅ Done!");
        
    } catch (e) {
        console.error("❌ Error:", e.message);
        process.exit(1);
    }
}

test();
