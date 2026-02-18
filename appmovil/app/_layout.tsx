import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
import "react-native-reanimated";
import "../global.css";

// Colores personalizados para tu tema
const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "rgba(0, 228, 250, 1)",
    background: "rgba(0, 28, 89, 1)",
    card: "rgba(0, 37, 123, 0.9)",
    text: "#FFFFFF",
    border: "rgba(0, 228, 250, 0.3)",
    notification: "rgba(0, 228, 250, 1)",
  },
};

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgba(0, 228, 250, 1)",
    background: "#F5F5F5",
    card: "#FFFFFF",
    text: "rgba(0, 28, 89, 1)",
    border: "rgba(0, 228, 250, 0.3)",
    notification: "rgba(0, 228, 250, 1)",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = new Animated.Value(0);

  // Determinar qué tema usar
  const theme = colorScheme === "dark" ? customDarkTheme : customLightTheme;

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsReady(true);
      // Animación de fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View style={{ alignItems: 'center' }}>
          {/* Logo animado */}
          <View 
            style={{
              width: 100,
              height: 100,
              borderRadius: 30,
              backgroundColor: "rgba(0, 228, 250, 1)",
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: "#00E4FA",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Animated.Text 
              style={{ 
                color: "rgba(0, 28, 89, 1)", 
                fontSize: 40,
                fontWeight: 'bold',
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }}
            >
              D.QR
            </Animated.Text>
          </View>
          
          <ActivityIndicator size="large" color="rgba(0, 228, 250, 1)" />
          
          <Animated.Text 
            style={{ 
              color: theme.colors.text,
              marginTop: 20,
              opacity: fadeAnim,
              fontWeight: '500'
            }}
          >
            Cargando aplicación...
          </Animated.Text>
        </View>
      </View>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade', // Animación suave entre pantallas
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
          animationDuration: 300,
        }}
      >
        <Stack.Screen 
          name="login" 
          options={{
            animation: 'fade',
          }}
        />
        
        <Stack.Screen 
          name="(tabs)" 
          options={{
            animation: 'slide_from_right',
          }}
        />
        
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: "modal",
            animation: 'slide_from_bottom',
            headerShown: false,
          }} 
        />
        
        {/* Pantalla de bienvenida/splash (opcional) */}
        <Stack.Screen 
          name="welcome" 
          options={{ 
            animation: 'fade',
          }} 
        />
        
        {/* Pantalla de configuración (ejemplo) */}
        <Stack.Screen 
          name="settings" 
          options={{ 
            animation: 'slide_from_right',
            headerShown: true,
            headerTitle: "Configuración",
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        
        {/* Pantalla de perfil (ejemplo) */}
        <Stack.Screen 
          name="profile" 
          options={{ 
            animation: 'slide_from_right',
            headerShown: true,
            headerTitle: "Perfil",
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }} 
        />
        
        {/* Pantalla de ayuda (ejemplo) */}
        <Stack.Screen 
          name="help" 
          options={{ 
            presentation: "modal",
            animation: 'slide_from_bottom',
            headerShown: true,
            headerTitle: "Ayuda",
            headerStyle: {
              backgroundColor: theme.colors.card,
            },
            headerTintColor: theme.colors.text,
          }} 
        />
      </Stack>

      {/* StatusBar personalizado según el tema */}
      <StatusBar 
        style={colorScheme === "dark" ? "light" : "dark"} 
        backgroundColor="transparent"
        translucent
      />
    </ThemeProvider>
  );
}

// Configuración avanzada (opcional)
export const unstable_settings = {
  // Asegurar que las pestañas se rendericen correctamente
  initialRouteName: "login",
  anchor: "(tabs)",
  // Configuración de deep linking
  linking: {
    prefixes: ["dqr://", "https://dqr.app"],
    config: {
      screens: {
        login: "login",
        "(tabs)": {
          screens: {
            index: "scanner",
            history: "historial",
          },
        },
        modal: "modal",
        settings: "configuracion",
        profile: "perfil",
        help: "ayuda",
      },
    },
  },
};