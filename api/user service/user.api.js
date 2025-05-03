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


export const updateProfile = async (student_id, name, avatarUri) => {
  const formData = new FormData();
  
  formData.append('name', name);
  formData.append('student_id', student_id);
  

    formData.append('avatar', {
      uri: avatarUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    });
  

  try {
    const res = await fetch(`${API_URL}/update-profile`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    });

    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || 'Не удалось обновить профиль');
    }

    return result;
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
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

    // return parsed.name; 
  
    const avatarPart = raw.split(`--${boundary}`).filter(p => p.includes('image/jpeg'))[0];
    if (!avatarPart) throw new Error('Аватар не найден');
  
    const base64Avatar = await extractBase64FromBinary(avatarPart);
  
    return {
      name: parsed.name,
      avatar: base64Avatar, 
    };
  };
  
  const extractBase64FromBinary = async (binaryPart) => {
    const binaryData = binaryPart.split('\n').slice(2).join(''); 
    const binaryBuffer = Uint8Array.from(binaryData.split(' ').map(Number));
  
    const base64String = await convertToBase64(binaryBuffer);
    return base64String;
  };
  
  const convertToBase64 = (binaryBuffer) => {
    return new Promise((resolve) => {
      const binaryString = String.fromCharCode.apply(null, binaryBuffer);
      const base64String = btoa(binaryString); 
      resolve(base64String);
    });

  


};


