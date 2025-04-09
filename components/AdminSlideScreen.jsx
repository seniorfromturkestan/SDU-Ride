import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';

const AdminSlidesScreen = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState('');
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SDU-Ride slides'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(fetched);
    });

    return () => unsubscribe();
  }, []);

  const addSlide = async () => {
    if (!text || !img) return Alert.alert('Ошибка', 'Заполни оба поля');

    await addDoc(collection(db, 'SDU-Ride slides'), { text, img });
    setText('');
    setImg('');
  };

  const removeSlide = async (id) => {
    await deleteDoc(doc(db, 'SDU-Ride slides', id));
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">🛠️ Управление слайдами</Text>

      <TextInput
        placeholder="Текст слайда"
        value={text}
        onChangeText={setText}
        className="border border-gray-300 rounded-lg p-2 mb-2"
      />

      <TextInput
        placeholder="URL картинки"
        value={img}
        onChangeText={setImg}
        className="border border-gray-300 rounded-lg p-2 mb-4"
      />

      <TouchableOpacity onPress={addSlide} className="bg-[#716DAA] p-3 rounded-xl mb-6 items-center">
        <Text className="text-white font-semibold">Добавить</Text>
      </TouchableOpacity>

      {slides.map((slide) => (
        <View
          key={slide.id}
          className="border border-gray-200 rounded-xl p-3 mb-3 bg-gray-50"
        >
          <Text className="text-sm font-semibold mb-1">{slide.text}</Text>
          <Text className="text-xs text-gray-500 mb-2">{slide.img}</Text>
          <TouchableOpacity
            onPress={() => removeSlide(slide.id)}
            className="bg-red-500 py-1 px-3 rounded-lg self-start"
          >
            <Text className="text-white text-sm">Удалить</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminSlidesScreen;
