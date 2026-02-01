#!/bin/bash

# ============================================
# AUTO-NEW Bot Setup Script
# ============================================
# Gunakan: bash setup.sh

echo "=================================="
echo "🤖 AUTO-NEW Bot Setup"
echo "=================================="
echo ""

# Check Node.js
echo "📌 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan. Install Node.js terlebih dahulu!"
    echo "   Download di: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"
echo ""

# Check npm
echo "📌 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm tidak ditemukan!"
    exit 1
fi
echo "✅ npm: $(npm --version)"
echo ""

# Install dependencies
echo "📌 Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies!"
    exit 1
fi
echo ""

# Check if config.json exists
echo "📌 Checking config.json..."
if [ ! -f "config/config.json" ]; then
    echo "⚠️  config.json tidak ditemukan!"
    echo "📋 Membuat config.json dari template..."
    cp config/config.example.json config/config.json
    echo "✅ File config.json dibuat. SILAKAN ISINYA DENGAN DATA ANDA!"
    echo ""
    echo "📝 Edit file berikut dan isi dengan data Discord & MongoDB Anda:"
    echo "   👉 config/config.json"
    echo ""
    echo "Setelah selesai, jalankan: npm start"
    exit 0
fi

echo "✅ config.json ditemukan"
echo ""

# Test config.json
echo "📌 Validating config.json..."
if grep -q "MASUKKAN\|your\|YOUR" config/config.json; then
    echo "⚠️  config.json masih mengandung template placeholder!"
    echo "🚀 Silakan edit dan isi dengan data yang benar:"
    echo "   👉 TOKEN"
    echo "   👉 MongoURL"
    echo "   👉 CLIENTID"
    echo "   👉 Owner"
    echo "   👉 Admin"
    exit 1
fi

echo "✅ config.json valid"
echo ""

# Check for required fields
echo "📌 Checking required fields in config.json..."
REQUIRED_FIELDS=("TOKEN" "MongoURL" "CLIENTID" "Owner" "Admin")
for field in "${REQUIRED_FIELDS[@]}"; do
    if ! grep -q "$field" config/config.json; then
        echo "❌ Field '$field' tidak ditemukan di config.json!"
        exit 1
    fi
done
echo "✅ Semua required fields ada"
echo ""

echo "=================================="
echo "✅ Setup selesai!"
echo "=================================="
echo ""
echo "🚀 Untuk menjalankan bot:"
echo "   npm start"
echo ""
echo "Atau dengan nodemon (auto-restart):"
echo "   npm run start"
echo ""
