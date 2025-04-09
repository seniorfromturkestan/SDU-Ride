import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

const AnimatedTabIcon = ({ children }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    // Haptic вибрация при нажатии
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Анимация увеличения
    Animated.spring(scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    // Возвращение к обычному размеру
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default AnimatedTabIcon;
