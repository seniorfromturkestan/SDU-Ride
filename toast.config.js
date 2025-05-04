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
        shadowColor: '#716DAA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        zIndex: 9999,
       
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
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#F87171',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#991B1B',
        fontFamily: 'Montserrat',

      }}
      text2Style={{
        fontSize: 12,
        color: '#991B1B',
        fontFamily: 'Montserrat',

      }}
    />
  ),
};
