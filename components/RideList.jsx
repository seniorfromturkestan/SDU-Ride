import React from 'react';
import { View, FlatList, Image, Linking, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import PhoneIcon from '@/assets/images/phone.png';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const RideList = ({ data }) => {
  const renderItem = ({ item }) => (
    <View className="bg-white rounded-[20] px-3 py-4 mb-4 flex-row justify-between items-start">
      <View className="items-center">
        <Image source={require('@/assets/images/userIcon.png')} className="w-9 h-9" resizeMode="contain" />
        <CustomText className="text-xs my-2 font-medium text-gray-500">
          {item.creator_role === 'driver' ? 'Водитель' : 'Пассажир'}
        </CustomText>
        <TouchableOpacity className="bg-gray-100 p-3 rounded-full" onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Image source={PhoneIcon} style={{ width: 24, height: 24, resizeMode: 'contain' }} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 ml-2">
        <View className="flex-row">
          <CustomText className="text-lg font-semibold text-[#5a568e]">{item.name}</CustomText>
          <CustomText className="ml-auto text-lg font-semibold text-[#D9631D]">
            {item.amount === 1 ? 'Бесплатно' : `${item.amount} ₸`}
          </CustomText>
        </View>
        <CustomText className="bg-gray-100 text-base rounded-[12] h-[68px] px-4 py-2 my-1">{item.message}</CustomText>
      </View>
      <CustomText className="text-xs absolute bottom-2 left-20 ml-2 text-gray-400">
        {dayjs(item.created_at).isToday()
          ? `создано сегодня в ${dayjs(item.created_at).format('HH:mm')}`
          : `создано ${dayjs(item.created_at).format('DD.MM.YYYY в HH:mm')}`}
      </CustomText>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 300 }} />}
    />
  );
};

export default RideList;