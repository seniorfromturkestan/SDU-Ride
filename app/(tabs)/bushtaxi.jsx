import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View, TouchableOpacity, FlatList, Image, StyleSheet,
  Dimensions, Platform, Modal, TextInput, KeyboardAvoidingView, Alert, Linking, ActivityIndicator, Text
} from 'react-native';
import { useNavigation } from 'expo-router';
import CustomText from '@/components/CustomText';
import PhoneIcon from '@/assets/images/phone.png';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';
import dayjs from 'dayjs';
import LottieView from 'lottie-react-native';
import { getRides, createRide } from '../../api/ride service/rider.api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import isToday from 'dayjs/plugin/isToday';
import Toast from 'react-native-toast-message';
dayjs.extend(isToday);

const tabWidth = Dimensions.get('window').width / 2 - 22;

export default function RidesScreen() {

  const [direction, setDirection] = useState('Алматы');
  const [rideData, setRideData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState('slideInRight');
  const indicatorX = useSharedValue(0);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ price: '', role: 'user', message: '', direction: 'sdu_to_sairan' });
  const [isFree, setIsFree] = useState(false);
  const [refreshing, setRefreshing] = useState(false);



  useEffect(() => {
    indicatorX.value = withTiming(direction === 'Алматы' ? 0 : tabWidth, { duration: 300 });
  }, [direction]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Попутки',
      headerTitleAlign: 'center',
      headerTitleStyle: { fontSize: 18, fontWeight: '600', fontFamily: 'Montserrat', paddingBottom: 10 },
    });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const key = direction === 'Алматы' ? 'sdu_to_sairan' : 'sairan_to_sdu';
        const data = await getRides(key);
        setRideData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [direction]);

  const handlePublish = async () => {
    try {
      const student_id = await AsyncStorage.getItem('student_id');
      await createRide({
        student_id,
        creator_role: form.role,
        direction: form.direction,
        amount: isFree ? 1 : parseInt(form.price) || 0,
        message: form.message,
      });
      
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: `Объявление опубликовано`,
        position: 'bottom',
      });
    } catch (err) {
      Alert.alert('Ошибка', err.message);
    }
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const key = direction === 'Алматы' ? 'sdu_to_sairan' : 'sairan_to_sdu';
      const data = await getRides(key);
      setRideData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };
  

  const renderItem = ({ item }) => (
    <View className="bg-white rounded-[20] px-3 py-4 mb-4 flex-row justify-between items-start">
      <View className="items-center">
        <Image source={require('@/assets/images/userIcon.png')} className="w-10 h-10" resizeMode="contain" />
        <CustomText className="text-xs my-2 font-medium text-gray-500">{item.creator_role === 'driver' ? 'Водитель' : 'Пассажир'}</CustomText>
        <TouchableOpacity className="bg-gray-100 p-3 rounded-full" onPress={() => Linking.openURL(`tel:${item.phone}`)}>
          <Image source={PhoneIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 ml-2">
        <View className="flex-row">
          <CustomText className="text-lg font-semibold text-[#5a568e]">{item.name}</CustomText>
          <CustomText className="ml-auto text-lg font-semibold text-[#D9631D]">{item.amount === 1 ? 'Бесплатно' : `${item.amount} ₸`}</CustomText>
        </View>
        <CustomText className="bg-gray-100 text-base rounded-[12] h-[68px] px-4 py-2 my-1">{item.message}</CustomText>
      </View>
      <CustomText className="text-xs absolute bottom-2 left-20 ml-2 text-gray-400">
        {dayjs(item.created_at).isToday()
          ? `создано сегодня в ${dayjs(item.created_at).format('HH:mm')}`
          : `создано ${dayjs(item.created_at).format('DD.MM.YYYY в HH:mm')}`}
      </CustomText>    
    </View>
  );

  return (
    <View className="flex-1 pt-4">
      <View className="flex-row bg-gray-200 rounded-[15] mx-4 mb-4 py-1 overflow-hidden">
        <Animated.View style={[{ position: 'absolute', top: 0, bottom: 0, width: '50%', backgroundColor: 'white', margin: 4, borderRadius: 12 }, indicatorStyle]} />
        {['Алматы', 'SDU'].map((tab) => (
          <TouchableOpacity
            key={tab}
            className="flex-1 z-10 py-3"
            onPress={() => {
              setAnimation(tab === 'Алматы' ? 'slideInLeft' : 'slideInRight');
              setDirection(tab);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setForm(prev => ({ ...prev, direction: tab === 'Алматы' ? 'sdu_to_sairan' : 'sairan_to_sdu' }));
            }}
          >
            <CustomText className={`text-center font-bold ${direction === tab ? 'text-[#716DAA]' : 'text-gray-500'}`}>{tab === 'Алматы' ? 'В Алматы' : 'В SDU'}</CustomText>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center ">
        <LottieView
          source={require('@/assets/animations/animation2.json')}
          autoPlay
          loop
          style={{ width: 120, height: 120, marginBottom: 120 }}
        />
     
      </View>
      ) : (
        <Animatable.View key={direction} animation={animation} duration={300} useNativeDriver className="px-4">
          <FlatList
            data={rideData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 300 }} />}
          />
        </Animatable.View>
      )}

      <TouchableOpacity className="bg-[#716DAA] absolute left-4 right-4 bottom-28 py-4 rounded-[20] items-center" onPress={() => setModalVisible(true)} style={styles.shadowButton}>
        <CustomText className="text-white font-bold text-xl">создать объявление</CustomText>
      </TouchableOpacity>


      <Modal visible={modalVisible} transparent>
  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 justify-end bg-black/30">
    <View className="bg-white rounded-t-[20] px-4 pt-2 pb-6">
      <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></View>

      <View className="flex-row mb-4 justify-between">
        {[
          { key: 'sdu_to_sairan', label: 'В Алматы' },
          { key: 'sairan_to_sdu', label: 'В SDU' }
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setForm(prev => ({ ...prev, direction: item.key }))}
            className={`flex-1 mx-1 rounded-2xl p-3 ${form.direction === item.key ? 'bg-[#716DAA]' : 'border border-[#716DAA]'}`}
          >
            <CustomText className={`text-center text-lg ${form.direction === item.key ? 'text-white font-bold' : 'text-[#716DAA]'}`}>
              {item.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Введите сообщение"
        className="border border-[#716DAA] rounded-2xl px-4 py-3 text-base mb-4 font-Montserrat"
        multiline
        value={form.message}
        onChangeText={(text) => setForm({ ...form, message: text })}
        maxLength={200}
        numberOfLines={4}
        textAlignVertical="top"
        required
      />

      <CustomText className="text-gray-500 mb-2">Укажите цену</CustomText>
      <View className="flex-row mb-4">
      <TextInput
          placeholder="1000"
          keyboardType="numeric"
          className="border border-[#716DAA] rounded-2xl flex-1 mr-2 p-3 text-lg font-Montserrat" 
          value={isFree ? '' : form.price}
          onChangeText={(text) => {
            setIsFree(false); 
            setForm({ ...form, price: text });
          }}
        />

       <TouchableOpacity
          className={`rounded-2xl flex-1 ml-2 p-3 justify-center items-center ${isFree ? 'bg-[#716DAA]' : 'border border-[#716DAA]'}`}
          onPress={() => {
            setIsFree(true);
            setForm({ ...form, price: '' }); 
          }}
        >
          <CustomText className={`text-lg ${isFree ? 'text-white font-bold' : 'text-gray-700'}`}>Бесплатно</CustomText>
        </TouchableOpacity>

      </View>

      <View className="flex-row mb-5 mt-3 justify-center">
        {[
          { key: 'passenger', label: 'пассажир' },
          { key: 'driver', label: 'водитель' }
        ].map((roleItem) => (
          <TouchableOpacity
            key={roleItem.key}
            onPress={() => setForm({ ...form, role: roleItem.key })}
            className="flex-row items-center mr-8"
          >
            <View className={`w-6 h-6 rounded-full border-2 ${form.role === roleItem.key ? 'border-[#716DAA]' : 'border-[#716DAA]'} justify-center items-center mr-2`}>
              {form.role === roleItem.key && <View className="w-3 h-3 rounded-full bg-[#716DAA]" />}
            </View>
            <CustomText className={form.role === roleItem.key ? 'text-[#716DAA] text-xl' : 'text-gray-500 text-xl'}>{roleItem.label}</CustomText>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity className="bg-[#716DAA] rounded-2xl py-4 items-center mb-3 mt-2" onPress={handlePublish}>
        <CustomText className="text-white text-lg">Опубликовать</CustomText>
      </TouchableOpacity>

      <TouchableOpacity className="items-center py-2" onPress={() => setModalVisible(false)}>
        <CustomText className="text-red-500 text-base font-medium">Отмена</CustomText>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  icon: { width: 24, height: 24, resizeMode: 'contain' },
  shadowButton: {
    shadowColor: '#716DAA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});