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
import { checkCode, sendCode } from '../api/user service/user.api';
import CustomText from './CustomText';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';

const CodeScreen = ({ gmail, onVerified }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(shift, {
        toValue: -e.endCoordinates.height / 3.2,
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

  const handleCheck = async () => {
    try {
      setLoading(true);
      await checkCode(gmail, code);
      setLoading(false);
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: 'Успех',
          text2: `Код подтвержден`,
          position: 'bottom',
        });
        onVerified();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: err.message,
          position: 'bottom',
        });
      }, 50);
    }
  };

  const handleSend = async () => {
    try {
      setLoadingSend(true);
      await sendCode(gmail);
      setLoadingSend(false);
    } catch (err) {
      setLoadingSend(false);
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2: err.message,
          position: 'bottom',
        });
       
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
            <CustomText className="text-2xl font-bold mb-4 text-black">Введите код из SMS</CustomText>
            <CustomText className="text-md mb-4 text-black">
              На вашу почту <CustomText className='font-bold'>{gmail}</CustomText>  был отправлен код подтверждения.
            </CustomText>

            <TextInput
              className="border border-[#716DAA] bg-white w-full rounded-2xl font-Montserrat p-4 text-black"
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />

        <TouchableOpacity
            className="bg-[#716DAA] p-3 rounded-[15] mt-4 h-[50px] items-center justify-center flex-row"
            onPress={handleCheck}
            disabled={loading}
          >
            <View className="flex-row items-center">
              <CustomText className="text-white text-xl text-center">
                {loading ? 'Отправка' : 'Отправить код'}
              </CustomText>

              {loading && (
                <View style={{height: 90}}>
                  <LottieView
                    source={require('@/assets/animations/animation3.json')}
                    autoPlay
                    loop
                    style={{ width: 80, height: 80, marginLeft: -20 }}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSend}
              className=" w-full rounded-2xl p-3 mt-4"
              disabled={loadingSend}
            >
              <CustomText className="text-gray-500 text-lg text-center">
                {loadingSend ? 'Отправка...' : 'Запросить код повторно'}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </ImageBackground>
  );
};

export default CodeScreen;
