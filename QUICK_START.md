# Quick Start Guide

**e-ManuAI v2.0** - Autonomous Lawn Mower Management System

---

## 🚀 Get Started in 5 Minutes

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for database)

### Installation

```bash
# Clone repository
git clone https://github.com/Dominik-88/e-ManuAi-2026.git
cd e-ManuAi-2026

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚠️ IMPORTANT: Import Migration Required

**Current Status:** Core files migrated, remaining files need update.

### Run Automated Migration (5 minutes)

```bash
# Make scripts executable
chmod +x scripts/migrate-imports.sh scripts/verify-imports.sh

# Run migration
./scripts/migrate-imports.sh

# Verify
./scripts/verify-imports.sh

# Test build
npm run build
```

**See:** `MIGRATION_GUIDE.md` for details.

---

## 📁 Project Structure

```
e-manuai-v2/
├── 01_REALITY/           # @reality/*        - PLC, sensors, Barbieri API
├── 02_DIGITAL_TWIN/      # @digital-twin/*   - Telemetry, sessions
├── 03_AI_LOGIC/          # @ai/*             - AI assistant, diagnostics
├── 04_USER_INTERFACE/    # @ui/*             - React pages & components
├── 05_INFRASTRUCTURE/    # @infrastructure/* - Database, auth, offline
├── 06_SHARED/            # @shared/*         - Hooks, utils, types
├── 07_DOCUMENTATION/     # Guides, architecture
├── 08_TESTING/           # Test suites
└── 09_PUBLIC/            # Static assets
```

---

## 🎯 Key Features

- **Real-time Telemetry** - Live GPS tracking with RTK precision
- **Service Management** - Automated service intervals and history
- **AI Assistant** - Natural language diagnostics and support
- **Offline Support** - Queue operations when disconnected
- **Digital Twin** - Virtual machine state synchronization
- **Multi-role Auth** - Admin, Technician, Operator roles

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests
npm run lint             # Lint code

# Migration
./scripts/migrate-imports.sh   # Migrate imports
./scripts/verify-imports.sh    # Verify migration
```

---

## 📚 Documentation

- **Architecture:** `07_DOCUMENTATION/architecture/OVERVIEW.md`
- **Migration Guide:** `MIGRATION_GUIDE.md`
- **Refactoring Report:** `REFACTORING_COMPLETE.md`
- **User Guides:** `07_DOCUMENTATION/guides/`

---

## 🐛 Troubleshooting

### Build Errors

**Error:** `Cannot find module '@/...'`  
**Fix:** Run migration script: `./scripts/migrate-imports.sh`

**Error:** `Module not found: '@infrastructure/...'`  
**Fix:** Check if index.ts exists in layer folder

### Runtime Errors

**Error:** Supabase connection failed  
**Fix:** Check `.env` file has correct credentials

**Error:** Telemetry not syncing  
**Fix:** Verify Barbieri API is accessible at `http://192.168.4.1:5000`

---

## 🤝 Contributing

1. Follow layer architecture rules
2. Use new import aliases (`@infrastructure/*`, `@ui/*`, etc.)
3. Write tests for new features
4. Update documentation

---

## 📞 Support

- **Issues:** GitHub Issues
- **Documentation:** `07_DOCUMENTATION/`
- **Architecture:** `REFACTORING_COMPLETE.md`

---

**Version:** 2.0-refactored  
**Status:** ✅ Core migrated, Phase 2 ready  
**License:** Proprietary
