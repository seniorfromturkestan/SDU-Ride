import { Image, StyleSheet, Platform, Text, View, StatusBar } from 'react-native';
import { HelloWave } from '@/components/HelloWave';

export default function Profile() {
  return (
    <View className='p-3'>
            <StatusBar barStyle="light-content" />      

      <View style={styles.titleContainer}>
        <Text className='font-bold text-blue-500 text-2xl'>Welcome User!</Text>
      </View>
      
   
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
