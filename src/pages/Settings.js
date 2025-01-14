import React, { useContext,useState,useEffect } from 'react';
import { View, Text, Button, StyleSheet, Switch, TextInput, Alert } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings({ navigation }) {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const [budget, setBudget] = useState('');

  useEffect(() => {
    const loadBudget = async () => {
      const storedBudget = await AsyncStorage.getItem('budget');
      if (storedBudget) {
        setBudget(storedBudget);
      }
    };
    loadBudget();
  }, []);

  const saveBudget = async () => {
    if (!budget || isNaN(budget)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for the budget.');
      return;
    }
    await AsyncStorage.setItem('budget', budget);
    Alert.alert('Success', 'Budget set successfully!');
  };

  const resetData = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Success', 'All data has been reset!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset data.');
    }
  };

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkTheme ? styles.darkText : styles.lightText]}>
        Settings
      </Text>

      <View style={styles.switchContainer}>
        <Text style={isDarkTheme ? styles.darkText : styles.lightText}>Dark Theme</Text>
        <Switch value={isDarkTheme} onValueChange={toggleTheme} />
      </View>

      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Set Monthly Budget"
        keyboardType="numeric"
        placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
        value={budget}
        onChangeText={setBudget}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.buttonSpacing}>
          <Button
            title="Save Budget"
            onPress={saveBudget}
            color={isDarkTheme ? '#BB86FC' : '#007BFF'}
          />
        </View>
        
        <View style={styles.buttonSpacing}>
          <Button
            title="Reset All Data"
            onPress={resetData}
            color={isDarkTheme ? '#BB86FC' : 'red'}
          />
        </View>
      </View>



      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  lightContainer: {
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  darkText: {
    color: '#ffffff',
    fontSize:16,
  },
  lightText: {
    color: '#000000',
    fontSize:16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  darkInput: {
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
    color: '#ffffff',
  },
  lightInput: {
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#000000',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 10,
  },
  buttonSpacing: {
    marginBottom: 10,
  }  
});
