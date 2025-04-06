import React from 'react';
import { Text as RNText, TextProps, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  style?: TextStyle;
}

const CustomText: React.FC<CustomTextProps> = ({ style, ...props }) => {
  return <RNText style={[{ fontFamily: 'Montserrat' }, style]} {...props} />;
};

export default CustomText;