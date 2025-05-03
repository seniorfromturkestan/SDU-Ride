import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import CustomText from '@/components/CustomText';
import { getTopUpHistory } from '../api/wallet service/wallet.api';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import bgHistory from '../assets/images/bghistory.png';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
dayjs.locale('ru');

export default function TopUpHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'История пополнений',
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
    getTopUpHistory()
      .then((data) => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {Array.isArray(history) && history.length > 0 ? (
          history.map((item, index) => {
            const prev = history[index - 1];
            const prevAmount = prev?.replenishment || 0;
            const delta = item.replenishment - prevAmount;

            const isSpent = item.method === 'spent';
            const isAdded = item.method === 'added';

            const amountDisplay = isSpent
              ? `-${Math.abs(delta)} ₸`
              : `+${Math.abs(delta)} ₸`;

            const amountColor = isSpent ? 'text-red-600' : 'text-green-600';

            const formattedTime =
              item.change_date && item.change_date.includes('T')
                ? `Сегодня ${item.change_date.slice(11, 16)}`
                : 'Время не указано';

            return (
              <View
                key={item.id}
                className="mb-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-200"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-2">
                  <CustomText className={`text-2xl ${amountColor}`}>💰</CustomText>
                  <CustomText className={`ml-2 ${amountColor} text-lg font-semibold`}>
                    {amountDisplay}
                  </CustomText>
                </View>

                <CustomText className="text-gray-500 text-sm">{formattedTime}</CustomText>

                <CustomText className="text-gray-400 text-xs mt-1">
                  ID: {item.student_id}
                </CustomText>
              </View>
            );
          })
        ) : (
          <View className="flex-1 justify-center items-center mt-32">
            <Image source={bgHistory} className="w-1/2 h-64" />
                <CustomText className="text-gray-500 text-lg mt-4">
                    У вас нет истории пополнений
                </CustomText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
