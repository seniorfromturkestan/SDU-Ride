import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  ImageBackground,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const NewsSlider = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SDU-Ride slides'), (snapshot) => {
      const fetchedSlides = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSlides(fetchedSlides);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const onScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  if (slides.length === 0) return null;

  return (
    <View className="h-[100px] mt-3 overflow-hidden">
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
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center justify-center">
            <ImageBackground
              source={{ uri: item.img }}
              className="w-[93%] h-[84px] rounded-[20] overflow-hidden justify-end"
              imageStyle={{ borderRadius: 20 }}
            >
                <LinearGradient
                  colors={['transparent',  'rgba(0,0,0,0.5)','rgba(0,0,0,0.8)']}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  className="px-3 py-2"
                >
                  <Text className="text-white text-sm p-3 font-Montserrat font-medium">{item.text}</Text>
                </LinearGradient>
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
