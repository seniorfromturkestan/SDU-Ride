import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated, Easing, Dimensions } from 'react-native';
import { StatusBar } from 'react-native';
import Menuburger from '@/assets/images/menuburgerPurple.svg';
import AdminSlidesScreen from '@/components/AdminSlideScreen';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';




const { width } = Dimensions.get('window');
const isSmallDevice = width < 375; 

const icons = {
  'Расписание': require('@/assets/images/calendarBurger.png'),
  'Новости SDU': require('@/assets/images/newsBurger.png'),
  'Обращение': require('@/assets/images/mailBurger.png'),
  'Контакт-центр': require('@/assets/images/phoneBurger.png'),
  'О приложении': require('@/assets/images/aboutUsBurger.png'),
  'Админ-панель': require('@/assets/images/aboutUsBurger.png'),
};

const icons1 = {
    cards: require('@/assets/images/card3x.png'),
    bluetooth: require('@/assets/images/bluetooth.png'),
    qr: require('@/assets/images/qr.png'),
    bus: require('@/assets/images/bus.png'),
    ticket: require('@/assets/images/ticket.png'),
    history: require('@/assets/images/history.png'),
    iconride: require('@/assets/images/sduridePurple.png')
  };

const BurgerMenu = ({ isVisible, onClose, activeItem = '' }) => {
  const [selectedItem, setSelectedItem] = useState(activeItem);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();


  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);
  

  if (!isVisible && fadeAnim.__getValue() === 0) return null;

  const menuItems = [
    { label: 'Расписание', screen: 'ScheduleScreen' },
    { label: 'Новости SDU', screen: 'NewsScreen' },
    { label: 'Обращение', screen: 'FeedbackScreen' },
    { label: 'Контакт-центр', screen: 'ContactScreen' },
    { label: 'О приложении', screen: 'AboutScreen' },
    { label: 'Админ-панель', screen: '/admin-slides' },
  ];
  

  return (
    <Animated.View
    className={`${isSmallDevice ? 'pt-10' : 'pt-[70px]'}`}
    style={[
        styles.menuContainer,
        {
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim, 
        fontFamily:"Montserrat",
        },
    ]}
    >
      <View style={styles.header}>
        <TouchableOpacity className='flex mr-auto -ml-2 -mt-6'>
              <Image source={icons1.iconride} className='w-36 h-16' resizeMode='contain'/>
          </TouchableOpacity>
        <TouchableOpacity  onPress={() => {
              onClose();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }} className='-mt-5'>
          <Menuburger name="close"width={24} height={24} color="#716DAA"/>
        </TouchableOpacity>
      </View>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            selectedItem === item.label && styles.activeItem,
          ]}
          onPress={() => {
            setSelectedItem(item.label);
            onClose();
            router.push(item.screen); 
          }}
        >
          {icons[item.label] && (
            <Image
              source={icons[item.label]}
              style={styles.icon}
              className="mr-5"
            />
          )}
          <Text
            style={[
              styles.menuText,
              selectedItem === item.label && { color: '#716DAA', fontWeight: 'bold' },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}




      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '120%',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 100,
    },
      
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#716DAA',
    paddingBottom: 5,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#716DAA',
  },
 
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 3,
    // borderBottomWidth: 0.2,
    // borderBottomColor: '#716DAA',
},
  activeItem: {
    backgroundColor: '#EEEEEE',
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Montserrat',
    fontWeight: '400',
  },
});

export default BurgerMenu;
