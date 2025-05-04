import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Pressable, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getActiveTickets } from '../api/wallet service/wallet.api'; 
import CustomText from '@/components/CustomText';
import ticketIcon from '../assets/images/ticketIcon.png'; 
import nonTickets from '../assets/images/nonTickets.png';
import busRoutes from '../busRoutes.json';
import LottieView from 'lottie-react-native';
import sdulogo from '../assets/images/sdulogo.png';

const MyTicketsScreen = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const navigation = useNavigation();

  const loadTickets = async () => {
    try {
      setContentLoading(true);
      const activeTickets = await getActiveTickets();
      setTickets(activeTickets);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    //   setContentLoading(false);
      setTimeout(() => setContentLoading(false), 1000); 
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadTickets();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTickets);
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Мои билеты', 
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

  if (contentLoading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <LottieView
          source={require('@/assets/animations/animation2.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150, marginBottom: 120 }}
        />
       
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-50">
        <CustomText className="text-red-500 text-center text-lg">
          Ошибка: {error}
        </CustomText>
        <TouchableOpacity
          className="mt-4 bg-[#716DAA] px-4 py-2 rounded-lg"
          onPress={loadTickets}
        >
          <CustomText className="text-white">Попробовать снова</CustomText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50 p-4"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#716DAA']}
        />
      }
    >
      {tickets.length >= 1 &&
        <CustomText className="text-xl font-bold mb-6 text-[#716DAA]">
          Активные билеты
        </CustomText>
      }

      {tickets.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Image 
            source={nonTickets} 
            className="w-1/2 h-64" 
          />
          <CustomText className="text-gray-500 text-lg mt-4">
            У вас нет активных билетов
          </CustomText>
        </View>
      ) : (
        tickets.map((ticket, index) => (
          <View
            key={index}
            className="bg-white rounded-[15] mb-4 h-44 shadow-lg relative shadow-black/10 flex-row items-start"
          >
            <Image 
              source={sdulogo} 
              className="w-28 h-28 opacity-10 absolute right-10 top-10 overflow-hidden" 
            />
            
            <View className="mr-3 p-4 rounded-l-[15] bg-[#716DAA]">
              <Image 
                source={ticketIcon}
                className="w-10 h-36"
              />
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-start mb-1 p-3 pt-5 pl-0">
                <View>
                  <CustomText className="text-[20px] font-bold text-[#716DAA]">
                    {busRoutes.find(b => b.gosnomer === ticket.bus_num)?.name || 'Неизвестный маршрут'}
                  </CustomText>
                  <CustomText className="text-gray-500 text-sm">
                    {busRoutes.find(b => b.gosnomer === ticket.bus_num)?.destination || 'Неизвестный маршрут'}
                  </CustomText>
                </View>
                <View className={`px-1 py-1 rounded ${
                  ticket.method === 'paid' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <CustomText className={`text-xs ${
                    ticket.method === 'paid' ? 'text-green-800' : 'text-blue-800'
                  }`}>
                    {ticket.method === 'paid' ? 'Оплачено' : ticket.method}
                  </CustomText>
                </View>
              </View>

              <View className="mt-6 flex-row justify-between">
                <View>
                  <CustomText className="text-gray-600 text-md">
                    <CustomText className="font-semibold">Гос. номер:</CustomText> {ticket.bus_num}
                  </CustomText>
                  <CustomText className="text-gray-600 text-sm">
                    <CustomText className="font-semibold">Время:</CustomText> {ticket.time}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default MyTicketsScreen;