import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Animated, Dimensions, View, Keyboard, Easing, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Option from '@/components/Option';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileEditorModal from '@/components/ProfileEditorModal';
import { fetchProfileName, updateProfile } from '../../api/user service/user.api';
import Toast from 'react-native-toast-message';

const { height } = Dimensions.get('window');

export default function Profile() {
  const navigation = useNavigation();
  const shift = useRef(new Animated.Value(height)).current;
  const [state, setState] = useState({
    notificationsEnabled: false,
    permissionGranted: false,
    profileName: '',
    avatar: null,
    id: null,
    newName: '',
    loading: false,
    bottomSheetVisible: false,
    tempAvatar: null,
    tempName: ''
  });

  // Простая функция обновления состояния
  const updateState = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    
    const loadProfile = async () => {
      try {
        const storedId = await AsyncStorage.getItem('student_id');
        if (!isMounted) return;
        if (!storedId) {
          Alert.alert('Ошибка', 'ID не найден');
          return;
        }
        
        const { name, avatar: avatarData } = await fetchProfileName(storedId, { signal: controller.signal });
        if (!isMounted) return;
        
        const avatarUri = avatarData ? `data:image/jpeg;base64,${avatarData}` : null;
        setState(prev => ({
          ...prev,
          id: storedId,
          profileName: name,
          newName: name,
          tempName: name,
          avatar: avatarUri,
          tempAvatar: avatarUri
        }));
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          Alert.alert('Ошибка', err.message || 'Не удалось загрузить профиль');
        }
      }
    };

    loadProfile();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [updateState]); // Удалил updateState из зависимостей

  useEffect(() => {
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
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(shift, {
        toValue: -e.endCoordinates.height / 1.1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, [shift]);

  const toggleNotifications = useCallback(async () => {
    try {
      if (!state.permissionGranted) {
        const { status } = await Notifications.requestPermissionsAsync();
        const granted = status === 'granted';
        setState(prev => ({
          ...prev,
          permissionGranted: granted,
          notificationsEnabled: granted
        }));
        if (!granted) {
          Alert.alert('Внимание', 'Пожалуйста, включите уведомления в настройках устройства');
        }
        return;
      }
      
      setState(prev => ({
        ...prev,
        notificationsEnabled: !prev.notificationsEnabled
      }));
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось изменить настройки уведомлений');
    }
  }, [state.permissionGranted]);

  const openBottomSheet = useCallback(() => {
    setState(prev => ({
      ...prev,
      bottomSheetVisible: true,
      tempName: prev.newName,
      tempAvatar: prev.avatar
    }));
    
    Animated.timing(shift, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [shift]);

  const closeBottomSheet = useCallback(() => {
    Animated.timing(shift, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      setState(prev => ({
        ...prev,
        bottomSheetVisible: false
      }));
    });
  }, [shift]);

  const pickAvatar = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Доступ запрещён', 'Разрешите доступ к галерее в настройках');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setState(prev => ({
          ...prev,
          tempAvatar: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  }, []);

  const handleUpdateProfile = useCallback(async () => {
    const { tempName, id, tempAvatar } = state;
    
    if (!tempName || !tempName.trim()) {
      Alert.alert('Ошибка', 'Имя не может быть пустым');
      return;
    }
    
    if (!id) {
      Alert.alert('Ошибка', 'ID пользователя не найден');
      return;
    }
    
    setState(prev => ({ ...prev, loading: true }));
    Keyboard.dismiss();
    
    try {
      await updateProfile(id, tempName, tempAvatar);
      
      setState(prev => ({
        ...prev,
        newName: tempName,
        profileName: tempName,
        avatar: tempAvatar,
        loading: false,
        bottomSheetVisible: false
      }));
      
      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: `Профиль обновлен`,
        position: 'bottom',
      });
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Ошибка', err.message || 'Не удалось обновить профиль');
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state]);

  const bottomSheetHeight = height / 1.75;

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 py-4">
      <ProfileHeader 
        avatar={state.avatar} 
        profileName={state.profileName} 
        newName={state.newName} 
        onEdit={openBottomSheet} 
      />

      <View className="bg-white rounded-[20] p-2 mb-4 shadow-custom">
        <Option icon="settings" text="Настройки приложения" className='py-4'/>
        <Option 
          icon="security" 
          text="Безопасность" 
          iconClassName='h-[38px]' 
          className='border-t py-4 border-[#716DAA]' 
        />
        <Option 
          icon="bell" 
          text="Уведомления и звуки" 
          iconClassName='h-[34px]'
          isSwitch 
          value={state.notificationsEnabled} 
          onToggle={toggleNotifications} 
          className='border-t py-4' 
        />
      </View>

      <View className="bg-white rounded-[20] p-2 py-1 mt-8 shadow-custom">
        <Option icon="share" text="Поделиться с друзьями из SDU" />
      </View>

      <View className="bg-white rounded-[20] p-2 py-1 mt-4 shadow-custom">
        <Option icon="exit" text="Выйти" />
      </View>

      <ProfileEditorModal
        visible={state.bottomSheetVisible}
        onClose={closeBottomSheet}
        onPickAvatar={pickAvatar}
        onSave={handleUpdateProfile}
        state={state}
        updateState={(patch) => setState(prev => ({ ...prev, ...patch }))}
        shift={shift}
        height={bottomSheetHeight}
      />
    </ScrollView>
  );
}



// import { Image, Text, View, Switch, ScrollView, TouchableOpacity } from 'react-native';
// import { useLayoutEffect, useEffect, useState } from 'react';
// import { useNavigation } from 'expo-router';
// import * as Notifications from 'expo-notifications';
// import CustomText from '@/components/CustomText';
// import OkProfile from '@/assets/images/okProfile.svg';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { fetchProfileName } from '../../api/user service/user.api';


// const icons = {
//   user: require('@/assets/images/userIcon.png'),
//   settings: require('@/assets/images/settings.png'),
//   security: require('@/assets/images/security.png'),
//   bell: require('@/assets/images/notifications.png'),
//   share: require('@/assets/images/repost.png'),
//   exit: require('@/assets/images/exit.png'),
// };

// export default function Profile() {
//   const navigation = useNavigation();
//   const [notificationsEnabled, setNotificationsEnabled] = useState(false);
//   const [permissionGranted, setPermissionGranted] = useState(false);
//   const [profileName, setProfileName] = useState(null);

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const id = await AsyncStorage.getItem('student_id');
//         if (!id) return;
//           const text = await fetchProfileName(id); 
//         setProfileName(text);
//       } catch (err) {
//         Alert.alert('Ошибка', err.message);
//       }
//     };

//     loadProfile();
//   }, []);

  

//   useLayoutEffect(() => {
//     navigation.setOptions({
//       headerShown: true,
//       headerStyle: { backgroundColor: '#716DAA' },
//       headerTintColor: '#fff',
//       headerTitle: 'Профиль',
//       headerTitleAlign: 'center',
//       headerTitleStyle: {
//         fontSize: 18,
//         fontWeight: '600',
//         fontFamily: 'Montserrat',
//         paddingBottom: 10,
//       },
//     });
//   }, [navigation]);

//   useEffect(() => {
//     checkNotificationPermission();
//   }, []);

//   const checkNotificationPermission = async () => {
//     const { status } = await Notifications.getPermissionsAsync();
//     const granted = status === 'granted';
//     setPermissionGranted(granted);
//     setNotificationsEnabled(granted); 
//   };

//   const toggleNotifications = async () => {
//     if (!permissionGranted) {
//       const { status } = await Notifications.requestPermissionsAsync();
//       const granted = status === 'granted';
//       setPermissionGranted(granted);
//       if (!granted) {
//         alert('Пожалуйста, включите уведомления в настройках устройства');
//         return;
//       }
//     }

//     setNotificationsEnabled(prev => !prev);
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-100 px-4 py-4">
//       <TouchableOpacity className="flex-row items-center bg-white rounded-[20] shadow-custom px-4 py-4 mb-4">
//         <Image source={icons.user} className="w-9 h-9 mr-4" />
//         <View>
//           <CustomText className="font-medium text-lg">Добро пожаловать!</CustomText>
//           <View className="flex-row items-center">
//             <CustomText className="text-md font-bold mr-1">{profileName || '...'}</CustomText>
//             <OkProfile width={14} height={14}/>
//           </View>

//         </View>
//       </TouchableOpacity>

//       <View className="bg-white rounded-[20] p-2 mb-4 shadow-custom">
//         <Option icon={icons.settings} text="Настройки приложения" className='py-4'/>
//         <Option icon={icons.security} iconClassName="h-[38px]"  className='border-t py-4 border-[#716DAA]' text="Безопасность" />
//         <Option
//           icon={icons.bell}
//           text="Уведомления и звуки"
//           isSwitch
//           value={notificationsEnabled}
//           onToggle={toggleNotifications}
//           className='border-t py-4'
//         />
//       </View>

//       <View className="bg-white rounded-[20] p-2 py-1 mt-8 shadow-custom">
//         <Option icon={icons.share} text="Поделиться с друзьями из SDU" />
//       </View>

//       <View className="bg-white rounded-[20] p-2 py-1 mt-4 shadow-custom">
//         <Option icon={icons.exit} text="Выйти" />
//       </View>
//     </ScrollView>
//   );
// }

// const Option = ({
//   icon,
//   text,
//   isSwitch = false,
//   value,
//   onToggle,
//   className = '',
//   iconClassName = '',
// }) => (
//   <TouchableOpacity className={`flex-row items-center justify-between px-2 py-3 border-b border-gray-200 last:border-b-0 ${className}`}>
//     <View className="flex-row items-center">
//       <Image source={icon} className={`w-9 h-9 mr-4 ${iconClassName}`} />
//       <CustomText className="text-lg">{text}</CustomText>
//     </View>
//     {isSwitch && (
//       <Switch
//         trackColor={{ false: '#ccc', true: '#716DAA' }}
//         thumbColor="#fff"
//         ios_backgroundColor="#ccc"
//         onValueChange={onToggle}
//         value={value}
//       />
//     )}
//   </TouchableOpacity>
// );