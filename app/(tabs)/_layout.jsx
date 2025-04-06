import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#716DAA',
          tabBarInactiveTintColor: '#A8A8A8',
          tabBarLabelStyle: {
            fontFamily: 'Montserrat',
            fontSize: 11,
          },
        }}
   
        >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Главная',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
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
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'bus' : 'bus-outline'} size={size} color={color} />
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
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'car' : 'car-outline'} size={size} color={color} />
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
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
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
    backgroundColor: 'white',
    height: 90,
    position: 'absolute',
    bottom: 0,
    left: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 5,
    zIndex: 1,
  },
});