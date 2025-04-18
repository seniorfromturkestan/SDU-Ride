import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { View, Image, TouchableOpacity, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Menuburger from '@/assets/images/menuburger.svg';
import PlusIcon from '@/assets/images/Plus.svg';
import CustomText from '@/components/CustomText';
import BurgerMenu from '@/components/BurgerMenu'; 
import NewsSlider from '@/components/NewsSlider';
import { Entypo } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';


const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const { width } = Dimensions.get('window');

const isSmallDevice = width < 375; 


const icons = {
  cards: require('@/assets/images/card3x.png'),
  bluetooth: require('@/assets/images/bluetooth.png'),
  qr: require('@/assets/images/qr.png'),
  bus: require('@/assets/images/bus.png'),
  ticket: require('@/assets/images/ticket.png'),
  history: require('@/assets/images/history.png'),
  iconride: require('@/assets/images/iconride.png')
};

const slides = [
  {
    id: '1',
    text: 'SDU делает важный шаг на пути к улучшению качества образования',
    image: require('@/assets/images/sdunews.jpg'),
  }
];


const HomeScreen = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const user = {
    id:210103146,
    balance: '120'
  }


  
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const gradientColors = ['#B74E00', '#D9631D', '#F39C12', '#F1C40F'];
  // const gradientColors = ['#20B2AA', '#48D1CC', '#00CED1', '#5F9EA0']
  const colorAnimation = useRef(new Animated.Value(0)).current;
  const startAnimation = () => {
    colorAnimation.setValue(0);
    
    Animated.timing(colorAnimation, {
      toValue: gradientColors.length,
      duration: 4000, 
      useNativeDriver: false,
    }).start(() => {
      startAnimation();
    });
  };
  
  useEffect(() => {
    if (isMenuVisible) {
      StatusBar.setBarStyle('dark-content');
    } else {
      StatusBar.setBarStyle('light-content');
    }
  }, [isMenuVisible]);

  useEffect(() => {
    startAnimation();
    return () => {
      colorAnimation.stopAnimation();
    };
  }, []);
  
  const color1 = colorAnimation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [gradientColors[0], gradientColors[1], gradientColors[2], gradientColors[3], gradientColors[0]],
  });
  
  const color2 = colorAnimation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [gradientColors[1], gradientColors[2], gradientColors[3], gradientColors[0], gradientColors[1]],
  });
  
  const color3 = colorAnimation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [gradientColors[2], gradientColors[3], gradientColors[0], gradientColors[1], gradientColors[2]],
  });
  
  const color4 = colorAnimation.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [gradientColors[3], gradientColors[0], gradientColors[1], gradientColors[2], gradientColors[3]],
  });
  


  return (
    <SafeAreaView className={`flex-1 bg-[#f1f1f1] font-Montserrat ${isSmallDevice ? 'max-h-[600px]' : ''}`} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />      
      <View className='bg-[#716DAA] h-[130px] p-4 -mt-20 pt-20 shadow-md'>
        <View className='flex-row justify-between items-center' >
          <TouchableOpacity>
              <Image source={icons.iconride} className='w-36 h-16' resizeMode='contain'/>
          </TouchableOpacity>
          <TouchableOpacity isVisible={isMenuVisible} onPress={() => {
              toggleMenu();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }} className='mr-2'>
            <Menuburger width={24} height={24}/>
          </TouchableOpacity>
        </View>
      </View>


      <BurgerMenu isVisible={isMenuVisible} onClose={() => setMenuVisible(false)}  />
      {isMenuVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      <ScrollView className='flex-1'>
        
        <View className="mx-4 mt-5 rounded-[20px] h-44 shadow-md overflow-hidden">
          
          <AnimatedLinearGradient
            colors={[color1, color2, color3, color4]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          >
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                      <Image source={icons.cards} className="w-10 h-10 mr-3" />
                    <View>
                      <CustomText className="text-2xl font-bold text-white">Virtual Card</CustomText>
                      <CustomText className="text-md font-semibold text-white">{user.id}</CustomText>
                    </View>
                </View>
                <View className="flex-row items-center">
                  <CustomText className="text-3xl font-bold text-white mr-2">{user.balance} ₸</CustomText>
                  <TouchableOpacity className="bg-[#716DAA] w-6 h-6 rounded-lg items-center justify-center">
                    <PlusIcon width={12} height={15} fill="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="h-px bg-[#ffffff] my-6" />

              <View className="flex-row justify-between items-center">
                <TouchableOpacity className="flex-row items-center">
                  <CustomText className="text-md text-white">Подробнее</CustomText>
                  <Entypo name="chevron-small-right" size={24} color="white"/>
                </TouchableOpacity>
                <CustomText className="text-white text-lg font-bold">KZT</CustomText>
              </View>
            </View>
          </AnimatedLinearGradient>
        </View>

        <NewsSlider slides={slides} />

        {[
          { icon: icons.ticket, label: "Мои билеты" },
          { icon: icons.history, label: "История поездок" },
        ].map((item, index) => (
          <TouchableOpacity key={index} className="mx-4 mt-3 bg-white rounded-[20] p-4 shadow-custom">
            <View className="flex-row items-center">
                <Image source={item.icon} className="w-9 h-9 mr-3" resizeMode="contain" />
              <CustomText className="text-xl">{item.label}</CustomText>
            </View>
          </TouchableOpacity>
        ))}

        
        <View className='mx-4 mt-4'>
        <View className='flex-row items-center mb-3'>
          <CustomText className='text-xl font-semibold'>Оплата</CustomText>
          <Entypo name="chevron-small-down" size={24} color="black"/>
        </View>

          
            <View className={`flex-row ${isSmallDevice ? 'gap-1' : 'gap-3'}`}>
            {[
              { icon: icons.bluetooth, label: "Bluetooth" },
              { icon: icons.qr, label: "QR Code" },
              { icon: icons.bus, label: "Гос.номер" },
            ].map((item, index) => (
              <TouchableOpacity key={index} className="flex-1 bg-white rounded-[20] p-4 items-center shadow-custom">
                  <Image source={item.icon} className="w-10 h-8" resizeMode="contain" />
                <CustomText className="text-lg mt-1">{item.label}</CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          className={`mx-4 mt-6 mb-4 bg-[#716DAA] rounded-[20] p-4 items-center`}
        >
          <CustomText className='text-white text-2xl font-bold'>жду автобус</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
    
    
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  }
});




export default HomeScreen;

