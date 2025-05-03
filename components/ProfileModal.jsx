import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileModal = () => {
  return (
    <Modal
        transparent={true}
        visible={bottomSheetVisible}
        onRequestClose={closeBottomSheet}
        animationType="none"
      >

        <View className="flex-1 bg-black/40 justify-end">
        
          <Pressable 
            className="absolute inset-0" 
            onPress={closeBottomSheet}
          />


          
          <Animated.View 
            className="bg-white rounded-t-[20] p-6 w-full"
            style={{
              height: bottomSheetHeight,
              transform: [{ translateY: shift }]
            }}
          >

      <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-5" />
      
      <CustomText className="text-xl font-bold text-center mb-6">Изменить профиль</CustomText>
      
      <View className="items-center mb-6">
        <TouchableOpacity 
          onPress={pickAvatar}
          className="relative"
        >
          <View className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 justify-center items-center">
            {tempAvatar ? (
              <Image
                source={{ uri: tempAvatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <CustomText className="text-gray-500 font-medium">Фото</CustomText>
            )}
          </View>
          <View className="absolute bottom-0 right-0 bg-[#716DAA] p-2 rounded-full">
            <Image 
              source={icons.camera} 
              className="w-5 h-5"
              style={{ tintColor: 'white' }}
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={pickAvatar} 
          className="mt-2"
        >
          <CustomText className="text-[#716DAA] font-medium">Выбрать из галереи</CustomText>
        </TouchableOpacity>
      </View>
      
      <View className="mb-8">
        <CustomText className="font-medium mb-2">Имя</CustomText>
        <TextInput
          value={tempName}
          onChangeText={(text) => updateState({ tempName: text })}
          className="border border-gray-300 rounded-lg p-3 mb-1 font-Montserrat"
          placeholder="Введите имя"
        />
        <CustomText className="text-xs text-gray-500">Имя будет отображаться в профиле</CustomText>
      </View>
      
      <TouchableOpacity 
        className="bg-[#716DAA] py-3 rounded-xl items-center mb-2"
        onPress={handleUpdateProfile}
        disabled={loading}
      >
        <CustomText className="text-white font-medium">
          {loading ? 'Обновление...' : 'Сохранить изменения'}
        </CustomText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="py-2 rounded-xl items-center"
        onPress={closeBottomSheet}
      >
        <CustomText className="text-gray-600">Отмена</CustomText>
      </TouchableOpacity>
    </Animated.View>
  </View>
</Modal>
  )
}

export default ProfileModal

