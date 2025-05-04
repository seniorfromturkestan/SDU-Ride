import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const { API_URL2 } = Constants.expoConfig.extra;


export const getBalance = async (studentId) => {
  try {
    const response = await fetch(`${API_URL2}/get-balance/${studentId}`);
    if (!response.ok) throw new Error('Ошибка сети');
    return await response.json();
  } catch (error) {
    console.error('Ошибка при запросе баланса:', error);
    return { balance: 0 }; 
  }
};


export const getTopUpHistory = async () => {
  try {
    const student_id = await AsyncStorage.getItem('student_id');
    if (!student_id) throw new Error('Студент ID не найден');

    const response = await fetch(`${API_URL2}/get-history/${student_id}`);
    const data = await response.json(); 
    
    if (!Array.isArray(data)) {
      console.warn('Ожидался массив, но получено:', data);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Ошибка при получении истории пополнений:', error);
    return []; 
  }
};



export const changeBalance = async (changeAmount) => {
  try {
    const studentId = await AsyncStorage.getItem('student_id');
    if (!studentId) throw new Error('Student ID not found');

    const response = await fetch(`${API_URL2}/change-balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        student_id: studentId,
        change: Number(changeAmount)
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при изменении баланса:', error);
    throw error;
  }
};



export const makePayment = async (amount, busNumber) => {
  try {
    const studentId = await AsyncStorage.getItem('student_id');
    
    if (!studentId) {
      throw new Error('Student ID not found in storage');
    }

    const response = await fetch(`${API_URL2}/change-balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        change: parseInt(amount),
        bus_number: busNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Payment failed');
    }

    return await response.json();
  } catch (error) {
    
    throw error;
  }
};



export const getActiveTickets = async () => {
  try {
    const studentId = await AsyncStorage.getItem('student_id');
    
    if (!studentId) {
      throw new Error('Student ID not found in storage');
    }

    const response = await axios.get(
      `${API_URL2}/get-active-tickets/${studentId}`
    );

    if (response.data && response.data.length > 0) {
      return response.data.map(ticket => ({
        student_id: ticket.student_id,
        time: ticket.change_date.split('T')[1].split('.')[0], 
        method: ticket.method,
        bus_num: ticket.bus_num
      }));
    }
    
    return []; 
    
  } catch (error) {
    console.error('Error fetching active tickets:', error);
    throw error;
  }
};