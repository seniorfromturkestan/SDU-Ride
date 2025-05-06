import React from 'react';
import { View, ScrollView, Linking, TouchableOpacity } from 'react-native';
import CustomText from '@/components/CustomText';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

const ContactCenterScreen = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'О приложении',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <TouchableOpacity className="bg-white rounded-lg">
            <Entypo name="chevron-left" size={22} color="#716DAA" />
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <CustomText className="text-2xl font-bold text-[#716DAA] mb-4">
        SDU Ride — транспорт для студентов
      </CustomText>

      <CustomText className="text-base text-gray-700 mb-4">
        SDU Ride — это мобильное приложение, которое помогает студентам удобно добираться между Алматы и университетом. 
        В приложении реализованы функции отслеживания маршрутов университетского транспорта в реальном времени и поиска попутчиков. 
        Наша цель — сделать поездки безопаснее, удобнее и понятнее для каждого пользователя.
      </CustomText>


      <CustomText className="text-base font-semibold mb-1">Контакт для связи:</CustomText>
      <TouchableOpacity
        onPress={() => Linking.openURL('mailto:erasylassyltaev@gmail.com')}
        className="bg-[#716DAA] rounded-xl py-3 mt-3 mb-10 items-center"
      >
        <CustomText className="text-white text-base font-semibold">Написать разработчикам</CustomText>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContactCenterScreen;
