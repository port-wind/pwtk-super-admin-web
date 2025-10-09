#!/bin/bash

# Interactive release script
# Usage: ./release.sh

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display error messages
error_exit() {
    echo "❌ ERROR: $1" >&2
    exit 1
}

# Function to display success messages
success_message() {
    echo "✅ SUCCESS: $1"
}

# Function to display info messages
info_message() {
    echo "ℹ️  INFO: $1"
}

# Function to display section headers
section_header() {
    echo ""
    echo "================================================"
    echo "$1"
    echo "================================================"
}

# Function to increment version based on user choice
increment_version() {
    local current_version="$1"
    local choice="$2"
    
    # Split version into parts
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $choice in
        1)
            # Increment major, reset minor and patch to 0
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        2)
            # Increment minor, reset patch to 0
            minor=$((minor + 1))
            patch=0
            ;;
        3)
            # Increment patch only
            patch=$((patch + 1))
            ;;
        *)
            error_exit "Invalid choice: $choice"
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

section_header "🚀 Interactive Release Process"

# Step 1: Check if we are on dev branch
info_message "Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    error_exit "Must be on 'dev' branch. Current branch: $CURRENT_BRANCH. Please switch to dev branch first: git checkout dev"
fi
success_message "Currently on dev branch"

# Step 2: Check for uncommitted changes
info_message "Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  WARNING: You have uncommitted changes:"
    git status --short
    read -p "Do you want to continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        error_exit "Please commit or stash your changes before release"
    fi
fi
success_message "Working directory is clean or user confirmed to continue"

# Step 3: Fetch latest changes from remote
info_message "Fetching latest changes from remote..."
git fetch origin || error_exit "Failed to fetch from remote"
success_message "Fetched latest changes from remote"

# Step 4: Check if local dev is behind remote
info_message "Checking if local dev branch is up to date..."
LOCAL_COMMIT=$(git rev-parse dev)
REMOTE_COMMIT=$(git rev-parse origin/dev)

if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    info_message "Local dev branch is behind remote. Pulling latest changes..."
    git pull origin dev || error_exit "Failed to pull latest changes from origin/dev"
    success_message "Successfully pulled latest changes"
else
    success_message "Local dev branch is up to date"
fi

# Step 5: Get current version and display version selection menu
info_message "Getting current version..."

# Get current version from package.json
CURRENT_VERSION=$(grep -m 1 '"version":' package.json | awk -F '"' '{print $4}')
if [ -z "$CURRENT_VERSION" ]; then
    error_exit "Could not determine current version from package.json"
fi

# Split current version into parts for display
IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR=${VERSION_PARTS[0]}
MINOR=${VERSION_PARTS[1]}
PATCH=${VERSION_PARTS[2]}

section_header "Version Selection"
echo "📦 Current version: $CURRENT_VERSION"
echo ""
echo "Please select which version number to increment:"
echo ""
echo "1) Major version (${MAJOR}.${MINOR}.${PATCH} → $((MAJOR + 1)).0.0)"
echo "   Use for: Breaking changes, major new features"
echo ""
echo "2) Minor version (${MAJOR}.${MINOR}.${PATCH} → ${MAJOR}.$((MINOR + 1)).0)"
echo "   Use for: New features, backward-compatible changes"
echo ""
echo "3) Patch version (${MAJOR}.${MINOR}.${PATCH} → ${MAJOR}.${MINOR}.$((PATCH + 1)))"
echo "   Use for: Bug fixes, small improvements"
echo ""

# Get user choice
while true; do
    read -p "Enter your choice (1-3): " -n 1 -r
    echo
    case $REPLY in
        [1-3])
            CHOICE=$REPLY
            break
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1, 2, or 3."
            ;;
    esac
done

# Calculate new version
NEW_VERSION=$(increment_version "$CURRENT_VERSION" "$CHOICE")
VERSION_TAG="v$NEW_VERSION"

section_header "Release Confirmation"
echo "📋 Release Summary:"
echo "   Current version: $CURRENT_VERSION"
echo "   New version:     $NEW_VERSION"
echo "   Tag to create:   $VERSION_TAG"
echo ""

# Final confirmation
read -p "Do you want to proceed with the release? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    info_message "Release cancelled by user"
    exit 0
fi

# Step 6: Verify the tag doesn't already exist
info_message "Checking if tag $VERSION_TAG already exists..."
if git rev-parse "$VERSION_TAG" >/dev/null 2>&1; then
    error_exit "Tag $VERSION_TAG already exists. This should not happen as we generated it automatically."
fi
success_message "Tag $VERSION_TAG is available"

section_header "Executing Release"

# Step 7: Create the tag first (for local development workflow)
info_message "Creating tag $VERSION_TAG locally..."
git tag -a "$VERSION_TAG" -m "Release $VERSION_TAG" || error_exit "Failed to create tag"
success_message "Tag $VERSION_TAG created locally"

# Step 8: Execute the jenkins release workflow
if [ -f "bash/jenkins-release.sh" ]; then
    chmod +x bash/jenkins-release.sh
    info_message "Executing jenkins release workflow..."
    ./bash/jenkins-release.sh "$VERSION_TAG" || error_exit "Release process failed"
else
    error_exit "jenkins-release.sh not found"
fi

section_header "🎉 Release Completed Successfully!"
echo "✅ Tag $VERSION_TAG has been created and pushed to remote."
echo "✅ Version updated from $CURRENT_VERSION to $NEW_VERSION"
echo "✅ Build process completed"
echo ""
echo "You can now view the release at:"
echo "🔗 https://github.com/your-org/your-repo/releases/tag/$VERSION_TAG" 