import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, RefreshControl } from 'react-native';
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
import LottieView from 'lottie-react-native';
import { getBalance } from '../../api/wallet service/wallet.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BalanceModalButton from '@/components/BalanceModal';
import { useNavigation } from 'expo-router';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import registerNNPushToken from 'native-notify';
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, arrayUnion, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase.config.js';
import buses from '../../busRoutes.json';


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
  registerNNPushToken(29791, 'LDJJw4kjuJ4EL8WSeZ0rgC');

  const navigation = useNavigation();
  const [balance, setBalance] = useState(0);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setLoading] = useState(true); 
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState(null);
  





  const translateX = new Animated.Value(0);

  const toggleMenu = () => {
  Animated.timing(translateX, {
    toValue: isMenuVisible ? 0 : 256,
    duration: 300,
    useNativeDriver: true,
  }).start();
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const id = await AsyncStorage.getItem('student_id');
    if (!id) {
      console.error('student_id не найден в AsyncStorage');
      return;
    }
    setStudentId(id);
    fetchBalance(id);
  };

  const fetchBalance = async (id) => {
    setRefreshing(true);
    const data = await getBalance(id);
    setBalance(data.balance);
    setRefreshing(false);
  };



  let currentBusIndex = 0;

const sendPushNotification = async ({ title, body }) => {
  try {
    const response = await fetch('https://app.nativenotify.com/api/notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        appId: 29791,
        appToken: "LDJJw4kjuJ4EL8WSeZ0rgC",
        title,
        body
      })
    });
    const result = await response.text();
    console.log('Уведомление отправлено:', result);
  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
  }
};

const handleWaitBusClick = async () => {
  const studentId = '210103' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  await sendPushNotification({
    title: "SDU Ride",
    body: `Вы добавлены в список ожидания.`
  });

  const groupsRef = collection(db, 'waitingGroups');
  const groupsSnap = await getDocs(groupsRef);

  let activeGroup = null;

  groupsSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.passengers && data.passengers.length < 6 && !activeGroup) {
      activeGroup = { id: docSnap.id, ...data };
    }
  });

  if (!activeGroup) {
    const bus = buses[currentBusIndex % buses.length];
    const groupId = bus.name;
  
    const groupDocRef = doc(db, 'waitingGroups', groupId);
    await setDoc(groupDocRef, {
      busId: bus.id, 
      busName: bus.name,
      busGos: bus.gosnomer,
      passengers: []
    });
  
    activeGroup = {
      id: groupId,
      busId: bus.id,
      passengers: []
    };
  
    currentBusIndex++;
  }
  

  const groupDocRef = doc(db, 'waitingGroups', activeGroup.id);
  await updateDoc(groupDocRef, {
    passengers: arrayUnion({
      studentId,
      timestamp: Date.now()
    })
  });

  await new Promise(resolve => setTimeout(resolve, 300));

  const updatedSnap = await getDoc(groupDocRef);
  const updatedData = updatedSnap.data();

  console.log('👥 Пассажиров:', updatedData.passengers?.length);

  if (updatedData.passengers?.length >= 4) {
    const bus = buses.find(b => b.id === updatedData.busId);
    console.log('Достигнут лимит! Отправляю уведомление...');

    await sendPushNotification({
      title: 'SDU Ride',
      body: `Автобус ${bus.name} выехал!`
    });

    await deleteDoc(groupDocRef);
    console.log(`🗑️ Группа ${activeGroup.id} удалена после отправки`);
  }

  console.log(`${studentId} добавлен в группу ${activeGroup.id}`);
};


  return (
    <SafeAreaView className={`flex-1 bg-[#f1f1f1] font-Montserrat ${isSmallDevice ? 'max-h-[600px]' : ''}`} style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />      
      <View className='bg-[#716DAA] h-[130px] p-4 -mt-20 pt-20 shadow-custom'>
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

      <BurgerMenu isVisible={isMenuVisible} onClose={() => setMenuVisible(false)} />
      {isMenuVisible && (
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
      

      <ScrollView className={`flex-1`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBalance(studentId)}
            tintColor="#716DAA"
          />
        }
      >
        
        <View className="mx-4 mt-4 h-40 shadow-gradient">
          <AnimatedLinearGradient
            colors={[color1, color2, color3, color4]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
            >
            <View className="p-4">
            <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Image source={icons.cards} className="w-10 h-10 mr-3" />
                  <View>
                    <CustomText className="text-2xl font-bold text-white">Virtual Card</CustomText>
                    <CustomText className="text-md font-semibold text-white">{studentId}</CustomText>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <CustomText className="text-3xl font-bold text-white mr-2">
                    {balance} ₸
                  </CustomText>
                  <TouchableOpacity
                    className="bg-[#716DAA] w-6 h-6 rounded-lg items-center justify-center"
                    onPress={() => {
                      setShowModal(true);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <PlusIcon width={12} height={15} fill="#FFFFFF" />
                  </TouchableOpacity>
                  <BalanceModalButton
                    isVisible={showModal}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                      setShowModal(false);
                    }}
                  />

                </View>
              </View>

              <View className="h-px bg-[#ffffff] my-6" />

              <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => navigation.navigate('my-history')}
              >
                <CustomText className="text-md text-white">Подробнее</CustomText>
                <Entypo name="chevron-small-right" size={24} color="white"/>
              </TouchableOpacity>
                <CustomText className="text-white text-lg font-bold">KZT</CustomText>
              </View>
            </View>
          </AnimatedLinearGradient>
        </View>

          <NewsSlider slides={slides}/>

        {[
          { icon: icons.ticket, label: "Мои билеты" },
          { icon: icons.history, label: "История поездок" },
        ].map((item, index) => (
          <TouchableOpacity key={index}
            onPress={
              () => {
                if (item.label === "История поездок") {
                  navigation.navigate('my-trips');
                } else if (item.label === "Мои билеты") {
                  navigation.navigate('my-tickets');
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }
           className="mx-4 mt-3 bg-white rounded-[20] p-4 shadow-custom">
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
            <TouchableOpacity 
              key={index} 
              className="flex-1 bg-white rounded-[20] p-4 items-center shadow-custom"
              onPress={() => {
                if (item.label === "Гос.номер") {
                  navigation.navigate('paymentBus');
                }
                // if (item.label === "QR Code") {
                //   navigation.navigate('qrcode');
                // }
                if (item.label === "Bluetooth") {
                  navigation.navigate('bluetooth');
                }
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Image source={item.icon} className="w-10 h-8" resizeMode="contain" />
              <CustomText className="text-lg mt-1">{item.label}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        
        <TouchableOpacity
          className="mx-4 mt-6 mb-4 bg-[#716DAA] rounded-[20] p-4 items-center"
          onPress={handleWaitBusClick}
        >
        <CustomText className="text-white text-2xl font-bold">жду автобус</CustomText>
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
  },
  shadowButton: {
    shadowColor: '#716DAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    
    
  },
  
});




export default HomeScreen;

