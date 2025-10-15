#!/bin/bash

# jenkins-release.sh
# Script for Jenkins CI/CD: Update version from existing tag and move tag to new commit

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

# Function to get version from existing tag
get_version_from_existing_tag() {
    local tag_name="$1"
    
    if [ -z "$tag_name" ]; then
        # Get the latest tag if no tag is specified
        tag_name=$(git describe --tags --abbrev=0 2>/dev/null)
        if [ -z "$tag_name" ]; then
            return 1  # Return error instead of calling error_exit in subshell
        fi
        # Send info message to stderr to avoid mixing with output
        echo "INFO: Using latest tag: $tag_name" >&2
    else
        # Check if the specified tag exists
        if ! git rev-parse "$tag_name" >/dev/null 2>&1; then
            return 1  # Return error instead of calling error_exit in subshell
        fi
        # Send info message to stderr to avoid mixing with output
        echo "INFO: Using specified tag: $tag_name" >&2
    fi
    
    # Extract version number from tag (remove 'v' prefix if present)
    local version=$(echo "$tag_name" | sed 's/^v//')
    
    # Validate version format (should be like 1.2.3 or 1.2.3-alpha.1)
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][a-zA-Z0-9]+)*$ ]]; then
        return 1  # Return error instead of calling error_exit in subshell
    fi
    
    echo "$version:$tag_name"
}

# Function to update package.json version
update_package_json() {
    local version="$1"
    local package_file="package.json"
    
    if [ ! -f "$package_file" ]; then
        error_exit "package.json not found in current directory"
    fi
    
    info_message "Updating version in $package_file to $version"
    
    # Update version using sed (macOS compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/" "$package_file"
    else
        sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$version\"/" "$package_file"
    fi
    
    # Verify the change
    local new_version=$(grep -m 1 '"version":' "$package_file" | awk -F '"' '{print $4}')
    if [ "$new_version" = "$version" ]; then
        success_message "package.json version updated to $version"
    else
        error_exit "Failed to update package.json version"
    fi
}

# Function to update webConfigApi.js version
update_web_config_api() {
    local version="$1"
    local config_files=("public/webConfigApi.js" "webConfigApi.js")
    
    for config_file in "${config_files[@]}"; do
        if [ ! -f "$config_file" ]; then
            info_message "Warning: $config_file not found, skipping"
            continue
        fi
        
        info_message "Updating version in $config_file to $version"
        
        # Update version using sed (macOS compatible)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/version: '[^']*'/version: '$version'/" "$config_file"
        else
            sed -i "s/version: '[^']*'/version: '$version'/" "$config_file"
        fi
        
        # Verify the change
        local new_version=$(grep "version:" "$config_file" | awk -F "'" '{print $2}')
        if [ "$new_version" = "$version" ]; then
            success_message "$config_file version updated to $version"
        else
            error_exit "Failed to update $config_file version"
        fi
    done
}

# Function to update timestamp in index.html
update_index_html_timestamp() {
    local index_file="index.html"
    
    if [ ! -f "$index_file" ]; then
        info_message "index.html not found in current directory. Skipping timestamp update."
        return 0
    fi
    
    info_message "Updating timestamp in $index_file..."
    
    # Generate current timestamp in format YYYYMMDDHHMM
    local NEW_TIMESTAMP=$(date "+%Y%m%d%H%M")
    
    # Update timestamp using sed (macOS compatible)
    if grep -q '<script src="/webConfigApi.js?t=[0-9][0-9]*"></script>' "$index_file"; then
        # Pattern found, replace the timestamp
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' -e "s/<script src=\"\/webConfigApi.js?t=[0-9][0-9]*\"><\/script>/<script src=\"\/webConfigApi.js?t=${NEW_TIMESTAMP}\"><\/script>/g" "$index_file"
        else
            sed -i "s/<script src=\"\/webConfigApi.js?t=[0-9][0-9]*\"><\/script>/<script src=\"\/webConfigApi.js?t=${NEW_TIMESTAMP}\"><\/script>/g" "$index_file"
        fi
        success_message "Timestamp successfully updated to ${NEW_TIMESTAMP} in index.html"
    else
        info_message "Timestamp pattern not found in index.html. No changes made."
    fi
}

# Function to move tag to new commit
move_tag_to_current_commit() {
    local tag_name="$1"
    local message="$2"
    
    info_message "Moving tag '$tag_name' to current commit"
    
    # Delete the old tag locally
    git tag -d "$tag_name"
    
    # Create new tag at current commit
    git tag -a "$tag_name" -m "$message"
    
    success_message "Tag '$tag_name' moved to current commit"
}

# Main Jenkins workflow
jenkins_release_workflow() {
    local tag_name="$1"
    
    info_message "=== Jenkins Release Workflow Started ==="
    info_message "Target tag: ${tag_name:-'latest'}"
    
    # Step 1: Get version from existing tag
    local version_info
    if ! version_info=$(get_version_from_existing_tag "$tag_name"); then
        if [ -z "$tag_name" ]; then
            error_exit "No git tags found."
        else
            error_exit "Tag '$tag_name' does not exist or has invalid format."
        fi
    fi
    
    # Check if version_info is empty (function failed)
    if [ -z "$version_info" ]; then
        error_exit "Failed to get version information from tag"
    fi
    
    local version=$(echo "$version_info" | cut -d':' -f1)
    local actual_tag=$(echo "$version_info" | cut -d':' -f2)
    
    # Validate extracted values
    if [ -z "$version" ] || [ -z "$actual_tag" ]; then
        error_exit "Failed to extract version or tag information. Got: '$version_info'"
    fi
    
    info_message "Extracted version: $version from tag: $actual_tag"
    
    # Step 2: Check if version files need updating
    local current_pkg_version=$(grep -m 1 '"version":' package.json | awk -F '"' '{print $4}')
    local current_web_version=$(grep "version:" public/webConfigApi.js | awk -F "'" '{print $2}')
    
    info_message "Current package.json version: $current_pkg_version"
    info_message "Current webConfigApi.js version: $current_web_version"
    
    if [ "$current_pkg_version" = "$version" ] && [ "$current_web_version" = "$version" ]; then
        info_message "Version files are already up to date. No changes needed."
        
        # Still execute package.sh
        info_message "Executing package.sh script..."
        if [ -f "bash/package.sh" ]; then
            chmod +x bash/package.sh
            bash/package.sh
            success_message "Package script executed successfully"
        else
            error_exit "bash/package.sh not found"
        fi
        
        info_message "=== Jenkins Release Workflow Completed (No Changes) ==="
        return 0
    fi
    
    # Step 3: Update all version files and timestamps simultaneously
    info_message "Updating version files and build timestamp..."
    update_package_json "$version"
    update_web_config_api "$version"
    update_index_html_timestamp
    success_message "All version files and timestamp updated"
    
    # Step 4: Commit all changes
    info_message "Committing version updates and timestamp changes..."
    git add package.json public/webConfigApi.js webConfigApi.js index.html
    git commit -m "chore: bump version to $version and update timestamp for release $actual_tag"
    success_message "Version and timestamp changes committed"
    
    # Step 5: Move tag to the new commit
    move_tag_to_current_commit "$actual_tag" "Release $actual_tag with version updates and timestamp"
    
    # Step 6: Push changes and updated tag
    info_message "Pushing changes and updated tag to remote..."
    git push origin $(git branch --show-current)
    git push origin "$actual_tag" --force
    success_message "Changes and updated tag pushed to remote"
    
    # Step 7: Execute package.sh for final build and packaging
    info_message "Executing package.sh script for final build and packaging..."
    if [ -f "bash/package.sh" ]; then
        chmod +x bash/package.sh
        bash/package.sh
        success_message "Package script executed successfully"
        
        # Note: package.sh no longer modifies any source files, only creates build artifacts
        info_message "Build artifacts created, no source file modifications"
    else
        error_exit "bash/package.sh not found"
    fi
    
    info_message "=== Jenkins Release Workflow Completed Successfully ==="
    
    # Output summary
    echo ""
    echo "===== RELEASE SUMMARY ====="
    echo "Tag: $actual_tag"
    echo "Version: $version"
    echo "Files updated: package.json, public/webConfigApi.js, webConfigApi.js"
    echo "Tag moved to commit: $(git rev-parse HEAD)"
    echo "========================="
}

# Check if running with tag parameter
if [ $# -eq 0 ]; then
    info_message "No tag specified, will use the latest tag"
    jenkins_release_workflow
else
    jenkins_release_workflow "$1"
fi 