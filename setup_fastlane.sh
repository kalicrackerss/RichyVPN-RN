#!/usr/bin/env bash

# RichyVPN_RN - Fastlane Configuration for iOS Build
# This script automates iOS build, signing, and deployment

# Install Fastlane
sudo gem install fastlane -NV

# Initialize Fastlane
cd ios
fastlane init

# Then configure lanes in fastfile:
# lane :build_ipa do
#   build_app(
#     workspace: "RichyVPN_RN.xcworkspace",
#     scheme: "RichyVPN_RN",
#     configuration: "Release",
#     export_method: "ad-hoc",
#     archive_path: "RichyVPN_RN.xcarchive",
#     export_path: "./"
#   )
# end

echo "Fastlane configured. Run 'cd ios && fastlane build_ipa' to build IPA"
