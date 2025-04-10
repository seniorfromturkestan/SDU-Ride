import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';
import AnimatedTabIcon from '@/components/AnimatedTabIcon';
import { BlurView } from 'expo-blur';



export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />

      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#716DAA',
          tabBarInactiveTintColor: '#A8A8A8',
          tabBarLabelStyle: {
            fontFamily: 'Montserrat',
            fontSize: 10,
          },
        }}
   
        >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Главная',
            tabBarIcon: ({ focused, color }) => (
                <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
            headerShown: false,
          }}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
            },
          }}
        />

        <Tabs.Screen
          name="bus"
          options={{
            title: 'Маршруты',
            tabBarIcon: ({ focused, color}) => (
              <Ionicons name={focused ? 'bus' : 'bus-outline'} size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
            },
          }}
        />

        <Tabs.Screen
          name="bushtaxi"
          options={{
            title: 'Попутки',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'car' : 'car-outline'} size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
            },
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); 
            },
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: '10%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 5,
    zIndex: 0,
  },
});