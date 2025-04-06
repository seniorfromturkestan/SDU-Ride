import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { View, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import CustomText from '@/components/CustomText';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        setFontsLoaded(true)
        setShowSplash(false);
        SplashScreen.hideAsync();
      }, 3000);
      setFontsLoaded(false)

    }
  }, [loaded]);



  useEffect(() => {
    if (language) {
      router.replace("/home");
    }
  }, [language]);

  if (!fontsLoaded || showSplash) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={require("../assets/images/sduridebg.png")}
          className="w-full h-full object-cover"
        />
      </View>
    );
  }

  if (!language) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={require("../assets/images/sduridebg.png")}
          className="w-full h-full object-cover"
        />
        <View className="absolute h-96 bottom-0 w-full p-6 bg-white rounded-t-[30px]">
          <CustomText className="text-center font-bold text-black text-3xl mt-2 font-['Montserrat']">
            Welcome to SDU Ride
          </CustomText>
          <View className="flex flex-col w-full items-center mt-4">
            <TouchableOpacity
              onPress={() => setLanguage("kk")}
              className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
            >
              <CustomText className="text-black text-xl text-center">Қазақ</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage("ru")}
              className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
            >
              <CustomText className="text-black text-xl text-center">Русский</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage("en")}
              className="bg-[#EEEEEE] w-full rounded-2xl p-3 m-2"
            >
              <CustomText className="text-black text-xl text-center">English</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
