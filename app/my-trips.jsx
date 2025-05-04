import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import CustomText from '@/components/CustomText';
import { getTopUpHistory } from '../api/wallet service/wallet.api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import noTripsImage from '../assets/images/nonTickets.png';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import LottieView from 'lottie-react-native';
import busRoutes from '../busRoutes.json';

dayjs.locale('ru');

const periodOptions = [
  { label: 'Последние 3 дня', value: 3 },
  { label: 'Последняя неделя', value: 7 },
  { label: 'Последний месяц', value: 30 },
  { label: 'Все время', value: 0 },
];

export default function TripHistoryScreen() {
  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [lastPayment, setLastPayment] = useState(null);
  const navigation = useNavigation();

  const determineLastPayment = (history) => {
    const last = history.find(item => item.method === 'spent');
    if (last) {
      const amount = last.amount || last.replenishment || 0;
      setLastPayment(-amount);
    }
  };

  const fetchTripHistory = async () => {
    try {
      setLoading(true);
      const history = await getTopUpHistory();
      const sorted = [...history].sort((a, b) =>
        new Date(b.change_date || 0) - new Date(a.change_date || 0)
      );
      setAllTrips(sorted);
      determineLastPayment(sorted);
    } catch (error) {
      console.error('Error fetching trip history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTripsByPeriod = useCallback(() => {
    if (selectedPeriod === 0) {
      setTrips(allTrips);
    } else {
      const cutoff = dayjs().subtract(selectedPeriod, 'day');
      setTrips(allTrips.filter(trip => dayjs(trip.change_date).isAfter(cutoff)));
    }
  }, [selectedPeriod, allTrips]);

  useFocusEffect(
    useCallback(() => {
      fetchTripHistory();
    }, [])
  );

  useEffect(() => {
    filterTripsByPeriod();
  }, [filterTripsByPeriod]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'История поездок',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Entypo name="calendar" size={24} color="white" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity className="bg-white rounded-lg ml-3" onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={22} color="#716DAA" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';

    if (dateString.startsWith('0000-01-01')) {
      const time = dateString.split('T')[1];
      if (time) return `${time.substring(0, 2)}:${time.substring(3, 5)}`;
      return 'Время не указано';
    }

    const date = dayjs(dateString);
    if (date.isSame(dayjs(), 'day')) return `Сегодня в ${date.format('HH:mm')}`;
    if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return `Вчера в ${date.format('HH:mm')}`;
    return date.format('D MMMM [в] HH:mm');
  };

  const getTripAmount = (trip) => {
    const route = busRoutes.find(r => r.gosnomer === trip.bus_num);
    const price = route?.price || 0;
    return `-${price} ₸`;
  };
  

  const getBusName = (busNum) => {
    const route = busRoutes.find(r => r.gosnomer === busNum);
    return route?.name || '';
  };
  

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require('@/assets/animations/animation2.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150, paddingBottom: 50 }}
        />
      </View>
    );
  }

  const filteredTrips = trips.filter(t => t.bus_num && t.bus_num !== 'non');

  return (
    <View className="flex-1 bg-white">
      {lastPayment && (
        <View className="bg-[#716DAA]/20 p-4 mx-4 my-2 rounded-lg">
          <CustomText className="text-center font-semibold">
            Последняя оплата: {lastPayment} ₸
          </CustomText>
        </View>
      )}

      <Modal
        transparent
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[20] py-6 ">
            <CustomText className="text-lg font-bold mb-4 text-center">
              Выберите период
            </CustomText>
            {periodOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                className={`py-5 border-b border-gray-100 ${selectedPeriod === option.value ? 'bg-[#716DAA]/10' : ''}`}
                onPress={() => {
                  setSelectedPeriod(option.value);
                  setFilterModalVisible(false);
                }}
              >
                <CustomText className={`text-center ${selectedPeriod === option.value ? 'text-[#716DAA] font-semibold' : ''}`}>
                  {option.label}
                </CustomText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="mt-4 py-3 pb-2" onPress={() => setFilterModalVisible(false)}>
              <CustomText className="text-center text-red-500">Отмена</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => (
            <View
            key={trip.id}
            className="pb-4 mb-4 border-b border-gray-200 flex-row"
          >
            <View className="mr-4">
              <Image
                source={require('@/assets/images/history.png')} 
                style={{ width: 35, height: 35, marginTop: 10 }}
              />
            </View>
          
            <View className="flex-1">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <CustomText className="text-gray-500 text-md mb-1">
                    Поездка на
                  </CustomText>
                  <CustomText className="text-lg font-semibold">
                    {getBusName(trip.bus_num)}
                  </CustomText>
                </View>
          
                <CustomText
                  className={`font-bold text-xl pt-5 ${
                    trip.method === 'paid' ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {getTripAmount(trip)}
                </CustomText>
              </View>
          
              <CustomText className="text-gray-400 text-xs mt-1">
                {formatDate(trip.change_date)}
              </CustomText>
            </View>
          </View>
          
          ))
        ) : (
          <View className="flex-1 justify-center items-center mt-32">
            <Image source={noTripsImage} className="w-1/2 h-64" />
            <CustomText className="text-gray-500 text-lg mt-4">
              Нет поездок за выбранный период
            </CustomText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
