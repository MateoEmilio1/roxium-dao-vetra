#!/bin/bash
# Quick fix script to update generated TypeScript types
# This is a workaround until document models can be properly updated via MCP

set -e

echo "🔧 Fixing generated TypeScript types..."

# Backup gen folders
echo "📦 Creating backups..."
cp -r document-models/dao/gen document-models/dao/gen.backup
cp -r document-models/proposal/gen document-models/proposal/gen.backup
cp -r document-models/task/gen document-models/task/gen.backup

echo "✏️  Updating DAO types..."
# Note: This would require complex sed/awk commands or a Node.js script
# For now, the user should follow FIX-TYPES.md manually

echo "⚠️  Manual updates required!"
echo "Please follow the instructions in FIX-TYPES.md"
echo ""
echo "Key files to edit:"
echo "  1. document-models/dao/gen/schema/types.ts"
echo "  2. document-models/dao/gen/index.ts (find DaoCoreOperations interface)"
echo "  3. document-models/dao/gen/creators.js (if it exists)"
echo ""
echo "  4. document-models/proposal/gen/schema/types.ts"
echo ""
echo "  5. document-models/task/gen/schema/types.ts"
echo "  6. document-models/task/gen/index.ts (find TaskCoreOperations interface)"
echo "  7. document-models/task/gen/creators.js (if it exists)"
echo ""
echo "After editing, run:"
echo "  pnpm tsc"
echo "  pnpm lint:fix"
echo ""
echo "Backups saved in *.gen.backup directories"
