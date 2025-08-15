#!/bin/bash

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
readonly REGISTRY="lgdweb"
readonly PROJECT_NAME="sample-project"

readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

logInfo() { echo -e "${BLUE}🔨 $*${NC}"; }
logSuccess() { echo -e "${GREEN}✅ $*${NC}"; }
logError() { echo -e "${RED}❌ $*${NC}" >&2; }

showHelp() {
  cat << EOF
🐳 Docker Build Script

USAGE: $0 <api|web|all> [tag]

EXAMPLES:
  $0 api              # Build API with latest tag
  $0 web v1.2.3       # Build web with specific tag
  $0 all              # Build both services

EOF
}

buildImage() {
  local service="$1"
  local tag="${2:-latest}"
  local imageName="${REGISTRY}/${PROJECT_NAME}-${service}:${tag}"
  
  logInfo "Building $service -> $imageName"
  
  cd "$PROJECT_ROOT"
  
  local dockerfile="docker/Dockerfile.${service}"
  local buildArgs=""
  
  [[ "$service" == "web" ]] && buildArgs="--build-arg PUBLIC_API_URL=/api"
  
  docker buildx build \
    -f "$dockerfile" \
    --network=host \
    $buildArgs \
    -t "$imageName" \
    .
  
  logSuccess "Built $imageName"
}

main() {
  local service="${1:-}"
  local tag="${2:-latest}"
  
  [[ -z "$service" ]] && { showHelp; exit 1; }
  
  case "$service" in
    api|web)
      buildImage "$service" "$tag"
      ;;
    all)
      buildImage "api" "$tag"
      buildImage "web" "$tag"
      ;;
    *)
      logError "Invalid service: $service"
      showHelp
      exit 1
      ;;
  esac
  
  logSuccess "Done!"
}

main "$@"
