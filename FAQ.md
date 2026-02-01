# ❓ FAQ - Pertanyaan Yang Sering Diajukan

## 🔧 Installation & Setup

### Q1: Apakah bot ini gratis?
**A:** Ya, bot ini open-source dan gratis. Namun untuk running bot, Anda perlu:
- Discord Server (gratis)
- MongoDB Database (Ada tier gratis di Atlas)
- Hosting/Server untuk run bot (VPS berbayar, atau local computer)

### Q2: Apa syarat untuk run bot ini?
**A:**
- Node.js 16+ (download di nodejs.org)
- npm (included dengan Node.js)
- Akun Discord
- MongoDB (Cloud atau Local)
- Discord Bot Token (dari Developer Portal)

### Q3: Berapa cost untuk MongoDB Atlas?
**A:** 
- **Free Tier**: Gratis selamanya!
  - 512 MB storage
  - Unlimited connections
  - 100k max connections per day
  - Enough untuk testing/small bot
- **Paid Tier**: Mulai dari $10/bulan jika butuh lebih

### Q4: Dapatkah saya run bot ini di Windows/Mac?
**A:** Ya, bot ini berjalan di:
- ✅ Windows (with Node.js)
- ✅ macOS (with Node.js)
- ✅ Linux (recommended)
- ✅ Cloud Server (VPS, Heroku, Railway, dll)

---

## 🤖 Discord Setup

### Q5: Bagaimana cara mendapat Bot Token?
**A:**
1. Buka https://discord.com/developers/applications
2. Klik "New Application"
3. Kasih nama bot
4. Di tab "Bot", klik "Add Bot"
5. Klik "Reset Token" dan copy
6. **JANGAN dibagikan ke siapapun!**

### Q6: Apa itu CLIENT ID?
**A:** Adalah ID unik aplikasi Discord Anda. Cara dapat:
1. Di tab "General Information"
2. Copy "Application ID"
3. Itu adalah CLIENT ID Anda

### Q7: Bagaimana cara invite bot ke server?
**A:**
1. Tab "OAuth2" → "URL Generator"
2. Scope: Select `bot`
3. Permissions: Select yang dibutuhkan
4. Copy URL yang tergenerate
5. Buka URL di browser dan select server
6. Authorize

### Q8: Bot tidak appear di server?
**A:** Check:
1. Bot sudah di-invite? (cek di member list)
2. Bot online? (blue dot di server)
3. Cek permissions di role bot
4. Bot tidak di-ban di server

### Q9: Slash commands tidak muncul?
**A:** 
1. Tunggu 1-2 menit setelah bot login
2. Type `/` di chat untuk refresh
3. Cek bot punya permission "applications.commands"
4. Restart bot

### Q10: Berapa banyak slash commands bisa ditambah?
**A:** Discord limit: 100 global commands per bot
- Saat ini bot punya ~8 commands
- Bisa di-extend sampai 100+

---

## 🗄️ MongoDB & Database

### Q11: Apakah harus pakai MongoDB?
**A:** Ya, bot ini dirancang untuk MongoDB. Bisa alternate dengan:
- MongoDB Atlas (Cloud) - Recommended
- MongoDB Local
- MongoDB Compass (GUI)

Tidak bisa pakai:
- ❌ MySQL
- ❌ PostgreSQL
- ❌ SQLite (bot ini butuh MongoDB)

### Q12: Apakah data aman di MongoDB Atlas?
**A:** Ya, cukup aman untuk hobby project:
- ✅ Data encrypted in transit (SSL)
- ✅ Data encrypted at rest
- ✅ Auto backup setiap hari
- ✅ Can restore dari backup

Untuk production, upgrade ke tier berbayar dengan lebih banyak security features.

### Q13: Bagaimana cara check MongoDB sudah connect?
**A:** Lihat console output bot:
```
[DATABASE MONGO DB] cluster0.xxxxx.mongodb.net
```

Jika tidak keluar, ada error di database connection.

### Q14: Apakah data akan di-delete jika bot restart?
**A:** Tidak. Data disimpan di MongoDB, bukan di local bot memory.

### Q15: Bagaimana backup database?
**A:**
- Atlas: Automatic daily backup (buka "Backup" tab)
- Local: Gunakan `mongodump` command

---

## 🚀 Running & Troubleshooting

### Q16: Bagaimana menjalankan bot?
**A:**
```bash
# Method 1: Simple (once)
npm start

# Method 2: Recommended (with auto-reload)
npm run start
```

Bot akan restart otomatis jika ada file changes.

### Q17: Bot crash dengan error "Cannot find module"
**A:**
```bash
# Install missing dependencies
npm install

# Atau install specific module
npm install discord.js
```

### Q18: Error "Unexpected token"
**A:** Ada syntax error di file JavaScript:
1. Cek console error message
2. Cek file yang error
3. Fix syntax error (missing bracket, quote, dll)

### Q19: Bagaimana stop bot?
**A:**
```bash
# Method 1: Di terminal
Ctrl + C (Windows) atau Cmd + C (Mac)

# Method 2: Kill process
ps aux | grep node
kill -9 <PID>
```

### Q20: Bot berjalan tapi tidak merespons command?
**A:** Check:
1. Bot online? (blue dot di Discord)
2. Slash commands registered? (type `/`)
3. Bot punya permission di channel?
4. Check error di console
5. Try restart bot

---

## 📝 Configuration

### Q21: Apa bedanya TOKEN dan CLIENT ID?
**A:**
- **TOKEN**: Password bot (JANGAN dibagikan!)
  - Contoh: `MzM4NTgyMzk1NzY2MDI4ODA4.DonCKg.PrYYvyW...`
  - Gunakan untuk login
- **CLIENT ID**: ID aplikasi (boleh dibagikan)
  - Contoh: `828173823198`
  - Gunakan untuk invite URL

### Q22: Bagaimana cara ubah prefix bot?
**A:** Bot ini menggunakan slash commands (`/`), bukan prefix tradisional.
- Jika ingin prefix tradisional, butuh modifikasi code
- Slash commands lebih modern dan recommended

### Q23: Apakah bisa bot respond ke normal message?
**A:** Default: Hanya respond ke slash commands
- Untuk respond normal message: butuh "Message Content Intent"
- Bot sudah punya Intent ini, tapi need code modification

### Q24: Bagaimana add new command?
**A:**
1. Buat file baru di `commands/` folder
   ```javascript
   module.exports = {
       name: "mycommand",
       description: "Command description",
       async execute(interaction) {
           // Command logic
       }
   }
   ```
2. Restart bot
3. Command otomatis teregister

---

## 🔐 Security

### Q25: Apakah aman share config.json?
**A:** ❌ JANGAN PERNAH!
- Ganti TOKEN jika accidentally shared
- Gunakan `.gitignore` untuk exclude config.json
- Gunakan `.env` file untuk sensitive data

### Q26: Bagaimana protect bot from abuse?
**A:**
- Set cooldown di commands
- Add rate limiting
- Add permission checks
- Use Admin/Owner checks

### Q27: Apakah TOKEN bisa di-reset?
**A:** Ya! Jika TOKEN leaked:
1. Buka Discord Developer Portal
2. Di Bot section, klik "Reset Token"
3. Copy token baru
4. Update di config.json
5. Restart bot

---

## 🌐 Deployment

### Q28: Bagaimana deploy bot ke server?
**A:** Options:
1. **VPS** (Recommended)
   - Rent VPS dari: Linode, DigitalOcean, AWS, dll
   - SSH ke server, git clone, npm install, npm start
   - Use PM2 untuk keep bot running

2. **Cloud Platform**
   - Heroku (free tier deprecated)
   - Railway.app (free tier available)
   - Replit (free, good for learning)
   - Render (free tier available)

3. **Local Machine** (for testing only)
   - Buka bot di local computer
   - Keep computer running 24/7

### Q29: Bagaimana keep bot running 24/7?
**A:**
- Linux: Use `PM2` atau `systemd` service
- Windows: Use `pm2-windows-startup` atau Task Scheduler
- Cloud: Platform otomatis keep running

### Q30: Berapa resource (CPU/RAM) dibutuhkan?
**A:** Untuk small bot:
- CPU: ~5-10%
- RAM: ~100-150 MB
- Storage: ~500 MB (include node_modules)

---

## 📚 File Structure

### Q31: Apa fungsi masing-masing folder?
**A:**
- `index.js` - Entry point, setup client
- `config/` - Configuration files (TOKEN, MongoURL)
- `commands/` - Slash commands definitions
- `events/` - Discord events (ready, interactionCreate, dll)
- `handlers/` - Handlers untuk load commands, events, db
- `Schema/` - MongoDB schema definitions

### Q32: Apakah bisa delete folder yang tidak terpakai?
**A:** Check dulu apakah diimport di `index.js`:
- Jika di-import: Jangan delete (bot crash)
- Jika tidak: Boleh delete

---

## 🆘 Masalah Umum

### Q33: "Error: Invalid token"
**A:**
1. Check TOKEN di config.json benar
2. Jangan ada spasi sebelum/sesudah TOKEN
3. Jangan pakai tanda kutip
4. TOKEN bisa expire, coba reset di Developer Portal

### Q34: "Error: ENOENT: no such file or directory"
**A:**
1. Path file salah
2. File belum di-create
3. Check folder structure benar

### Q35: "Error: Cannot POST /api/discord"
**A:** Biasanya ini error dari code, bukan setup issue
1. Check error message di console
2. Cek code syntax
3. Check API endpoint correct

---

## 💡 Tips & Tricks

### Q36: Bagaimana debug bot?
**A:**
```javascript
// Add console.log untuk check value
console.log("Variable:", variable);

// Gunakan try-catch untuk handle error
try {
    // code
} catch(err) {
    console.log("Error:", err);
}
```

### Q37: Bagaimana test command without Discord?
**A:** Setup local test:
```bash
# Install jest untuk testing
npm install jest

# Buat test file
# Run test
npm test
```

### Q38: Apakah bisa punya multiple bot?
**A:** Ya, tapi perlu:
- Separate APPLICATION di Discord Developer Portal
- Separate TOKEN dan CLIENT ID
- Separate folder/repo untuk code
- Hosting untuk multiple bots

---

## 📞 Butuh Bantuan Lebih Lanjut?

1. **Cek Dokumentasi:**
   - Discord.js: https://discord.js.org
   - MongoDB: https://docs.mongodb.com
   
2. **Cek Error Console:**
   - Baca error message dengan seksama
   - Google error message
   
3. **Forum/Community:**
   - Discord.js Official Server
   - Stack Overflow
   - GitHub Issues (jika pakai repo public)

---

**Happy Coding! 🚀**
