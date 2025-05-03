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
import { sendCode } from '../api/user service/user.api';
import CustomText from '@/components/CustomText';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const EmailScreen = ({ onSuccess }) => {
  const [gmail, setGmail] = useState('');
  const [loading, setLoading] = useState(false);

  const shift = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(shift, {
        toValue: -e.endCoordinates.height / 2.3,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handleSend = async () => {
    if (!gmail) {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: 'Введите Gmail',
          position: 'bottom',
        });
      }, 50);
      return;
    }

    try {
      setLoading(true);
      await sendCode(gmail);
      setLoading(false);
      onSuccess(gmail);
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Alert.alert("Ошибка", err.message);
      }, 50);
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
        <View className="flex-1 w-full justify-end">
          <View className="bg-white px-6 pt-6 pb-64 rounded-t-[20] z-10">
            <CustomText className="text-start font-bold text-black text-2xl mb-3">
              Введите SDU-шную почту
            </CustomText>
            <CustomText className="text-start text-black text-md mb-6">
              Вам придет SMS с кодом подтверждения
            </CustomText>

            <TextInput
              className="border border-[#716DAA] bg-white w-full rounded-2xl font-Montserrat p-4 text-black"
              placeholder="example@sdu.edu.kz"
              placeholderTextColor="#888"
              value={gmail}
              onChangeText={setGmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

          <TouchableOpacity
            className="bg-[#716DAA] p-3 rounded-[15] mt-4 h-[50px] items-center justify-center flex-row"
            onPress={handleSend}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <CustomText className="text-white text-xl text-center">
                {loading ? 'Отправка' : 'Отправить код'}
              </CustomText>

              {loading && (
                  <LottieView
                    source={require('@/assets/animations/animation3.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80, marginLeft: -20, paddingBottom: 8 }}
                  />
              )}
            </View>
          </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default EmailScreen;
