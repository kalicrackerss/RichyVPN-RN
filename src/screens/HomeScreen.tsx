import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useVPN } from '../contexts/VPNContext';
import GlassCard from '../components/GlassCard';

const HomeScreen: React.FC = () => {
  const { isConnected, connectionStatus, currentConfig, connect, disconnect } = useVPN();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const [connectionTime, setConnectionTime] = useState('00:00:00');

  // Таймер подключения
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let seconds = 0;

    if (isConnected) {
      interval = setInterval(() => {
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        setConnectionTime(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      }, 1000);
    } else {
      setConnectionTime('00:00:00');
    }

    return () => clearInterval(interval);
  }, [isConnected]);

  // Анимация пульса
  useEffect(() => {
    if (isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, scaleAnim]);

  const getStatusColor = () => {
    if (isConnected) return '#00d4ff';
    if (connectionStatus.includes('Подключение')) return '#ffaa00';
    return '#ff4444';
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      disconnect();
    } else if (currentConfig) {
      connect(currentConfig);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Richy VPN</Text>
        <View style={[styles.statusBadge, { borderColor: getStatusColor() }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {connectionStatus}
          </Text>
        </View>
      </View>

      {/* Главная карточка подключения */}
      <GlassCard style={styles.mainCard}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Время подключения</Text>
          <Text style={styles.timeValue}>{connectionTime}</Text>
        </View>

        <Animated.View
          style={[
            styles.connectionButton,
            {
              backgroundColor: isConnected ? '#00d4ff' : '#1a1a3a',
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={handleToggleConnection}
            disabled={!currentConfig && !isConnected}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isConnected ? '#0a0a1a' : '#00d4ff',
                },
              ]}
            >
              {isConnected ? '⊙' : '◯'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.connectionStatus}>
          {isConnected ? 'Подключено' : 'Отключено'}
        </Text>
      </GlassCard>

      {/* Текущий сервер */}
      {currentConfig && (
        <GlassCard>
          <View style={styles.configSection}>
            <Text style={styles.sectionTitle}>Текущий сервер</Text>
            <Text style={styles.configName}>{currentConfig.name}</Text>
            <View style={styles.configDetailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Адрес</Text>
                <Text style={styles.detailValue}>{currentConfig.address}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Порт</Text>
                <Text style={styles.detailValue}>{currentConfig.port}</Text>
              </View>
            </View>
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{currentConfig.protocol}</Text>
              </View>
              {currentConfig.reality && (
                <View style={[styles.tag, styles.tagReality]}>
                  <Text style={styles.tagText}>Reality</Text>
                </View>
              )}
            </View>
          </View>
        </GlassCard>
      )}

      {!currentConfig && (
        <GlassCard>
          <View style={styles.noConfigMessage}>
            <Text style={styles.noConfigEmoji}>🚀</Text>
            <Text style={styles.noConfigTitle}>Нет выбранного сервера</Text>
            <Text style={styles.noConfigText}>
              Перейдите в раздел Серверы и выберите конфигурацию
            </Text>
          </View>
        </GlassCard>
      )}

      {/* Статистика */}
      {isConnected && (
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Статус</Text>
            <Text style={[styles.statValue, { color: '#00d4ff' }]}>
              ✓ Активен
            </Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>Порт</Text>
            <Text style={styles.statValue}>
              {currentConfig?.port}
            </Text>
          </GlassCard>
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  statusBadge: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 212, 255, 0.05)',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  mainCard: {
    marginHorizontal: 12,
    marginVertical: 12,
    marginBottom: 24,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: '300',
    color: '#fff',
    fontFamily: 'Courier New',
    letterSpacing: 2,
  },
  connectionButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 15,
  },
  buttonContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 70,
  },
  connectionStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  configSection: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  configName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  configDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  tagReality: {
    backgroundColor: 'rgba(0, 255, 170, 0.15)',
    borderColor: 'rgba(0, 255, 170, 0.3)',
  },
  tagText: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
  },
  noConfigMessage: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noConfigEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  noConfigTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  noConfigText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 12,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  spacer: {
    height: 40,
  },
});

export default HomeScreen;
