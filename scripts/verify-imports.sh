#!/bin/bash

# e-ManuAI Import Verification Script
# Checks for remaining old @/ imports
# Date: February 9, 2026

set -e

echo "🔍 Verifying import migration..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Find files with old imports
OLD_IMPORTS=$(grep -r "from '@/" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git . 2>/dev/null || true)

if [ -z "$OLD_IMPORTS" ]; then
  echo -e "${GREEN}✅ No old imports found!${NC}"
  echo ""
  echo "All imports have been migrated to layer aliases."
  echo ""
  echo "Next steps:"
  echo "1. Run: npm run build"
  echo "2. Run: npm run dev"
  echo "3. Test all features"
  exit 0
else
  echo -e "${RED}❌ Found files with old @/ imports:${NC}"
  echo ""
  echo "$OLD_IMPORTS"
  echo ""
  echo -e "${YELLOW}Action required:${NC}"
  echo "1. Review MIGRATION_GUIDE.md"
  echo "2. Update remaining files manually"
  echo "3. Run this script again to verify"
  exit 1
fi
