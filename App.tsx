// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';
import ExecutionScreen from './src/screens/ExecutionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="Execution" component={ExecutionScreen} options={{ title: 'Exécution' }} />
        <Stack.Screen name="Editor" component={EditorScreen} options={{ title: 'Éditeur' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
