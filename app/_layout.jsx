import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import SplashLoader from "@/components/SplashLoader";
import LanguageSelect from "@/components/LanguageSelect";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [showSplashImage, setShowSplashImage] = useState(true);

  useFonts({
    Montserrat: require("../assets/fonts/Montserrat-VariableFont_wght.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync();
        setAppReady(true);
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
        setAppReady(true);
      }
    }
    
    prepare();
  }, []);

  useEffect(() => {
    if (appReady) {
      // Показываем splash-изображение 3 секунды
      const timer = setTimeout(() => {
        setShowSplashImage(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [appReady]);

  useEffect(() => {
    if (language) {
      router.replace("/home");
    }
  }, [language, router]);

  if (showSplashImage) {
    return <SplashLoader showSpinner={false} />;
  }

  if (!language) {
    return <LanguageSelect setLanguage={setLanguage} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className="flex-1 relative">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}