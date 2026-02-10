# Migration Guide: Import Path Refactoring

**Date:** February 9, 2026  
**Status:** ✅ Core files migrated, remaining files need update  
**Architect:** Bhindi AI

---

## Overview

This project uses a **9-layer architecture** with TypeScript path aliases. All imports must use the new layer-based aliases instead of the old `@/` (src/) paths.

---

## Path Alias Mapping

### Old → New Import Paths

| Old Path | New Path | Layer |
|----------|----------|-------|
| `@/integrations/supabase/client` | `@infrastructure/database` | Infrastructure |
| `@/types/database` | `@infrastructure/database/types/database` | Infrastructure |
| `@/contexts/AuthContext` | `@infrastructure/auth` | Infrastructure |
| `@/hooks/useMachine` | `@shared/hooks/useMachine` | Shared |
| `@/hooks/useBarbieriiClient` | `@shared/hooks/useBarbieriiClient` | Shared |
| `@/lib/telemetry-sync` | `@digital-twin/telemetry` | Digital Twin |
| `@/lib/barbieri-realtime` | `@digital-twin/telemetry/realtime-client` | Digital Twin |
| `@/lib/offline-queue` | `@infrastructure/offline` | Infrastructure |
| `@/lib/ai-context` | `@ai/assistant/context-builder` | AI Logic |
| `@/components/*` | `@ui/components/*` | UI |
| `@/pages/*` | `@ui/pages/*` | UI |
| `@/styles/*` | `@ui/styles/*` | UI |

---

## Layer Structure

```
e-manuai-v2/
├── 01_REALITY/           # @reality/*    - PLC, sensors, Barbieri API
├── 02_DIGITAL_TWIN/      # @digital-twin/* - Telemetry, sessions, machine state
├── 03_AI_LOGIC/          # @ai/*         - AI assistant, diagnostics
├── 04_USER_INTERFACE/    # @ui/*         - React pages & components
├── 05_INFRASTRUCTURE/    # @infrastructure/* - Database, auth, offline
├── 06_SHARED/            # @shared/*     - Hooks, utils, types
├── 07_DOCUMENTATION/     # Guides, architecture
├── 08_TESTING/           # Test suites
└── 09_PUBLIC/            # Static assets
```

---

## Migration Status

### ✅ Completed Files

- [x] `src/App.tsx`
- [x] `05_INFRASTRUCTURE/auth/AuthContext.tsx`
- [x] `02_DIGITAL_TWIN/machine-model/machine-hooks.ts`
- [x] `01_REALITY/barbieri-api/client.ts`
- [x] `02_DIGITAL_TWIN/telemetry/sync-service.ts`
- [x] `04_USER_INTERFACE/pages/DashboardPage.tsx`
- [x] `04_USER_INTERFACE/components/layout/AppLayout.tsx`

### ⏳ Remaining Files (Need Update)

Run this search to find all files with old imports:

```bash
# Find all files with @/ imports (excluding node_modules)
grep -r "from '@/" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .
```

**Estimated remaining files:** ~150-170 files

---

## How to Migrate a File

### Step 1: Identify Old Imports

Look for imports starting with `@/`:

```typescript
// ❌ OLD
import { supabase } from '@/integrations/supabase/client';
import { useMachine } from '@/hooks/useMachine';
import { Button } from '@/components/ui/button';
```

### Step 2: Replace with New Aliases

Use the mapping table above:

```typescript
// ✅ NEW
import { supabase } from '@infrastructure/database';
import { useMachine } from '@shared/hooks/useMachine';
import { Button } from '@ui/components/ui/button';
```

### Step 3: Verify Build

```bash
npm run build
```

TypeScript will catch any broken imports.

---

## Common Patterns

### Database Access

```typescript
// ❌ OLD
import { supabase } from '@/integrations/supabase/client';
import type { Stroj } from '@/types/database';

// ✅ NEW
import { supabase } from '@infrastructure/database';
import type { Stroj } from '@infrastructure/database/types/database';
```

### Authentication

```typescript
// ❌ OLD
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// ✅ NEW
import { useAuth } from '@infrastructure/auth';
import { ProtectedRoute } from '@infrastructure/auth';
```

### Hooks

```typescript
// ❌ OLD
import { useMachine } from '@/hooks/useMachine';
import { useBarbieriiClient } from '@/hooks/useBarbieriiClient';

// ✅ NEW
import { useMachine } from '@shared/hooks/useMachine';
import { useBarbieriiClient } from '@shared/hooks/useBarbieriiClient';
```

### UI Components

```typescript
// ❌ OLD
import { Button } from '@/components/ui/button';
import { DashboardPage } from '@/pages/DashboardPage';

// ✅ NEW
import { Button } from '@ui/components/ui/button';
import { DashboardPage } from '@ui/pages/DashboardPage';
```

### Telemetry & Digital Twin

```typescript
// ❌ OLD
import { startGlobalTelemetrySync } from '@/lib/telemetry-sync';
import { getBarbieriClient } from '@/lib/barbieri-realtime';

// ✅ NEW
import { startGlobalTelemetrySync } from '@digital-twin/telemetry';
import { getBarbieriClient } from '@digital-twin/telemetry/realtime-client';
```

### Offline Support

```typescript
// ❌ OLD
import { saveMthUpdate } from '@/lib/offline-queue';

// ✅ NEW
import { saveMthUpdate } from '@infrastructure/offline';
```

---

## Automated Migration Script

Use this bash script to automate most replacements:

```bash
#!/bin/bash

# Replace common patterns
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -exec sed -i '' \
  -e "s|from '@/integrations/supabase/client'|from '@infrastructure/database'|g" \
  -e "s|from '@/types/database'|from '@infrastructure/database/types/database'|g" \
  -e "s|from '@/contexts/AuthContext'|from '@infrastructure/auth'|g" \
  -e "s|from '@/hooks/useMachine'|from '@shared/hooks/useMachine'|g" \
  -e "s|from '@/hooks/useBarbieriiClient'|from '@shared/hooks/useBarbieriiClient'|g" \
  -e "s|from '@/lib/telemetry-sync'|from '@digital-twin/telemetry'|g" \
  -e "s|from '@/lib/barbieri-realtime'|from '@digital-twin/telemetry/realtime-client'|g" \
  -e "s|from '@/lib/offline-queue'|from '@infrastructure/offline'|g" \
  -e "s|from '@/components/|from '@ui/components/|g" \
  -e "s|from '@/pages/|from '@ui/pages/|g" \
  -e "s|from '@/styles/|from '@ui/styles/|g" \
  {} +

echo "✅ Migration complete! Run 'npm run build' to verify."
```

**Note:** Review changes before committing. Some imports may need manual adjustment.

---

## Verification Checklist

After migration:

- [ ] `npm run build` passes without TypeScript errors
- [ ] `npm run dev` starts successfully
- [ ] Dashboard loads without console errors
- [ ] Authentication works (login/logout)
- [ ] Telemetry sync runs
- [ ] Service book CRUD operations work
- [ ] AI assistant responds
- [ ] Offline mode syncs correctly

---

## Troubleshooting

### Error: Cannot find module '@/...'

**Cause:** File still uses old import path  
**Fix:** Update import to use new layer alias

### Error: Module not found: '@infrastructure/...'

**Cause:** Missing index.ts export file  
**Fix:** Create index.ts in the layer folder with proper exports

### Error: Circular dependency detected

**Cause:** Layer imports from higher layer (violates architecture)  
**Fix:** Move shared code to `06_SHARED/` or refactor dependency

---

## Architecture Rules

### Layer Dependencies (Top → Bottom)

```
04_USER_INTERFACE (UI)
  ↓ can import from
03_AI_LOGIC (AI)
  ↓ can import from
02_DIGITAL_TWIN (Digital Twin)
  ↓ can import from
01_REALITY (Reality)
  ↓ can import from
05_INFRASTRUCTURE (Infrastructure)
  ↓ can import from
06_SHARED (Shared)
```

**Rule:** Lower layers CANNOT import from higher layers.

### Shared Layer

`06_SHARED/` is accessible by ALL layers. Use for:
- Reusable hooks
- Utility functions
- Common types
- Wrapper exports

---

## Next Steps

1. **Run automated script** (review changes)
2. **Manual review** of complex files
3. **Test build** (`npm run build`)
4. **Test runtime** (`npm run dev`)
5. **Commit changes** with clear message

---

## Support

If you encounter issues:

1. Check this guide first
2. Review `REFACTORING_REPORT.md`
3. Check TypeScript errors in build output
4. Verify path aliases in `tsconfig.json` and `vite.config.ts`

---

**Migration Progress:** 7/~170 files (4%)  
**Estimated Time:** 2-3 hours for full migration  
**Priority:** High (blocks production deployment)
