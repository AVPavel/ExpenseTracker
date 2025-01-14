import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../context/ThemeContext';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [total, setTotal] = useState(0);
  const { isDarkTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem('expenses');
        if (storedExpenses) {
          const parsedExpenses = JSON.parse(storedExpenses);
          setExpenses(parsedExpenses);
          setFilteredExpenses(parsedExpenses);
          calculateTotal(parsedExpenses);
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load expenses.');
        console.error(error);
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [searchTerm, categoryFilter]);

  const calculateTotal = (expensesList) => {
    const totalAmount = expensesList.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    setTotal(totalAmount);
  };

  const filterExpenses = () => {
    let tempExpenses = expenses;

    if (searchTerm) {
      tempExpenses = tempExpenses.filter((expense) =>
        expense.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      tempExpenses = tempExpenses.filter((expense) => expense.category === categoryFilter);
    }

    setFilteredExpenses(tempExpenses);
    calculateTotal(tempExpenses);
  };

  const deleteExpense = async (index) => {
    try {
      const updatedExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(updatedExpenses);
      setFilteredExpenses(updatedExpenses);
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      calculateTotal(updatedExpenses);
      Alert.alert('Success', 'Expense deleted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete expense.');
      console.error(error);
    }
  };

  const renderExpense = ({ item, index }) => (
    <View style={[styles.expenseItem, isDarkTheme ? styles.darkExpenseItem : styles.lightExpenseItem]}>
      <View>
        <Text style={[styles.expenseName, isDarkTheme ? styles.darkText : styles.lightText]}>{item.name}</Text>
        <Text style={[styles.expenseDetails, isDarkTheme ? styles.darkText : styles.lightText]}>
          {item.category} - ${item.amount}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteExpense(index)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkTheme ? styles.darkText : styles.lightText]}>Expense Reports</Text>
      <Text style={[styles.total, isDarkTheme ? styles.darkText : styles.lightText]}>Total: ${total.toFixed(2)}</Text>

      <TextInput
        style={[styles.input, isDarkTheme ? styles.darkInput : styles.lightInput]}
        placeholder="Search by name"
        placeholderTextColor={isDarkTheme ? '#888' : '#aaa'}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Picker
        selectedValue={categoryFilter}
        style={[styles.picker, isDarkTheme ? styles.darkPicker : styles.lightPicker]}
        onValueChange={(itemValue) => setCategoryFilter(itemValue)}
      >
        <Picker.Item label="All Categories" value="" />
        <Picker.Item label="Food" value="Food" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      {filteredExpenses.length > 0 ? (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderExpense}
        />
      ) : (
        <Text style={[styles.noData, isDarkTheme ? styles.darkText : styles.lightText]}>No expenses found.</Text>
      )}
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
  total: {
    fontSize: 20,
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
    marginBottom: 20,
  },
  darkPicker: {
    color: '#ffffff',
    backgroundColor: '#1E1E1E',
  },
  lightPicker: {
    color: '#000000',
    backgroundColor: '#fff',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  darkExpenseItem: {
    borderColor: '#333',
  },
  lightExpenseItem: {
    borderColor: '#ccc',
  },
  expenseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseDetails: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noData: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
