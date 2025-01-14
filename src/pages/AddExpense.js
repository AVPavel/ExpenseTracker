import React, { useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { ThemeContext } from '../context/ThemeContext';

export default function AddExpense({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const { isDarkTheme } = useContext(ThemeContext);

  const handleSave = async () => {
    if (!name || !amount || !category) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      const newExpenseAmount = parseFloat(amount);
  
      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
  
      const storedBudget = await AsyncStorage.getItem('budget');
      const budget = storedBudget ? parseFloat(storedBudget) : 0;
  
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const updatedTotal = totalExpenses + newExpenseAmount;
  
      if (budget > 0 && updatedTotal > budget) {
        Alert.alert('Budget Exceeded', `Adding this expense will exceed your budget of $${budget.toFixed(2)}.\nRemaining budget: $${(budget - totalExpenses).toFixed(2)}`);
        return;
      }
  
      const newExpense = { name, amount: newExpenseAmount.toFixed(2), category };
      expenses.push(newExpense);
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
  
      Alert.alert('Success', 'Expense added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense.');
      console.error(error);
    }
  };
  

  

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkTheme ? styles.darkText : styles.lightText]}>
        Add New Expense
      </Text>
      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Expense Name"
        placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Amount"
        placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        dropdownIconColor={isDarkTheme ? '#ffffff' : '#000000'}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Button
        title="Save Expense"
        onPress={handleSave}
        color={isDarkTheme ? '#BB86FC' : '#007BFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  lightText: {
    color: '#000000',
  },
  input: {
    borderWidth: 1,
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
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
});
