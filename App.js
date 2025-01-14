import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/context/ThemeContext';

import Home from './src/pages/Home';
import AddExpense from './src/pages/AddExpense';
import Reports from './src/pages/Reports';
import Settings from './src/pages/Settings';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddExpense" component={AddExpense} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
