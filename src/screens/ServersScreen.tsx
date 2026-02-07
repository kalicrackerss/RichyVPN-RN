import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useVPN } from '../contexts/VPNContext';
import GlassCard from '../components/GlassCard';
import type { RootStackParamList } from '../types/navigation';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ServersScreenProps = NativeStackScreenProps<RootStackParamList, 'ServersList'>;

const ServersScreen: React.FC<ServersScreenProps> = ({ navigation }) => {
  const { configs, loadConfigs, deleteConfig, connect, currentConfig } = useVPN();

  useEffect(() => {
    loadConfigs();
  }, []);

  const handleAddServer = () => {
    navigation.navigate('AddServer');
  };

  const handleDeleteServer = (id: string) => {
    Alert.alert(
      'Удалить сервер?',
      'Это действие нельзя отменить',
      [
        { text: 'Отмена', onPress: () => {} },
        {
          text: 'Удалить',
          onPress: () => deleteConfig(id),
          style: 'destructive',
        },
      ]
    );
  };

  const handleSelectServer = (id: string) => {
    const config = configs.find(c => c.id === id);
    if (config) {
      Alert.alert(
        'Подключиться?',
        `Подключиться к серверу: ${config.name}`,
        [
          { text: 'Отмена', onPress: () => {} },
          {
            text: 'Подключиться',
            onPress: () => connect(config),
          },
        ]
      );
    }
  };

  const renderServerItem = ({ item }) => {
    const isSelected = currentConfig?.id === item.id;

    return (
      <GlassCard
        style={[
          styles.serverCard,
          isSelected && styles.selectedCard,
        ]}
      >
        <TouchableOpacity
          onPress={() => handleSelectServer(item.id)}
          style={styles.serverContent}
        >
          <View style={styles.serverInfo}>
            <Text style={styles.serverName}>{item.name}</Text>
            <Text style={styles.serverAddress}>
              {item.address}:{item.port}
            </Text>
            <View style={styles.serverMeta}>
              <Text style={styles.serverProtocol}>{item.protocol}</Text>
              {item.reality && (
                <Text style={styles.serverBadge}>Reality</Text>
              )}
            </View>
          </View>
          <View style={styles.serverActions}>
            {isSelected && (
              <Text style={styles.selectedBadge}>✓ Активен</Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteServer(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Удалить</Text>
        </TouchableOpacity>
      </GlassCard>
    );
  };

  return (
    <View style={styles.container}>
      {configs.length === 0 ? (
        <View style={styles.emptyState}>
          <GlassCard>
            <View style={styles.emptyContent}>
              <Text style={styles.emptyTitle}>Нет серверов</Text>
              <Text style={styles.emptyText}>
                Добавьте сервер VLESS, чтобы начать
              </Text>
              <TouchableOpacity
                onPress={handleAddServer}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Добавить сервер</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      ) : (
        <>
          <FlatList
            data={configs}
            renderItem={renderServerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          />
          <TouchableOpacity
            onPress={handleAddServer}
            style={styles.floatingAddButton}
          >
            <Text style={styles.floatingAddText}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  serverCard: {
    marginHorizontal: 12,
    marginVertical: 8,
  },
  selectedCard: {
    borderColor: 'rgba(0, 212, 255, 0.5)',
  },
  serverContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  serverAddress: {
    fontSize: 13,
    color: '#00d4ff',
    marginBottom: 8,
  },
  serverMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  serverProtocol: {
    fontSize: 12,
    color: '#888',
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serverBadge: {
    fontSize: 12,
    color: '#00ffaa',
    backgroundColor: 'rgba(0, 255, 170, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serverActions: {
    alignItems: 'flex-end',
  },
  selectedBadge: {
    fontSize: 12,
    color: '#00d4ff',
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyContent: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00d4ff',
  },
  addButtonText: {
    fontSize: 14,
    color: '#00d4ff',
    fontWeight: '600',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00d4ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingAddText: {
    fontSize: 30,
    color: '#0a0a1a',
    fontWeight: '600',
  },
});

export default ServersScreen;
