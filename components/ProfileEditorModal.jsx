import React from 'react';
import { View, TouchableOpacity, Image, TextInput, Pressable, Animated, Modal } from 'react-native';
import CustomText from '@/components/CustomText';
import LottieView from 'lottie-react-native';

const icons = {
  user: require('@/assets/images/sdulogo.png'),
  camera: require('@/assets/images/repost.png'), 
};

const ProfileEditorModal = ({ visible, onClose, onPickAvatar, onSave, state, updateState, shift, height, opacity }) => (
  <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
    <View className="flex-1 bg-black/40 justify-end">
      <Pressable className="absolute inset-0" onPress={onClose} />
      <Animated.View
          className="bg-white rounded-t-[20] p-6 pt-4 w-full"
          style={{
            height,
            transform: [{ translateY: shift }],
            opacity: opacity, 
          }}
        >
        <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-3" />
        <CustomText className="text-xl font-bold text-center mb-4">Изменить профиль</CustomText>

        <View className="items-center mb-6">
          <TouchableOpacity onPress={onPickAvatar} className="relative">
            <View className="w-36 h-36 rounded-full overflow-hidden border border-[#716DAA] justify-center items-center">
            {state.tempAvatar ? (
              <Image
                source={{ uri: state.tempAvatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              // <CustomText className="text-gray-400 text-3xl">
              //   {state.tempName ? state.tempName.charAt(0).toUpperCase() : 'П'}
              // </CustomText>
              <Image
                source={icons.user}
                className="w-20 h-20 pb-2 opacity-30"
                resizeMode="contain"
                style={{ tintColor: '#716DAA' }}
              />
            )}
            </View>
            <View className="absolute bottom-0 right-0 bg-[#716DAA] p-2 rounded-full">
              <Image source={icons.camera} className="w-5 h-5" style={{ tintColor: 'white' }} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPickAvatar} className="mt-2">
            <CustomText className="text-[#716DAA] font-medium">Выбрать из галереи</CustomText>
          </TouchableOpacity>
        </View>

        <View>
          <CustomText className="font-medium mb-2">Имя Фамилия</CustomText>
          <TextInput
            value={state.tempName}
            onChangeText={(text) => updateState({ tempName: text })}
            className="border border-[#716DAA]  rounded-xl p-3 mb-1 font-Montserrat"
            placeholder="Введите имя"
          />
        </View>
        <View className="mt-4 mb-8">
          <CustomText className="font-medium mb-2">Номер телефона</CustomText>
          <TextInput
            value={state.tempPhone}
            onChangeText={(text) => updateState({ tempPhone: text })}
            keyboardType="phone-pad"
            className="border border-[#716DAA] rounded-xl p-3 mb-1 font-Montserrat"
            placeholder="Введите номер телефона"
          />
        </View>


        <TouchableOpacity
          className="bg-[#716DAA] p-2 rounded-[15] h-[45px] items-center justify-center flex-row"
          onPress={onSave}
          disabled={state.loading}
        >
          <View className="flex-row items-center">
            <CustomText className="text-white text-xl text-center">
              {state.loading ? 'Обнавление' : 'Сохранить'}
            </CustomText>
            {state.loading && (
              <LottieView
                source={require('@/assets/animations/animation3.json')}
                autoPlay
                loop
                style={{ width: 80, height: 80, marginLeft: -20, paddingBottom: 8 }}
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="py-5 rounded-xl items-center" onPress={onClose}>
          <CustomText className="text-gray-600 text-lg">Отмена</CustomText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  </Modal>
);

export default ProfileEditorModal;
