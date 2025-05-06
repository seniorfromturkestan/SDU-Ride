import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import Constants from 'expo-constants';
import StartScreen from "@/components/StartScreen";
import Toast from 'react-native-toast-message';
import { toastConfig } from "../toast.config";
import { AppContext } from '@/context/AppContext.jsx';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [gmail, setGmail] = useState(null);
  const [verified, setVerified] = useState(false);

  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
          setAppReady(true);
        }
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
        setAppReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (verified) {
      router.replace("/home");
    }
  }, [verified]);

  if (!appReady) return null;

  
  return (
    <ThemeProvider value={DefaultTheme}>
      <AppContext.Provider value={{ verified, setVerified }}>
        <View className="flex-1 relative">
          {!verified ? (
            <StartScreen
              setLanguage={setLanguage}
              setGmail={setGmail}
              setVerified={setVerified}
            />
          ) : (
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          )}
          <Toast config={toastConfig} />
        </View>
      </AppContext.Provider>
    </ThemeProvider>
  );
  
}


