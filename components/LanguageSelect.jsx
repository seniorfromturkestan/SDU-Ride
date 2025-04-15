import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';

const LanguageSelect = ({ onSelectLang }) => {
  return (
    <>
      <CustomText className="text-center font-bold text-black text-3xl mt-2 font-Montserrat">
        Welcome to SDU Ride
      </CustomText>
      <View className="flex flex-col w-full items-center mt-4">
        <TouchableOpacity
          onPress={() => onSelectLang("kk")}
          className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
        >
          <CustomText className="text-black text-xl text-center">Қазақ</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectLang("ru")}
          className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
        >
          <CustomText className="text-black text-xl text-center">Русский</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelectLang("en")}
          className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
        >
          <CustomText className="text-black text-xl text-center">English</CustomText>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default LanguageSelect;
