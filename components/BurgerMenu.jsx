import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { StatusBar } from 'react-native';
import Menuburger from '@/assets/images/menuburgerPurple.svg';


const icons = {
  'Расписание': require('@/assets/images/calendarBurger.png'),
  'Новости SDU': require('@/assets/images/newsBurger.png'),
  'Обращение': require('@/assets/images/mailBurger.png'),
  'Контакт-центр': require('@/assets/images/phoneBurger.png'),
  'О приложении': require('@/assets/images/aboutUsBurger.png'),
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
    'Расписание',
    'Новости SDU',
    'Обращение',
    'Контакт-центр',
    'О приложении',
  ];

  return (
    <Animated.View
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
        <TouchableOpacity className='flex mr-auto -ml-2 -mt-4'>
              <Image source={icons1.iconride} className='w-36 h-16' resizeMode='contain'/>
          </TouchableOpacity>
        <TouchableOpacity onPress={onClose} className='-mt-3 -mr-1'>
          <Menuburger name="close"width={24} height={24} color="#716DAA"/>
        </TouchableOpacity>
      </View>

      {menuItems.map((title, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            selectedItem === title && styles.activeItem,
          ]}
          onPress={() => {
            setSelectedItem(title);
            onClose();
          }}
        >
            
            <View className='bg-[#EBEBEB] w-12 h-12 rounded-full mr-4 items-center justify-center'>
                <Image source={icons[title]} style={styles.icon} />
            </View>
          <Text
            style={[
              styles.menuText,
              selectedItem === title && { color: '#716DAA', fontWeight: 'bold' },
            ]}
          >
            {title}
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
        paddingTop: 60,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
        zIndex: 100,
        fontFamily:"Montserrat",
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
