# 🎯 Как собрать IPA файл из React Native приложения

Поскольку вы работаете на Windows, собрать IPA файл напрямую невозможно (нужен Mac). Вот 3 способа:

## ✅ Способ 1: Codemagic (Рекомендуется) - САМЫЙ ПРОСТОЙ

Codemagic автоматически собирает iOS приложения на облачном Mac.

### Шаги:

1. **Зарегистрируйте репозиторий на GitHub:**
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/RichyVPN_RN.git
   git push -u origin main
   ```

2. **Создайте аккаунт на Codemagic:**
   - Перейдите на https://codemagic.io/
   - Авторизуйтесь через GitHub
   - Подключите ваш репозиторий

3. **Настройте сборку:**
   - Создайте `codemagic.yaml` в корне проекта (см. ниже)
   - Запустите сборку в Codemagic

### Пример `codemagic.yaml`:

```yaml
workflows:
  default-workflow:
    name: React Native iOS Build
    instance_type: mac_mini_m2
    environment:
      node: 18
      xcode: latest
      cocoapods: default
    triggers:
      - push
    scripts:
      - name: Install dependencies
        script: npm install
      - name: Install pods
        script: cd ios && pod install && cd ..
      - name: Build
        script: |
          cd ios
          xcodebuild -workspace RichyVPN_RN.xcworkspace \
            -scheme RichyVPN_RN \
            -configuration Release \
            -derivedDataPath build \
            -archivePath build/RichyVPN_RN.xcarchive \
            archive
    artifacts:
      - build/RichyVPN_RN.xcarchive
```

---

## ✅ Способ 2: Expo + EAS Build

Expo предоставляет облачный сервис для сборки iOS приложений.

### Шаги:

1. **Установите Expo CLI:**
   ```bash
   npm install -g expo-cli
   ```

2. **Инициализируйте Expo проект:**
   ```bash
   expo init RichyVPN_RN --template
   ```

3. **Создайте аккаунт и авторизуйтесь:**
   ```bash
   expo login
   ```

4. **Соберите для iOS:**
   ```bash
   eas build --platform ios
   ```

5. **Скачайте IPA файл из Expo:**
   - Перейдите в Expo Dashboard
   - Найдите вашу сборку
   - Скачайте готовый IPA файл

---

## ✅ Способ 3: GitHub Actions + Fastlane

Используйте GitHub Actions для автоматической сборки на macOS.

### Создайте `.github/workflows/build-ios.yml`:

```yaml
name: Build iOS IPA

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install Pods
        run: cd ios && pod install && cd ..
      
      - name: Build Archive
        run: |
          cd ios
          xcodebuild -workspace RichyVPN_RN.xcworkspace \
            -scheme RichyVPN_RN \
            -configuration Release \
            -archivePath ${{ github.workspace }}/RichyVPN_RN.xcarchive \
            archive
      
      - name: Export IPA
        run: |
          xcodebuild -exportArchive \
            -archivePath ${{ github.workspace }}/RichyVPN_RN.xcarchive \
            -exportOptionsPlist ${{ github.workspace }}/ios/ExportOptions.plist \
            -exportPath ${{ github.workspace }}/ipa
      
      - name: Upload IPA artifact
        uses: actions/upload-artifact@v3
        with:
          name: RichyVPN_RN.ipa
          path: ipa/RichyVPN_RN.ipa
```

---

## 📋 Что нужно для реальной сборки:

1. **Apple Developer Account** - $99/год
2. **Сертификаты и provision profil** - генерируются в Apple Developer
3. **App ID** - уникальный идентификатор приложения
4. **Підпис** - для App Store или Ad Hoc распространения

---

## 🚀 Быстрый старт - Используйте Codemagic

**Рекомендуемый способ для Windows пользователей:**

1. Загрузьте код на GitHub
2. Зарегистрируйтесь на codemagic.io
3. Подключите репозиторий
4. Скачайте готовый IPA файл

Это займет ~10-15 минут!

---

## 🔗 Полезные ссылки:

- [Codemagic Docs](https://docs.codemagic.io/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [GitHub Actions for iOS](https://github.blog/2021-03-10-github-actions-for-ios-developers/)
- [Apple App Store Connect](https://appstoreconnect.apple.com/)
