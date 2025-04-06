import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Animated, Easing } from 'react-native';

const BurgerMenu = ({ isVisible, onClose }) => {
    const slideAnim = React.useRef(new Animated.Value(300)).current;

    React.useEffect(() => {
      if (isVisible) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }, [isVisible]);
  
    if (!isVisible) return null;

    const menuItems = [
        { title: 'Расписание' },
        { title: 'Новости SDU' },
        { title: 'Обращение' },
        { title: 'Контакт-центр' },
        { title: 'О приложении' },
    ];

    return (
        <Animated.View 
            style={[
                styles.menuContainer,
                { 
                    transform: [{ translateX: slideAnim }],
                    right: 0, 
                    zIndex: 1000,
                }
            ]}
        >
          
            <View style={styles.header}>
                <Text style={styles.headerText}>SDU Ride</Text>

            </View>
            
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    {item.isDivider ? (
                        <View style={styles.divider} />
                    ) : (
                        <TouchableOpacity 
                            style={styles.menuItem} 
                            onPress={onClose}
                        >
                            <Text style={styles.menuText}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                </React.Fragment>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        top: 0,
        paddingTop: 60,
        width: '75%', 
        height: '120%',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 100,
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    headerText: {
        color: '#716DAA',
        fontSize: 20,
        fontWeight: 'bold',
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 10,
    },
});

export default BurgerMenu;