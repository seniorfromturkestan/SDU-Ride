import Constants from 'expo-constants';
import axios from 'axios';


const { API_URL3 } = Constants.expoConfig.extra;

export const fetchSchedule = async () => {
    try {
      const response = await fetch(`${API_URL3}/get-schedule`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      return [];
    }
  };

export const getBusSchedule = async () => {
  try {
    const response = await axios.get(`${API_URL3}/get-schedule`);  
    return response.data; 
  } catch (error) {
    console.error('Error fetching bus schedule:', error);
    throw error;  
  }
};


export const getRouteStops = async () => {
  try {
    const response = await fetch(`${API_URL3}/get-stops`);
    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при получении остановок:', error);
    return [];
  }
};


