# Final IPA Build Guide for RichyVPN iOS App

## Overview
This guide provides step-by-step instructions to build a production iOS IPA file using **Codemagic** cloud build services (macOS hosted). This is the recommended approach for Windows users.

---

## Prerequisites
- GitHub account (public or private repository)
- Codemagic account (free tier available)
- Apple Developer Account (for certificates and signing - $99/year)
- App Store Connect access (for app distribution)

---

## Step 1: Prepare Your GitHub Repository

### 1.1 Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial React Native VPN app commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/RichyVPN-RN.git
git push -u origin main
```

### 1.2 Repository Structure Must Include
```
├── app.json
├── package.json
├── ios/
│   ├── RichyVPN
│   │   ├── Info.plist
│   │   ├── RichyVPN.entitlements (IMPORTANT - add NetworkExtension capability)
│   │   └── ...
│   └── Podfile
├── src/
├── codemagic.yaml (Codemagic configuration)
└── README.md
```

---

## Step 2: Apple Developer Setup

### 2.1 Create App ID in Apple Developer Portal
1. Go to [developer.apple.com](https://developer.apple.com)
2. Login to your Apple Developer Account
3. Navigate to **Certificates, Identifiers & Profiles** → **Identifiers**
4. Click **+** to create new identifier
5. Select **App IDs** → **Continue**
6. Fill in:
   - **Description**: RichyVPN
   - **Bundle ID**: `com.richyvpn.client` (or your domain)
   - **Capabilities**: 
     - Enable **Network Extension**
     - Enable **VPN Configuration**

### 2.2 Create Distribution Certificate
1. Go to **Certificates** → Click **+**
2. Select **Apple Distribution** → **Continue**
3. Follow steps to create and download certificate
4. Double-click to add to Keychain

### 2.3 Create Provisioning Profile
1. Go to **Provisioning Profiles** → Click **+**
2. Select **App Store** → **Continue**
3. Choose your App ID → **Continue**
4. Select Distribution Certificate → **Continue**
5. Name it: `RichyVPN Production`
6. Download the provisioning profile

### 2.4 Create App Store Connect Record
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Click **+ Create New App**
3. Select **iOS**
4. Fill in:
   - **Name**: RichyVPN
   - **Primary Language**: English
   - **Bundle ID**: Select `com.richyvpn.client`
   - **SKU**: `richyvpn-001`
   - **User Access**: Full Access

---

## Step 3: Configure Codemagic

### 3.1 Add iOS Configuration to codemagic.yaml

Create/update `codemagic.yaml` in your project root:

```yaml
workflows:
  ios-production:
    name: iOS Production Build
    max_build_duration: 60
    instance_type: mac_mini_m2
    
    environment:
      ios_signing:
        provisioning_profiles:
          - name: RichyVPN Production
      groups:
        - apple_credentials
      xcode: latest
      cocoapods: default
    
    scripts:
      - name: Install dependencies
        script: |
          npm install
          cd ios && pod install && cd ..
      
      - name: Build iOS app
        script: |
          xcodebuild build \
            -workspace ios/RichyVPN.xcworkspace \
            -scheme RichyVPN \
            -configuration Release \
            -derivedDataPath build/ios \
            -allowProvisioningUpdates \
            CODE_SIGN_IDENTITY="Apple Distribution: Your Name (TEAM_ID)" \
            PROVISIONING_PROFILE_SPECIFIER="RichyVPN Production" \
            TEAM_ID="TEAM_ID_HERE"
    
      - name: Create IPA
        script: |
          xcodebuild -exportArchive \
            -archivePath build/ios/RichyVPN.xcarchive \
            -exportPath build/ios/ipa \
            -exportOptionsPlist ios/ExportOptions.plist
    
    artifacts:
      - build/ios/ipa/**/*.ipa
      - build/ios/**/*.dsym
      
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
        submit_to_app_store: false
```

### 3.2 Create ExportOptions.plist

Create `ios/ExportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>teamID</key>
    <string>TEAM_ID_HERE</string>
    <key>provisioningProfileSpecifier</key>
    <string>RichyVPN Production</string>
</dict>
</plist>
```

---

## Step 4: Connect Codemagic to GitHub

### 4.1 Login to Codemagic
1. Go to [codemagic.io](https://codemagic.io)
2. Click **Sign In** → Select **GitHub**
3. Authorize Codemagic to access your repositories

### 4.2 Create New Build
1. Click **+ New App**
2. Select **RichyVPN-RN** repository
3. Click **Set Up Build**

### 4.3 Configure Build
1. Select **iOS** → **React Native**
2. Select branch: **main**
3. Select workflow: Choose the one that matches `codemagic.yaml`

### 4.4 Add Apple Credentials
1. Navigate to **Team Settings** → **Integrations** → **App Store Connect**
2. Click **Create New Integration**
3. Select **API Key** or **App-specific Password**
4. Enter your Apple ID credentials
5. Save integration

---

## Step 5: Build Steps in Codemagic Dashboard

### 5.1 Configure Signing Credentials
1. In build settings, go to **iOS Signing**
2. Upload or select:
   - **Distribution Certificate** (.p12 file)
   - **Provisioning Profile** (.mobileprovision file)
   - **Provisioning Profile Password** (if certificate is password-protected)

### 5.2 Configure Environment Variables
In **Environment Variables** section, add:
```
CM_APPLE_ID = your-apple-id@icloud.com
CM_APP_PASSWORD = your-app-specific-password
CM_CERTIFICATE_PASSWORD = your-cert-password (if any)
```

### 5.3 Start Build
1. Click **Build** button
2. Monitor build progress in real-time
3. View logs for any errors

---

## Step 6: Download IPA File

### Option 1: From Codemagic Dashboard
1. When build completes successfully, go to **Artifacts**
2. Download `.ipa` file
3. Download `.dsym` file (for crash debugging)

### Option 2: Using API
```bash
curl -H "x-auth-token: YOUR_CODEMAGIC_API_TOKEN" \
  https://api.codemagic.io/builds/BUILD_ID/artifacts \
  -o RichyVPN.ipa
```

---

## Step 7: Distribute IPA

### Option A: TestFlight (Beta Testing)
1. In **App Store Connect** → **TestFlight**
2. Click **+ Add build**
3. Select the build uploaded by Codemagic
4. Add beta testers' emails
5. Beta testing starts immediately

### Option B: Ad-Hoc Distribution (Limited Devices)
1. In Codemagic, use different Provisioning Profile (`Ad Hoc`)
2. Download IPA
3. Use **Apple Configurator** or **Xcode** to install on specific devices

### Option C: App Store Release
1. In **App Store Connect**, go to **General** → **App Information**
2. Fill in all required fields:
   - **Subtitle**
   - **Description**
   - **Keywords**
   - **Support URL**
   - **Privacy Policy URL**

3. Go to **Pricing and Availability**
   - Set price (Free or paid)
   - Select countries/regions

4. Go to **App Review Information**
   - **Contact Information**
   - **Demo Account** (if authentication required)
   - **Notes for Apple Review**

5. Upload **Screenshots** and **Preview** for App Store

6. Submit for Review:
   - Go to **Version Release**
   - Click **Submit for Review**
   - Wait 1-3 days for Apple review

---

## Troubleshooting

### Build Fails: "Certificate Not Found"
**Solution**: Ensure certificate and provisioning profile are uploaded and match your Team ID

### Build Fails: "Code Signing Error"
**Solution**: 
- Verify Bundle ID matches App ID in Developer Portal
- Check Team ID is correct
- Ensure provisioning profile is valid (not expired)

### Build Fails: "Pod Dependencies"
**Solution**: 
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### IPA Installation Fails on Device
**Solution**: Check device is in provisioning profile's device list

### App Crashes on Launch
**Solution**:
- Check console logs: `Window` → `Devices and Simulators` in Xcode
- Review `.dsym` crash reports
- Verify NetworkExtension entitlements are set

---

## Verification Checklist

Before submitting to App Store:
- [ ] Bundle ID matches Apple Developer Portal
- [ ] Team ID is correct
- [ ] Provisioning Profile is not expired
- [ ] Distribution Certificate is valid
- [ ] All app icons provided (1024x1024)
- [ ] Screenshots uploaded for all device sizes
- [ ] Privacy Policy URL is valid
- [ ] No proprietary code visible in compiled binary
- [ ] VPN capabilities declared in Info.plist
- [ ] NetworkExtension entitlements enabled
- [ ] no-window PowerShell script included in app bundle (if using Xray)

---

## Post-Build Verification

### Test IPA Locally with Xcode
```bash
# Connect iPhone via USB
xcode-select --install
xcrun instruments -s devices
xcodebuild -importArchive -archivePath build/ios/RichyVPN.xcarchive \
  -exportPath build/ios/export -exportOptionsPlist ios/ExportOptions.plist
```

### Verify App Functionality
1. Connect VPN
2. Test speed and latency
3. Verify kill switch works
4. Test auto-connect on app launch
5. Check connection status updates
6. Test server switching
7. Verify statistics display

---

## Next Steps

1. **Monitor App Store Metrics**: Use App Analytics in App Store Connect
2. **Handle User Reviews**: Respond to reviews and crash reports
3. **Push Updates**: Push app improvements via Codemagic on new commits
4. **Track Crashes**: Use Crash Logs in App Store Connect
5. **Gather Feedback**: Use TestFlight TestFlight feedback system

---

## Useful Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation)
- [Codemagic Documentation](https://docs.codemagic.io)
- [React Native iOS Deployment](https://reactnative.dev/docs/signed-apk-ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines)

---

## Support

For issues:
1. Check Codemagic logs in dashboard
2. Review Apple Developer notification center
3. Check App Store Connect for submission errors
4. Search GitHub Issues in your repository

---

**Last Updated**: 2024
**Version**: 1.0
