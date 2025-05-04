import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import CustomText from '@/components/CustomText';
import { StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { fetchSchedule } from '../../api/route service/route.api';
import busRoutes from '../../busRoutes.json'; 
import LottieView from 'lottie-react-native';


const icons = {
  bus: require('@/assets/images/bus.png'),
  check: require('@/assets/images/click.png'),
}

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Маршруты',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
    });
  }, [navigation]);


  const filteredRoutes = busRoutes.filter((route) =>
    route.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const getScheduleData = async () => {
      const data = await fetchSchedule();
      setSchedule(data);
      setLoading(false);
    };
    
    getScheduleData();
  }, []);



  if (loading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <LottieView
          source={require('@/assets/animations/animation2.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150, marginBottom: 120 }}
        />
       
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
        <Search size={20} color="#9CA3AF" className="mr-5" />
        <TextInput
          placeholder="Поиск"
          value={search}
          onChangeText={setSearch}
          className="flex-1 font-Montserrat ml-3 text-md"
          placeholderTextColor="#9CA3AF"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => {
            setSearch('');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            }
          }>
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    
      <FlatList
        data={filteredRoutes}
        className="pt-8"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() =>{
              setSelectedId(selectedId === item.id ? null : item.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            }
            }
          >
            <View className="w-12 h-12 mr-4 items-center">
              {selectedId === item.id ? (
                <Image source={icons.check} className="w-10 h-10" resizeMode="contain" />
              ) : (
                <Image source={icons.bus} className="w-12 h-10" resizeMode="contain" />
              )}
            </View>
    
            <View className="w-full border-b border-gray-200 pb-3">
              <CustomText className="text-xl font-bold">{item.name}</CustomText>
              <CustomText className="text-md text-gray-500">{item.destination}</CustomText>
            </View>
          </TouchableOpacity>
        )}
      />
    
        {selectedId && (
          <TouchableOpacity
            className="bg-[#716DAA] absolute left-4 right-4 bottom-28 py-4 rounded-[20] items-center"
            style={styles.shadowButton}
            onPress={() => {
              navigation.navigate('my-maps')
            

              // navigation.navigate('busdetails', { busId: selectedId });
              // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <CustomText className="text-white font-bold text-xl">Посмотреть маршрут</CustomText>
          </TouchableOpacity>
        )}
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 24,
    position: 'relative',
  },
  listContent: {
    paddingBottom: 80, 
  },
  shadowButton: {
    shadowColor: '#716DAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    
    
  },
  

});