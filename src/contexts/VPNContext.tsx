import React, { createContext, useState, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VPNConfig {
  id: string;
  name: string;
  address: string;
  port: number;
  uuid: string;
  vlessLink: string;
  protocol: string;
  reality?: Record<string, any>;
  createdAt: string;
}

interface VPNContextType {
  isConnected: boolean;
  connectionStatus: string;
  currentConfig: VPNConfig | null;
  configs: VPNConfig[];
  error: string | null;
  
  addConfig: (config: VPNConfig) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  updateConfig: (id: string, config: VPNConfig) => Promise<void>;
  loadConfigs: () => Promise<void>;
  connect: (config: VPNConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
}

const VPNContext = createContext<VPNContextType | undefined>(undefined);

export const VPNProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Отключено');
  const [currentConfig, setCurrentConfig] = useState<VPNConfig | null>(null);
  const [configs, setConfigs] = useState<VPNConfig[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadConfigs = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('vpn_configs');
      if (stored) {
        setConfigs(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading configs:', err);
      setError('Ошибка загрузки конфигураций');
    }
  }, []);

  const addConfig = useCallback(async (config: VPNConfig) => {
    try {
      const newConfigs = [...configs, config];
      setConfigs(newConfigs);
      await AsyncStorage.setItem('vpn_configs', JSON.stringify(newConfigs));
    } catch (err) {
      console.error('Error adding config:', err);
      setError('Ошибка сохранения конфигурации');
    }
  }, [configs]);

  const deleteConfig = useCallback(async (id: string) => {
    try {
      const newConfigs = configs.filter(c => c.id !== id);
      setConfigs(newConfigs);
      await AsyncStorage.setItem('vpn_configs', JSON.stringify(newConfigs));
      if (currentConfig?.id === id) {
        setCurrentConfig(null);
        setIsConnected(false);
      }
    } catch (err) {
      console.error('Error deleting config:', err);
      setError('Ошибка удаления конфигурации');
    }
  }, [configs, currentConfig]);

  const updateConfig = useCallback(async (id: string, updatedConfig: VPNConfig) => {
    try {
      const newConfigs = configs.map(c => c.id === id ? updatedConfig : c);
      setConfigs(newConfigs);
      await AsyncStorage.setItem('vpn_configs', JSON.stringify(newConfigs));
      if (currentConfig?.id === id) {
        setCurrentConfig(updatedConfig);
      }
    } catch (err) {
      console.error('Error updating config:', err);
      setError('Ошибка обновления конфигурации');
    }
  }, [configs, currentConfig]);

  const connect = useCallback(async (config: VPNConfig) => {
    try {
      setConnectionStatus('Подключение...');
      setCurrentConfig(config);
      
      // Здесь должна быть реальная логика подключения к VPN
      // Для React Native нужен Native Module для iOS VPN
      
      // Эмуляция подключения
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('Подключено');
      }, 2000);
    } catch (err) {
      setError('Ошибка подключения к VPN');
      setConnectionStatus('Ошибка');
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      setConnectionStatus('Отключение...');
      
      // Здесь должна быть реальная логика отключения VPN
      
      // Эмуляция отключения
      setTimeout(() => {
        setIsConnected(false);
        setConnectionStatus('Отключено');
        setCurrentConfig(null);
      }, 1000);
    } catch (err) {
      setError('Ошибка отключения VPN');
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <VPNContext.Provider
      value={{
        isConnected,
        connectionStatus,
        currentConfig,
        configs,
        error,
        addConfig,
        deleteConfig,
        updateConfig,
        loadConfigs,
        connect,
        disconnect,
        clearError,
      }}
    >
      {children}
    </VPNContext.Provider>
  );
};

export const useVPN = () => {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error('useVPN must be used within VPNProvider');
  }
  return context;
};
