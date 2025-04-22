import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import CustomText from '@/components/CustomText';
import { StyleSheet } from 'react-native';


const busRoutes = [
  { id: '230', name: 'Маршрут 230', destination: 'Конечная - Сайран' },
  { id: '257', name: 'Маршрут 257', destination: 'Конечная - проспект Саина' },
  { id: 'sdu1', name: 'Маршрут SDU 01', destination: 'Конечная - улица Төле би' },
  { id: '457', name: 'Маршрут 457', destination: 'Конечная - Колос' },
  { id: 'sdu2', name: 'Маршрут SDU 02', destination: 'Конечная - улица Төле би' },
  { id: 'sdu3', name: 'Маршрут SDU 03', destination: 'Конечная - улица Төле би' },
  { id: '202', name: 'Маршрут 202', destination: 'Конечная - улица Б.Момышұлы' },
  { id: '459', name: 'Маршрут 459', destination: 'Конечная - Сайран' },
];

const icons = {
  bus: require('@/assets/images/bus.png'),
  check: require('@/assets/images/click.png'),
}

export default function TabTwoScreen() {
  const navigation = useNavigation();


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
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filteredRoutes = busRoutes.filter((route) =>
    route.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <View style={styles.container}>
      {/* Поисковая строка */}
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
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    
      {/* Список маршрутов */}
      <FlatList
        data={filteredRoutes}
        className="pt-8"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center mb-4"
            onPress={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
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
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mapButton}>
          <CustomText className="text-white font-semibold text-base">
            Посмотреть на карте
          </CustomText>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 80, // Важно: оставляем место для кнопки
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
  },
  mapButton: {
    backgroundColor: '#716DAA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
});