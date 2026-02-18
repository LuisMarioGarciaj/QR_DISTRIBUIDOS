import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Animated, View, Dimensions, TouchableOpacity } from "react-native";
import "../../global.css";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { width } = Dimensions.get("window");
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Animación para el indicador
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const tabWidth = width / 2;

  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: activeIndex * tabWidth,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [activeIndex]);

  const getTabColors = () => {
    if (colorScheme === "dark") {
      return {
        activeColor: "rgba(0, 228, 250, 1)",
        inactiveColor: "rgba(255, 255, 255, 0.4)",
        background: "rgba(0, 28, 89, 0.98)",
        indicatorColor: "rgba(0, 228, 250, 1)",
        glowColor: "rgba(0, 228, 250, 0.2)",
      };
    } else {
      return {
        activeColor: "rgba(0, 37, 123, 1)",
        inactiveColor: "rgba(0, 0, 0, 0.3)",
        background: "#FFFFFF",
        indicatorColor: "rgba(0, 228, 250, 1)",
        glowColor: "rgba(0, 228, 250, 0.15)",
      };
    }
  };

  const tabColors = getTabColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: tabColors.activeColor,
        tabBarInactiveTintColor: tabColors.inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: Platform.OS === "ios" ? 4 : 6,
          letterSpacing: 0.3,
        },
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 70,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 26 : 12,
          backgroundColor: tabColors.background,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: colorScheme === "dark" ? "#00E4FA" : "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: colorScheme === "dark" ? 0.15 : 0.08,
          shadowRadius: 16,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        listeners={{
          tabPress: () => setActiveIndex(0),
        }}
        options={{
          title: "Scanner",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <IconSymbol
                size={focused ? 30 : 26}
                name="qrcode.viewfinder"
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: tabColors.indicatorColor,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        listeners={{
          tabPress: () => setActiveIndex(1),
        }}
        options={{
          title: "Historial",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <IconSymbol
                size={focused ? 30 : 26}
                name="clock.arrow.circlepath"
                color={color}
                style={{
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              />
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: tabColors.indicatorColor,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      {/* Indicador animado (opcional) */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: tabWidth,
          height: 3,
          backgroundColor: tabColors.indicatorColor,
          borderRadius: 1.5,
          transform: [{ translateX: indicatorPosition }],
        }}
      />
    </Tabs>
  );
}