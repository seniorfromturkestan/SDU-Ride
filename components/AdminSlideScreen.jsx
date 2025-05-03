import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import CustomCustomText from './CustomText';
import CustomText from './CustomText';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FlatList } from 'react-native';


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
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} >
          <TouchableOpacity className='bg-white rounded-lg' onPress={() => navigation.goBack()}>
              <Entypo name="chevron-left" size={22} color="#716DAA"/>
          </TouchableOpacity>
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
    if (!CustomText || !img) return Alert.alert('Ошибка', 'Заполните оба поля');
    await addDoc(collection(db, 'SDU-Ride slides'), { text, img });
    setText('');
    setImg('');
  };

  const removeSlide = async (id) => {
    await deleteDoc(doc(db, 'SDU-Ride slides', id));
  };

  return (
    <View className="flex-1 bg-white">
  <View className="p-4 bg-white">
    <CustomCustomText className="text-2xl text-[#716DAA] font-bold mb-4 text-center">Управление слайдами</CustomCustomText>

    <TextInput
      placeholder="Текст слайда"
      placeholderTextColor={'#808080'}
      value={text}
      onChangeText={setText}
      className="border border-[#716DAA] rounded-[12] p-3 mb-2 font-Montserrat"
    />

    <TextInput
      placeholder="URL картинки"
      placeholderTextColor={'#808080'}
      value={img}
      onChangeText={setImg}
      className="border border-[#716DAA] rounded-[12] p-3 mb-4 font-Montserrat"
    />

    <TouchableOpacity onPress={addSlide} className="bg-[#716DAA] p-3 rounded-[15] items-center">
      <CustomText className="text-white font-semibold text-lg">Добавить</CustomText>
    </TouchableOpacity>
  </View>

<FlatList
  data={slides}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ paddingBottom: 50 }}
  className="px-4"
  renderItem={({ item: slide }) => (
    <View
      className="border border-gray-200 rounded-[20] p-3 mb-3 bg-gray-50"
    >
      <CustomText className="text-md font-semibold mb-1">{slide.text}</CustomText>
      <ImageBackground
        source={{ uri: slide.img }}
        className="w-full h-[80px] rounded-[15] shadow-xl overflow-hidden my-2 justify-end"
        imageStyle={{ borderRadius: 20 }}
      />
      <TouchableOpacity
        onPress={() => removeSlide(slide.id)}
        className="bg-red-500 py-2 px-3 rounded-[10] self-end"
      >
        <CustomText className="text-white text-md">Удалить</CustomText>
      </TouchableOpacity>
    </View>
  )}
/>

</View>

  );
};

export default AdminSlidesScreen;
