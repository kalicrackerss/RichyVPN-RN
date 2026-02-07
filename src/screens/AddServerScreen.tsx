import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useVPN } from '../contexts/VPNContext';
import GlassCard from '../components/GlassCard';
import { VLESSParser } from '../utils/VLESSParser';
import { v4 as uuidv4 } from 'uuid';

const AddServerScreen: React.FC<any> = ({ navigation }) => {
  const { addConfig } = useVPN();
  const [vlessLink, setVlessLink] = useState('');
  const [serverName, setServerName] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);

  const [manualAddress, setManualAddress] = useState('');
  const [manualPort, setManualPort] = useState('443');
  const [manualUUID, setManualUUID] = useState('');
  const [manualName, setManualName] = useState('');

  const handleAddVLESS = () => {
    if (!vlessLink.trim()) {
      Alert.alert('Ошибка', 'Введите VLESS ссылку');
      return;
    }

    if (!serverName.trim()) {
      Alert.alert('Ошибка', 'Введите имя сервера');
      return;
    }

    const parsed = VLESSParser.parse(vlessLink);
    if (!parsed) {
      Alert.alert('Ошибка', 'Невалидная VLESS ссылка');
      return;
    }

    const config = {
      id: uuidv4(),
      name: serverName,
      address: parsed.address,
      port: parsed.port,
      uuid: parsed.uuid,
      vlessLink: vlessLink,
      protocol: 'VLESS',
      reality: parsed.realityParams || undefined,
      createdAt: new Date().toISOString(),
    };

    addConfig(config);
    Alert.alert('Успешно', 'Сервер добавлен', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleAddManual = () => {
    if (!manualAddress.trim() || !manualUUID.trim() || !manualName.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const port = parseInt(manualPort, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      Alert.alert('Ошибка', 'Введите корректный порт (1-65535)');
      return;
    }

    const vlessLink = VLESSParser.generateVLESSLink(
      manualUUID,
      manualAddress,
      port
    );

    const config = {
      id: uuidv4(),
      name: manualName,
      address: manualAddress,
      port: port,
      uuid: manualUUID,
      vlessLink: vlessLink,
      protocol: 'VLESS',
      createdAt: new Date().toISOString(),
    };

    addConfig(config);
    Alert.alert('Успешно', 'Сервер добавлен', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Добавить сервер</Text>
          <Text style={styles.subtitle}>
            Выберите способ добавления сервера
          </Text>
        </View>

        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={() => setUseManualInput(false)}
            style={[
              styles.toggleButton,
              !useManualInput && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                !useManualInput && styles.toggleTextActive,
              ]}
            >
              VLESS Ссылка
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUseManualInput(true)}
            style={[
              styles.toggleButton,
              useManualInput && styles.toggleButtonActive,
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                useManualInput && styles.toggleTextActive,
              ]}
            >
              Ручной ввод
            </Text>
          </TouchableOpacity>
        </View>

        {/* VLESS Link Input */}
        {!useManualInput && (
          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя сервера</Text>
              <TextInput
                style={styles.input}
                placeholder="Мой сервер"
                placeholderTextColor="#666"
                value={serverName}
                onChangeText={setServerName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>VLESS ссылка</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                placeholder="vless://uuid@address:port?..."
                placeholderTextColor="#666"
                value={vlessLink}
                onChangeText={setVlessLink}
                multiline
              />
            </View>

            <TouchableOpacity
              onPress={handleAddVLESS}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Добавить сервер</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        {/* Manual Input */}
        {useManualInput && (
          <GlassCard>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Имя сервера</Text>
              <TextInput
                style={styles.input}
                placeholder="Мой сервер"
                placeholderTextColor="#666"
                value={manualName}
                onChangeText={setManualName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Адрес сервера</Text>
              <TextInput
                style={styles.input}
                placeholder="example.com"
                placeholderTextColor="#666"
                value={manualAddress}
                onChangeText={setManualAddress}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputGroupSmall]}>
                <Text style={styles.label}>Порт</Text>
                <TextInput
                  style={styles.input}
                  placeholder="443"
                  placeholderTextColor="#666"
                  value={manualPort}
                  onChangeText={setManualPort}
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.inputGroupSmall]}>
                <Text style={styles.label}>Шифрование</Text>
                <Text style={styles.staticValue}>none</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>UUID</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                placeholder="uuid-uuid-uuid-uuid"
                placeholderTextColor="#666"
                value={manualUUID}
                onChangeText={setManualUUID}
              />
            </View>

            <TouchableOpacity
              onPress={handleAddManual}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Добавить сервер</Text>
            </TouchableOpacity>
          </GlassCard>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: 'rgba(30, 30, 60, 0.4)',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#00d4ff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroupSmall: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  largeInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  staticValue: {
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#888',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  submitButton: {
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00d4ff',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00d4ff',
  },
  spacer: {
    height: 40,
  },
});

export default AddServerScreen;
