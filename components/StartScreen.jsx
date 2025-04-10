import React, { useEffect, useRef, useState } from 'react';
import { View, Image, ActivityIndicator, Animated } from 'react-native';
import LanguageSelect from '@/components/LanguageSelect';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'react-native';

const StartScreen = ({ setLanguage }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);

  const slideAnim = useRef(new Animated.Value(100)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current;  

  useEffect(() => {
    if (bgLoaded) {
      const timer = setTimeout(() => {
        setShowLanguageSelect(true);

        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [bgLoaded]);

  return (
    <View className="flex-1 bg-white relative">
      <StatusBar barStyle="dark-content" />      
      <Image
        source={require("@/assets/images/sduridebg.png")}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        resizeMode="cover"
        onLoad={() => setBgLoaded(true)}
      />

      {!bgLoaded && (
        <View className="absolute inset-0 justify-center items-center bg-white z-10">
          <LottieView
                  source={require('@/assets/animations/animation2.json')}
                  autoPlay
                  loop
                  style={{ width: 150, height: 150 }}
          />        
      </View>
      )}

      {bgLoaded && showLanguageSelect && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '40%',
            padding: 24,
            backgroundColor: 'white',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          }}
        >
          <LanguageSelect setLanguage={setLanguage} />
        </Animated.View>
      )}
    </View>
  );
};

export default StartScreen;
