import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig.extra;

export const sendCode = async (gmail) => {
  const response = await fetch(`${API_URL}/send-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gmail }),
  });

  if (!response.ok) throw new Error("Failed to send code");
  return await response.json();
};

export const checkCode = async (gmail, code) => {
  const response = await fetch(`${API_URL}/check-code/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gmail, code }),
  });

  if (!response.ok) throw new Error("Invalid code");
  return await response.json();
};

export const registerUser = async (name, student_id) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, student_id }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка при регистрации');
  }

  return data;
};

export const fetchProfileName = async (student_id) => {
  const res = await fetch(`${API_URL}/get-profile/${student_id}`);

  if (!res.ok) throw new Error('Не удалось получить профиль');

  const contentType = res.headers.get('Content-Type');
  const boundaryMatch = contentType.match(/boundary=(.+)$/);
  if (!boundaryMatch) throw new Error('Boundary не найден');

  const boundary = boundaryMatch[1];
  const raw = await res.text();

  const parts = raw.split(`--${boundary}`).filter(p => p.includes('application/json'));
  if (parts.length === 0) throw new Error('JSON часть не найдена');

  const jsonPart = parts[0];
  const jsonStart = jsonPart.indexOf('{');
  const jsonEnd = jsonPart.lastIndexOf('}');
  const jsonString = jsonPart.substring(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(jsonString);

  return parsed.name; 
};
