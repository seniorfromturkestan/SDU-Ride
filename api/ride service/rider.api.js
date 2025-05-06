import Constants from 'expo-constants';


const { API_URL4 } = Constants.expoConfig.extra;

export const getRides = async (direction) => {
    const res = await fetch(`${API_URL4}/user/orders/${direction}`);
    if (!res.ok) throw new Error('Ошибка загрузки поездок');
    return await res.json();
  };
  
export const createRide = async (payload) => {
    const res = await fetch(`${API_URL4}/user/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Ошибка создания поездки');
    return await res.json();
  };
  
export const becomeDriver = async (studentId) => {
    const res = await fetch(`${API_URL4}/driver/${studentId}`);
    if (!res.ok) throw new Error('Ошибка назначения роли водителя');
    return await res.json();
};