import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="Camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon name={focused ? 'camera' : 'camera'} color={color} />
          )
        }}
      />
      <Tabs.Screen
       name="picture_mode"
       options={{
        title: 'Picture Mode',
        tabBarIcon: ({color, focused}) => (
          //<TabBarIcon name={focused ? 'picture' : 'picture'} color={color} />
          <TabBarIcon name={focused ? 'image' : 'image'} color={color} />
        )
       }}/>
    </Tabs>
  );
}
