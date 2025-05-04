import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { makePayment } from '../api/wallet service/wallet.api';
import Toast from 'react-native-toast-message';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import CustomText from '@/components/CustomText';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import busRoutes from '../busRoutes.json';

const PaymentScreen = () => {
  const [busNumber, setBusNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const navigation = useNavigation();


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Оплата проезда', 
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <TouchableOpacity className='bg-white rounded-lg' onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={22} color="#716DAA" />
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleBusNumberChange = (text) => {
    const cleanedInput = text.replace(/\s/g, '').toUpperCase();
    setBusNumber(text);
    
    const foundRoute = busRoutes.find(route => 
      route.gosnomer.replace(/\s/g, '') === cleanedInput
    );
    
    setSelectedRoute(foundRoute || null);
    
    if (foundRoute) {
      setAmount(foundRoute.price.toString());
    }
  };

  const handlePayment = async () => {
    if (!selectedRoute) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Пожалуйста, выберите действительный маршрут',
        position: 'bottom',
      });
      return;
    }

    setIsLoading(true);

    try {
      await makePayment(amount, selectedRoute.gosnomer);
      Toast.show({
        type: 'success',
        text1: 'Оплата успешна',
        text2: `Спасибо за оплату ${amount}₸!`,
        position: 'bottom',
      });
      setBusNumber('');
      setSelectedRoute(null);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка оплаты',
        text2: 'Пожалуйста, попробуйте позже',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5 bg-gray-100">
      <View className="mb-5">
        <CustomText className="text-lg text-[#716DAA] mb-2">Номер автобуса</CustomText>
        <TextInput
          className="bg-white p-4 rounded-xl text-lg shadow-lg shadow-black/10 font-Montserrat"
          value={busNumber}
          onChangeText={handleBusNumberChange}
          placeholder="Введите гос. номер (например: 111XXX11)"
          placeholderTextColor="#888"
          autoCapitalize="characters"
        />
      </View>

      {selectedRoute && (
        <View className="bg-white shadow-lg shadow-black/20 p-4 rounded-xl mb-5 border-l-4 border-[#716DAA]">
          <CustomText className="text-xl font-semibold text-gray-800">{selectedRoute.name}</CustomText>
          <CustomText className="text-lg text-gray-600 mb-1">{selectedRoute.destination}</CustomText>
          <CustomText className="text-xl font-bold text-[#716DAA] mt-1">Стоимость: {selectedRoute.price}₸</CustomText>
        </View>
      )}

      

<TouchableOpacity
  className={`p-3 rounded-[15] mt-4 h-[50px] items-center justify-center flex-row  ${!selectedRoute ? 'bg-gray-300' : 'bg-[#716DAA]'}`}
  onPress={handlePayment}
  disabled={!selectedRoute || isLoading}
    style={styles.shadowButton}
>
  <View className="flex-row items-center justify-center">
    {isLoading ? (
      <>
       <CustomText className="text-white text-lg font-semibold">
          Идет оплата
        </CustomText>
        <LottieView
          source={require('@/assets/animations/animation3.json')}
          autoPlay
          loop
          style={{ width: 80, height: 80, marginLeft: -20, paddingBottom: 8  }}
        />
       
      </>
    ) : (
      <CustomText className="text-white text-lg font-semibold">
        Оплатить {selectedRoute?.price}
        {selectedRoute?.price ? '₸' : ''}
      </CustomText>
    )}
  </View>
</TouchableOpacity>


 
    </View>
  );
};

const styles = StyleSheet.create({
   
    shadowButton: {
      shadowColor: '#716DAA',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
      
      
    },
    
  
  });

export default PaymentScreen;
