import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import CustomText from '@/components/CustomText';
import PhoneIcon from '@/assets/images/phone.png';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';



const ridesToAlmaty = [
  {
    id: '1',
    name: 'Kamila Nuraddinova',
    role: 'Водитель',
    message: 'Выезжаю в 18:30 в город. Кто едет?',
    price: '500 ₸',
    time: 'создано сегодня, 14:25',
  },
  {
    id: '2',
    name: 'Janibek Tulegenov',
    role: 'Водитель',
    message: 'Срочно! Через 10 минут выезжаю в город, есть 2 места.',
    price: 'Бесплатно',
    time: 'создано сегодня, 14:38',
  },
  {
    id: '3',
    name: 'Ardak Aspen',
    role: 'Пассажир',
    message: 'Если до едете до Абая заберите пж!',
    price: '1000 ₸',
    time: 'создано сегодня, 14:38',
  },
  {
    id: '7',
    name: 'Nurbek Tulegenov',
    role: 'Пассажир',
    message: 'Если будете ехать к SDU, возьмите, пожалуйста.',
    price: 'Бесплатно',
    time: 'создано сегодня, 08:45',
  },
  {
    id: '8',
    name: 'Nursultan Resim',
    role: 'Пассажир',
    message: 'Если будете ехать к SDU, возьмите, пожалуйста.',
    price: 'Бесплатно',
    time: 'создано сегодня, 08:45',
  },
];

const ridesToSDU = [
  {
    id: '4',
    name: 'Aigerim Bekturgan',
    role: 'Водитель',
    message: 'Выезжаю в SDU в 9:00. Есть 1 место.',
    price: '700 ₸',
    time: 'создано сегодня, 08:30',
  },
  {
    id: '5',
    name: 'Nursultan Resim',
    role: 'Пассажир',
    message: 'Если будете ехать к SDU, возьмите, пожалуйста.',
    price: 'Бесплатно',
    time: 'создано сегодня, 08:45',
  },
  {
    id: '6',
    name: 'Aigerim Bekturgan',
    role: 'Пассажир',
    message: 'Если будете ехать к SDU, возьмите, пожалуйста.',
    price: 'Бесплатно',
    time: 'создано сегодня, 08:45',
  },
  {
    id: '9',
    name: 'Nurbek Tulegenov',
    role: 'Пассажир',
    message: 'Если будете ехать к SDU, возьмите, пожалуйста.',
    price: 'Бесплатно',
    time: 'создано сегодня, 08:45',
  },
];

const tabWidth = Dimensions.get('window').width / 2 - 22;
const isSmallDevice = Dimensions.get('window').width < 375; 

export default function RidesScreen() {
  const [direction, setDirection] = useState('Алматы');
  const [animation, setAnimation] = useState('slideInRight');
  const indicatorX = useSharedValue(0);
  const navigation = useNavigation();

  useEffect(() => {
    indicatorX.value = withTiming(direction === 'Алматы' ? 0 : tabWidth, { duration: 300 });
  }, [direction]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Попутки',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
    });
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View className="bg-white relative rounded-tl-none rounded-[20] px-3 py-4 mb-4 flex-row justify-between items-start">
      <View className="flex-col items-center">
        <Image source={require('@/assets/images/userIcon.png')} className="w-9 h-9" resizeMode="contain" />
        <CustomText className="text-xs my-2 font-medium text-gray-500">{item.role}</CustomText>
        <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
          <Image href="tel:+79001111111" source={PhoneIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 ml-2">
        <View className="flex-row">
          <CustomText className="text-lg font-semibold text-[#5a568e]">{item.name}</CustomText>
          <CustomText className="ml-auto text-lg font-semibold text-[#D9631D]">{item.price}</CustomText>
        </View>
        <CustomText className="bg-gray-100 text-base rounded-tl-none rounded-[12] h-[68px] px-4 py-2 my-1">
          {item.message}
        </CustomText>
      </View>
      <CustomText className="text-xs absolute bottom-2 left-20 text-gray-400">{item.time}</CustomText>
    </View>
  );

  const currentRides = direction === 'Алматы' ? ridesToAlmaty : ridesToSDU;

  return (
    <View className="relative flex-1 pt-4">
      <View className="relative flex-row bg-gray-200 rounded-[15] mx-4 mb-4 py-1 overflow-hidden">
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundColor: 'white',
            margin:4,
            borderRadius: 12,
            zIndex: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          },
          indicatorStyle,
        ]}
      />


        {['Алматы', 'SDU'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 z-10 py-3 rounded-[12]"
            onPress={() => {
              setAnimation(tab === 'Алматы' ? 'slideInLeft' : 'slideInRight');
              setDirection(tab);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            }}
          >
            <CustomText
              className={`text-center font-bold ${
                direction === tab ? 'text-[#716DAA]' : 'text-gray-500'
              }`}
            >
              {tab === 'Алматы' ? 'В Алматы' : 'В SDU'}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>


      <Animatable.View
        key={direction}
        animation={animation}
        duration={300}
        useNativeDriver
        className="px-4" 
      >
        <FlatList
          data={currentRides}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 300 }} />} 
        />
      </Animatable.View>

      <TouchableOpacity
        className="bg-[#716DAA] absolute left-4 right-4 bottom-28 py-4 rounded-[20] items-center"
        style={styles.shadowButton}
      >
        <CustomText className="text-white font-bold text-xl">создать объявление</CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  shadowButton: {
    shadowColor: '#716DAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    
    
  },
});
