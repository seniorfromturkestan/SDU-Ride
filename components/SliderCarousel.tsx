import React, { useRef } from 'react';
import { View, Text, Image, Dimensions, Animated, FlatList, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

type Slide = {
  id: string;
  title: string;
  description: string;
  image: any; // require('@/assets/...')
};

type Props = {
  slides: Slide[];
};

const SliderCarousel: React.FC<Props> = ({ slides }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className='px-4 border'>
        <View style={styles.container}>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={slides}
            keyExtractor={(item) => item.id}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => (
              <View style={styles.slide}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            )}
          />

          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [6, 12, 6],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={i.toString()}
                  style={[styles.dot, { width: dotWidth }]}
                />
              );
            })}
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#716DAA',
    marginHorizontal: 4,
  },
});

export default SliderCarousel;
