import React from 'react';
import { View, TouchableOpacity, Alert, Switch } from 'react-native';
import CustomText from '@/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';

const SecurityScreen = () => {
  const navigation = useNavigation();
  const [faceIdEnabled, setFaceIdEnabled] = React.useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Удаление аккаунта',
      'Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => {
            Alert.alert('Аккаунт удалён');
        }},
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Безопасность',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <TouchableOpacity className="bg-white rounded-lg p-1">
            <Entypo name="chevron-left" size={22} color="#716DAA" />
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <View className="border-b border-gray-200 py-4 flex-row justify-between items-center">
        <CustomText className="text-base font-medium text-black">Вход с Face ID</CustomText>
        <Switch
          value={faceIdEnabled}
          onValueChange={(value) => {
            setFaceIdEnabled(value);
            Alert.alert('Настройки обновлены', value ? 'Face ID включен' : 'Face ID отключен');
          }}
          trackColor={{ false: '#ccc', true: '#716DAA' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        className="mt-6 bg-red-500 py-4 rounded-xl items-center"
        onPress={handleDeleteAccount}
      >
        <CustomText className="text-white font-semibold text-base">Удалить аккаунт</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default SecurityScreen;
