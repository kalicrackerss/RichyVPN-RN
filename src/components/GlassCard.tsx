import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 60, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.15)',
    backdropFilter: 'blur(10px)',
    shadowColor: '#00d4ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default GlassCard;
