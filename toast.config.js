// toastConfig.js
import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#716DAA',
        backgroundColor: '#ffffff',
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#716DAA',
        fontFamily: 'Montserrat',
      }}
      text2Style={{
        fontSize: 12,
        color: '#716DAA',
        fontFamily: 'Montserrat',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#F87171',
        backgroundColor: '#FEF2F2',
        borderRadius: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#991B1B',
      }}
      text2Style={{
        fontSize: 14,
        color: '#991B1B',
      }}
    />
  ),
};
