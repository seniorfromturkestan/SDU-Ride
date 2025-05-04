import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text,Animated, FlatList, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { getBusSchedule } from '../api/route service/route.api';  
import CustomText from '@/components/CustomText';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Entypo } from '@expo/vector-icons';



const BusSchedule = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Расписание',
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

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getBusSchedule();
        setScheduleData(data); 
        setLoading(false);  
      } catch (error) {
        console.error('Error loading schedule:', error);
        setLoading(false); 
      }
    };

    fetchSchedule();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const time = new Date(timeString); 
      const hours = time.getUTCHours().toString().padStart(2, '0');  
      const minutes = time.getUTCMinutes().toString().padStart(2, '0'); 
      return `${hours}:${minutes}`;
    } catch (e) {
      return timeString;  
    }
  };

  const [scaleAnim] = useState(new Animated.Value(1)); 

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05, 
          duration: 1000, 
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 1000, 
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);
 

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const renderRouteItem = ({ item }) => (
    
    <View className="py-4 border-b border-gray-200">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <CustomText className="text-xl font-bold mb-1">{`Маршрут SDU ${item.route_number}`}</CustomText>
          <CustomText className="text-base text-gray-600">{item.destination || 'SDU University - Сайран'}</CustomText>
        </View>
        <View className="items-end ">
        <CustomText className="text-lg font-bold">{formatTimeRange(item.start_time, item.end_time)}</CustomText>
      </View>

      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          transform: [{ translateX: -30 }, { scale: scaleAnim }], 
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#28a745',
            width: 60,
            height: 20,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#28a745', 
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 6, 
          }}
          onPress={() => {
            console.log('Автобусы на линии');
          }}
        >
          <CustomText style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                <CustomText style={{ fontSize: 10 }}>на линии</CustomText>
          </CustomText>
        </TouchableOpacity>
      </Animated.View>
    </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-around py-1 pt-5">
        <CustomText className="text-gray-400 font-bold">МАРШРУТ</CustomText>
        <CustomText className="text-gray-400 font-bold">ВРЕМЯ</CustomText>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={scheduleData}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={renderRouteItem}
          contentContainerStyle={{ paddingHorizontal: 24 }}
        />
      )}
    </View>
  );
};

export default BusSchedule;
