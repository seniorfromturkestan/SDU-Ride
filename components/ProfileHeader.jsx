import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import OkProfile from '@/assets/images/okProfile.svg';

const ProfileHeader = ({ avatar, profileName, newName, onEdit }) => {

  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-[20] shadow-custom px-3 py-2 mb-4"
      onPress={onEdit}
      activeOpacity={0.7}
    >
      <View className="w-16 h-16 rounded-full mr-4 justify-center items-center overflow-hidden">
      
      {avatar ? (
        <Image
          source={{uri:avatar}} 
          style={{ width: 56, height: 56, borderRadius: 28 }}
          resizeMode="cover"
        />
      ) : (
        <Image
          source={require('@/assets/images/userIcon.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="cover"
        />
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
