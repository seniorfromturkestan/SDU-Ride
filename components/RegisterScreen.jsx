import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  ImageBackground,
  Animated,
  Easing,
} from 'react-native';
import CustomText from './CustomText';
import { registerUser } from '../api/user service/user.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';



const RegisterScreen = ({ gmail, onRegistered }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);

  const shift = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(shift, {
        toValue: -e.endCoordinates.height / 2.4,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const handleRegister = async () => {
    if (!name || !studentId) {
      return Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
    }

    try {
        setLoading(true);
        await registerUser(name, studentId);
        await AsyncStorage.setItem('student_id', studentId); 
        setLoading(false);
        setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Добро пожаловать!',
          text2: `Вы зарегистрированы на SDU Ride`,
          position: 'bottom',
        });        
        onRegistered();
      }, 1500);
      } catch (err) {
        setLoading(false);
        Alert.alert('Ошибка', err.message);
      }
      
  };


  return (
    <ImageBackground
      source={require('@/assets/images/sduridebg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View className="absolute bottom-0 w-full h-64 bg-white z-0 rounded-t-[20]" />

      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY: shift }],
        }}
      >
      <View className="absolute bottom-0 justify-end w-full">
        <View className="bg-white pt-6 pb-64 rounded-t-[20] px-6">
          <CustomText className="text-2xl font-bold mb-1 text-black">
          Введите имя, фамилию и ID
          </CustomText>
            <CustomText className="text-md mb-5 text-black">
            При обнаружении неверных данных доступ может быть заблокирован.
                </CustomText>

          <TextInput
            placeholder="Имя и фамилия"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            className="border border-[#716DAA] bg-white w-full font-Montserrat rounded-2xl p-4 mb-4 text-black"
          />

          <TextInput
            placeholder="ID студента"
            placeholderTextColor="#888"
            value={studentId}
            onChangeText={setStudentId}
            className="border border-[#716DAA] bg-white w-full font-Montserrat rounded-2xl p-4 mb-4 text-black"
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={handleRegister}
            className="bg-[#716DAA] w-full rounded-2xl p-3"
            disabled={loading}
          >
            <CustomText className="text-white text-xl text-center">
              {loading ? 'Отправка...' : 'Завершить регистрацию'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      </Animated.View>
    </ImageBackground>

  );
};

export default RegisterScreen;
