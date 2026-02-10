#!/bin/bash

# e-ManuAI Import Migration Script
# Automatically updates old @/ imports to new layer-based aliases
# Date: February 9, 2026

set -e

echo "🔄 Starting import migration..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for changes
CHANGES=0

# Function to replace imports in files
replace_imports() {
  local pattern=$1
  local replacement=$2
  local description=$3
  
  echo -e "${YELLOW}Migrating:${NC} $description"
  
  # Find and replace (macOS compatible)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" -exec sed -i '' "s|$pattern|$replacement|g" {} +
  else
    # Linux
    find . -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" -exec sed -i "s|$pattern|$replacement|g" {} +
  fi
  
  CHANGES=$((CHANGES + 1))
}

echo "📦 Phase 1: Infrastructure Layer"
echo "--------------------------------"
replace_imports "from '@/integrations/supabase/client'" "from '@infrastructure/database'" "Supabase client"
replace_imports "from '@/types/database'" "from '@infrastructure/database/types/database'" "Database types"
replace_imports "from '@/contexts/AuthContext'" "from '@infrastructure/auth'" "Auth context"
replace_imports "from '@/lib/offline-queue'" "from '@infrastructure/offline'" "Offline queue"
echo ""

echo "🤖 Phase 2: Digital Twin Layer"
echo "--------------------------------"
replace_imports "from '@/lib/telemetry-sync'" "from '@digital-twin/telemetry'" "Telemetry sync"
replace_imports "from '@/lib/barbieri-realtime'" "from '@digital-twin/telemetry/realtime-client'" "Barbieri realtime"
echo ""

echo "🧠 Phase 3: AI Logic Layer"
echo "--------------------------------"
replace_imports "from '@/lib/ai-context'" "from '@ai/assistant/context-builder'" "AI context builder"
echo ""

echo "🎨 Phase 4: UI Layer"
echo "--------------------------------"
replace_imports "from '@/components/" "from '@ui/components/" "UI components"
replace_imports "from '@/pages/" "from '@ui/pages/" "UI pages"
replace_imports "from '@/styles/" "from '@ui/styles/" "UI styles"
echo ""

echo "🔧 Phase 5: Shared Layer"
echo "--------------------------------"
replace_imports "from '@/hooks/useMachine'" "from '@shared/hooks/useMachine'" "useMachine hook"
replace_imports "from '@/hooks/useBarbieriiClient'" "from '@shared/hooks/useBarbieriiClient'" "useBarbieriiClient hook"
replace_imports "from '@/hooks/" "from '@shared/hooks/" "Other hooks"
replace_imports "from '@/lib/utils'" "from '@shared/utils/format-utils'" "Utility functions"
echo ""

echo "✅ Migration complete!"
echo ""
echo -e "${GREEN}Applied $CHANGES migration patterns${NC}"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test build: npm run build"
echo "3. Test runtime: npm run dev"
echo "4. Commit: git add . && git commit -m 'Migrate imports to layer aliases'"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC} Some imports may need manual adjustment."
echo "   Check TypeScript errors after running 'npm run build'"
