import React from 'react';
import {
  View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal
} from 'react-native';
import CustomText from '@/components/CustomText';

const RideFormModal = ({ visible, onClose, onSubmit, form, setForm }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end bg-black/30"
      >
        <View className="bg-white rounded-t-2xl px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-3">
            <CustomText className="font-medium">Направление:</CustomText>
            <TouchableOpacity
              onPress={() =>
                setForm(prev => ({
                  ...prev,
                  direction: prev.direction === 'sdu_to_sairan' ? 'sairan_to_sdu' : 'sdu_to_sairan'
                }))
              }
              className="bg-gray-200 px-4 py-2 rounded-xl"
            >
              <CustomText className="text-[#716DAA] font-semibold">
                {form.direction === 'sdu_to_sairan' ? 'В Алматы' : 'В SDU'}
              </CustomText>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between mb-3">
            <TouchableOpacity
              onPress={() => setForm({ ...form, role: 'driver' })}
              className="flex-1 mr-1 p-2 bg-gray-200 rounded-xl"
            >
              <CustomText
                className={`text-center ${
                  form.role === 'driver' ? 'text-[#716DAA] font-bold' : 'text-gray-500'
                }`}
              >
                Я Водитель
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setForm({ ...form, role: 'user' })}
              className="flex-1 ml-1 p-2 bg-gray-200 rounded-xl"
            >
              <CustomText
                className={`text-center ${
                  form.role === 'user' ? 'text-[#716DAA] font-bold' : 'text-gray-500'
                }`}
              >
                Я Пассажир
              </CustomText>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Введите сообщение"
            className="border rounded-xl mb-3 px-4 py-2"
            value={form.message}
            onChangeText={(text) => setForm({ ...form, message: text })}
          />
          <TextInput
            placeholder="Цена (1 = бесплатно)"
            keyboardType="numeric"
            className="border rounded-xl mb-3 px-4 py-2"
            value={form.price}
            onChangeText={(text) => setForm({ ...form, price: text })}
          />

          <TouchableOpacity className="bg-[#716DAA] rounded-xl py-3 items-center" onPress={onSubmit}>
            <CustomText className="text-white text-lg">Опубликовать</CustomText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} className="mt-4 items-center">
            <CustomText className="text-gray-500">Отмена</CustomText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default RideFormModal;