#!/bin/bash

# build-and-archive.sh
# Script to build a Vue project in development mode and create a timestamped zip archive

# Exit immediately if a command exits with a non-zero status
set -e

# Function to display error messages
error_exit() {
    echo "ERROR: $1" >&2
    exit 1
}

# Function to display success messages
success_message() {
    echo "SUCCESS: $1"
}

# Function to display info messages
info_message() {
    echo "INFO: $1"
}

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Check if the original directory ends with '/bash' and move to parent if needed
if [[ "$ORIGINAL_DIR" == */bash ]]; then
    info_message "Current directory ends with '/bash', changing to parent directory"
    cd ..
    ORIGINAL_DIR=$(pwd)
fi

# Determine project directory
if [ $# -ge 1 ]; then
    # Use provided directory
    PROJECT_DIR="$1"
    info_message "Using provided project directory: $PROJECT_DIR"
else
    # Determine directory from script location
    SCRIPT_PATH=$(readlink -f "$0")
    SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
    PROJECT_DIR=$(dirname "$SCRIPT_DIR")
    info_message "Using derived project directory: $PROJECT_DIR"
fi

# Change to the project directory
info_message "Changing to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || error_exit "Failed to change to project directory: $PROJECT_DIR"

# Get the project name from package.json
PROJECT_NAME=$(grep -m 1 '"name":' package.json | awk -F '"' '{print $4}')
VERSION=$(grep -m 1 '"version":' package.json | awk -F '"' '{print $4}')

if [ -z "$PROJECT_NAME" ]; then
    error_exit "Could not determine project name from package.json"
fi

info_message "Project name: $PROJECT_NAME"

# Function to safely clean the dist-dev directory if it exists
clean_dist_dev() {
    if [ -d "dist-dev" ]; then
        info_message "Cleaning dist-dev directory..."
        rm -rf dist-dev
        success_message "dist-dev directory cleaned"
    else
        info_message "No dist-dev directory found, skipping cleanup"
    fi
}

# Clean the dist-dev directory before building
clean_dist_dev

# Note: Timestamp update functionality moved to jenkins-release.sh

# Create timestamp in format [yyyy-mm-dd-hh:mm]
TIMESTAMP=$(date "+[%Y-%m-%d-%H:%M]")
ZIP_FILENAME="${PROJECT_NAME}_${VERSION}_${TIMESTAMP}.zip"

# Timestamp update now handled by release script before packaging
info_message "Skipping timestamp update - handled by release script"

info_message "Starting development build..."

# Build the project in development mode
npm run build || error_exit "Build failed"

success_message "Build completed successfully"

# Check if dist-dev directory exists
if [ ! -d "dist-dev" ]; then
    error_exit "dist-dev directory not found. Build may have created output in a different location."
fi

info_message "Creating zip archive: $ZIP_FILENAME"

# Create zip file of the dist-dev directory
zip -r "$ZIP_FILENAME" dist-dev || error_exit "Failed to create zip file"

# Verify the zip file was created
if [ -f "$ZIP_FILENAME" ]; then
    ZIP_SIZE=$(du -h "$ZIP_FILENAME" | cut -f1)
    success_message "Archive created successfully: $ZIP_FILENAME (Size: $ZIP_SIZE)"
else
    error_exit "Zip file was not created"
fi

info_message "Build and archive process completed"

# Output the full path to the zip file
FULL_PATH="$(pwd)/$ZIP_FILENAME"
echo "---------------------------------------------"
echo "Archive location: $FULL_PATH"
echo "---------------------------------------------"

# Return to the original directory
cd "$ORIGINAL_DIR" || error_exit "Failed to return to original directory: $ORIGINAL_DIR"
info_message "Returned to original directory"

exit 0
