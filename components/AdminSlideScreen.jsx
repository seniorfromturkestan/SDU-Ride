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
import CustomCustomText from './CustomText';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AdminSlidesScreen = () => {
   const navigation = useNavigation();
   const [text, setText] = useState('');
   const [img, setImg] = useState('');
   const [slides, setSlides] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: {
        backgroundColor: '#716DAA',
      },
      headerTintColor: '#fff',
      headerTitle: 'Админ-панель для staff',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation]);
 

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
    if (!CustomText || !img) return Alert.alert('Ошибка', 'Заполни оба поля');
    await addDoc(collection(db, 'SDU-Ride slides'), { text, img });
    setText('');
    setImg('');
  };

  const removeSlide = async (id) => {
    await deleteDoc(doc(db, 'SDU-Ride slides', id));
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <CustomCustomText className="text-2xl font-bold mb-4">Управление слайдами</CustomCustomText>

      <TextInput
        placeholder="Текст слайда"
        value={text}
        onChangeText={setText}
        className="border border-[#716DAA] rounded-[10] p-3 mb-2"
      />

      <TextInput
        placeholder="URL картинки"
        value={img}
        onChangeText={setImg}
        className="border border-[#716DAA] rounded-[10] p-3 mb-4"
      />

      <TouchableOpacity onPress={addSlide} className="bg-[#716DAA] p-4 rounded-[10] mb-6 items-center">
        <CustomText className="text-white font-semibold">Добавить</CustomText>
      </TouchableOpacity>

      {slides.map((slide) => (
        <View
          key={slide.id}
          className="border border-gray-200 rounded-[10] p-3 mb-3 bg-gray-50"
        >
          <CustomText className="text-sm font-semibold mb-1">{slide.text}</CustomText>
          <CustomText className="text-xs text-gray-500 mb-2">{slide.img}</CustomText>
          <TouchableOpacity
            onPress={() => removeSlide(slide.id)}
            className="bg-red-500 py-1 px-3 rounded-[10] self-start"
          >
            <CustomText className="text-white text-sm">Удалить</CustomText>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default AdminSlidesScreen;
