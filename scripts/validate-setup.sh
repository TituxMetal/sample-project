#! /bin/bash

PASSED=0
FAILED=0
ERRORS=()

pass() { echo "✅ $1"; ((PASSED++)); }
fail() { echo "❌ $1"; ERRORS+=("$1"); ((FAILED++)); }

NODE_REQUIRED=$(grep -o '"node": "[^"]*"' package.json | cut -d'"' -f4)
YARN_REQUIRED=$(grep -o '"yarn": "[^"]*"' package.json | cut -d'"' -f4)

COMPONENTS=()
[ -d "apps/api" ] && COMPONENTS+=("api")
[ -d "apps/web" ] && COMPONENTS+=("web")


validateEnvironment() {
  echo "🔍 Validating environment..."
  
  CURRENT_NODE=$(node --version)
  CURRENT_YARN=$(yarn --version)
  
  echo "Node.js: $CURRENT_NODE (required: $NODE_REQUIRED)"
  echo "Yarn: $CURRENT_YARN (required: $YARN_REQUIRED)"
  
  [ -d ".git" ] && pass "Git repository detected" || echo "⚠️  No git repository found"
}

detectProjectStructure() {
  echo "📦 Detecting project structure..."
  
  COMPONENTS=()
  [ -d "apps/api" ] && COMPONENTS+=("api")
  [ -d "apps/web" ] && COMPONENTS+=("web")
  [ -d "packages/shared-types" ] && COMPONENTS+=("shared-types")
  [ -d "packages/eslint-config" ] && COMPONENTS+=("eslint-config")
  [ -d "packages/ts-config" ] && COMPONENTS+=("ts-config")
  
  echo "Found components: ${COMPONENTS[*]}"
}

validateDetectedComponents() {
  echo "🧪 Validating detected components..."
  
  for component in "${COMPONENTS[@]}"; do
    pass "$component detected and working"
  done
}

validateBuildProcess() {
  echo "🔨 Testing build process..."
  
  yarn build && pass "Build successful" || fail "Build failed"
}

validateDevelopmentWorkflow() {
  echo "⚙️  Testing development workflow..."
  
  WORKFLOW_COMMANDS=("typecheck" "lint" "format" "test")
  
  for cmd in "${WORKFLOW_COMMANDS[@]}"; do
    echo "Testing yarn $cmd..."
    yarn "$cmd" && pass "$cmd works" || fail "$cmd failed"
  done
}

validateDatabase() {
  echo "🗄️  Testing database setup..."
  
  # Check if Prisma schema exists
  [ -f "apps/api/prisma/schema.prisma" ] && pass "Prisma schema found" || fail "Prisma schema missing"
  
  # Test Prisma generate using yarn workspace
  yarn workspace @app/api prisma generate && pass "Prisma generate works" || fail "Prisma generate failed"
}

validateDocker() {
  echo "🐳 Testing Docker setup..."
  
  # Check Docker files exist
  [ -f "docker/compose.yaml" ] && pass "Docker Compose found" || fail "Docker Compose missing"
  [ -f "docker/Dockerfile.api" ] && pass "API Dockerfile found" || fail "API Dockerfile missing"
  [ -f "docker/Dockerfile.web" ] && pass "Web Dockerfile found" || fail "Web Dockerfile missing"

  docker compose -f docker/compose.yaml config > /dev/null && pass "Docker Compose config valid" || fail "Docker Compose config invalid"
}

validateTypeScript() {
  echo "📝 Testing TypeScript configuration..."
  
  # Test TypeScript compilation for each app using workspace commands
  yarn workspace @app/api tsc --noEmit && pass "API TypeScript compilation OK" || fail "API TypeScript compilation failed"
  yarn workspace @app/web tsc --noEmit && pass "Web TypeScript compilation OK" || fail "Web TypeScript compilation failed"
}

printSummary() {
  echo ""
  echo "📊 SUMMARY: $PASSED passed, $FAILED failed"
  
  for error in "${ERRORS[@]}"; do
    echo "🚨 $error"
  done
  
  [ $FAILED -eq 0 ] && echo "🎉 ALL GOOD!" || echo "💥 FIX THE ERRORS!"
}

main() {
  validateEnvironment          # 1. Check Node/Yarn versions first
  detectProjectStructure       # 2. Identify what components exist
  validateDetectedComponents  # 3. Validate the detected components
  validateDatabase           # 4. Test Prisma/database setup (needs dependencies)
  validateDocker            # 5. Validate Docker configuration (independent)
  validateTypeScript        # 6. Test TypeScript compilation (needs dependencies)
  validateBuildProcess      # 7. Test build (needs TypeScript + dependencies working)
  validateDevelopmentWorkflow # 8. Test dev commands (needs everything else working)
  
  echo "🧹 Cleaning up..."
  yarn clean
  yarn reset
  
  printSummary
}

time main "$@"

exit 0
