import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ImageBackground,
  Animated,
  Text,
  StatusBar,
} from 'react-native';
import LanguageSelect from '@/components/LanguageSelect';
import EmailScreen from '@/components/EmailScreen';
import CodeScreen from '@/components/CodeScreen';
import LottieView from 'lottie-react-native';
import RegisterScreen from '@/components/RegisterScreen';

const StartScreen = ({ setLanguage, setVerified }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [gmail, setGmail] = useState('');

  const [showLanguage, setShowLanguage] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (bgLoaded) {
        const timer = setTimeout(() => {
          setShowLanguage(true);
  
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

  const handleLangSelect = (lang) => {
    setLanguage(lang);
    setShowLanguage(false);
    setShowEmail(true);
  };

  const handleEmailSuccess = (email) => {
    setGmail(email);
    setShowEmail(false);
    setShowCode(true);
  };

  const handleCodeSuccess = () => {
    setShowCode(false);
    setShowRegister(true);
   
  };


  return (
    <ImageBackground
      source={require('@/assets/images/sduridebg.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
      onLoadEnd={() => setBgLoaded(true)}
    >
      <View className="flex-1 relative">
        <StatusBar barStyle="dark-content" />

        {!bgLoaded && (
          <View className="absolute inset-0 justify-center items-center bg-white z-10">
            <LottieView
              source={require('@/assets/animations/animation2.json')}
              autoPlay
              loop
              style={{ width: 140, height: 140 }}
            />
          </View>
        )}

        {showLanguage && (
          <Animated.View
            className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6"
            style={{
              height: '40%',
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            }}
          >
            <LanguageSelect onSelectLang={handleLangSelect} />
          </Animated.View>
        )}

        {showEmail && <EmailScreen onSuccess={handleEmailSuccess} />}
        {showCode && <CodeScreen gmail={gmail} onVerified={handleCodeSuccess} />}
        {showRegister && (
          <RegisterScreen
            gmail={gmail}
            onRegistered={() => {
              setShowRegister(false);
              setVerified(true); // → router.replace("/home")
            }}
          />
        )}

        

      </View>
    </ImageBackground>
  );
};

export default StartScreen;
