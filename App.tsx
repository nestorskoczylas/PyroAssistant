// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import EditorScreen from './screens/EditorScreen';
import ExecutionScreen from './screens/ExecutionScreen';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="Execution" component={ExecutionScreen} options={{ title: 'Exécution' }} />
        <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Éditeur' }} />
        <Stack.Screen name="Settings" component={PlaceholderScreen('Settings')} options={{ title: 'Paramètres' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function PlaceholderScreen(label: string) {
  return () => (
    <View style={styles.container}>
      <Text>{label} Screen (en construction)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});