import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

const NewsSlider = ({ slides }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  return (
    <View className="h-24 mt-3 rounded-[20] overflow-hidden">
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center">
            <ImageBackground
              source={item.image}
              className="w-[93%] h-20 rounded-[20] overflow-hidden justify-end"
              imageStyle={{ borderRadius: 20 }}
            >
              <Animated.View
                className="bg-black/40 px-3 py-1.5"
                style={{ opacity: fadeAnim }}
              >
                <Text className="text-white text-xs font-medium">{item.text}</Text>
              </Animated.View>
            </ImageBackground>
          </View>
        )}
      />

      <View className="flex-row justify-center mt-2">
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={{ opacity: dotOpacity }}
              className="w-2 h-2 bg-[#716DAA] rounded-full mx-1"
            />
          );
        })}
      </View>
    </View>
  );
};

export default NewsSlider;
