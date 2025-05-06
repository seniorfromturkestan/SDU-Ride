// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';

// export default function QRScannerScreen() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     Alert.alert('QR-код отсканирован', `Данные: ${data}`);
//   };

//   if (hasPermission === null) {
//     return <Text>Запрашиваем доступ к камере...</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>Нет доступа к камере</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />

//       {scanned && (
//         <Text style={styles.resetText} onPress={() => setScanned(false)}>
//           Нажмите, чтобы сканировать снова
//         </Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   resetText: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 10,
//     color: '#716DAA',
//     fontWeight: 'bold',
//   },
// });
