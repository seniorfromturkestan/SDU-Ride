import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import StartScreen from "@/components/StartScreen";
import AdminSlidesScreen from "@/components/AdminSlideScreen";


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [language, setLanguage] = useState(null);
  const [appReady, setAppReady] = useState(false);

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
    if (language) {
      router.replace("/home");
    }
  }, [language]);

  if (!language || !appReady) {
    return <StartScreen setLanguage={setLanguage} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className="flex-1 relative">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          {/* <Stack.Screen name="AdminSlides" component={AdminSlidesScreen} /> */}

        </Stack>
      </View>
    </ThemeProvider>
  );
}
