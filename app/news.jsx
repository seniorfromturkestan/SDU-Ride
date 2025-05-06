import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, ImageBackground, StyleSheet, ActivityIndicator, Pressable, TouchableOpacity } from 'react-native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import CustomText from '@/components/CustomText';
import { useNavigation } from 'expo-router';
import { Entypo } from '@expo/vector-icons';


const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Новости SDU',
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'SDU-Ride slides'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNews(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ImageBackground
        source={{ uri: item.img }}
        style={styles.image}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.overlay}>
          <CustomText style={styles.title}>{item.text}</CustomText>
        </View>
      </ImageBackground>
      {item.message && (
        <CustomText style={styles.message}>{item.message}</CustomText>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#716DAA" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  message: {
    padding: 12,
    fontSize: 14,
    color: '#444',
  },
});