import { Tabs } from 'expo-router';
import { Calculator, Cloud } from 'lucide-react-native';
import React from "react";
import { useTheme } from '../../src/contexts/ThemeContext';

export default function TabLayout() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const tabBarBg = isDarkMode ? '#111827' : '#FFFFFF';
    const activeTint = isDarkMode ? '#60A5FA' : '#2563EB';
    const inactiveTint = isDarkMode ? '#9CA3AF' : '#6B7280';

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: { backgroundColor: tabBarBg, borderTopWidth: 0},
                tabBarActiveTintColor: activeTint,
                tabBarInactiveTintColor: inactiveTint,
                headerStyle: { backgroundColor: tabBarBg },
                headerTintColor: activeTint,
            }}
        >

            <Tabs.Screen
                name="calculator"
                options={{
                    title: 'BAC Calculator',
                    tabBarIcon: ({ color }) => 
                        <Calculator color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="weather"
                options={{
                    title: 'Clima',
                    tabBarIcon: ({ color }) =>
                        <Cloud color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
