import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Pressable, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import CustomText from '@/components/CustomText';

const { width, height } = Dimensions.get('window');

const Maps = () => {
  const apiKey = '56b799c9-048e-4713-a7bb-150cad82d060'; // Ваш API ключ Yandex Maps
  const navigation = useNavigation();

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
        <Pressable onPress={() => navigation.goBack()} >
          <TouchableOpacity className='bg-white rounded-lg' onPress={() => navigation.goBack()}>
              <Entypo name="chevron-left" size={22} color="#716DAA"/>
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  // HTML контент с кастомным JavaScript для управления картой
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
          });

          var endPlacemark = new ymaps.Placemark([43.207157, 76.668767], {
            balloonContent: 'Это Университет SDU'
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

          // Программно скрываем элементы управления
          myMap.controls.remove('searchControl'); // Убираем строку поиска
          myMap.controls.remove('zoomControl');   // Убираем кнопки зума
          myMap.controls.remove('trafficControl'); // Убираем трафик
          myMap.controls.remove('typeSelector'); // Убираем типы карты
          myMap.controls.remove('fullscreenControl'); // Убираем кнопку полноэкранного режима
          myMap.controls.remove('routeButtonControl'); // Убираем кнопку "Как добраться"
          myMap.controls.remove('geolocationControl'); // Убираем кнопку геолокации
          myMap.controls.remove('rulerControl'); // Убираем измеритель
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
      />
      <View style={styles.infoContainer}>
        <Image source={icons.bus} style={styles.busIcon} resizeMode="contain" />
        <CustomText style={styles.routeText}>Маршрут 230</CustomText>
        <CustomText style={styles.destinationText}>Сайран - Университет SDU</CustomText>
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
    padding: 15,
    width: width,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  busIcon: {
    width: 50,
    height: 50,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  destinationText: {
    fontSize: 14,
    color: '#555',
  },
});

export default Maps;
