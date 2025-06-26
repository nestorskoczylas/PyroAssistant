// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PyroAssistant 🔥</Text>
      <Button title="🎬 Lancer une séquence" onPress={() => navigation.navigate('Execution')} />
      <Button title="📝 Éditer une feuille" onPress={() => navigation.navigate('Editor')} />
      <Button title="⚙️ Paramètres" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
    padding: 24,
    backgroundColor: '#111',
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
});
