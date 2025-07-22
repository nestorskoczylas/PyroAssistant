import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS, SIZES } from '../constants/theme';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.settingsIcon} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.iconText}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.title}>PyroAssistant</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Editor')}
        >
          <Text style={styles.buttonText}>Éditer feuille de tir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Execution')}
        >
          <Text style={styles.buttonText}>Lancer exécution</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  settingsIcon: {
    position: 'absolute',
    top: 32,
    right: 24,
    zIndex: 10,
  },
  iconText: {
    fontSize: 28,
    color: COLORS.textLight,
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: SIZES.padding * 2,
  },
  buttonGroup: {
    gap: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: SIZES.borderRadius,
    marginVertical: 10,
  },
  buttonText: {
    color: COLORS.textLight,
    fontSize: SIZES.text,
    textAlign: 'center',
  },
});
