import React, { useEffect, useState } from 'react';
import { View, Switch, TouchableOpacity, Alert, Pressable, Modal } from 'react-native';
import CustomText from '@/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';

const AppSettingsScreen = () => {
  const navigation = useNavigation();
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Настройки приложения',
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

  const handleFaceIDToggle = () => {
    setIsFaceIDEnabled((prev) => !prev);
    Alert.alert('Настройки', isFaceIDEnabled ? 'Face ID отключён' : 'Face ID включён');
  };

  const handleDeleteCard = () => {
    Alert.alert('Удаление карты', 'Вы уверены, что хотите удалить привязанную карту?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: () => {} },
    ]);
  };

  const getLanguageLabel = (code) => {
    return code === 'ru' ? 'Русский' : code === 'kz' ? 'Қазақша' : 'English';
  };

  return (
    <View className="flex-1 bg-white p-6">
      <CustomText className="text-2xl font-bold text-[#716DAA] mb-6">Настройки приложения</CustomText>

      <View className="flex-row justify-between items-center mb-4">
        <CustomText className="text-lg">Вход с Face ID</CustomText>
        <Switch
          value={isFaceIDEnabled}
          onValueChange={handleFaceIDToggle}
          trackColor={{ false: '#ccc', true: '#716DAA' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity className="border border-red-400 rounded-xl py-3 px-4 mb-4" onPress={handleDeleteCard}>
        <CustomText className="text-red-500 text-center font-semibold">Удалить привязанную карту</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-300 rounded-xl py-3 px-4 mb-4"
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <CustomText className="text-center text-[#716DAA] font-semibold">Сменить пароль</CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-gray-300 rounded-xl py-3 px-4 mb-4"
        onPress={() => setIsLanguageModalVisible(true)}
      >
        <CustomText className="text-center text-[#716DAA] font-semibold">
          Язык интерфейса: {getLanguageLabel(selectedLanguage)}
        </CustomText>
      </TouchableOpacity>

      <Modal visible={isLanguageModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white p-6 rounded-t-[20]">
            <CustomText className="text-xl font-bold text-[#716DAA] mb-4">Выберите язык</CustomText>

            {[
              { code: 'ru', label: 'Русский' },
              { code: 'kz', label: 'Қазақша' },
              { code: 'en', label: 'English' },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => {
                  setSelectedLanguage(lang.code);
                  setIsLanguageModalVisible(false);
                }}
                className={`p-3 rounded-xl mb-2 ${
                  selectedLanguage === lang.code ? 'bg-[#716DAA]' : 'bg-gray-100'
                }`}
              >
                <CustomText
                  className={`text-center text-lg ${
                    selectedLanguage === lang.code ? 'text-white font-bold' : 'text-gray-700'
                  }`}
                >
                  {lang.label}
                </CustomText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity className="items-center my-4" onPress={() => setIsLanguageModalVisible(false)}>
              <CustomText className="text-gray-500">Отмена</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppSettingsScreen;
