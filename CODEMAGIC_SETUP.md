# Codemagic Configuration for RichyVPN_RN

This file configures Codemagic CI/CD for automatic iOS IPA builds.

## Setup Instructions

1. **Create account at Codemagic:**
   - Go to https://codemagic.io/
   - Sign up with GitHub

2. **Connect GitHub repository:**
   - Add your repo
   - Authorize Codemagic

3. **Create codemagic.yaml in project root:**
   ```yaml
   workflows:
     ios-workflow:
       name: React Native iOS Build
       instance_type: mac_mini_m2
       max_build_duration: 60
       
       environment:
         node: 18
         nvm_dir: $HOME/.nvm
         xcode: latest
         cocoapods: default
         
       triggering:
         events:
           - push
           - pull_request
         branches:
           - main
           - develop
       
       scripts:
         - name: Install dependencies
           script: npm install
         
         - name: Install CocoaPods
           script: cd ios && pod install && cd ..
         
         - name: Build for iOS
           script: |
             cd ios
             xcodebuild -workspace RichyVPN_RN.xcworkspace \
               -scheme RichyVPN_RN \
               -configuration Release \
               -derivedDataPath build \
               -archivePath build/RichyVPN_RN.xcarchive \
               archive
             cd ..
       
       artifacts:
         - ios/build/RichyVPN_RN.xcarchive
         - build/logs/xcodebuild_archive.log
       
       publishing:
         slack:
           channel: '#builds'
           notify_on_build_start: true
   ```

4. **Push configuration to GitHub:**
   ```bash
   git add codemagic.yaml
   git commit -m "Add Codemagic configuration"
   git push
   ```

5. **Monitor builds:**
   - Go to Codemagic Dashboard
   - Watch build progress
   - Download IPA artifact when done

## Build Artifacts

After successful build, download:
- `RichyVPN_RN.xcarchive` - Can be exported to IPA
- `xcodebuild_archive.log` - Build logs

## Export to IPA

On macOS, convert archive to IPA:

```bash
xcodebuild -exportArchive \
  -archivePath RichyVPN_RN.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath ./ipa
```

## Alternative: Use Codemagic Publish

Add to codemagic.yaml to auto-export IPA:

```yaml
scripts:
  - name: Export IPA
    script: |
      xcodebuild -exportArchive \
        -archivePath $CM_BUILD_DIR/ios/build/RichyVPN_RN.xcarchive \
        -exportOptionsPlist $CM_BUILD_DIR/ios/ExportOptions.plist \
        -exportPath $CM_BUILD_DIR/ipa

artifacts:
  - ipa/**/*.ipa
```

## Cost

- Free tier: 500 minutes/month
- Pro tier: Starting from $39/month

## Support

- Docs: https://docs.codemagic.io/
- Slack: Codemagic Community Slack
