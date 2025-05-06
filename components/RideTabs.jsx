import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function RideTabs({ direction, setDirection, setForm, setAnimation, indicatorX, tabWidth }) {
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleTabPress = (tab) => {
    const newDirection = tab === 'Алматы' ? 'sdu_to_sairan' : 'sairan_to_sdu';
    setDirection(tab);
    setAnimation(tab === 'Алматы' ? 'slideInLeft' : 'slideInRight');
    setForm((prev) => ({ ...prev, direction: newDirection }));
  };

  return (
    <View className="flex-row bg-gray-200 rounded-[15] mx-4 mb-4 py-1 overflow-hidden relative">
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '50%',
            backgroundColor: 'white',
            margin: 4,
            borderRadius: 12,
            zIndex: 0,
          },
          indicatorStyle,
        ]}
      />
      {['Алматы', 'SDU'].map((tab) => (
        <TouchableOpacity
          key={tab}
          className="flex-1 z-10 py-3"
          onPress={() => handleTabPress(tab)}
        >
          <CustomText
            className={`text-center font-bold ${
              direction === tab ? 'text-[#716DAA]' : 'text-gray-500'
            }`}
          >
            {tab === 'Алматы' ? 'В Алматы' : 'В SDU'}
          </CustomText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
