# RichyVPN React Native - iOS Native Module Implementation Guide

Этот документ описывает как реализовать реальное VPN подключение.

## Архитектура

```
┌─ React Native (JavaScript) ─┐
│                              │
│  VPNContext.tsx              │
│  ├─ connect()                │
│  ├─ disconnect()             │
│  └─ getStatus()              │
│                              │
└────────  Bridge ─────────────┘
           ↓   ↑
    ┌──────────────────┐
    │  Native Module   │
    │  (Objective-C)   │
    │                  │
    │  VPNBridge.m     │
    │  ├─ startVPN()   │
    │  ├─ stopVPN()    │
    │  └─ getStatus()  │
    └──────────────────┘
           ↓   ↑
    ┌──────────────────┐
    │ NetworkExtension │
    │ Framework (iOS)  │
    └──────────────────┘
```

## Шаг 1: Создать Native Module

### Файл: `ios/RichyVPN_RN/VPNBridge.h`

```objective-c
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface VPNBridge : RCTEventEmitter <RCTBridgeModule>
@end
```

### Файл: `ios/RichyVPN_RN/VPNBridge.m`

```objective-c
#import "VPNBridge.h"
#import <NetworkExtension/NetworkExtension.h>

@implementation VPNBridge
{
  NEVPNManager *vpnManager;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"VPNStatusChanged"];
}

RCT_EXPORT_METHOD(connectVPN:(NSDictionary *)config 
                  resolver:(RCTPromiseResolveBlock)resolve 
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  // Реализация подключения
  dispatch_async(dispatch_get_main_queue(), ^{
    NEVPNProtocolIKEv2 *protocol = [[NEVPNProtocolIKEv2 alloc] init];
    protocol.serverAddress = config[@"address"];
    protocol.username = config[@"uuid"];
    
    NEVPNConfiguration *vpnConfig = [[NEVPNConfiguration alloc] init];
    vpnConfig.protocolConfigurations = @[protocol];
    vpnConfig.isEnabled = YES;
    
    [NEVPNManager.sharedManager saveToPreferencesWithCompletionHandler:^(NSError *error) {
      if (error) {
        reject(@"VPN_ERROR", error.localizedDescription, error);
      } else {
        [NEVPNManager.sharedManager loadFromPreferencesWithCompletionHandler:^(NSError *error) {
          [NEVPNManager.sharedManager connection] startVPNTunnelAndReturnError:nil];
          resolve(@"Подключение начато");
        }];
      }
    }];
  });
}

RCT_EXPORT_METHOD(disconnectVPN:(RCTPromiseResolveBlock)resolve 
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NEVPNManager.sharedManager connection] stopVPNTunnel];
    resolve(@"Отключено");
  });
}

RCT_EXPORT_METHOD(getStatus:(RCTPromiseResolveBlock)resolve)
{
  NSString *status;
  switch (NEVPNManager.sharedManager.connection.status) {
    case NEVPNStatusConnected:
      status = @"connected";
      break;
    case NEVPNStatusConnecting:
      status = @"connecting";
      break;
    case NEVPNStatusDisconnected:
      status = @"disconnected";
      break;
    default:
      status = @"unknown";
  }
  resolve(status);
}

@end
```

## Шаг 2: Обновить VPNContext для использования Native Module

```typescript
import { NativeModules } from 'react-native';

const { VPNBridge } = NativeModules;

const connect = async (config: VPNConfig) => {
  try {
    // Используем Native Module вместо эмуляции
    const result = await VPNBridge.connectVPN({
      address: config.address,
      port: config.port,
      uuid: config.uuid,
      protocol: config.protocol,
    });
    
    setIsConnected(true);
    setConnectionStatus('Подключено');
    setCurrentConfig(config);
  } catch (error) {
    setError('Ошибка подключения: ' + error.message);
  }
};

const disconnect = async () => {
  try {
    await VPNBridge.disconnectVPN();
    setIsConnected(false);
    setConnectionStatus('Отключено');
  } catch (error) {
    setError('Ошибка отключения: ' + error.message);
  }
};
```

## Шаг 3: Настроить Xcode

1. **Откройте Xcode:**
   ```bash
   open ios/RichyVPN_RN.xcworkspace
   ```

2. **Добавьте Capability:**
   - Target: RichyVPN_RN
   - Signing & Capabilities
   - + Capability
   - Выберите "Network Extension"

3. **Логируй:**
   - Project: RichyVPN_RN
   - Target: RichyVPN_RN
   - Build Phases
   - Link Binary With Libraries
   - Нажмите +
   - Добавьте NetworkExtension.framework

## Шаг 4: Создать VPN App Extension

Для реального VPN нужна отдельная app extension:

1. **File → New → Target**
2. **App Extension → Network Extension**
3. **Назовите** `RichyVPNExtension`

## Шаг 5: Реализовать VLESS Протокол

```objective-c
// Для реальной поддержки VLESS нужна библиотека xray-core
// Используйте Go Mobile для обертки Go кода

#import <xray/Xray.h>

@interface VlessProvider : NSObject <NEPacketTunnelProvider>
@end

@implementation VlessProvider
- (void)startPacketTunnelWithOptions:(NSDictionary *)options
{
  // Инициализировать xray-core с VLESS config
  NSString *config = [self generateXrayConfig];
  Xray_Start(config);
}
@end
```

## Шаг 6: Подпишите приложение

```bash
# Создайте сертификат в Apple Developer
# Загрузите в Xcode

# Автоматическая подпись
xcodebuild \
  -workspace ios/RichyVPN_RN.xcworkspace \
  -scheme RichyVPN_RN \
  -configuration Release \
  CODE_SIGN_IDENTITY="iPhone Developer" \
  PROVISIONING_PROFILE="your-profile-id" \
  archive
```

## Ресурсы

- [NetworkExtension Framework](https://developer.apple.com/documentation/networkextension)
- [Packet Tunnel Provider](https://developer.apple.com/documentation/networkextension/nepackettunnelprovider)
- [VLESS Protocol](https://github.com/xtls/xray-core/wiki/VLESS)
- [xray-core Go Mobile](https://github.com/xtls/xray-core#go-mobile-build)

## Сложность

⚠️ **Высокая сложность:**
- Требуется знание Objective-C
- Сложная работа с NetworkExtension
- Требует Apple Developer Certificate
- Требует интеграция xray-core

## Альтернатива

Используйте готовую библиотеку:
- [Wireguard iOS](https://github.com/wireguard/wireguard-ios)
- [v2ray-core Go Mobile](https://github.com/v2fly/v2ray-core)

---

Для вопросов смотрите официальную документацию Apple.
