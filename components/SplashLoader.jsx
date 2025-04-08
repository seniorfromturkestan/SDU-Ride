import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

const SplashLoader = ({ duration = 3000, onComplete }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }, [duration, onComplete]);
  
    return (
      <View className="flex-1 justify-center items-center bg-white relative">
        <Image
          source={require("@/assets/images/sduridebg.png")}
          className="w-full h-full object-cover"
          resizeMode="cover"
        />
      </View>
    );
  };
export default SplashLoader;