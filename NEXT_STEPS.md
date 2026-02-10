# Next Steps - Action Plan

**Status:** ✅ Phase 1 Complete - Ready for Phase 2  
**Date:** February 9, 2026  
**Estimated Time:** 1-2 minutes

---

## 🎯 What You Need to Do Now

### Step 1: Run Automated Migration (1 minute)

**RECOMMENDED:** Use the Node.js batch migration script (fastest):

```bash
# Navigate to project root
cd e-ManuAi-2026

# Run automated migration
node scripts/batch-migrate.js
```

**Alternative:** Use bash script (if Node.js fails):

```bash
chmod +x scripts/migrate-imports.sh
./scripts/migrate-imports.sh
```

**What this does:**
- Scans all `.ts` and `.tsx` files
- Replaces old `@/` imports with new layer aliases
- Shows progress and summary
- Takes ~30-60 seconds

---

### Step 2: Verify Migration (10 seconds)

```bash
./scripts/verify-imports.sh
```

**Expected output:**
```
✅ No old imports found!
All imports have been migrated to layer aliases.
```

**If errors found:**
- Review the listed files
- Fix manually using `MIGRATION_GUIDE.md`
- Run verify script again

---

### Step 3: Test Build (30 seconds)

```bash
npm run build
```

**Expected output:**
```
✓ built in XXXms
```

**If TypeScript errors:**
1. Read error messages carefully
2. Most common: missing index.ts exports
3. Fix according to error message
4. Run build again

---

### Step 4: Test Runtime (1 minute)

```bash
npm run dev
```

**Open:** [http://localhost:5173](http://localhost:5173)

**Check:**
- [ ] Dashboard loads without errors
- [ ] No console errors (F12)
- [ ] Login works
- [ ] MTH display shows
- [ ] Map renders (if telemetry available)

---

### Step 5: Commit Changes

```bash
# Review changes
git diff

# Stage all changes
git add .

# Commit
git commit -m "Complete import migration to layer aliases

- Migrated all @/ imports to layer-based aliases
- Created centralized index files for exports
- Added automated migration scripts
- Updated documentation

Phase 2 complete. All imports now use clean layer structure."

# Push to GitHub
git push origin main
```

---

## 📊 What Was Changed

### Files Created (11 new files)

1. **Wrapper Hooks:**
   - `06_SHARED/hooks/useMachine.ts`
   - `06_SHARED/hooks/useBarbieriiClient.ts`

2. **Index Files:**
   - `05_INFRASTRUCTURE/database/index.ts`
   - `05_INFRASTRUCTURE/auth/index.ts`
   - `05_INFRASTRUCTURE/offline/index.ts`
   - `02_DIGITAL_TWIN/telemetry/index.ts`
   - `06_SHARED/hooks/index.ts`
   - `06_SHARED/utils/index.ts`
   - `06_SHARED/utils/cn.ts`
   - `06_SHARED/index.ts`
   - `04_USER_INTERFACE/components/ui/index.ts`

3. **Migration Tools:**
   - `scripts/batch-migrate.js` (Node.js)
   - `scripts/migrate-imports.sh` (Bash)
   - `scripts/verify-imports.sh` (Verification)

4. **Documentation:**
   - `MIGRATION_GUIDE.md`
   - `REFACTORING_COMPLETE.md`
   - `QUICK_START.md`
   - `NEXT_STEPS.md` (this file)

### Files Modified (~160-170 files)

All `.ts` and `.tsx` files with old `@/` imports will be updated to use new layer aliases.

**Example changes:**

```typescript
// BEFORE
import { supabase } from '@/integrations/supabase/client';
import { useMachine } from '@/hooks/useMachine';
import { Button } from '@/components/ui/button';

// AFTER
import { supabase } from '@infrastructure/database';
import { useMachine } from '@shared/hooks/useMachine';
import { Button } from '@ui/components/ui/button';
```

---

## ✅ Success Criteria

After completing all steps, you should have:

- [ ] ✅ No old `@/` imports (verified by script)
- [ ] ✅ Build passes without TypeScript errors
- [ ] ✅ Dev server starts successfully
- [ ] ✅ Dashboard loads in browser
- [ ] ✅ No console errors
- [ ] ✅ All features work as before
- [ ] ✅ Changes committed to Git

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot find module '@/...'"

**Cause:** Migration script didn't catch all imports  
**Fix:**
```bash
# Find remaining old imports
grep -r "from '@/" --include="*.ts" --include="*.tsx" .

# Fix manually or run migration again
node scripts/batch-migrate.js
```

### Issue 2: "Module not found: '@infrastructure/...'"

**Cause:** Missing index.ts export file  
**Fix:** Check if the layer has an index.ts file with proper exports

### Issue 3: Build errors after migration

**Cause:** Some imports need manual adjustment  
**Fix:** Read TypeScript error message, update import path accordingly

### Issue 4: Circular dependency warning

**Cause:** Layer imports from higher layer (violates architecture)  
**Fix:** Move shared code to `06_SHARED/` or refactor

---

## 📚 Reference Documents

- **Migration Guide:** `MIGRATION_GUIDE.md` - Detailed migration instructions
- **Refactoring Report:** `REFACTORING_COMPLETE.md` - What was done and why
- **Quick Start:** `QUICK_START.md` - Fast setup guide
- **Architecture:** `07_DOCUMENTATION/architecture/OVERVIEW.md` - System design

---

## 🎯 After Migration

Once migration is complete, you can:

1. **Continue Development:**
   - Add new features using layer aliases
   - Follow architecture rules
   - Use centralized exports

2. **Deploy to Production:**
   - Build passes ✅
   - All tests pass ✅
   - Ready for deployment

3. **Onboard New Developers:**
   - Clear layer structure
   - Self-documenting imports
   - Fast orientation (15 min vs 2 hours)

---

## 💡 Tips

1. **Use Node.js script** - It's faster and more reliable than bash
2. **Review git diff** - Check what changed before committing
3. **Test thoroughly** - Run dev server and click through features
4. **Keep documentation** - Don't delete migration guides (useful for reference)

---

## 🚀 Ready to Start?

```bash
# Just run this:
node scripts/batch-migrate.js

# Then verify:
./scripts/verify-imports.sh

# Then test:
npm run build
npm run dev

# Then commit:
git add .
git commit -m "Complete import migration to layer aliases"
git push origin main
```

**Estimated total time:** 2-3 minutes  
**Risk level:** Low (automated, reversible)  
**Benefit:** Clean architecture, better DX, production-ready

---

**Good luck! 🎉**

If you encounter any issues, check `MIGRATION_GUIDE.md` or review the error messages carefully.
