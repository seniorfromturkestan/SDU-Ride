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
      headerTitle: 'Контакт-центр',
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
        Свяжитесь с нами
      </CustomText>

      <CustomText className="text-base mb-3 text-gray-700">
        Если у вас возникли вопросы, проблемы с бронированием или предложения по улучшению — наша команда готова помочь.
      </CustomText>

      <CustomText className="text-base font-semibold mt-4 mb-1">Телефон поддержки:</CustomText>
      <TouchableOpacity onPress={() => Linking.openURL('tel:+77271234567')}>
        <CustomText className="text-[#716DAA] underline mb-3">+7 (727) 123-45-67</CustomText>
      </TouchableOpacity>

      <CustomText className="text-base font-semibold mb-1">Email:</CustomText>
      <TouchableOpacity onPress={() => Linking.openURL('mailto:support@sduride.kz')}>
        <CustomText className="text-[#716DAA] underline mb-3">support@sduride.kz</CustomText>
      </TouchableOpacity>

      <CustomText className="text-base font-semibold mb-1">Время работы:</CustomText>
      <CustomText className="text-gray-700 mb-3">Пн–Пт, 09:00–18:00</CustomText>

      <CustomText className="text-base font-semibold mb-1">Адрес:</CustomText>
      <CustomText className="text-gray-700 mb-10">
        Сулейман Демирель Университет{'\n'}ул. Абылай хана, Каскелен, Казахстан
      </CustomText>
    </ScrollView>
  );
};

export default ContactCenterScreen;
