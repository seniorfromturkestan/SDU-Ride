import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';

const LanguageSelect = ({ setLanguage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View className="flex-1 justify-center items-center bg-white relative">
      <Image
        source={require("@/assets/images/sduridebg.png")}
        className="w-full h-full object-cover"
        resizeMode="cover"
        onLoad={() => setImageLoaded(true)}
      />
      {imageLoaded && (
      <View className="absolute h-96 bottom-0 w-full p-6 bg-white rounded-t-[30px]">
        <CustomText className="text-center font-bold text-black text-3xl mt-2 font-['Montserrat']">
          Welcome to SDU Ride
        </CustomText>
        <View className="flex flex-col w-full items-center mt-4">
          <TouchableOpacity
            onPress={() => setLanguage("kk")}
            className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
          >
            <CustomText className="text-black text-xl text-center">Қазақ</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage("ru")}
            className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
          >
            <CustomText className="text-black text-xl text-center">Русский</CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage("en")}
            className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
          >
            <CustomText className="text-black text-xl text-center">English</CustomText>
          </TouchableOpacity>
        </View>
      </View>)}
    </View>
  );
};

export default LanguageSelect;