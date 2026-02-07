import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import GlassCard from '../components/GlassCard';

const SettingsScreen: React.FC = () => {
  const [autoConnect, setAutoConnect] = React.useState(false);
  const [killSwitch, setKillSwitch] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('Ошибка', 'Не удалось открыть ссылку')
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Настройки</Text>
      </View>

      {/* Security Settings */}
      <GlassCard>
        <Text style={styles.sectionTitle}>🔒 Безопасность</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Kill Switch</Text>
            <Text style={styles.settingDescription}>
              Отключить интернет при разрыве VPN
            </Text>
          </View>
          <Switch
            value={killSwitch}
            onValueChange={setKillSwitch}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={killSwitch ? '#fff' : '#888'}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Автоподключение</Text>
            <Text style={styles.settingDescription}>
              Подключаться к VPN при запуске
            </Text>
          </View>
          <Switch
            value={autoConnect}
            onValueChange={setAutoConnect}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={autoConnect ? '#fff' : '#888'}
          />
        </View>
      </GlassCard>

      {/* Display Settings */}
      <GlassCard>
        <Text style={styles.sectionTitle}>🎨 Оформление</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Темная тема</Text>
            <Text style={styles.settingDescription}>
              Использовать темную тему приложения
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#333', true: '#00d4ff' }}
            thumbColor={darkMode ? '#fff' : '#888'}
            disabled
          />
        </View>
      </GlassCard>

      {/* About and Help */}
      <GlassCard>
        <Text style={styles.sectionTitle}>ℹ️  О приложении</Text>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            handleOpenLink('https://github.com/richyvpn/richyvpn-ios')
          }
        >
          <Text style={styles.linkLabel}>Исходный код на GitHub</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => Alert.alert('О приложении', 'Richy VPN v1.0.0\n\nКроссплатформенный VPN клиент\nPC React Native Edition')}
        >
          <Text style={styles.linkLabel}>Версия приложения</Text>
          <Text style={styles.linkValue}>1.0.0</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() => {
            Alert.alert(
              'Благодарности',
              'Спасибо за использование Richy VPN!\n\n• XRAY Project\n• React Native Community\n• iOS NetworkExtension Framework'
            );
          }}
        >
          <Text style={styles.linkLabel}>Благодарности</Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      </GlassCard>

      {/* Advanced */}
      <GlassCard>
        <Text style={styles.sectionTitle}>⚙️ Продвинутые</Text>

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            Alert.alert(
              'Кэш',
              'Кэш очищен',
              [{ text: 'OK', onPress: () => {} }]
            )
          }
        >
          <Text style={styles.linkLabel}>Очистить кэш</Text>
          <Text style={styles.linkValue}>~2.5 MB</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.linkItem}
          onPress={() =>
            Alert.alert(
              'Сброс',
              'Вы уверены? Все сохраненные серверы будут удалены.',
              [
                { text: 'Отмена', onPress: () => {} },
                {
                  text: 'Сбросить',
                  onPress: () => Alert.alert('Успешно', 'Приложение сброшено'),
                  style: 'destructive',
                },
              ]
            )
          }
        >
          <Text style={[styles.linkLabel, styles.dangerText]}>
            Сбросить приложение
          </Text>
          <Text style={styles.linkArrow}>→</Text>
        </TouchableOpacity>
      </GlassCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Richy VPN © 2026 • Сделано с ❤️ для пользователей
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    marginVertical: 12,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  linkLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
  linkValue: {
    fontSize: 14,
    color: '#888',
  },
  linkArrow: {
    fontSize: 18,
    color: '#00d4ff',
  },
  dangerText: {
    color: '#ff4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default SettingsScreen;
