import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext'; 
import { useIsFocused } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const { isDarkTheme } = useContext(ThemeContext);
  const isFocused = useIsFocused();
  const [budget, setBudget] = useState(0);

  const fetchBudget = async () => {
    try {
      const storedBudget = await AsyncStorage.getItem('budget');
      if (storedBudget) {
        setBudget(parseFloat(storedBudget));
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    }
  };
  
  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
      fetchBudget();
    }
  }, [isFocused]);
  
  const fetchExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setRecentExpenses(parsedExpenses.slice(-5))
        const totalAmount = parsedExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
        setTotal(totalAmount);
      }
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
    }
  }, [isFocused]);

  const renderExpense = ({ item }) => (
    <View style={[styles.expenseItem, isDarkTheme ? styles.darkExpenseItem : styles.lightExpenseItem]}>
      <Text style={[styles.expenseName, isDarkTheme ? styles.darkText : styles.lightText]}>{item.name}</Text>
      <Text style={[styles.expenseAmount, isDarkTheme ? styles.darkText : styles.lightText]}>${item.amount}</Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkTheme ? styles.darkContainer : styles.lightContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkTheme ? styles.darkText : styles.lightText]}>
          Welcome to Expense Tracker
        </Text>
        <Icon
          name="settings-outline"
          size={30}
          color={isDarkTheme ? '#BB86FC' : '#007BFF'}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>
      <Text style={[styles.total, isDarkTheme ? styles.darkText : styles.lightText]}>
        Total Expenses: ${total.toFixed(2)}
      </Text>
      <Text style={[styles.total, isDarkTheme ? styles.darkText : styles.lightText]}>
        Budget: ${budget.toFixed(2)} | Remaining: ${(budget - total).toFixed(2)}
      </Text>


      <Text style={[styles.subtitle, isDarkTheme ? styles.darkText : styles.lightText]}>Recent Expenses</Text>
      {recentExpenses.length > 0 ? (
        <FlatList
          data={recentExpenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderExpense}
        />
      ) : (
        <Text style={[styles.noData, isDarkTheme ? styles.darkText : styles.lightText]}>No recent expenses.</Text>
      )}

      <TouchableOpacity
        style={[styles.button, isDarkTheme ? styles.darkButton : styles.lightButton]}
        onPress={() => navigation.navigate('AddExpense')}
      >
        <Text style={[styles.buttonText, isDarkTheme ? styles.darkButtonText : styles.lightButtonText]}>
          ADD EXPENSE
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isDarkTheme ? styles.darkButton : styles.lightButton]}
        onPress={() => navigation.navigate('Reports')}
      >
        <Text style={[styles.buttonText, isDarkTheme ? styles.darkButtonText : styles.lightButtonText]}>
          VIEW REPORTS
        </Text>
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    elevation: 2,
  },
  darkExpenseItem: {
    backgroundColor: '#1E1E1E',
  },
  lightExpenseItem: {
    backgroundColor: '#fff',
  },
  expenseName: {
    fontSize: 16,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#ffffff',
  },
  lightText: {
    color: '#000000',
  },
  noData: {
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: '#BB86FC',
  },
  lightButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#121212',
  },
  lightButtonText: {
    color: '#fff',
  },
});
