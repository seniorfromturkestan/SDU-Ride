import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import { changeBalance } from '../api/wallet service/wallet.api';
import CustomText from '@/components/CustomText';
import * as Haptics from 'expo-haptics';


const BalanceModalButton = ({ isVisible, onClose, onSuccess }) => {
  const [changeAmount, setChangeAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardSaved, setCardSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const animationRef = useRef(null);

  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadCard = async () => {
      const savedCard = await AsyncStorage.getItem('card_number');
      if (savedCard) {
        setCardNumber(savedCard);
        setCardSaved(true);
      }
    };
    if (isVisible) loadCard();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (!changeAmount) return;
    try {
      setIsProcessing(true);
      animationRef.current?.play();
      await changeBalance(changeAmount);
      setTimeout(() => {
        setIsProcessing(false);
        Toast.show({
          type: 'success',
          text1: 'Баланс пополнен',
          text2: `+${changeAmount} ₸ успешно зачислено`,
          position: 'bottom',
        });
        setChangeAmount('');
        onSuccess?.();
      }, 3000);
    } catch (err) {
      setIsProcessing(false);
      Toast.show({
        type: 'error',
        text1: 'Ошибка пополнения',
        text2: 'Попробуйте еще раз',
        position: 'bottom',
      });
    }
  };

  const handleCardSave = async () => {
    if (!cardNumber) return;
    await AsyncStorage.setItem('card_number', cardNumber);
    setCardSaved(true);
    Toast.show({
      type: 'success',
      text1: 'Карта добавлена',
      text2: 'Теперь вы можете пополнить баланс',
      position: 'bottom',
    });
  };

  const predefinedAmounts = [150, 300, 500];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
      avoidKeyboard={true}
    >
      <Animated.View
        className="bg-white p-5 rounded-t-[20] pb-10"
        style={{ transform: [{ translateY: shift }] }}
      >
        <CustomText className="text-lg font-bold mb-4">Пополнение баланса</CustomText>

        {cardSaved ? (
          <View
            className="p-5 mb-4"
            style={{
              backgroundColor: '#4B3F72',
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <CustomText className="text-white text-sm mb-2">Банковская карта</CustomText>

            <CustomText className="text-white text-xl tracking-widest font-semibold mb-4">
              **** **** **** {cardNumber.slice(-4)}
            </CustomText>

            <View className="flex-row justify-between items-center">
              <CustomText className="text-white text-sm opacity-70">Card Holder</CustomText>
              <CustomText className="text-white font-bold text-lg">VISA</CustomText>
            </View>
          </View>
        ) : (
          <TextInput
            placeholder="Номер карты"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
            className="border-b border-gray-300 py-2 text-base mb-4 font-Montserrat"
          />
        )}


        {cardSaved && (
          <>
            <TextInput
              placeholder="Введите сумму"
              keyboardType="numeric"
              value={changeAmount}
              onChangeText={setChangeAmount}
              className="border-b border-gray-300 py-2 text-xl mb-3 font-Montserrat"
            />

            <View className="flex-row justify-around mb-4">
              {predefinedAmounts.map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setChangeAmount(amt.toString())}
                  className="bg-[#F3F3F3] rounded-xl px-4 py-2"
                >
                  <CustomText className="text-[#716DAA] font-semibold text-lg">
                    {amt} ₸
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {isProcessing && (
          <LottieView
            ref={animationRef}
            source={require('@/assets/animations/animation4.json')}
            autoPlay={false}
            loop={false}
            onLayout={() => {
              animationRef.current?.reset();
              animationRef.current?.play();
            }}
            style={{ width: 80, height: 80, alignSelf: 'center', marginVertical: 10 }}
          />
        )}

        <TouchableOpacity
          className="bg-[#716DAA] py-3 rounded-[20] mt-2"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            cardSaved ? handleSubmit() : handleCardSave();
          }}
          disabled={isProcessing}
        >


          <CustomText className="text-white text-center p-1 text-lg">
            {cardSaved ? 'Подтвердить' : 'Сохранить карту'}
          </CustomText>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default BalanceModalButton;
