import { Image, Text, View, Switch, ScrollView } from 'react-native';
import { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import * as Notifications from 'expo-notifications';
import CustomText from '@/components/CustomText';
import OkProfile from '@/assets/images/okProfile.svg';

const icons = {
  user: require('@/assets/images/userIcon.png'),
  settings: require('@/assets/images/settings.png'),
  security: require('@/assets/images/security.png'),
  bell: require('@/assets/images/notifications.png'),
  share: require('@/assets/images/repost.png'),
  exit: require('@/assets/images/exit.png'),
};

export default function Profile() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Профиль',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
    });
  }, [navigation]);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    setNotificationsEnabled(granted); 
  };

  const toggleNotifications = async () => {
    if (!permissionGranted) {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      if (!granted) {
        alert('Пожалуйста, включите уведомления в настройках устройства');
        return;
      }
    }

    setNotificationsEnabled(prev => !prev);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-4">
      <View className="flex-row items-center bg-white rounded-[20] px-4 py-4 mb-4">
        <Image source={icons.user} className="w-9 h-9 mr-4" />
        <View>
          <CustomText className="font-medium text-lg">Добро пожаловать!</CustomText>
          <View className="flex-row items-center">
            <CustomText className="text-md font-bold mr-1">Zhanarys Seidakhan</CustomText>
            <OkProfile width={14} height={14}/>
          </View>

        </View>
      </View>

      <View className="bg-white rounded-[20] p-2 mb-4">
        <Option icon={icons.settings} text="Настройки приложения" className='py-4'/>
        <Option icon={icons.security} iconClassName="h-[38px]"  className='border-t py-4' text="Безопасность" />
        <Option
          icon={icons.bell}
          text="Уведомления и звуки"
          isSwitch
          value={notificationsEnabled}
          onToggle={toggleNotifications}
          className='border-t py-4'
        />
      </View>

      <View className="bg-white rounded-[20] p-2 py-1 mt-8">
        <Option icon={icons.share} text="Поделиться с друзьями из SDU" />
      </View>

      <View className="bg-white rounded-[20] p-2 py-1 mt-4">
        <Option icon={icons.exit} text="Выйти" />
      </View>
    </ScrollView>
  );
}

const Option = ({
  icon,
  text,
  isSwitch = false,
  value,
  onToggle,
  className = '',
  iconClassName = '',
}) => (
  <View className={`flex-row items-center justify-between px-2 py-3 border-b border-gray-200 last:border-b-0 ${className}`}>
    <View className="flex-row items-center">
      <Image source={icon} className={`w-9 h-9 mr-4 ${iconClassName}`} />
      <CustomText className="text-lg">{text}</CustomText>
    </View>
    {isSwitch && (
      <Switch
        trackColor={{ false: '#ccc', true: '#716DAA' }}
        thumbColor="#fff"
        ios_backgroundColor="#ccc"
        onValueChange={onToggle}
        value={value}
      />
    )}
  </View>
);
