#!/bin/bash

echo "DumpIt Frontend Cleanup Script"
echo "----------------------------"
echo "This script removes redundant files after refactoring."
echo "Press Enter to continue or Ctrl+C to cancel."
read

# List of files to remove
echo "Removing redundant API/Services files..."
rm -f src/api/auth.ts
rm -f src/api/authService.ts
rm -f src/api/productService.ts
rm -f src/api/categoryService.ts
rm -f src/services/api.ts

# Remove Redux-related files
echo "Removing Redux files..."
rm -f src/redux/store.ts
rm -f src/redux/hooks.ts
rm -f src/redux/AuthReduxProvider.tsx
rm -rf src/redux/slices

# Remove store files
echo "Removing store files..."
rm -f src/store/index.ts
rm -rf src/store/slices

# Remove empty directories
echo "Cleaning up empty directories..."
find src -type d -empty -delete

echo "Cleanup complete!" 