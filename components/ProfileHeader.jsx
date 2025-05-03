import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import OkProfile from '@/assets/images/okProfile.svg';

const ProfileHeader = ({ avatar, profileName, newName, onEdit }) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-[20] shadow-custom px-3 py-3 mb-4"
      onPress={onEdit}
      activeOpacity={0.7}
    >
      <View className="w-14 h-14 rounded-full mr-4 bg-gray-300 justify-center items-center overflow-hidden">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <CustomText className="text-gray-500 font-medium">Фото</CustomText>
        )}
      </View>

      <View>
        <CustomText className="font-medium text-lg">Добро пожаловать!</CustomText>
        <View className="flex-row items-center">
          <CustomText className="text-md font-bold mr-1">
            {newName || profileName}
          </CustomText>
          <OkProfile width={14} height={14} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileHeader;
