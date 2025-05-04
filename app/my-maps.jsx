import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Pressable, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';

const { width, height } = Dimensions.get('window');

const Maps = () => {
  const apiKey = '56b799c9-048e-4713-a7bb-150cad82d060';
  const navigation = useNavigation();
  const mapWebView = useRef(null);

  const icons = {
    bus: require('@/assets/images/bus.png'),
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Карта',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <TouchableOpacity className='bg-white rounded-lg' onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={22} color="#716DAA" />
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  const mapHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yandex Map</title>
      <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${apiKey}" type="text/javascript"></script>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }
        #map {
          width: 100%;
          height: 100%;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script type="text/javascript">
        ymaps.ready(function() {
          var myMap = new ymaps.Map("map", {
            center: [43.238949, 76.89846], // Центр карты
            zoom: 12, // Масштаб
            controls: [] // Убираем все элементы управления
          });

          // Добавляем маркеры для Сайрана и Университета SDU с текстами
          var startPlacemark = new ymaps.Placemark([43.238949, 76.89846], {
            balloonContent: 'Это Сайран'
          }, {
            interactive: false
          });

          var endPlacemark = new ymaps.Placemark([43.207157, 76.668767], {
            balloonContent: 'Это Университет SDU'
          }, {
            interactive: false
          });

          // Добавляем маркеры на карту
          myMap.geoObjects.add(startPlacemark);
          myMap.geoObjects.add(endPlacemark);

          // Создаем маршрут от Сайрана до Университета SDU
          var multiRoute = new ymaps.multiRouter.MultiRoute({
            referencePoints: [
              [43.238949, 76.89846], // Сайран
              [43.207157, 76.668767]  // Университет SDU
            ],
            params: {
              results: 1 // Отображаем только один маршрут
            }
          }, {
            boundsAutoApply: true // Автоматическое изменение масштаба карты, чтобы показать маршрут
          });

          // Добавляем маршрут на карту
          myMap.geoObjects.add(multiRoute);

          // Программно скрываем все элементы управления
          myMap.controls.remove('searchControl');
          myMap.controls.remove('zoomControl');
          myMap.controls.remove('trafficControl');
          myMap.controls.remove('typeSelector');
          myMap.controls.remove('fullscreenControl');
          myMap.controls.remove('routeButtonControl');
          myMap.controls.remove('geolocationControl');
          myMap.controls.remove('rulerControl');
          
          // Экспортируем объект карты в WebView для управления
          window.myMap = myMap;
        });
      </script>
    </body>
    </html>
  `;

  const zoomIn = () => {
    if (mapWebView.current) {
      mapWebView.current.injectJavaScript(`
        window.myMap.setZoom(window.myMap.getZoom() + 1);
      `);
    }
  };

  const zoomOut = () => {
    if (mapWebView.current) {
      mapWebView.current.injectJavaScript(`
        window.myMap.setZoom(window.myMap.getZoom() - 1);
      `);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={mapWebView}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
      />
      <View style={styles.infoContainer} className='flex-row'>
        <View style={styles.iconContainer} >
          <Image source={icons.bus} style={styles.busIcon} resizeMode="contain" />
        </View>
        <View>
          <CustomText style={styles.routeText}>Маршрут SDU 01</CustomText>
          <CustomText style={styles.destinationText}>Сайран - Университет SDU</CustomText>
        </View>
      </View>
      
      <View style={styles.zoomControls}>
        <Pressable onPress={zoomIn} style={styles.zoomButton}>
          <CustomText style={styles.zoomText}>+</CustomText>
        </Pressable>
        <Pressable onPress={zoomOut} style={styles.zoomButton}>
          <CustomText style={styles.zoomText}>-</CustomText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    padding: 40,
    paddingTop: 20,
    paddingBottom: 70,
    width: width,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  iconContainer: {
    marginBottom: 10,  
  },
  busIcon: {
    width: 40,
    height: 40,
    marginTop: 5,
    marginLeft: -20,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 20,
  },
  destinationText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 20,

  },
  zoomControls: {
    position: 'absolute',
    bottom: '50%',
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',

  },
  zoomButton: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  zoomText: {
    fontSize: 30,
    color: '#716DAA',
  },
});

export default Maps;
