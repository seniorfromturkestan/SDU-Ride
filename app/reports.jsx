import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase.config';
import CustomText from '@/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const StudentReportsScreen = () => {
  const [reports, setReports] = useState([]);
  const [text, setText] = useState('');
  const [studentId, setStudentId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(fetched);
    });

    return () => unsubscribe();
  }, []);

  const sendReport = async () => {
    if (!text || !studentId) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните оба поля');
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        student_id: studentId,
        text,
      });

      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: 'Жалоба отправлена',
        position: 'bottom',
      });

      setText('');
      setStudentId('');
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось отправить жалобу');
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerStyle: { backgroundColor: '#716DAA' },
      headerTintColor: '#fff',
      headerTitle: 'Жалобы студентов',
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Montserrat',
        paddingBottom: 10,
      },
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()}>
          <TouchableOpacity className="bg-white rounded-lg">
            <Entypo name="chevron-left" size={22} color="#716DAA" />
          </TouchableOpacity>
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="p-4">
        <CustomText className="text-lg text-[#716DAA] font-bold mb-2">
          Отправить жалобу
        </CustomText>

        <TextInput
          placeholder="Ваш ID"
          value={studentId}
          onChangeText={setStudentId}
          keyboardType="numeric"
          className="border border-gray-300 rounded-xl mb-2 p-3 font-Montserrat"
        />

        <TextInput
        placeholder="Текст жалобы"
        value={text}
        onChangeText={setText}
        multiline
        className="border border-gray-300 rounded-xl mb-2 p-3 font-Montserrat h-44 text-base"
        />


        <TouchableOpacity
          onPress={sendReport}
          className="bg-[#716DAA] p-3 rounded-xl items-center mb-4"
        >
          <CustomText className="text-white text-xl font-medium">Отправить</CustomText>
        </TouchableOpacity>
      </View>

     
    </KeyboardAvoidingView>
  );
};

export default StudentReportsScreen;
