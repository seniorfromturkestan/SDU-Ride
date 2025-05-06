import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import CustomText from '@/components/CustomText';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';


export default function BluetoothScanScreen() {
  const [scanning, setScanning] = useState(true);
  const animationRef = useRef(null);
    const navigation = useNavigation();

  useEffect(() => {
    animationRef.current?.play();

    const timer = setTimeout(() => {
      setScanning(false);
    }, 5000); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Поиск автобуса',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} >
          <TouchableOpacity className='bg-white rounded-lg' onPress={() => navigation.goBack()}>
              <Entypo name="chevron-left" size={22} color="#716DAA"/>
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);


  return (
    <View style={styles.container}>
      {scanning ? (
        <>
          <CustomText className="text-xl text-[#716DAA] font-bold">Поиск автобуса...</CustomText>
          <LottieView
            ref={animationRef}
            source={require('@/assets/animations/animation2.json')} 
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </>
      ) : (
        <CustomText className="text-center text-lg text-gray-500">
          Рядом не обнаружено автобусов через Bluetooth
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
