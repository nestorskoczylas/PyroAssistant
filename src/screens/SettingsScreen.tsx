import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';
import { Settings } from '../constants/types';
import { COLORS, SIZES } from '../constants/theme';

export default function SettingsScreen() {
  const [subtractOneSecond, setSubtractOneSecond] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.SETTINGS).then(saved => {
      if (saved) {
        const parsed: Settings = JSON.parse(saved);
        setSubtractOneSecond(parsed.subtractOneSecond);
      }
    });
  }, []);

  const toggleSwitch = async () => {
    const newValue = !subtractOneSecond;
    setSubtractOneSecond(newValue);
    const newSettings: Settings = { subtractOneSecond: newValue };
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Retirer 1 seconde à chaque ligne</Text>
          <Switch
            value={subtractOneSecond}
            onValueChange={toggleSwitch}
            trackColor={{ false: '#555', true: COLORS.primary }}
            thumbColor={subtractOneSecond ? '#fff' : '#aaa'}
          />
        </View>
        <Text style={styles.description}>
          Ajuste automatiquement les temps d’exécution pour éviter des chevauchements dus aux retards d’allumage.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
  },
  backText: {
    fontSize: 28,
    color: COLORS.textLight,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 64,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#222',
    borderRadius: SIZES.borderRadius,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#aaa',
    lineHeight: 18,
  },
  label: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    flex: 1,
    paddingRight: 10,
  },
});
