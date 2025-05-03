import Constants from 'expo-constants';

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