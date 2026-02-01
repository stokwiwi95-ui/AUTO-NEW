# ✅ CHECKLIST SETUP BOT DISCORD AUTO-NEW

## 🎯 Sebelum Memulai
- [ ] Punya akun Discord (minimal 1 server untuk testing)
- [ ] Install Node.js versi 16+ (cek: `node --version`)
- [ ] Punya akun MongoDB Atlas atau MongoDB local

---

## 📝 STEP 1: Install Dependencies
```bash
cd /workspaces/AUTO-NEW
npm install
```
- [ ] Semua dependency terinstall (cek: folder `node_modules` ada)

---

## 🤖 STEP 2: Setup Discord Developer Portal

### Buka https://discord.com/developers/applications

#### A. Buat Application Baru
- [ ] Klik "New Application"
- [ ] Kasih nama (misalnya "AUTO-NEW")
- [ ] Klik "Create"

#### B. Dapatkan Token
- [ ] Di tab "Bot", klik "Add Bot"
- [ ] Klik icon copy di sebelah TOKEN
- [ ] Simpan token (JANGAN DIBAGIKAN!)
- [ ] Contoh token format: `MzM4NTgyMzk1NzY2MDI4ODA4.DonCKg.PrYYvyWLtMrHf...` (panjang)

#### C. Dapatkan Client ID
- [ ] Di tab "General Information"
- [ ] Copy "Application ID"
- [ ] Client ID = angka panjang (misal: 828173823198)

#### D. Setup Intents (PENTING!)
- [ ] Buka tab "Bot"
- [ ] Scroll ke "Privileged Gateway Intents"
- [ ] Enable ✅ "Message Content Intent"
- [ ] Enable ✅ "Server Members Intent"

#### E. Invite Bot ke Server
- [ ] Di tab "OAuth2" → "URL Generator"
- [ ] Di "SCOPES" pilih: ✅ `bot`
- [ ] Di "PERMISSIONS" pilih: ✅ Administrator
- [ ] Copy generated URL
- [ ] [ ] Buka URL dan select server Anda
- [ ] [ ] Klik "Authorize"

---

## 🗄️ STEP 3: Setup MongoDB

### Pilih salah satu:

#### Option A: MongoDB Atlas (Recommended)
1. [ ] Buka https://www.mongodb.com/cloud/atlas
2. [ ] Sign up/Login dengan akun Google atau email
3. [ ] Buat Project baru
4. [ ] Buat Cluster (pilih Free tier)
5. [ ] Di "Database Access": Buat username & password
   - [ ] Username: `admin` (atau nama lain)
   - [ ] Password: `password123` (ingat password ini!)
6. [ ] Di "Network Access": Click "Add IP Address"
   - [ ] Masukkan `0.0.0.0/0` (allow all - untuk development)
7. [ ] Click "Connect" → Copy "Connection String"
   - [ ] Format: `mongodb+srv://admin:password123@cluster.mongodb.net/?retryWrites=true&w=majority`
   - [ ] Ganti `admin` dan `password` dengan username/password Anda

#### Option B: MongoDB Local
```bash
# Cek apakah MongoDB sudah terinstall
mongod --version

# Jika belum, install:
sudo apt-get install -y mongodb-org

# Jalankan MongoDB
sudo systemctl start mongod

# MongoDB URL lokal:
mongodb://localhost:27017/auto-new
```
- [ ] MongoDB local sudah running

---

## ⚙️ STEP 4: Konfigurasi File config.json

File lokasi: `/workspaces/AUTO-NEW/config/config.json`

Edit dengan data Anda:

```json
{
    "TOKEN": "YOUR_BOT_TOKEN_HERE",
    "MongoURL": "YOUR_MONGODB_URL_HERE",
    "CLIENTID": "YOUR_CLIENT_ID_HERE",
    "Owner": "YOUR_DISCORD_USER_ID",
    "Admin": ["ADMIN_ID_1", "ADMIN_ID_2"]
}
```

### Cara isi setiap field:

#### TOKEN
- [ ] Dari step 2B (Discord Developer Portal Bot Token)
- [ ] Contoh: `MzM4NTgyMzk1NzY2MDI4ODA4.DonCKg.PrYYvyWLtMrHf...`

#### MongoURL
- [ ] Dari step 3 (MongoDB connection string)
- [ ] Dari Atlas: `mongodb+srv://admin:pass@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
- [ ] Dari Local: `mongodb://localhost:27017/auto-new`

#### CLIENTID
- [ ] Dari step 2C (Discord Application ID)
- [ ] Contoh: `828173823198`

#### Owner
- [ ] Your Discord User ID
- [ ] Cara: Enable Dev Mode → Right-click nama Anda → Copy User ID
- [ ] Contoh: `123456789012345678`

#### Admin (Array)
- [ ] List admin user IDs
- [ ] Contoh: `["111222333444555666", "999888777666555444"]`
- [ ] Bisa kosong: `[]`

### ✅ Contoh config.json yang sudah diisi:
```json
{
    "TOKEN": "MzM4NTgyMzk1NzY2MDI4ODA4.DonCKg.PrYYvyWLtMrHf1234567890",
    "MongoURL": "mongodb+srv://admin:mypassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority",
    "CLIENTID": "828173823198",
    "Owner": "123456789012345678",
    "Admin": ["111222333444555666"]
}
```

- [ ] config.json sudah diisi dengan benar

---

## 🚀 STEP 5: Jalankan Bot

```bash
cd /workspaces/AUTO-NEW
npm start
```

### ✅ Cek Output (seharusnya keluar):
```
[DATABASE MONGO DB] cluster0.xxxxx.mongodb.net
[SYSTEMS SLASH] All Commands already registered in your server!
```

- [ ] Bot running tanpa error
- [ ] Bot online di Discord (lihat member list)

---

## 🧪 STEP 6: Test Bot

Di Discord Server Anda:

1. [ ] Coba ketik `/` di chat
2. [ ] Lihat apakah slash commands muncul
3. [ ] Coba jalankan salah satu command (misalnya `/uptime`)
4. [ ] Bot harus merespons dengan message

---

## 📊 Verifikasi Akhir

Checklist final:

- [ ] `npm install` berhasil
- [ ] Discord Application dibuat
- [ ] Bot Token didapat dan disimpan
- [ ] Client ID didapat dan disimpan
- [ ] Intents sudah di-enable
- [ ] Bot sudah di-invite ke server
- [ ] MongoDB sudah running (Atlas atau Local)
- [ ] config.json sudah diisi dengan benar
- [ ] Bot berjalan (`npm start` tidak error)
- [ ] Bot online di Discord
- [ ] Slash commands muncul
- [ ] Bot merespons command

---

## ❌ Troubleshooting Cepat

| Error | Solusi |
|-------|--------|
| `Cannot find module 'discord.js'` | Jalankan `npm install` |
| `Token undefined` | Cek config.json, jangan pakai kutip |
| `MongoDB Connection Failed` | Cek MongoDB URL dan koneksi internet |
| `Cannot connect to bot` | Cek TOKEN dan CLIENT ID benar |
| `Slash commands tidak muncul` | Tunggu 1-2 menit atau restart bot |
| `Bot tidak merespons` | Cek permissions bot di server |

---

## 📚 File Penting

- `index.js` - Entry point utama
- `config/config.json` - Konfigurasi (HARUS DIISI!)
- `handlers/mongoosee.js` - Database connection
- `handlers/event.js` - Event loader
- `handlers/slash.js` - Command loader
- `events/client/ready.js` - Bot ready event
- `events/client/interactionCreate.js` - Command handler
- `commands/` - Semua slash commands

---

**Status: Belum Setup**

Setelah selesai semua checklist, ubah menjadi: **Status: ✅ Setup Selesai**

---

Butuh bantuan? Cek error di console atau baca PANDUAN_SETUP.md
