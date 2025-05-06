import React from 'react';
import { TouchableOpacity, View, Image, Switch } from 'react-native';
import CustomText from '@/components/CustomText';

const icons = {
  user: require('@/assets/images/userIcon.png'),
  settings: require('@/assets/images/settings.png'),
  security: require('@/assets/images/security.png'),
  bell: require('@/assets/images/notification.png'),
  share: require('@/assets/images/repost.png'),
  exit: require('@/assets/images/exit.png'),
  camera: require('@/assets/images/repost.png'), 
  gallery: require('@/assets/images/repost.png'), 
};
const Option = ({
  icon,
  text,
  isSwitch = false,
  value,
  onToggle,
  className = '',
  iconClassName = '',
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    testID="option-button"
    accessibilityLabel={text}
    accessibilityRole="button"
   className={`flex-row items-center justify-between px-2 py-3 border-b border-gray-200 last:border-b-0 ${className}`}>
    <View className="flex-row items-center">
      <Image source={icons[icon]} className={`w-9 h-9 mr-4 ${iconClassName}`} />
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
  </TouchableOpacity>
);

export default Option;
